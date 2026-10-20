export class UpdateCustomerProfile {
  constructor(customerRepository) {
    this.customerRepository = customerRepository;
  }

  async execute(uid, { fullname }) {
    const existingCustomer =
      await this.customerRepository.findById(uid);

    if (!existingCustomer) {
      throw new Error("Customer not found");
    }

    const updatedCustomer =
      await this.customerRepository.updateFullname(
        uid,
        fullname
      );

    return {
      uid: updatedCustomer.uid,
      fullname: updatedCustomer.fullname,
      membership: {
        mid: updatedCustomer.membership.mid,
        mname: updatedCustomer.membership.mname,
        score: updatedCustomer.membership.score
      }
    };
  }
}