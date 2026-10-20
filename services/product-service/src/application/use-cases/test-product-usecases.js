import "dotenv/config";
import mongoose from "mongoose";
import { connectDatabase } from "../../infrastructure/database/mongoose.js";
import { MongooseProductRepository } from "../../infrastructure/repositories/MongooseProductRepository.js";
import { GetProductByPid } from "./GetProductByPid.js";

const productRepository =
  new MongooseProductRepository();

const getProductByPid =
  new GetProductByPid(productRepository);

try {
  await connectDatabase();

  const result =
    await getProductByPid.execute(999999);

  console.log(result);
} catch (error) {
  console.error(
    "Get product failed:",
    error.message
  );
} finally {
  await mongoose.disconnect();
}