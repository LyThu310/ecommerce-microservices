import { GetCustomerProfile } from "./GetCustomerProfile.js";
import { PrismaCustomerRepository } from "../../infrastructure/repositories/PrismaCustomerRepository.js";
import prisma from "../../infrastructure/database/prisma.js";

const customerRepository = new PrismaCustomerRepository();
const getCustomerProfile = new GetCustomerProfile(customerRepository);

try {
  const result = await getCustomerProfile.execute(999999);

  console.log("Customer profile:", result);
} catch (error) {
  console.error("Get customer profile failed:", error.message);
} finally {
  await prisma.$disconnect();
}