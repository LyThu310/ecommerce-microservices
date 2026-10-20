import "dotenv/config";
import app from "./app.js";
import { startCustomerGrpcServer } from "./infrastructure/grpc/customer.grpc.js";

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(
    `Customer Service is running on port ${PORT}`
  );
});

startCustomerGrpcServer();