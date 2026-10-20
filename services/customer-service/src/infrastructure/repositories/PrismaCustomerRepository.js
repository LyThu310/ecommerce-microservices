import { CustomerRepository } from "../../domain/repositories/CustomerRepository.js";
import prisma from "../database/prisma.js";

export class PrismaCustomerRepository extends CustomerRepository {
  async findById(uid) {
    return prisma.customer.findUnique({
      where: {
        uid
      },
      include: {
        membership: true
      }
    });
  }

  async updateFullname(uid, fullname) {
    return prisma.customer.update({
      where: {
        uid
      },
      data: {
        fullname
      },
      include: {
        membership: true
      }
    });
  }
}