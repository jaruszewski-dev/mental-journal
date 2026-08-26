export const ErrorPath = {
  AUTH: 'auth',
  JOURNAL: 'journal',
  MAIL: 'mail',
  USER: 'user',
  FEED: 'feed',
  COMMENT: 'comment',
} as const;

export type ErrorPath = (typeof ErrorPath)[keyof typeof ErrorPath];
