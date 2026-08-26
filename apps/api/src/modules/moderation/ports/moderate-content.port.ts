export type ModerationContentType =
  | 'comment'
  | 'journal_entry'
  | 'chat_message';

export type ModerationSeverity = 'low' | 'medium' | 'high';

export interface ModerateContentInput {
  content: string;
  type: ModerationContentType;
}

export interface ModerateContentResult {
  allow: boolean;
  reason?: string;
  severity: ModerationSeverity;
}

export interface ModerateContentPort {
  execute(input: ModerateContentInput): Promise<ModerateContentResult>;
}

export const MODERATE_CONTENT_PORT = Symbol('MODERATE_CONTENT_PORT');
