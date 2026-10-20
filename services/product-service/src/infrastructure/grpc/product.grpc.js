import path from "path";
import { fileURLToPath } from "url";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import { MongooseProductRepository } from "../repositories/MongooseProductRepository.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH = path.resolve(
  __dirname,
  "../../../../../proto/product.proto"
);

const packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  }
);

const productProto =
  grpc.loadPackageDefinition(packageDefinition).product;

const productRepository =
  new MongooseProductRepository();

// Lấy thông tin sản phẩm
async function getProduct(call, callback) {
  try {
    const pid = call.request.pid;

    const product =
      await productRepository.findByPid(pid);

    if (!product) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: "Product not found"
      });
    }

    return callback(null, {
      pid: product.pid,
      pname: product.pname,
      price: product.price,
      quantity: product.quantity
    });
  } catch (error) {
    console.error(
      "Product gRPC error:",
      error
    );

    return callback({
      code: grpc.status.INTERNAL,
      message: "Internal server error"
    });
  }
}

// Giảm số lượng tồn kho
async function decreaseStock(call, callback) {
  try {
    const { pid, qty } = call.request;

    if (!Number.isInteger(qty) || qty <= 0) {
      return callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: "Quantity must be greater than 0"
      });
    }

    const existingProduct =
      await productRepository.findByPid(pid);

    if (!existingProduct) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: "Product not found"
      });
    }

    const product =
      await productRepository.decreaseStock(
        pid,
        qty
      );

    if (!product) {
      return callback({
        code: grpc.status.FAILED_PRECONDITION,
        message: "Insufficient stock"
      });
    }

    return callback(null, {
      pid: product.pid,
      pname: product.pname,
      price: product.price,
      remainingQuantity: product.quantity
    });
  } catch (error) {
    console.error(
      "Decrease stock gRPC error:",
      error
    );

    return callback({
      code: grpc.status.INTERNAL,
      message: "Internal server error"
    });
  }
}

// Khôi phục số lượng tồn kho
async function restoreStock(call, callback) {
  try {
    const { pid, qty } = call.request;

    if (!Number.isInteger(qty) || qty <= 0) {
      return callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: "Quantity must be greater than 0"
      });
    }

    const product =
      await productRepository.restoreStock(
        pid,
        qty
      );

    if (!product) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: "Product not found"
      });
    }

    return callback(null, {
      pid: product.pid,
      quantity: product.quantity
    });
  } catch (error) {
    console.error(
      "Restore stock gRPC error:",
      error
    );

    return callback({
      code: grpc.status.INTERNAL,
      message: "Internal server error"
    });
  }
}

// Khởi động Product gRPC Server
export function startProductGrpcServer() {
  const server = new grpc.Server();

  server.addService(
    productProto.ProductService.service,
    {
      GetProduct: getProduct,
      DecreaseStock: decreaseStock,
      RestoreStock: restoreStock
    }
  );

  const grpcPort =
    process.env.GRPC_PORT || 50053;

  server.bindAsync(
    `0.0.0.0:${grpcPort}`,
    grpc.ServerCredentials.createInsecure(),
    (error) => {
      if (error) {
        console.error(
          "Failed to start Product gRPC server:",
          error
        );
        return;
      }

      console.log(
        `Product gRPC server is running on port ${grpcPort}`
      );
    }
  );
}
