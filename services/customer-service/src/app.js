import express from "express";
import healthRoutes from "./presentation/routes/health.routes.js";
import customerRoutes from "./presentation/routes/customer.routes.js";
import membershipRoutes from "./presentation/routes/membership.routes.js";
import {
  notFoundHandler,
  errorHandler
} from "./presentation/middlewares/error.middleware.js";

const app = express();

app.disable("x-powered-by");

app.use(express.json({
  limit: "100kb"
}));

app.use("/api", healthRoutes);
app.use("/api/customers", customerRoutes);
app.use(
  "/api/memberships",
  membershipRoutes
);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;