export class UpdateMembership {
  constructor(membershipRepository) {
    this.membershipRepository =
      membershipRepository;
  }

  async execute(
    mid,
    data
  ) {
    const existingMembership =
      await this.membershipRepository.findById(
        mid
      );

    if (!existingMembership) {
      throw new Error(
        "Membership not found"
      );
    }

    return this.membershipRepository.update(
      mid,
      data
    );
  }
}