import { useInfiniteQuery } from '@tanstack/react-query';

import { getFeed } from '../api/get-feed';
import { feedListQueryKey } from '../consts/feed-query-key';

export function useFeedInfiniteQuery(tags: string[] = []) {
	return useInfiniteQuery({
		queryKey: feedListQueryKey(tags),
		queryFn: ({ pageParam }) =>
			getFeed(
				pageParam
					? {
							tags,
							lastCursorId: pageParam.id,
							lastCreatedAt: pageParam.createdAt,
						}
					: { tags },
			),
		initialPageParam: null as { id: string; createdAt: string } | null,
		getNextPageParam: (lastPage) => (lastPage.meta.hasMore ? lastPage.meta.nextCursor : undefined),
	});
}
