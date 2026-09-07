import { useInfiniteQuery } from '@tanstack/react-query';

import { getComments } from '../api/get-comments';
import { commentsQueryKey } from '../consts/comments-query-key';

export function useCommentsInfiniteQuery(postId: string, enabled: boolean) {
	return useInfiniteQuery({
		queryKey: commentsQueryKey(postId),
		queryFn: ({ pageParam }) =>
			getComments(
				pageParam
					? {
							postId,
							lastCursorId: pageParam.id,
							lastCreatedAt: pageParam.createdAt,
						}
					: { postId },
			),
		initialPageParam: null as { id: string; createdAt: string } | null,
		getNextPageParam: (lastPage) => (lastPage.meta.hasMore ? lastPage.meta.nextCursor : undefined),
		enabled,
	});
}
