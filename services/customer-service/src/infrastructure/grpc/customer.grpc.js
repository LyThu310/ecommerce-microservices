import path from "path";
import { fileURLToPath } from "url";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import { PrismaCustomerRepository } from "../repositories/PrismaCustomerRepository.js";

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

const customerRepository =
  new PrismaCustomerRepository();

async function getCustomer(call, callback) {
  try {
    const uid = call.request.uid;

    const customer =
      await customerRepository.findById(uid);

    if (!customer) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: "Customer not found"
      });
    }

    return callback(null, {
      uid: customer.uid,
      fullname: customer.fullname,
      mid: customer.membership.mid,
      mname: customer.membership.mname,
      score: customer.membership.score
    });
  } catch (error) {
    console.error("Customer gRPC error:", error);

    return callback({
      code: grpc.status.INTERNAL,
      message: "Internal server error"
    });
  }
}

export function startCustomerGrpcServer() {
  const server = new grpc.Server();

  server.addService(
    customerProto.CustomerService.service,
    {
      GetCustomer: getCustomer
    }
  );

  const grpcPort =
    process.env.GRPC_PORT || 50052;

  server.bindAsync(
    `0.0.0.0:${grpcPort}`,
    grpc.ServerCredentials.createInsecure(),
    (error) => {
      if (error) {
        console.error(
          "Failed to start Customer gRPC server:",
          error
        );
        return;
      }

      console.log(
        `Customer gRPC server is running on port ${grpcPort}`
      );
    }
  );
}