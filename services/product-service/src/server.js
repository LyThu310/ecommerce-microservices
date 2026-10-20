import "dotenv/config";
import app from "./app.js";
import { connectDatabase } from "./infrastructure/database/mongoose.js";
import { startProductGrpcServer } from "./infrastructure/grpc/product.grpc.js";

const PORT = process.env.PORT || 3003;

async function startServer() {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(
        `Product Service is running on port ${PORT}`
      );
    });

    startProductGrpcServer();
  } catch (error) {
    console.error(
      "Failed to start Product Service:",
      error.message
    );

    process.exit(1);
  }
}

startServer();