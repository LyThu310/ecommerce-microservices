import "dotenv/config";
import { Kafka } from "kafkajs";

const brokers = (
  process.env.KAFKA_BROKERS ||
  "localhost:9092"
)
  .split(",")
  .map((broker) => broker.trim())
  .filter(Boolean);

const kafka = new Kafka({
  clientId:
    process.env.KAFKA_CLIENT_ID ||
    "order-service",

  brokers
});

export const kafkaProducer =
  kafka.producer();