import { CreateOrder } from "./CreateOrder.js";

import * as customerClient
  from "../../infrastructure/grpc/customer.client.js";

import * as productClient
  from "../../infrastructure/grpc/product.client.js";

const failingOrderRepository = {
  async createWithOutbox() {
    throw new Error(
      "Forced database failure"
    );
  }
};

const testDiscountPolicy = {
  calculate() {
    return 0;
  }
};

const createOrder =
  new CreateOrder({
    orderRepository:
      failingOrderRepository,

    customerClient,
    productClient,

    discountPolicy:
      testDiscountPolicy
  });

try {
  await createOrder.execute({
    uid: 2,
    items: [
      {
        pid: 1,
        qty: 1
      }
    ]
  });

  console.log(
    "ERROR: Order should not succeed"
  );
} catch (error) {
  console.log(
    "Expected order failure:"
  );

  console.log(error.message);
}