import type { InfiniteData, QueryClient } from '@tanstack/react-query';

import type { FeedItem, ListFeedResponse } from '../api/get-feed';
import { feedQueryKey } from '../consts/feed-query-key';

type FeedInfiniteData = InfiniteData<ListFeedResponse, { id: string; createdAt: string } | null>;

function toIso(value: string | Date): string {
	return typeof value === 'string' ? value : value.toISOString();
}

export function prependFeedItem(queryClient: QueryClient, item: FeedItem): void {
	queryClient.setQueryData<FeedInfiniteData>(feedQueryKey, (old) => {
		if (!old?.pages.length) {
			return {
				pages: [
					{
						items: [item],
						meta: { hasMore: false, nextCursor: null },
					},
				],
				pageParams: [null],
			};
		}

		const first = old.pages[0];
		if (!first) return old;

		if (first.items.some((existing) => existing.id === item.id)) {
			return old;
		}

		const nextFirst: ListFeedResponse = {
			...first,
			items: [item, ...first.items],
		};

		return {
			...old,
			pages: [nextFirst, ...old.pages.slice(1)],
		};
	});
}

export function activateFeedItem(queryClient: QueryClient, postId: string): void {
	queryClient.setQueryData<FeedInfiniteData>(feedQueryKey, (old) => {
		if (!old) return old;

		return {
			...old,
			pages: old.pages.map((page) => ({
				...page,
				items: page.items.map((item) =>
					item.id === postId ? { ...item, status: 'ACTIVE' as const } : item,
				),
			})),
		};
	});
}

export function removeFeedItem(queryClient: QueryClient, postId: string): void {
	queryClient.setQueryData<FeedInfiniteData>(feedQueryKey, (old) => {
		if (!old) return old;

		return {
			...old,
			pages: old.pages.map((page) => ({
				...page,
				items: page.items.filter((item) => item.id !== postId),
			})),
		};
	});
}

export function feedItemFromCreateResponse(post: {
	id: string;
	content: string;
	mood?: number;
	tags: string[];
	status: 'ACTIVE' | 'PENDING';
	anonName: string;
	avatarUrl: string | null;
	isMine?: boolean;
	journalEntryId: string;
	createdAt: string | Date;
	updatedAt: string | Date | null;
}): FeedItem {
	return {
		id: post.id,
		content: post.content,
		mood: post.mood,
		tags: post.tags,
		status: post.status,
		anonName: post.anonName,
		avatarUrl: post.avatarUrl,
		isMine: post.isMine ?? true,
		journalEntryId: post.journalEntryId,
		createdAt: toIso(post.createdAt),
		updatedAt: post.updatedAt == null ? null : toIso(post.updatedAt),
	};
}
