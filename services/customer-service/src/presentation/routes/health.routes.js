import { Router } from "express";

const router = Router();

router.get("/health", (req, res) => {
  return res.status(200).json({
    service: "customer-service",
    status: "UP"
  });
});

export default router;
