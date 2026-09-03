import { apiClient } from "@/lib/api-client";

export type FeedItem = {
  id: string;
  content: string;
  mood?: number;
  tags: string[];
  anonName: string;
  createdAt: string;
  updatedAt: string | null;
};

export type FeedNextCursor = {
  id: string;
  createdAt: string;
};

export type ListFeedResponse = {
  items: FeedItem[];
  meta: {
    hasMore: boolean;
    nextCursor: FeedNextCursor | null;
  };
};

export type ListFeedParams = {
  lastCursorId?: string;
  lastCreatedAt?: string;
};

export async function getFeed(
  params: ListFeedParams = {},
): Promise<ListFeedResponse> {
  const { data } = await apiClient.get<ListFeedResponse>("/feed", {
    params: {
      ...(params.lastCursorId ? { lastCursorId: params.lastCursorId } : {}),
      ...(params.lastCreatedAt
        ? { lastCreatedAt: params.lastCreatedAt }
        : {}),
    },
  });
  return data;
}
