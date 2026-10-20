import "dotenv/config";

import app from "./app.js";

import {
  connectDatabase
} from "./infrastructure/database/mongoose.js";

import {
  startOrderCreatedConsumer
} from "./infrastructure/messaging/orderCreated.consumer.js";

const PORT =
  process.env.PORT || 3005;

async function startServer() {
  try {
    await connectDatabase();

    await startOrderCreatedConsumer();

    app.listen(
      PORT,
      () => {
        console.log(
          `Shipment Service is running on port ${PORT}`
        );
      }
    );
  } catch (error) {
    console.error(
      "Failed to start Shipment Service:",
      error
    );

    process.exit(1);
  }
}

startServer();