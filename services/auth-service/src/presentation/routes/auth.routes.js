import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { RegisterUser } from "../../application/use-cases/RegisterUser.js";
import { LoginUser } from "../../application/use-cases/LoginUser.js";
import { PrismaUserRepository } from "../../infrastructure/repositories/PrismaUserRepository.js";
import { PrismaRoleRepository } from "../../infrastructure/repositories/PrismaRoleRepository.js";
import { JwtTokenService } from "../../infrastructure/security/JwtTokenService.js";

const router = Router();

const userRepository = new PrismaUserRepository();
const roleRepository = new PrismaRoleRepository();

const registerUser = new RegisterUser(
  userRepository,
  roleRepository
);

const tokenService = new JwtTokenService(
  process.env.JWT_SECRET,
  process.env.JWT_EXPIRES_IN
);

const loginUser = new LoginUser(
  userRepository,
  tokenService
);

const authController = new AuthController(
  registerUser,
  loginUser
);

router.post("/register", authController.register);
router.post("/login", authController.login);

export default router;