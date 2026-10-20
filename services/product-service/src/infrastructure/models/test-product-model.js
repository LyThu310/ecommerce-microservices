import "dotenv/config";
import mongoose from "mongoose";
import { connectDatabase } from "../database/mongoose.js";
import { ProductModel } from "./ProductModel.js";

try {
  await connectDatabase();

  await ProductModel.syncIndexes();

  const indexes =
    await ProductModel.collection.indexes();

  console.log(
    "Product model initialized successfully."
  );

  console.log(indexes);
} catch (error) {
  console.error(
    "Product model test failed:",
    error
  );
} finally {
  await mongoose.disconnect();
}