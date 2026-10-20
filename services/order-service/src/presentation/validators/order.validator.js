import { z } from "zod";

export const createOrderSchema = z
  .object({
    uid: z.coerce
      .number()
      .int()
      .positive(),

    items: z
      .array(
        z
          .object({
            pid: z.coerce
              .number()
              .int()
              .positive(),

            qty: z.coerce
              .number()
              .int()
              .positive()
          })
          .strict()
      )
      .min(1)
  })
  .strict()
  .superRefine((data, ctx) => {
    const pids =
      data.items.map(
        (item) => item.pid
      );

    const uniquePids =
      new Set(pids);

    if (
      uniquePids.size !==
      pids.length
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["items"],
        message:
          "Duplicate product in order"
      });
    }
  });

export const orderIdSchema =
  z.coerce
    .number()
    .int()
    .positive();