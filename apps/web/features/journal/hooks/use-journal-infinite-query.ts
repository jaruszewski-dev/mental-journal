import { useInfiniteQuery } from '@tanstack/react-query';

import { getJournalEntries } from '../api/get-entries';
import {
	type JournalListSort,
	journalListQueryKey,
} from '../consts/journal-query-key';

export function useJournalInfiniteQuery(sort: JournalListSort) {
	return useInfiniteQuery({
		queryKey: journalListQueryKey(sort),
		queryFn: ({ pageParam }) =>
			getJournalEntries(
				pageParam
					? {
							sortBy: sort.sortBy,
							orderBy: sort.orderBy,
							lastCursorId: pageParam.id,
							lastCreatedAt: pageParam.createdAt,
							lastMood: pageParam.mood,
						}
					: {
							sortBy: sort.sortBy,
							orderBy: sort.orderBy,
						},
			),
		initialPageParam: null as {
			id: string;
			createdAt?: string;
			mood?: number;
		} | null,
		getNextPageParam: (lastPage) => {
			if (!lastPage.meta.hasMore || !lastPage.meta.nextCursor) {
				return undefined;
			}
			return {
				id: lastPage.meta.nextCursor.id,
				createdAt: lastPage.meta.nextCursor.createdAt,
				mood: lastPage.meta.nextCursor.mood,
			};
		},
	});
}
