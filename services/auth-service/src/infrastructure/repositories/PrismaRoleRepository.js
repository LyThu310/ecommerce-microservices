import { RoleRepository } from "../../domain/repositories/RoleRepository.js";
import prisma from "../database/prisma.js";

export class PrismaRoleRepository extends RoleRepository {
  async findByName(rolename) {
    return prisma.role.findUnique({
      where: {
        rolename
      }
    });
  }
}