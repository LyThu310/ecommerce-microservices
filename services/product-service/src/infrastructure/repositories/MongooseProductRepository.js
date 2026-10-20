import { ProductRepository } from "../../domain/repositories/ProductRepository.js";
import { ProductModel } from "../models/ProductModel.js";

function mapProduct(document) {
  if (!document) {
    return null;
  }

  return {
    pid: document.pid,
    pname: document.pname,
    price: Number(document.price.toString()),
    quantity: document.quantity
  };
}

export class MongooseProductRepository extends ProductRepository {
  async findAll() {
    const products = await ProductModel.find()
      .sort({ pid: 1 });

    return products.map(mapProduct);
  }

  async findByPid(pid) {
    const product = await ProductModel.findOne({
      pid
    });

    return mapProduct(product);
  }

  async create(product) {
    const createdProduct =
      await ProductModel.create({
        pid: product.pid,
        pname: product.pname,
        price: product.price.toString(),
        quantity: product.quantity
      });

    return mapProduct(createdProduct);
  }

  async update(pid, productData) {
    const data = {};

    if (productData.pname !== undefined) {
      data.pname = productData.pname;
    }

    if (productData.price !== undefined) {
      data.price = productData.price.toString();
    }

    if (productData.quantity !== undefined) {
      data.quantity = productData.quantity;
    }

    const updatedProduct =
      await ProductModel.findOneAndUpdate(
        { pid },
        data,
        {
          new: true,
          runValidators: true
        }
      );

    return mapProduct(updatedProduct);
  }

  async delete(pid) {
    const deletedProduct =
      await ProductModel.findOneAndDelete({
        pid
      });

    return mapProduct(deletedProduct);
  }
  async decreaseStock(pid, qty) {
  const product =
    await ProductModel.findOneAndUpdate(
      {
        pid,
        quantity: {
          $gte: qty
        }
      },
      {
        $inc: {
          quantity: -qty
        }
      },
      {
        new: true,
        runValidators: true
      }
    );

  return mapProduct(product);
}

async restoreStock(pid, qty) {
  const product =
    await ProductModel.findOneAndUpdate(
      {
        pid
      },
      {
        $inc: {
          quantity: qty
        }
      },
      {
        new: true,
        runValidators: true
      }
    );

  return mapProduct(product);
}
}
