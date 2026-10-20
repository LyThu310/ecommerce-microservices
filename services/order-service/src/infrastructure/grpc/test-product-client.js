import { getProduct } from "./product.client.js";

try {
  const product =
    await getProduct(999999);
  console.log(
    "Product gRPC call successful."
  );

  console.log(product);
} catch (error) {
  console.error(
    "Product gRPC call failed:",
    error.message
  );
}