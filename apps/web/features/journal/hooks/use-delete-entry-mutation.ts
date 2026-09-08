import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { feedQueryKey } from '@/features/feed/consts/feed-query-key';
import { resolveApiErrorMessage } from '@/lib/api-error';

import { deleteEntry } from '../api/delete-entry';
import { journalQueryKey } from '../consts/journal-query-key';

export function useDeleteEntryMutation() {
	const t = useTranslations('entryActions');
	const tApi = useTranslations('apiErrors');
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteEntry,
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: journalQueryKey });
			void queryClient.invalidateQueries({ queryKey: feedQueryKey });
			toast.success(t('deleteSuccess'), { position: 'bottom-center' });
		},
		onError: (error) => {
			toast.error(resolveApiErrorMessage(error, tApi));
		},
	});
}
