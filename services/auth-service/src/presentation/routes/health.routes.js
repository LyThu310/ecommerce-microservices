import { Router } from "express";

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    service: "auth-service",
    status: "UP"
  });
});

export default router;