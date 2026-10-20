import express from "express";
import shipmentRoutes
  from "./presentation/routes/shipment.routes.js";
import healthRoutes
  from "./presentation/routes/health.routes.js";

import {
  notFoundHandler,
  errorHandler
} from "./presentation/middlewares/error.middleware.js";

const app = express();

app.disable("x-powered-by");

app.use(
  express.json({
    limit: "100kb"
  })
);

app.use("/api", healthRoutes);
app.use(
  "/api/shipments",
  shipmentRoutes
);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;