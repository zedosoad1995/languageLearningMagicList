import { z } from "zod";

export const editWordSchema = z
  .object({
    original: z.string().transform((val) => val.trim()),
    translation: z.string().transform((val) => val.trim()),
    knowledge: z.number().min(1).max(5),
    relevance: z.number().min(1).max(5),
    isSeen: z.boolean(),
    is_learned: z.boolean(),
  })
  .strict()
  .partial();
