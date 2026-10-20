export class ProductRepository {
  async findAll() {
    throw new Error("Not implemented");
  }

  async findByPid(pid) {
    throw new Error("Not implemented");
  }

  async create(product) {
    throw new Error("Not implemented");
  }

  async update(pid, productData) {
    throw new Error("Not implemented");
  }

  async delete(pid) {
    throw new Error("Not implemented");
  }

  async decreaseStock(pid, qty) {
    throw new Error("Not implemented");
  }

  async restoreStock(pid, qty) {
    throw new Error("Not implemented");
  }
}