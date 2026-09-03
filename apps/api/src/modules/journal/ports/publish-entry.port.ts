export interface PublishEntryInput {
  authorId: string;
  journalEntryId: string;
  content: string;
  mood?: number | null;
  tags: string[];
}

export interface PublishEntryPort {
  execute(input: PublishEntryInput): Promise<{ id: string }>;
}

export const PUBLISH_ENTRY_PORT = Symbol('PUBLISH_ENTRY_PORT');
