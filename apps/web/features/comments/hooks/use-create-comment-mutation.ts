import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { resolveApiErrorMessage } from '@/lib/api-error';

import { createComment } from '../api/create-comment';

export function useCreateCommentMutation(options?: { onSuccess?: () => void }) {
	const t = useTranslations('comments');
	const tApi = useTranslations('apiErrors');

	return useMutation({
		mutationFn: createComment,
		onSuccess: () => {
			toast.success(t('success'), { position: 'bottom-center' });
			options?.onSuccess?.();
		},
		onError: (error) => {
			toast.error(resolveApiErrorMessage(error, tApi));
		},
	});
}
