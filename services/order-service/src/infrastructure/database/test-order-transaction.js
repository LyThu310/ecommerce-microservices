import prisma from "./prisma.js";

try {
  const result = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        uid: 2,
        discount: "0.00",
        details: {
          create: [
            {
              pid: 1,
              qty: 2,
              unit_price: "15000000.00"
            }
          ]
        }
      },
      include: {
        details: true
      }
    });

    const outboxEvent = await tx.outboxEvent.create({
      data: {
        aggregatetype: "ORDER",
        aggregateid: order.oid,
        eventtype: "OrderCreated",
        payload: {
          oid: order.oid,
          uid: order.uid,
          items: [
            {
              pid: 1,
              qty: 2,
              unit_price: 15000000
            }
          ]
        }
      }
    });

    return {
      order,
      outboxEvent
    };
  });

  console.log("Transaction completed successfully.");
  console.dir(result, {
    depth: null
  });
} catch (error) {
  console.error(
    "Transaction failed:",
    error
  );
} finally {
  await prisma.$disconnect();
}