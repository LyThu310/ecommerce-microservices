import { Router } from "express";
import { CustomerController } from "../controllers/customer.controller.js";
import { GetCustomerProfile } from "../../application/use-cases/GetCustomerProfile.js";
import { UpdateCustomerProfile } from "../../application/use-cases/UpdateCustomerProfile.js";
import { PrismaCustomerRepository } from "../../infrastructure/repositories/PrismaCustomerRepository.js";

const router = Router();

const customerRepository = new PrismaCustomerRepository();

const getCustomerProfile = new GetCustomerProfile(
  customerRepository
);

const updateCustomerProfile = new UpdateCustomerProfile(
  customerRepository
);

const customerController = new CustomerController(
  getCustomerProfile,
  updateCustomerProfile
);

router.get("/:uid", customerController.getById);
router.put("/:uid", customerController.update);

export default router;