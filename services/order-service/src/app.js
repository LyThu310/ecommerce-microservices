import express from "express";

import healthRoutes from "./presentation/routes/health.routes.js";
import orderRoutes from "./presentation/routes/order.routes.js";

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
app.use("/api/orders", orderRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;