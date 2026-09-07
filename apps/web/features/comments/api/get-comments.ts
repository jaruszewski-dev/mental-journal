import { apiClient } from '@/lib/api-client';

export type CommentItem = {
	id: string;
	content: string;
	anonName: string;
	avatarUrl: string | null;
	createdAt: string;
	updatedAt: string | null;
};

export type CommentsNextCursor = {
	id: string;
	createdAt: string;
};

export type ListCommentsResponse = {
	items: CommentItem[];
	meta: {
		hasMore: boolean;
		nextCursor: CommentsNextCursor | null;
	};
};

export type ListCommentsParams = {
	postId: string;
	lastCursorId?: string;
	lastCreatedAt?: string;
};

export async function getComments(params: ListCommentsParams): Promise<ListCommentsResponse> {
	const { data } = await apiClient.get<ListCommentsResponse>('/comments', {
		params: {
			postId: params.postId,
			...(params.lastCursorId ? { lastCursorId: params.lastCursorId } : {}),
			...(params.lastCreatedAt ? { lastCreatedAt: params.lastCreatedAt } : {}),
		},
	});
	return data;
}
