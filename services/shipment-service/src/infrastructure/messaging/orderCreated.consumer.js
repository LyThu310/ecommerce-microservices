import "dotenv/config";

import {
  Kafka
} from "kafkajs";

import {
  MongooseShipmentRepository
} from "../repositories/MongooseShipmentRepository.js";

import {
  CreateShipmentFromOrderCreated
} from "../../application/use-cases/CreateShipmentFromOrderCreated.js";

const brokers = (
  process.env.KAFKA_BROKERS ||
  "localhost:9092"
)
  .split(",")
  .map(
    (broker) =>
      broker.trim()
  )
  .filter(Boolean);

const kafka =
  new Kafka({
    clientId:
      process.env.KAFKA_CLIENT_ID ||
      "shipment-service",

    brokers
  });

export const orderCreatedConsumer =
  kafka.consumer({
    groupId:
      process.env.KAFKA_GROUP_ID ||
      "shipment-order-created-group"
  });

const shipmentRepository =
  new MongooseShipmentRepository();

const createShipment =
  new CreateShipmentFromOrderCreated({
    shipmentRepository
  });

export async function startOrderCreatedConsumer() {
  await orderCreatedConsumer.connect();

  console.log(
    "Shipment Kafka consumer connected."
  );

  await orderCreatedConsumer.subscribe({
    topic:
      process.env
        .KAFKA_ORDER_CREATED_TOPIC ||
      "order-created",

    /*
      Lần đầu group này chạy,
      đọc các event cũ để tạo Shipment
      cho Order 1,3,4,5,6.
    */
    fromBeginning: true
  });

  console.log(
    "Shipment consumer subscribed to order-created."
  );

  orderCreatedConsumer
    .run({
      eachMessage:
        async ({
          topic,
          partition,
          message
        }) => {
          try {
            const raw =
              message.value?.toString();

            if (!raw) {
              console.warn(
                "Ignored empty Kafka message."
              );

              return;
            }

            let event;

            try {
              event =
                JSON.parse(raw);
            } catch {
              console.warn(
                "Ignored invalid JSON Kafka message."
              );

              return;
            }

            /*
              Bỏ qua message test:
              {"test":"kafka-ok"}

              hoặc event loại khác.
            */
            if (
              event.eventType !==
              "OrderCreated"
            ) {
              console.log(
                "Ignored non-OrderCreated Kafka message."
              );

              return;
            }

            const oid =
              Number(
                event.data?.oid ??
                event.aggregateId
              );

            const uid =
              Number(
                event.data?.uid
              );

            if (
              !Number.isInteger(oid) ||
              oid <= 0 ||
              !Number.isInteger(uid) ||
              uid <= 0
            ) {
              console.warn(
                "Ignored invalid OrderCreated event:",
                event
              );

              return;
            }

            const result =
              await createShipment.execute({
                oid,
                uid
              });

            if (result.created) {
              console.log(
                `Shipment created for Order ${oid}.`
              );
            } else {
              console.log(
                `Shipment for Order ${oid} already exists.`
              );
            }
          } catch (error) {
            console.error(
              "Failed to process OrderCreated event:",
              error
            );

            /*
              Ném lại để KafkaJS không coi
              message lỗi là xử lý thành công.
            */
            throw error;
          }
        }
    })
    .catch((error) => {
      console.error(
        "Shipment Kafka consumer stopped:",
        error
      );
    });
}