import { useInfiniteQuery } from "@tanstack/react-query";

import { getFeed } from "../api/get-feed";
import { feedQueryKey } from "../consts/feed-query-key";

export function useFeedInfiniteQuery() {
  return useInfiniteQuery({
    queryKey: feedQueryKey,
    queryFn: ({ pageParam }) =>
      getFeed(
        pageParam
          ? {
              lastCursorId: pageParam.id,
              lastCreatedAt: pageParam.createdAt,
            }
          : {},
      ),
    initialPageParam: null as { id: string; createdAt: string } | null,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasMore ? lastPage.meta.nextCursor : undefined,
  });
}
