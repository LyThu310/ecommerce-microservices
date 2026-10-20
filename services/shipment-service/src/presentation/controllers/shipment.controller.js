import {
  MongooseShipmentRepository
} from "../../infrastructure/repositories/MongooseShipmentRepository.js";

import {
  GetShipmentByOrderId
} from "../../application/use-cases/GetShipmentByOrderId.js";

import {
  UpdateShipmentStatus
} from "../../application/use-cases/UpdateShipmentStatus.js";

import {
  shipmentIdSchema,
  updateShipmentStatusSchema
} from "../validators/shipment.validator.js";

const shipmentRepository =
  new MongooseShipmentRepository();

const getShipmentByOrderId =
  new GetShipmentByOrderId({
    shipmentRepository
  });

const updateShipmentStatus =
  new UpdateShipmentStatus({
    shipmentRepository
  });

export async function getShipmentHandler(
  req,
  res,
  next
) {
  try {
    const oidResult =
      shipmentIdSchema.safeParse(
        req.params.oid
      );

    if (!oidResult.success) {
      return res.status(400).json({
        message: "Invalid order id"
      });
    }

    const shipment =
      await getShipmentByOrderId.execute(
        oidResult.data
      );

    const actorUid =
      Number(
        req.get("x-user-id")
      );

    const actorRole =
      req.get("x-user-role");

    const privilegedRoles = [
      "ADMIN",
      "SHIPMENT_STAFF"
    ];

    /*
      CUSTOMER chỉ được xem Shipment
      thuộc chính mình.
    */
    if (
      !privilegedRoles.includes(
        actorRole
      ) &&
      shipment.uid !== actorUid
    ) {
      return res.status(403).json({
        message: "Forbidden"
      });
    }

    return res.status(200).json({
      message:
        "Get shipment successfully",
      data: shipment
    });
  } catch (error) {
    if (
      error.message ===
      "Shipment not found"
    ) {
      return res.status(404).json({
        message: error.message
      });
    }

    return next(error);
  }
}

export async function updateShipmentStatusHandler(
  req,
  res,
  next
) {
  try {
    const oidResult =
      shipmentIdSchema.safeParse(
        req.params.oid
      );

    if (!oidResult.success) {
      return res.status(400).json({
        message: "Invalid order id"
      });
    }

    const bodyResult =
      updateShipmentStatusSchema.safeParse(
        req.body
      );

    if (!bodyResult.success) {
      return res.status(400).json({
        message:
          "Invalid request data",
        errors:
          bodyResult.error.flatten()
      });
    }

    const actorRole =
      req.get("x-user-role");

    /*
      Chỉ nhân viên giao hàng hoặc ADMIN
      mới được cập nhật trạng thái.
    */
    if (
      ![
        "ADMIN",
        "SHIPMENT_STAFF"
      ].includes(actorRole)
    ) {
      return res.status(403).json({
        message: "Forbidden"
      });
    }

    const updatedShipment =
      await updateShipmentStatus.execute({
        oid: oidResult.data,
        status:
          bodyResult.data.status
      });

    return res.status(200).json({
      message:
        "Update shipment status successfully",
      data: updatedShipment
    });
  } catch (error) {
    if (
      error.message ===
      "Shipment not found"
    ) {
      return res.status(404).json({
        message: error.message
      });
    }

    return next(error);
  }
}