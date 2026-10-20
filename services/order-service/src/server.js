import "dotenv/config";

import app from "./app.js";

import {
  startOutboxPublisher,
  stopOutboxPublisher
} from "./infrastructure/messaging/outbox.runner.js";

const PORT =
  process.env.PORT || 3004;

const server =
  app.listen(
    PORT,
    () => {
      console.log(
        `Order Service is running on port ${PORT}`
      );

      startOutboxPublisher();
    }
  );

async function shutdown(signal) {
  console.log(
    `${signal} received. Shutting down Order Service...`
  );

  server.close(
    async () => {
      try {
        await stopOutboxPublisher();

        process.exit(0);
      } catch (error) {
        console.error(
          "Shutdown error:",
          error
        );

        process.exit(1);
      }
    }
  );
}

process.on(
  "SIGINT",
  () => shutdown("SIGINT")
);

process.on(
  "SIGTERM",
  () => shutdown("SIGTERM")
);