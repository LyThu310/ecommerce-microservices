import prisma from "./prisma.js";

const roles = [
  "CUSTOMER",
  "ADMIN",
  "SHIPMENT_STAFF"
];

try {
  for (const rolename of roles) {
    await prisma.role.upsert({
      where: {
        rolename
      },
      update: {},
      create: {
        rolename
      }
    });
  }

  const savedRoles = await prisma.role.findMany({
    orderBy: {
      roleid: "asc"
    }
  });

  console.log("Seed roles successfully.");
  console.table(savedRoles);
} catch (error) {
  console.error("Seed roles failed:", error);
} finally {
  await prisma.$disconnect();
}