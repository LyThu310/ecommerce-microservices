import bcrypt from "bcryptjs";
import prisma from "./src/infrastructure/database/prisma.js";

const PASSWORD = "password123456";

try {
  const adminRole =
    await prisma.role.findUnique({
      where: {
        rolename: "ADMIN"
      }
    });

  const shipmentRole =
    await prisma.role.findUnique({
      where: {
        rolename: "SHIPMENT_STAFF"
      }
    });

  if (!adminRole || !shipmentRole) {
    throw new Error(
      "Required roles not found"
    );
  }

  const hashedPassword =
    await bcrypt.hash(
      PASSWORD,
      10
    );

  const admin =
    await prisma.user.upsert({
      where: {
        username: "admin01"
      },

      update: {
        password: hashedPassword,
        email:
          "admin01@example.com",
        phone:
          "0903333333",
        roleid:
          adminRole.roleid
      },

      create: {
        username: "admin01",
        password: hashedPassword,
        email:
          "admin01@example.com",
        phone:
          "0903333333",
        roleid:
          adminRole.roleid
      }
    });

  const shipmentStaff =
    await prisma.user.upsert({
      where: {
        username: "shipper01"
      },

      update: {
        password: hashedPassword,
        email:
          "shipper01@example.com",
        phone:
          "0904444444",
        roleid:
          shipmentRole.roleid
      },

      create: {
        username: "shipper01",
        password: hashedPassword,
        email:
          "shipper01@example.com",
        phone:
          "0904444444",
        roleid:
          shipmentRole.roleid
      }
    });

  console.log(
    "ADMIN user:",
    admin.username
  );

  console.log(
    "SHIPMENT_STAFF user:",
    shipmentStaff.username
  );
} catch (error) {
  console.error(error);
} finally {
  await prisma.$disconnect();
}