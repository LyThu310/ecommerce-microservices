export class DeleteProduct {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(pid) {
    const existingProduct =
      await this.productRepository.findByPid(pid);

    if (!existingProduct) {
      throw new Error("Product not found");
    }

    return this.productRepository.delete(pid);
  }
}