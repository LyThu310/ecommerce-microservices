import { z } from "zod";

export const customerIdSchema = z.object({
  uid: z.coerce
    .number()
    .int("UID must be an integer")
    .positive("UID must be greater than 0")
});

export const updateCustomerSchema = z.object({
  fullname: z.string()
    .trim()
    .min(2, "Fullname must have at least 2 characters")
    .max(100, "Fullname must have at most 100 characters")
}).strict();