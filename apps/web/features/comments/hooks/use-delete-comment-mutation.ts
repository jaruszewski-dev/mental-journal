import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { resolveApiErrorMessage } from '@/lib/api-error';

import { deleteComment } from '../api/delete-comment';
import { removeCommentItem } from '../utils/comments-cache';

type DeleteCommentVariables = {
	commentId: string;
	postId: string;
};

export function useDeleteCommentMutation() {
	const t = useTranslations('comments');
	const tApi = useTranslations('apiErrors');
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ commentId }: DeleteCommentVariables) =>
			deleteComment(commentId),
		onSuccess: (_data, variables) => {
			removeCommentItem(queryClient, variables.postId, variables.commentId);
			toast.success(t('deleteSuccess'), { position: 'bottom-center' });
		},
		onError: (error) => {
			toast.error(resolveApiErrorMessage(error, tApi));
		},
	});
}
