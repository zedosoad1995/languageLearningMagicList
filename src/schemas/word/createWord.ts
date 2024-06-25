import { z } from "zod";

export const createWordSchema = z
  .object({
    original: z.string(),
    translation: z.string(),
    knowledge: z.number().min(1).max(5),
    relevance: z.number().min(1).max(5),
  })
  .strict();
