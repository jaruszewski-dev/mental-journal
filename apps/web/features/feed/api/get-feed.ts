import { apiClient } from '@/lib/api-client';

export type FeedItem = {
	id: string;
	content: string;
	mood?: number;
	tags: string[];
	status: 'ACTIVE' | 'PENDING';
	anonName: string;
	avatarUrl: string | null;
	isMine: boolean;
	journalEntryId: string;
	createdAt: string;
	updatedAt: string | null;
};

export type FeedNextCursor = {
	id: string;
	createdAt: string;
};

export type ListFeedResponse = {
	items: FeedItem[];
	meta: {
		hasMore: boolean;
		nextCursor: FeedNextCursor | null;
	};
};

export type ListFeedParams = {
	tags?: string[];
	lastCursorId?: string;
	lastCreatedAt?: string;
};

export async function getFeed(params: ListFeedParams = {}): Promise<ListFeedResponse> {
	const { data } = await apiClient.get<ListFeedResponse>('/feed', {
		params: {
			...(params.tags?.length ? { tags: params.tags } : {}),
			...(params.lastCursorId ? { lastCursorId: params.lastCursorId } : {}),
			...(params.lastCreatedAt ? { lastCreatedAt: params.lastCreatedAt } : {}),
		},
		paramsSerializer: {
			indexes: null,
		},
	});
	return data;
}
