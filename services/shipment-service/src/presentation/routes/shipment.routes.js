import { Router } from "express";

import {
  getShipmentHandler,
  updateShipmentStatusHandler
} from "../controllers/shipment.controller.js";

const router = Router();

router.get(
  "/:oid",
  getShipmentHandler
);

router.patch(
  "/:oid/status",
  updateShipmentStatusHandler
);

export default router;