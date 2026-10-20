import prisma from "./prisma.js";

try {
  const roleCount = await prisma.role.count();

  console.log("Prisma connected successfully.");
  console.log("Role count:", roleCount);
} catch (error) {
  console.error("Prisma connection failed:", error);
} finally {
  await prisma.$disconnect();
}