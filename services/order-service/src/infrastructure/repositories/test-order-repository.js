import { Order } from "../../domain/entities/Order.js";
import { OrderDetail } from "../../domain/entities/OrderDetail.js";
import { PrismaOrderRepository } from "./PrismaOrderRepository.js";
import prisma from "../database/prisma.js";

const repository =
  new PrismaOrderRepository();

try {
  const order = new Order({
    uid: 2,
    discount: 0,
    details: [
      new OrderDetail({
        pid: 1,
        qty: 1,
        unitPrice: 15000000
      })
    ]
  });

  const created =
    await repository.createWithOutbox(
      order
    );

  console.log(
    "Order repository create successful."
  );

  console.log(created);

  const found =
    await repository.findById(
      created.oid
    );

  console.log(
    "Order repository find successful."
  );

  console.log(found);

} catch (error) {
  console.error(
    "Order repository test failed:",
    error
  );
} finally {
  await prisma.$disconnect();
}