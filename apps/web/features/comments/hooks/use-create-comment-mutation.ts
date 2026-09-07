import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { resolveApiErrorMessage } from '@/lib/api-error';

import { createComment } from '../api/create-comment';
import {
	commentItemFromCreateResponse,
	prependCommentItem,
} from '../utils/comments-cache';

export function useCreateCommentMutation(options?: { onSuccess?: () => void }) {
	const t = useTranslations('comments');
	const tApi = useTranslations('apiErrors');
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createComment,
		onSuccess: (data, variables) => {
			prependCommentItem(
				queryClient,
				variables.postId,
				commentItemFromCreateResponse(data),
			);
			toast.success(t('success'), { position: 'bottom-center' });
			options?.onSuccess?.();
		},
		onError: (error) => {
			toast.error(resolveApiErrorMessage(error, tApi));
		},
	});
}
