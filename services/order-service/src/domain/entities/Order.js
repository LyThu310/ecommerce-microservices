export class Order {
  constructor({
    oid = null,
    uid,
    discount,
    details = []
  }) {
    this.oid = oid;
    this.uid = uid;
    this.discount = discount;
    this.details = details;
  }
}