import { apiClient } from '@/lib/api-client';

export type CreateCommentPayload = {
	postId: string;
	content: string;
};

type CreateCommentResponse = {
	id: string;
};

export async function createComment(payload: CreateCommentPayload): Promise<CreateCommentResponse> {
	const { data } = await apiClient.post<CreateCommentResponse>('/comments', payload);
	return data;
}
