import "dotenv/config";
import jwt from "jsonwebtoken";

export function authenticateJwt(req, res, next) {
  const authorization =
    req.get("authorization");

  if (
    !authorization ||
    !authorization.startsWith("Bearer ")
  ) {
    return res.status(401).json({
      message: "Authentication required"
    });
  }

  const token =
    authorization
      .slice("Bearer ".length)
      .trim();

  if (!token) {
    return res.status(401).json({
      message: "Authentication required"
    });
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET,
      {
        algorithms: ["HS256"]
      }
    );

    const uid = Number(payload.sub);

    if (
      !Number.isInteger(uid) ||
      uid <= 0
    ) {
      return res.status(401).json({
        message: "Invalid access token"
      });
    }

    req.user = {
      uid,
      role: payload.role
    };

    /*
      Ghi đè header do client gửi.
      Downstream chỉ nhận identity từ JWT.
    */
    req.headers["x-user-id"] =
      String(uid);

    req.headers["x-user-role"] =
      String(payload.role || "");

    return next();
  } catch {
    return res.status(401).json({
      message:
        "Invalid or expired access token"
    });
  }
}

export function requireRoles(
  ...allowedRoles
) {
  return function roleMiddleware(
    req,
    res,
    next
  ) {
    if (
      !req.user ||
      !allowedRoles.includes(
        req.user.role
      )
    ) {
      return res.status(403).json({
        message: "Forbidden"
      });
    }

    return next();
  };
}

export function requireSelfOrAdmin(
  req,
  res,
  next
) {
  if (req.user?.role === "ADMIN") {
    return next();
  }

  const pathname =
    req.originalUrl.split("?")[0];

  const match =
    pathname.match(
      /^\/api\/customers\/(\d+)(?:\/|$)/
    );

  if (!match) {
    return res.status(400).json({
      message: "Invalid customer id"
    });
  }

  const requestedUid =
    Number(match[1]);

  if (
    requestedUid !==
    req.user.uid
  ) {
    return res.status(403).json({
      message: "Forbidden"
    });
  }

  return next();
}

export function useAuthenticatedOrderIdentity(
  req,
  res,
  next
) {
  /*
    Chỉ POST tạo Order mới cần
    ghi đè uid trong body.
  */
  if (req.method === "POST") {
    req.body = {
      ...(req.body || {}),
      uid: req.user.uid
    };
  }

  return next();
}