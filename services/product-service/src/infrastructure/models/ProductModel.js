import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    pid: {
      type: Number,
      required: true,
      unique: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "PID must be an integer"
      }
    },

    pname: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    price: {
      type: mongoose.Schema.Types.Decimal128,
      required: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be an integer"
      }
    }
  },
  {
    versionKey: false,
    collection: "products"
  }
);

export const ProductModel =
  mongoose.models.Product ||
  mongoose.model(
    "Product",
    productSchema
  );