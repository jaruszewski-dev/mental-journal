export const SEED_USER_COUNT = 50;

export const ENTRIES_PER_USER_MIN = 8;
export const ENTRIES_PER_USER_MAX = 15;

export const PUBLISH_RATIO = 0.7;

export const COMMENTS_PER_ACTIVE_POST_MIN = 2;
export const COMMENTS_PER_ACTIVE_POST_MAX = 8;

export const SEED_PASSWORD = 'Password1!';
export const BCRYPT_SALT_ROUNDS = 12;

export const SEED_DB_NAME = 'mental_journal_seed';
export const MAIN_DB_NAME = 'mental_journal';

export const TABLES_TO_TRUNCATE = [
	'moderation_evidence',
	'moderation_cases',
	'comments',
	'posts',
	'journal_entries',
	'sessions',
	'user',
] as const;
