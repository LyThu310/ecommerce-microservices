import "dotenv/config";

import {
  connectDatabase
} from "../database/mongoose.js";

import {
  ShipmentModel
} from "../models/ShipmentModel.js";

import {
  MongooseShipmentRepository
} from "./MongooseShipmentRepository.js";

import {
  Shipment
} from "../../domain/entities/Shipment.js";

import mongoose from "mongoose";

await connectDatabase();

const repository =
  new MongooseShipmentRepository();

try {
  await ShipmentModel.deleteOne({
    oid: 99999
  });

  const shipment =
    new Shipment({
      oid: 99999,
      uid: 2
    });

  const created =
    await repository.create(
      shipment
    );

  console.log(
    "Shipment create successful."
  );

  console.log(created);

  const found =
    await repository.findByOid(
      99999
    );

  console.log(
    "Shipment find successful."
  );

  console.log(found);

  const updated =
    await repository.updateStatus(
      99999,
      "SHIPPING"
    );

  console.log(
    "Shipment update successful."
  );

  console.log(updated);
} catch (error) {
  console.error(
    "Shipment repository test failed:",
    error
  );
} finally {
  await mongoose.disconnect();
}