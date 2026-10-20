import { Router } from "express";

import {
  createOrderHandler,
  getOrderByIdHandler
} from "../controllers/order.controller.js";

const router = Router();

router.post(
  "/",
  createOrderHandler
);

router.get(
  "/:oid",
  getOrderByIdHandler
);

export default router;