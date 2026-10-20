import express from "express";

import healthRoutes
  from "./routes/health.routes.js";

import {
  authProxy,
  customerProxy,
  membershipProxy,
  productProxy,
  orderProxy,
  shipmentProxy
} from "./config/proxy.js";

import {
  authenticateJwt,
  requireRoles,
  requireSelfOrAdmin,
  useAuthenticatedOrderIdentity
} from "./middlewares/auth.middleware.js";

import {
  createRateLimiter
} from "./middlewares/rateLimiter.middleware.js";
import {
  requestLogger
} from "./middlewares/requestLogger.middleware.js";
import {
  getProductWithCache,
  invalidateProductCache
} from "./middlewares/productCache.middleware.js";
import {
  notFoundHandler,
  errorHandler
} from "./middlewares/error.middleware.js";

/*
  =========================
  RATE LIMIT CONFIGURATION
  =========================
*/

const windowSeconds =
  Number(
    process.env.RATE_LIMIT_WINDOW_SECONDS
  ) || 60;

const globalRateLimiter =
  createRateLimiter({
    prefix: "global",

    maxRequests:
      Number(
        process.env.RATE_LIMIT_MAX_REQUESTS
      ) || 100,

    windowSeconds
  });

const authRateLimiter =
  createRateLimiter({
    prefix: "auth",

    maxRequests:
      Number(
        process.env.AUTH_RATE_LIMIT_MAX_REQUESTS
      ) || 10,

    windowSeconds
  });

/*
  =========================
  EXPRESS APP
  =========================
*/

const app = express();

app.disable("x-powered-by");
app.use(
  requestLogger
);
app.use(
  express.json({
    limit: "100kb"
  })
);

/*
  =========================
  HEALTH CHECK
  =========================

  Không áp dụng rate limit để Docker
  hoặc monitoring có thể kiểm tra
  trạng thái Gateway ổn định.
*/

app.use(
  "/api",
  healthRoutes
);

/*
  =========================
  GLOBAL RATE LIMIT
  =========================
*/

app.use(
  globalRateLimiter
);

/*
  =========================
  AUTH SERVICE
  =========================

  Public:
  - Register
  - Login

  Có rate limit riêng để hạn chế
  brute-force login.
*/

app.use(
  "/api/auth",
  authRateLimiter,
  authProxy
);

/*
  =========================
  CUSTOMER SERVICE
  =========================

  CUSTOMER:
  - chỉ được truy cập thông tin
    của chính mình.

  ADMIN:
  - được truy cập customer khác.
*/

app.use(
  "/api/customers",

  authenticateJwt,

  requireSelfOrAdmin,

  customerProxy
);

/*
  =========================
  MEMBERSHIP
  =========================

  GET:
  - CUSTOMER
  - ADMIN
  - SHIPMENT_STAFF
  => chỉ cần đăng nhập.

  POST / PUT / DELETE:
  - ADMIN only.
*/

app.use(
  "/api/memberships",

  authenticateJwt,

  (req, res, next) => {
    if (req.method === "GET") {
      return next();
    }

    return requireRoles(
      "ADMIN"
    )(
      req,
      res,
      next
    );
  },

  membershipProxy
);

/*
  =========================
  PRODUCT SERVICE
  =========================
*/

/*
  GET product detail:
  Redis Cache
*/
app.get(
  "/api/products/:pid",
  getProductWithCache
);

/*
  Các Product API còn lại
*/
app.use(
  "/api/products",

  (req, res, next) => {
    if (req.method === "GET") {
      return next();
    }

    return authenticateJwt(
      req,
      res,
      () => {
        return requireRoles(
          "ADMIN"
        )(
          req,
          res,
          next
        );
      }
    );
  },

  (req, res, next) => {
    if (
      ["PUT", "PATCH", "DELETE"]
        .includes(req.method)
    ) {
      return invalidateProductCache(
        req,
        res,
        next
      );
    }

    return next();
  },

  productProxy
);

/*
  =========================
  ORDER SERVICE
  =========================

  POST:
  - CUSTOMER only.
  - uid trong body sẽ bị Gateway
    ghi đè bằng uid từ JWT.

  GET:
  - CUSTOMER
  - ADMIN

  Ownership của CUSTOMER được
  Order Service kiểm tra bằng:
  x-user-id
  x-user-role
*/

app.use(
  "/api/orders",

  authenticateJwt,

  (req, res, next) => {
    if (req.method === "POST") {
      return requireRoles(
        "CUSTOMER"
      )(
        req,
        res,
        next
      );
    }

    return requireRoles(
      "CUSTOMER",
      "ADMIN"
    )(
      req,
      res,
      next
    );
  },

  useAuthenticatedOrderIdentity,

  orderProxy
);

/*
  =========================
  SHIPMENT SERVICE
  =========================

  GET:
  - authenticated users.
  - Shipment Service kiểm tra
    ownership nếu là CUSTOMER.

  PATCH:
  - SHIPMENT_STAFF
  - ADMIN
*/

app.use(
  "/api/shipments",

  authenticateJwt,

  (req, res, next) => {
    if (req.method === "PATCH") {
      return requireRoles(
        "SHIPMENT_STAFF",
        "ADMIN"
      )(
        req,
        res,
        next
      );
    }

    return next();
  },

  shipmentProxy
);

/*
  =========================
  ERROR HANDLERS
  =========================
*/

app.use(
  notFoundHandler
);

app.use(
  errorHandler
);

export default app;