import { useInfiniteQuery } from '@tanstack/react-query';

import { getJournalEntries } from '../api/get-entries';
import { journalQueryKey } from '../consts/journal-query-key';

export function useJournalInfiniteQuery() {
	return useInfiniteQuery({
		queryKey: journalQueryKey,
		queryFn: ({ pageParam }) =>
			getJournalEntries(
				pageParam
					? {
							lastCursorId: pageParam.id,
							lastCreatedAt: pageParam.createdAt,
						}
					: {},
			),
		initialPageParam: null as { id: string; createdAt?: string } | null,
		getNextPageParam: (lastPage) => {
			if (!lastPage.meta.hasMore || !lastPage.meta.nextCursor) {
				return undefined;
			}
			return {
				id: lastPage.meta.nextCursor.id,
				createdAt: lastPage.meta.nextCursor.createdAt,
			};
		},
	});
}
