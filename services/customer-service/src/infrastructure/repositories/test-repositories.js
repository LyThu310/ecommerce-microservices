import { PrismaCustomerRepository } from "./PrismaCustomerRepository.js";
import { PrismaMembershipRepository } from "./PrismaMembershipRepository.js";
import prisma from "../database/prisma.js";

const customerRepository = new PrismaCustomerRepository();
const membershipRepository = new PrismaMembershipRepository();

try {
  const customer = await customerRepository.findById(999999);
  const membership = await membershipRepository.findById(999999);

  console.log("Customer repository connected successfully.");
  console.log("Customer result:", customer);

  console.log("Membership repository connected successfully.");
  console.log("Membership result:", membership);
} catch (error) {
  console.error("Repository test failed:", error);
} finally {
  await prisma.$disconnect();
}