import { ShipmentModel }
  from "../models/ShipmentModel.js";

import { Shipment }
  from "../../domain/entities/Shipment.js";

function mapShipment(document) {
  if (!document) {
    return null;
  }

  return {
    oid: document.oid,
    uid: document.uid,
    status: document.status,
    createdAt:
      document.createdAt,
    updatedAt:
      document.updatedAt
  };
}

export class MongooseShipmentRepository {
  async findByOid(oid) {
    const document =
      await ShipmentModel.findOne({
        oid
      });

    return mapShipment(document);
  }

  async create(shipment) {
    const document =
      await ShipmentModel.create({
        oid: shipment.oid,
        uid: shipment.uid,
        status: shipment.status
      });

    return mapShipment(document);
  }

  async updateStatus(
    oid,
    status
  ) {
    const document =
      await ShipmentModel.findOneAndUpdate(
        {
          oid
        },
        {
          status
        },
        {
          returnDocument: "after",
          runValidators: true
        }
      );

    return mapShipment(document);
  }
}