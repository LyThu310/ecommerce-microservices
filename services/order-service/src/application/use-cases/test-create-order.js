import { CreateOrder } from "./CreateOrder.js";
import { PrismaOrderRepository } from "../../infrastructure/repositories/PrismaOrderRepository.js";

import * as customerClient
  from "../../infrastructure/grpc/customer.client.js";

import * as productClient
  from "../../infrastructure/grpc/product.client.js";

import prisma
  from "../../infrastructure/database/prisma.js";

const orderRepository =
  new PrismaOrderRepository();

/*
  TEST ONLY.

  Tài liệu hiện chưa quy định công thức
  score -> discount nên không dùng policy này
  làm business rule chính thức.
*/
const testDiscountPolicy = {
  calculate({ score, subtotal }) {
    console.log(
      "Test discount input:",
      {
        score,
        subtotal
      }
    );

    return 0;
  }
};

const createOrder =
  new CreateOrder({
    orderRepository,
    customerClient,
    productClient,
    discountPolicy: testDiscountPolicy
  });

try {
  const result =
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
    "Create order successful."
  );

  console.dir(result, {
    depth: null
  });
} catch (error) {
  console.error(
    "Create order failed:",
    error.message
  );
} finally {
  await prisma.$disconnect();
}