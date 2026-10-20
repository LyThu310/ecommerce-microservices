import {
  createProxyMiddleware,
  fixRequestBody
} from "http-proxy-middleware";

function createServiceProxy(
  serviceName,
  target,
  pathPrefix
) {
  return createProxyMiddleware({
    target,
    changeOrigin: true,

    pathRewrite: (path) => {
      return `${pathPrefix}${path}`;
    },

    on: {
      proxyReq: fixRequestBody,

      error(error, req, res) {
        console.error(
          `${serviceName} proxy error:`,
          error.message
        );

        if (!res.headersSent) {
          res.writeHead(502, {
            "Content-Type":
              "application/json"
          });
        }

        res.end(
          JSON.stringify({
            message:
              `${serviceName} unavailable`
          })
        );
      }
    },

    proxyTimeout: 5000,
    timeout: 5000
  });
}

export const authProxy =
  createServiceProxy(
    "Auth Service",
    process.env.AUTH_SERVICE_URL,
    "/api/auth"
  );

export const customerProxy =
  createServiceProxy(
    "Customer Service",
    process.env.CUSTOMER_SERVICE_URL,
    "/api/customers"
  );

export const productProxy =
  createServiceProxy(
    "Product Service",
    process.env.PRODUCT_SERVICE_URL,
    "/api/products"
  );

export const orderProxy =
  createServiceProxy(
    "Order Service",
    process.env.ORDER_SERVICE_URL,
    "/api/orders"
  );

export const shipmentProxy =
  createServiceProxy(
    "Shipment Service",
    process.env.SHIPMENT_SERVICE_URL,
    "/api/shipments"
  );
export const membershipProxy =
  createServiceProxy(
    "Customer Service",
    process.env.CUSTOMER_SERVICE_URL,
    "/api/memberships"
  );