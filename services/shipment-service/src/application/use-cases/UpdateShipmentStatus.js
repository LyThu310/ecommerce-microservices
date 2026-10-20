export class UpdateShipmentStatus {
  constructor({
    shipmentRepository
  }) {
    this.shipmentRepository =
      shipmentRepository;
  }

  async execute({
    oid,
    status
  }) {
    const shipment =
      await this.shipmentRepository
        .findByOid(oid);

    if (!shipment) {
      throw new Error(
        "Shipment not found"
      );
    }

    return this.shipmentRepository
      .updateStatus(
        oid,
        status
      );
  }
}