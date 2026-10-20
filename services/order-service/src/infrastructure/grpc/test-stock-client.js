import { decreaseStock } from "./product.client.js";

try {
  const result = await decreaseStock(1, 999);

  console.log("Decrease stock successful.");
  console.log(result);
} catch (error) {
  console.error(
    "Stock operation failed:",
    error.message
  );
}