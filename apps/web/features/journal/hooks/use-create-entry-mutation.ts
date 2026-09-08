import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import {
	feedItemFromCreateResponse,
	prependFeedItem,
} from '@/features/feed/utils/feed-cache';
import { resolveApiErrorMessage } from '@/lib/api-error';

import { createEntry } from '../api/create-entry';
import { journalQueryKey } from '../consts/journal-query-key';

export function useCreateEntryMutation(options?: { onSuccess?: () => void }) {
	const tApi = useTranslations('apiErrors');
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createEntry,
		onSuccess: (data, variables) => {
			void queryClient.invalidateQueries({ queryKey: journalQueryKey });
			if (variables.publish && data.post) {
				prependFeedItem(queryClient, feedItemFromCreateResponse(data.post));
			}
			options?.onSuccess?.();
		},
		onError: (error) => {
			toast.error(resolveApiErrorMessage(error, tApi));
		},
	});
}
