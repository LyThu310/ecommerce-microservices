import { Product } from "../../domain/entities/Product.js";

export class CreateProduct {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute({
    pid,
    pname,
    price,
    quantity
  }) {
    const existingProduct =
      await this.productRepository.findByPid(pid);

    if (existingProduct) {
      throw new Error("Product already exists");
    }

    const product = new Product({
      pid,
      pname,
      price,
      quantity
    });

    return this.productRepository.create(product);
  }
}