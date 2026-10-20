export class GetProductByPid {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(pid) {
    const product =
      await this.productRepository.findByPid(pid);

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  }
}