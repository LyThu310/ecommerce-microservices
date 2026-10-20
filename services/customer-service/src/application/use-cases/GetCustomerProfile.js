export class GetCustomerProfile {
  constructor(customerRepository) {
    this.customerRepository = customerRepository;
  }

  async execute(uid) {
    const customer = await this.customerRepository.findById(uid);

    if (!customer) {
      throw new Error("Customer not found");
    }

    return {
      uid: customer.uid,
      fullname: customer.fullname,
      membership: {
        mid: customer.membership.mid,
        mname: customer.membership.mname,
        score: customer.membership.score
      }
    };
  }
}