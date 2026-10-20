import mongoose from "mongoose";

export async function connectDatabase() {
  await mongoose.connect(
    process.env.MONGODB_URI,
    {
      serverSelectionTimeoutMS: 5000
    }
  );

  console.log(
    "Shipment MongoDB connected successfully."
  );
}