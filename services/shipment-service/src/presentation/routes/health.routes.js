import { Router } from "express";
import mongoose from "mongoose";

const router = Router();

router.get(
  "/health",
  (req, res) => {
    const databaseUp =
      mongoose.connection.readyState === 1;

    return res
      .status(databaseUp ? 200 : 503)
      .json({
        service:
          "shipment-service",
        status:
          databaseUp
            ? "UP"
            : "DEGRADED",
        database:
          databaseUp
            ? "UP"
            : "DOWN"
      });
  }
);

export default router;