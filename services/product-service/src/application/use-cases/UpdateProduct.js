export class UpdateProduct {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(pid, productData) {
    const existingProduct =
      await this.productRepository.findByPid(pid);

    if (!existingProduct) {
      throw new Error("Product not found");
    }

    return this.productRepository.update(
      pid,
      productData
    );
  }
}