import { z } from "zod";

export const shipmentIdSchema =
  z.coerce
    .number()
    .int()
    .positive();

export const updateShipmentStatusSchema =
  z
    .object({
      status: z.enum([
        "PENDING",
        "SHIPPING",
        "DELIVERED"
      ])
    })
    .strict();