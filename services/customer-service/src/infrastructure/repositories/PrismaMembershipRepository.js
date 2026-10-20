import { MembershipRepository } from "../../domain/repositories/MembershipRepository.js";
import prisma from "../database/prisma.js";

export class PrismaMembershipRepository extends MembershipRepository {
  async findAll() {
    return prisma.membership.findMany({
      orderBy: {
        mid: "asc"
      }
    });
  }

  async findById(mid) {
    return prisma.membership.findUnique({
      where: {
        mid
      }
    });
  }

  async create(membership) {
    return prisma.membership.create({
      data: {
        mname: membership.mname,
        score: membership.score
      }
    });
  }

  async update(mid, data) {
    return prisma.membership.update({
      where: {
        mid
      },
      data
    });
  }

  async delete(mid) {
    return prisma.membership.delete({
      where: {
        mid
      }
    });
  }
}
