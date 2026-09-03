import {
  ALL_JOURNAL_TAGS,
  JOURNAL_TAG_CATALOG,
  type JournalTag,
} from "@repo/api-types";
import { z } from "zod";

const MIN_CONTENT = 1;
const MAX_CONTENT = 10_000;
const MIN_MOOD = 1;
const MAX_MOOD = 5;
const MAX_TAGS = 5;

const journalTagSchema = z.enum(
  ALL_JOURNAL_TAGS as unknown as [JournalTag, ...JournalTag[]],
);

export function createEntrySchema(errors: {
  contentRequired: string;
  contentMax: string;
  tagsMax: string;
}) {
  return z.object({
    content: z
      .string()
      .min(MIN_CONTENT, errors.contentRequired)
      .max(MAX_CONTENT, errors.contentMax),
    mood: z.number().int().min(MIN_MOOD).max(MAX_MOOD).optional(),
    tags: z.array(journalTagSchema).max(MAX_TAGS, errors.tagsMax),
    publish: z.boolean(),
  });
}

export type EntryFormValues = z.infer<ReturnType<typeof createEntrySchema>>;

export { JOURNAL_TAG_CATALOG, MAX_TAGS };
export type { JournalTag };
