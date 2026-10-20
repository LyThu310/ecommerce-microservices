import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

const __filename =
  fileURLToPath(import.meta.url);

const __dirname =
  path.dirname(__filename);

const PROTO_PATH = path.resolve(
  __dirname,
  "../../../../../proto/product.proto"
);

const packageDefinition =
  protoLoader.loadSync(
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
  grpc.loadPackageDefinition(
    packageDefinition
  ).product;

const client =
  new productProto.ProductService(
    process.env.PRODUCT_GRPC_URL,
    grpc.credentials.createInsecure()
  );

export function getProduct(pid) {
  return new Promise(
    (resolve, reject) => {
      client.GetProduct(
        { pid },
        (error, response) => {
          if (error) {
            return reject(error);
          }

          return resolve(response);
        }
      );
    }
  );
}
export function decreaseStock(pid, qty) {
  return new Promise(
    (resolve, reject) => {
      client.DecreaseStock(
        {
          pid,
          qty
        },
        (error, response) => {
          if (error) {
            return reject(error);
          }

          return resolve(response);
        }
      );
    }
  );
}

export function restoreStock(pid, qty) {
  return new Promise(
    (resolve, reject) => {
      client.RestoreStock(
        {
          pid,
          qty
        },
        (error, response) => {
          if (error) {
            return reject(error);
          }

          return resolve(response);
        }
      );
    }
  );
}