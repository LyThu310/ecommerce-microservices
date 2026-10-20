import { Router } from "express";
import mongoose from "mongoose";

const router = Router();

router.get("/health", (req, res) => {
  const databaseStatus =
    mongoose.connection.readyState === 1
      ? "UP"
      : "DOWN";

  const status =
    databaseStatus === "UP"
      ? "UP"
      : "DEGRADED";

  return res.status(
    databaseStatus === "UP" ? 200 : 503
  ).json({
    service: "product-service",
    status,
    database: databaseStatus
  });
});

export default router;