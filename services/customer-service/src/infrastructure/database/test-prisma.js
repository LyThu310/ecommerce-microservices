import prisma from "./prisma.js";

try {
  const membershipCount = await prisma.membership.count();
  const customerCount = await prisma.customer.count();

  console.log("Prisma connected successfully.");
  console.log("Membership count:", membershipCount);
  console.log("Customer count:", customerCount);
} catch (error) {
  console.error("Prisma connection failed:", error);
} finally {
  await prisma.$disconnect();
}