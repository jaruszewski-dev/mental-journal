export interface PublishEntryInput {
  authorId: string;
  journalEntryId: string;
  content: string;
  mood?: number | null;
  tags: string[];
}

export type PublishEntryResult = {
  id: string;
  content: string;
  mood: number | null;
  tags: string[];
  status: 'PENDING';
  anonName: string;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export interface PublishEntryPort {
  execute(input: PublishEntryInput): Promise<PublishEntryResult>;
}

export const PUBLISH_ENTRY_PORT = Symbol('PUBLISH_ENTRY_PORT');
