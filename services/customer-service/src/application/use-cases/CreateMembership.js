import {
  Membership
} from "../../domain/entities/Membership.js";

export class CreateMembership {
  constructor(membershipRepository) {
    this.membershipRepository =
      membershipRepository;
  }

  async execute({
    mname,
    score
  }) {
    const membership =
      new Membership({
        mname,
        score
      });

    return this.membershipRepository.create(
      membership
    );
  }
}