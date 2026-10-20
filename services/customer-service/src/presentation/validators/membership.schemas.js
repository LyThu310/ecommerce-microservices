import { z } from "zod";

export const membershipIdSchema = z.object({
  mid: z.coerce
    .number()
    .int("MID must be an integer")
    .positive("MID must be greater than 0")
});

export const createMembershipSchema = z.object({
  mname: z.string()
    .trim()
    .min(2, "Membership name must have at least 2 characters")
    .max(50, "Membership name must have at most 50 characters"),

  score: z.number()
    .int("Score must be an integer")
    .nonnegative("Score must be greater than or equal to 0")
}).strict();

export const updateMembershipSchema =
  createMembershipSchema;