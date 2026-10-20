import { OrderRepository } from "../../domain/repositories/OrderRepository.js";
import prisma from "../database/prisma.js";

function mapOrder(order) {
  if (!order) {
    return null;
  }

  return {
    oid: order.oid,
    uid: order.uid,
    discount: Number(
      order.discount.toString()
    ),
    details: order.details.map((detail) => ({
      pid: detail.pid,
      qty: detail.qty,
      unitPrice: Number(
        detail.unit_price.toString()
      )
    }))
  };
}

export class PrismaOrderRepository
  extends OrderRepository {

  async createWithOutbox(order) {
    return prisma.$transaction(
      async (tx) => {
        const createdOrder =
          await tx.order.create({
            data: {
              uid: order.uid,
              discount:
                order.discount.toString(),

              details: {
                create:
                  order.details.map(
                    (detail) => ({
                      pid: detail.pid,
                      qty: detail.qty,
                      unit_price:
                        detail.unitPrice.toString()
                    })
                  )
              }
            },

            include: {
              details: true
            }
          });

        await tx.outboxEvent.create({
          data: {
            aggregatetype: "ORDER",
            aggregateid:
              createdOrder.oid,
            eventtype: "OrderCreated",

            payload: {
              oid: createdOrder.oid,
              uid: createdOrder.uid,
              discount: Number(
                createdOrder.discount.toString()
              ),

              items:
                createdOrder.details.map(
                  (detail) => ({
                    pid: detail.pid,
                    qty: detail.qty,
                    unitPrice: Number(
                      detail.unit_price.toString()
                    )
                  })
                )
            }
          }
        });

        return mapOrder(createdOrder);
      }
    );
  }

  async findById(oid) {
    const order =
      await prisma.order.findUnique({
        where: {
          oid
        },

        include: {
          details: true
        }
      });

    return mapOrder(order);
  }
}