import { UserRepository } from "../../domain/repositories/UserRepository.js";
import prisma from "../database/prisma.js";

export class PrismaUserRepository extends UserRepository {
  async findByUsername(username) {
  return prisma.user.findUnique({
    where: {
      username
    },
    include: {
      role: true
    }
  });
}

  async findByEmail(email) {
    return prisma.user.findUnique({
      where: {
        email
      }
    });
  }

  async findById(uid) {
    return prisma.user.findUnique({
      where: {
        uid
      },
      include: {
        role: true
      }
    });
  }

  async create(user) {
    return prisma.user.create({
      data: {
        username: user.username,
        password: user.password,
        email: user.email,
        phone: user.phone,
        roleid: user.roleid
      },
      include: {
        role: true
      }
    });
  }
}