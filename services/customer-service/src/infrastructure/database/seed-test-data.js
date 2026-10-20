import prisma from "./prisma.js";

try {
  let membership = await prisma.membership.findFirst({
    where: {
      mname: "TEST"
    }
  });

  if (!membership) {
    membership = await prisma.membership.create({
      data: {
        mname: "TEST",
        score: 0
      }
    });
  }

  const customer = await prisma.customer.upsert({
    where: {
      uid: 2
    },
    update: {
      fullname: "Test Customer",
      mid: membership.mid
    },
    create: {
      uid: 2,
      fullname: "Test Customer",
      mid: membership.mid
    },
    include: {
      membership: true
    }
  });

  console.log("Test data created successfully.");
  console.log(customer);
} catch (error) {
  console.error("Seed test data failed:", error);
} finally {
  await prisma.$disconnect();
}
