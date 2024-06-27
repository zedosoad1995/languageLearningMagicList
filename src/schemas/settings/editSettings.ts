import { z } from "zod";

export const editSettingsSchema = z
  .object({
    words_per_day: z.number().min(1).max(100),
  })
  .strict()
  .partial();
