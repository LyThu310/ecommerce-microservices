import { z } from "zod";

export const productIdSchema = z.object({
  pid: z.coerce
    .number()
    .int("PID must be an integer")
    .positive("PID must be greater than 0")
});

export const createProductSchema = z.object({
  pid: z.number()
    .int("PID must be an integer")
    .positive("PID must be greater than 0"),

  pname: z.string()
    .trim()
    .min(1, "Product name is required")
    .max(100, "Product name must have at most 100 characters"),

  price: z.number()
    .positive("Price must be greater than 0")
    .max(99999999.99, "Price exceeds DECIMAL(10,2) range"),

  quantity: z.number()
    .int("Quantity must be an integer")
    .min(0, "Quantity cannot be negative")
}).strict();

export const updateProductSchema = z.object({
  pname: z.string()
    .trim()
    .min(1, "Product name is required")
    .max(100, "Product name must have at most 100 characters")
    .optional(),

  price: z.number()
    .positive("Price must be greater than 0")
    .max(99999999.99, "Price exceeds DECIMAL(10,2) range")
    .optional(),

  quantity: z.number()
    .int("Quantity must be an integer")
    .min(0, "Quantity cannot be negative")
    .optional()
})
.strict()
.refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one field must be provided"
  }
);