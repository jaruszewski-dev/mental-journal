import { apiClient } from '@/lib/api-client';

export type DeleteCommentResponse = {
	id: string;
};

export async function deleteComment(
	commentId: string,
): Promise<DeleteCommentResponse> {
	const { data } = await apiClient.delete<DeleteCommentResponse>(
		`/comments/${commentId}`,
	);
	return data;
}
