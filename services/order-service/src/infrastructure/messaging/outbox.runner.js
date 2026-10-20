import "dotenv/config";

import prisma
  from "../database/prisma.js";

import {
  kafkaProducer
} from "./kafka.producer.js";

import {
  OutboxPublisher
} from "./OutboxPublisher.js";

const topic =
  process.env.KAFKA_ORDER_CREATED_TOPIC ||
  "order-created";

const intervalMs =
  Number(
    process.env.OUTBOX_PUBLISH_INTERVAL_MS
  ) || 2000;

const publisher =
  new OutboxPublisher({
    prisma,
    producer: kafkaProducer,
    topic
  });

let timer = null;
let stopped = false;
let producerConnected = false;

async function connectProducer() {
  if (producerConnected) {
    return;
  }

  await kafkaProducer.connect();

  producerConnected = true;

  console.log(
    "Order Kafka producer connected."
  );
}

async function runOnce() {
  try {
    await connectProducer();

    const count =
      await publisher.publishPending();

    if (count > 0) {
      console.log(
        `Outbox publisher processed ${count} event(s).`
      );
    }
  } catch (error) {
    console.error(
      "Outbox publisher cycle failed:",
      error.message
    );

    /*
      Để lần quét tiếp theo thử connect Kafka lại.
    */
    producerConnected = false;

    try {
      await kafkaProducer.disconnect();
    } catch {
      // Ignore disconnect failure.
    }
  }
}

async function loop() {
  if (stopped) {
    return;
  }

  await runOnce();

  if (!stopped) {
    timer = setTimeout(
      loop,
      intervalMs
    );
  }
}

export function startOutboxPublisher() {
  if (timer) {
    return;
  }

  stopped = false;

  console.log(
    `Outbox publisher started. Interval: ${intervalMs} ms`
  );

  /*
    Không await để Kafka lỗi cũng không
    làm REST API Order Service chết.
  */
  loop().catch((error) => {
    console.error(
      "Outbox publisher loop failed:",
      error
    );
  });
}

export async function stopOutboxPublisher() {
  stopped = true;

  if (timer) {
    clearTimeout(timer);
    timer = null;
  }

  if (producerConnected) {
    try {
      await kafkaProducer.disconnect();
    } finally {
      producerConnected = false;
    }
  }

  console.log(
    "Outbox publisher stopped."
  );
}