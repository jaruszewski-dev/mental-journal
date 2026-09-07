import { apiClient } from '@/lib/api-client';

import type { CommentItem } from './get-comments';

export type CreateCommentPayload = {
	postId: string;
	content: string;
};

export type CreateCommentResponse = CommentItem;

export async function createComment(
	payload: CreateCommentPayload,
): Promise<CreateCommentResponse> {
	const { data } = await apiClient.post<CreateCommentResponse>('/comments', payload);
	return data;
}
