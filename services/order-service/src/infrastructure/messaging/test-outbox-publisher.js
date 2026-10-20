import "dotenv/config";

import prisma
  from "../database/prisma.js";

import {
  kafkaProducer
} from "./kafka.producer.js";

import {
  OutboxPublisher
} from "./OutboxPublisher.js";

const publisher =
  new OutboxPublisher({
    prisma,
    producer:
      kafkaProducer,

    topic:
      process.env
        .KAFKA_ORDER_CREATED_TOPIC
  });

try {
  await kafkaProducer.connect();

  console.log(
    "Kafka producer connected."
  );

  const count =
    await publisher.publishPending();

  console.log(
    `Published ${count} pending event(s).`
  );
} catch (error) {
  console.error(
    "Outbox publisher failed:",
    error
  );
} finally {
  await kafkaProducer.disconnect();
  await prisma.$disconnect();
}