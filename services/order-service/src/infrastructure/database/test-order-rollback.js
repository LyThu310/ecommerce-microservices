import prisma from "./prisma.js";

try {
  await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        uid: 999,
        discount: "0.00",
        details: {
          create: [
            {
              pid: 999,
              qty: 1,
              unit_price: "1000.00"
            }
          ]
        }
      }
    });

    console.log(
      "Temporary order created:",
      order.oid
    );

    throw new Error("Force rollback test");
  });
} catch (error) {
  console.log(
    "Rollback triggered:",
    error.message
  );
} finally {
  await prisma.$disconnect();
}