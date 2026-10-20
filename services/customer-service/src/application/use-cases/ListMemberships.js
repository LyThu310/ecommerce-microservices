export class ListMemberships {
  constructor(membershipRepository) {
    this.membershipRepository =
      membershipRepository;
  }

  async execute() {
    return this.membershipRepository.findAll();
  }
}