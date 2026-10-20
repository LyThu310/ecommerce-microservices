import { getCustomer } from "./customer.client.js";

try {
  const customer = await getCustomer(2);

  console.log(
    "Customer gRPC call successful."
  );

  console.log(customer);
} catch (error) {
  console.error(
    "Customer gRPC call failed:",
    error.message
  );
}