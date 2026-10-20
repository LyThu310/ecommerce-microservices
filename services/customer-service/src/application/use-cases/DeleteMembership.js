export class DeleteMembership {
  constructor(membershipRepository) {
    this.membershipRepository =
      membershipRepository;
  }

  async execute(mid) {
    const existingMembership =
      await this.membershipRepository.findById(
        mid
      );

    if (!existingMembership) {
      throw new Error(
        "Membership not found"
      );
    }

    return this.membershipRepository.delete(
      mid
    );
  }
}