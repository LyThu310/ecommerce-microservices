import { Router } from "express";
import redisClient from "../config/redis.js";

const router = Router();

router.get(
  "/health",
  async (req, res) => {
    try {
      const pong =
        await redisClient.ping();

      return res.status(200).json({
        service: "api-gateway",
        status: "UP",
        redis:
          pong === "PONG"
            ? "UP"
            : "DOWN"
      });
    } catch (error) {
      return res.status(503).json({
        service: "api-gateway",
        status: "DEGRADED",
        redis: "DOWN"
      });
    }
  }
);

export default router;