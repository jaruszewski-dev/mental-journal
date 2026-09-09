import { apiClient } from '@/lib/api-client';

export type JournalEntry = {
	id: string;
	content: string;
	mood?: number;
	tags: string[];
	visibility: 'private' | 'public';
	postStatus?: 'ACTIVE' | 'PENDING' | 'HIDDEN';
	postId?: string;
	createdAt: string;
	updatedAt: string | null;
};

export type JournalNextCursor = {
	id: string;
	createdAt?: string;
	mood?: number;
};

export type ListJournalResponse = {
	items: JournalEntry[];
	meta: {
		hasMore: boolean;
		nextCursor: JournalNextCursor | null;
	};
};

export type ListJournalParams = {
	sortBy?: 'date' | 'mood';
	orderBy?: 'asc' | 'desc';
	lastCursorId?: string;
	lastCreatedAt?: string;
	lastMood?: number;
};

export async function getJournalEntries(
	params: ListJournalParams = {},
): Promise<ListJournalResponse> {
	const { data } = await apiClient.get<ListJournalResponse>('/journal', {
		params: {
			...(params.sortBy ? { sortBy: params.sortBy } : {}),
			...(params.orderBy ? { orderBy: params.orderBy } : {}),
			...(params.lastCursorId ? { lastCursorId: params.lastCursorId } : {}),
			...(params.lastCreatedAt ? { lastCreatedAt: params.lastCreatedAt } : {}),
			...(params.lastMood != null ? { lastMood: params.lastMood } : {}),
		},
	});
	return data;
}
