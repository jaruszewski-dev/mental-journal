import type { InfiniteData, QueryClient } from '@tanstack/react-query';

import type { JournalEntry, ListJournalResponse } from '../api/get-entries';
import { journalQueryKey } from '../consts/journal-query-key';

type JournalInfiniteData = InfiniteData<
	ListJournalResponse,
	{ id: string; createdAt?: string; mood?: number } | null
>;

function mapJournalItems(
	old: JournalInfiniteData,
	mapItem: (item: JournalEntry) => JournalEntry,
): JournalInfiniteData {
	return {
		...old,
		pages: old.pages.map((page) => ({
			...page,
			items: page.items.map(mapItem),
		})),
	};
}

export function setJournalEntryPost(
	queryClient: QueryClient,
	entryId: string,
	post: { postId: string; postStatus: 'ACTIVE' | 'PENDING' | 'HIDDEN' },
): void {
	queryClient.setQueriesData<JournalInfiniteData>({ queryKey: journalQueryKey }, (old) => {
		if (!old) return old;

		return mapJournalItems(old, (item) =>
			item.id === entryId
				? {
						...item,
						visibility: 'public',
						postId: post.postId,
						postStatus: post.postStatus,
					}
				: item,
		);
	});
}

export function activateJournalPost(
	queryClient: QueryClient,
	postId: string,
): void {
	queryClient.setQueriesData<JournalInfiniteData>({ queryKey: journalQueryKey }, (old) => {
		if (!old) return old;

		return mapJournalItems(old, (item) =>
			item.postId === postId
				? { ...item, postStatus: 'ACTIVE' as const }
				: item,
		);
	});
}

export function hideJournalPost(queryClient: QueryClient, postId: string): void {
	queryClient.setQueriesData<JournalInfiniteData>({ queryKey: journalQueryKey }, (old) => {
		if (!old) return old;

		return mapJournalItems(old, (item) =>
			item.postId === postId
				? { ...item, postStatus: 'HIDDEN' as const }
				: item,
		);
	});
}
