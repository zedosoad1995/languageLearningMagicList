import { z } from "zod";

export const editWordSchema = z
  .object({
    original: z.string(),
    translation: z.string(),
    knowledge: z.number().min(1).max(5),
    relevance: z.number().min(1).max(5),
    isSeen: z.boolean(),
  })
  .strict()
  .partial();
