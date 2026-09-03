import { z } from "zod";

const MIN_CONTENT = 1;
const MAX_CONTENT = 10_000;
const MIN_MOOD = 1;
const MAX_MOOD = 5;

export function createEntrySchema(errors: {
  contentRequired: string;
  contentMax: string;
}) {
  return z.object({
    content: z
      .string()
      .min(MIN_CONTENT, errors.contentRequired)
      .max(MAX_CONTENT, errors.contentMax),
    mood: z.number().int().min(MIN_MOOD).max(MAX_MOOD).optional(),
    publish: z.boolean(),
  });
}

export type EntryFormValues = z.infer<ReturnType<typeof createEntrySchema>>;
