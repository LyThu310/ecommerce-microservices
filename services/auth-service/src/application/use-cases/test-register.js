import { PrismaUserRepository } from "../../infrastructure/repositories/PrismaUserRepository.js";
import { PrismaRoleRepository } from "../../infrastructure/repositories/PrismaRoleRepository.js";
import { RegisterUser } from "./RegisterUser.js";
import prisma from "../../infrastructure/database/prisma.js";

const userRepository = new PrismaUserRepository();
const roleRepository = new PrismaRoleRepository();

const registerUser = new RegisterUser(
  userRepository,
  roleRepository
);

try {
  const result = await registerUser.execute({
    username: "customer01",
    password: "123456",
    email: "customer01@example.com",
    phone: "0901234567"
  });

  console.log("Register successfully.");
  console.log(result);
} catch (error) {
  console.error("Register failed:", error.message);
} finally {
  await prisma.$disconnect();
}

