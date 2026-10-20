import "dotenv/config";

import app from "./app.js";
import redisClient from "./config/redis.js";

const PORT =
  process.env.PORT || 3000;

async function startServer() {
  try {
    await redisClient.connect();

    app.listen(
      PORT,
      () => {
        console.log(
          `API Gateway is running on port ${PORT}`
        );
      }
    );
  } catch (error) {
    console.error(
      "Failed to start API Gateway:",
      error.message
    );

    process.exit(1);
  }
}

startServer();