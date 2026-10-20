import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must have at least 3 characters")
    .max(50, "Username must have at most 50 characters"),

  password: z
    .string()
    .min(6, "Password must have at least 6 characters"),

  email: z
    .string()
    .trim()
    .email("Invalid email"),

  phone: z
    .string()
    .trim()
    .min(9, "Phone number is too short")
    .max(20, "Phone number is too long")
});
export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Username is required"),

  password: z
    .string()
    .min(1, "Password is required")
});