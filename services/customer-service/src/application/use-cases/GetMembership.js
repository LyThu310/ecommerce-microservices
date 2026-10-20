export class GetMembership {
  constructor(membershipRepository) {
    this.membershipRepository =
      membershipRepository;
  }

  async execute(mid) {
    const membership =
      await this.membershipRepository.findById(
        mid
      );

    if (!membership) {
      throw new Error(
        "Membership not found"
      );
    }

    return membership;
  }
}