import { Router } from "express";
import prisma from "../../infrastructure/database/prisma.js";

const router = Router();

router.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return res.status(200).json({
      service: "order-service",
      status: "UP",
      database: "UP"
    });
  } catch (error) {
    console.error("Order database health check failed:", error.message);

    return res.status(503).json({
      service: "order-service",
      status: "DEGRADED",
      database: "DOWN"
    });
  }
});

export default router;