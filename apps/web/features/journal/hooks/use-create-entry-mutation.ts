import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { feedItemFromCreateResponse, prependFeedItem } from '@/features/feed/utils/feed-cache';
import { resolveApiErrorMessage } from '@/lib/api-error';

import { createEntry } from '../api/create-entry';
import { journalQueryKey } from '../consts/journal-query-key';
import { setJournalEntryPost } from '../utils/journal-cache';

export function useCreateEntryMutation(options?: { onSuccess?: () => void }) {
	const tApi = useTranslations('apiErrors');
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createEntry,
		onSuccess: (data, variables) => {
			if (variables.publish && data.post) {
				setJournalEntryPost(queryClient, data.id, {
					postId: data.post.id,
					postStatus: data.post.status,
				});
				prependFeedItem(queryClient, feedItemFromCreateResponse(data.post));
			}
			void queryClient.invalidateQueries({ queryKey: journalQueryKey });
			options?.onSuccess?.();
		},
		onError: (error) => {
			toast.error(resolveApiErrorMessage(error, tApi));
		},
	});
}
