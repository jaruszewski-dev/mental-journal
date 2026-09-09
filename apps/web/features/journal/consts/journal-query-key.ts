export const journalQueryKey = ['journal'] as const;

export type JournalListSort = {
	sortBy: 'date' | 'mood';
	orderBy: 'asc' | 'desc';
};

export function journalListQueryKey(sort: JournalListSort) {
	return [...journalQueryKey, sort] as const;
}
