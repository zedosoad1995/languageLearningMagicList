import { z } from "zod";

export const createUserSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(1),
    words_per_day: z.number().min(1).max(100).optional(),
  })
  .strict();
