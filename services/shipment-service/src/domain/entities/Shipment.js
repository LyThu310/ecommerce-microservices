export class Shipment {
  constructor({
    oid,
    uid,
    status = "PENDING"
  }) {
    this.oid = oid;
    this.uid = uid;
    this.status = status;
  }
}