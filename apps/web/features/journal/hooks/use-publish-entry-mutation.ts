import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import {
	feedItemFromCreateResponse,
	prependFeedItem,
} from '@/features/feed/utils/feed-cache';
import { resolveApiErrorMessage } from '@/lib/api-error';

import { publishEntry } from '../api/publish-entry';
import { journalQueryKey } from '../consts/journal-query-key';
import { setJournalEntryPost } from '../utils/journal-cache';

export function usePublishEntryMutation() {
	const t = useTranslations('entryActions');
	const tApi = useTranslations('apiErrors');
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: publishEntry,
		onSuccess: (data) => {
			if (data.post) {
				setJournalEntryPost(queryClient, data.id, {
					postId: data.post.id,
					postStatus: data.post.status,
				});
				prependFeedItem(queryClient, feedItemFromCreateResponse(data.post));
			}
			void queryClient.invalidateQueries({ queryKey: journalQueryKey });
			toast.success(t('publishSuccess'), { position: 'bottom-center' });
		},
		onError: (error) => {
			toast.error(resolveApiErrorMessage(error, tApi));
		},
	});
}
