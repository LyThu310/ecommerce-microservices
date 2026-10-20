import "dotenv/config";
import mongoose from "mongoose";
import { connectDatabase } from "../database/mongoose.js";
import { MongooseProductRepository } from "./MongooseProductRepository.js";

const productRepository =
  new MongooseProductRepository();

try {
  await connectDatabase();

  const products =
    await productRepository.findAll();

  const product =
    await productRepository.findByPid(999999);

  console.log(
    "Product repository connected successfully."
  );

  console.log(
    "Product count:",
    products.length
  );

  console.log(
    "Find PID 999999:",
    product
  );
} catch (error) {
  console.error(
    "Product repository test failed:",
    error
  );
} finally {
  await mongoose.disconnect();
}