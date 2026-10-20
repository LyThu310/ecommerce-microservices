import mongoose from "mongoose";

const shipmentSchema =
  new mongoose.Schema(
    {
      oid: {
        type: Number,
        required: true,
        unique: true,
        min: 1
      },

      uid: {
        type: Number,
        required: true,
        min: 1
      },

      status: {
        type: String,
        required: true,
        default: "PENDING",
        trim: true
      }
    },
    {
      timestamps: true,
      versionKey: false,
      collection: "shipments"
    }
  );

export const ShipmentModel =
  mongoose.model(
    "Shipment",
    shipmentSchema
  );