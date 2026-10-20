import { Shipment }
  from "../../domain/entities/Shipment.js";

export class CreateShipmentFromOrderCreated {
  constructor({
    shipmentRepository
  }) {
    this.shipmentRepository =
      shipmentRepository;
  }

  async execute({
    oid,
    uid
  }) {
    if (
      !Number.isInteger(oid) ||
      oid <= 0
    ) {
      throw new Error(
        "Invalid order id"
      );
    }

    if (
      !Number.isInteger(uid) ||
      uid <= 0
    ) {
      throw new Error(
        "Invalid customer id"
      );
    }

    const existing =
      await this.shipmentRepository
        .findByOid(oid);

    if (existing) {
      return {
        shipment: existing,
        created: false
      };
    }

    try {
      const shipment =
        new Shipment({
          oid,
          uid,
          status: "PENDING"
        });

      const createdShipment =
        await this.shipmentRepository
          .create(shipment);

      return {
        shipment:
          createdShipment,
        created: true
      };
    } catch (error) {
      /*
        Có thể xảy ra nếu hai bản sao
        cùng event chạy sát nhau.

        unique index trên oid sẽ chặn
        Shipment bị tạo trùng.
      */
      if (error?.code === 11000) {
        const shipment =
          await this.shipmentRepository
            .findByOid(oid);

        return {
          shipment,
          created: false
        };
      }

      throw error;
    }
  }
}