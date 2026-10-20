export class GetShipmentByOrderId {
  constructor({
    shipmentRepository
  }) {
    this.shipmentRepository =
      shipmentRepository;
  }

  async execute(oid) {
    const shipment =
      await this.shipmentRepository
        .findByOid(oid);

    if (!shipment) {
      throw new Error(
        "Shipment not found"
      );
    }

    return shipment;
  }
}