import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH = path.resolve(
  __dirname,
  "../../../../../proto/customer.proto"
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

const customerProto =
  grpc.loadPackageDefinition(packageDefinition).customer;

const client =
  new customerProto.CustomerService(
    process.env.CUSTOMER_GRPC_URL,
    grpc.credentials.createInsecure()
  );

export function getCustomer(uid) {
  return new Promise((resolve, reject) => {
    client.GetCustomer(
      { uid },
      (error, response) => {
        if (error) {
          return reject(error);
        }

        return resolve(response);
      }
    );
  });
}