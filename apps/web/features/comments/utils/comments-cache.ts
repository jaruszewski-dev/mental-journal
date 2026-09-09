import type { InfiniteData, QueryClient } from '@tanstack/react-query';

import type { CommentItem, ListCommentsResponse } from '../api/get-comments';
import { commentsQueryKey } from '../consts/comments-query-key';

type CommentsInfiniteData = InfiniteData<ListCommentsResponse, { id: string; createdAt: string } | null>;

function toIso(value: string | Date): string {
	return typeof value === 'string' ? value : value.toISOString();
}

export function commentItemFromCreateResponse(comment: {
	id: string;
	content: string;
	status: 'ACTIVE' | 'PENDING';
	anonName: string;
	avatarUrl: string | null;
	isMine?: boolean;
	createdAt: string | Date;
	updatedAt: string | Date | null;
}): CommentItem {
	return {
		id: comment.id,
		content: comment.content,
		status: comment.status,
		anonName: comment.anonName,
		avatarUrl: comment.avatarUrl,
		isMine: comment.isMine ?? true,
		createdAt: toIso(comment.createdAt),
		updatedAt: comment.updatedAt == null ? null : toIso(comment.updatedAt),
	};
}

export function prependCommentItem(queryClient: QueryClient, postId: string, item: CommentItem): void {
	queryClient.setQueryData<CommentsInfiniteData>(commentsQueryKey(postId), (old) => {
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

		const nextFirst: ListCommentsResponse = {
			...first,
			items: [item, ...first.items],
		};

		return {
			...old,
			pages: [nextFirst, ...old.pages.slice(1)],
		};
	});
}

export function activateCommentItem(queryClient: QueryClient, postId: string, commentId: string): void {
	queryClient.setQueryData<CommentsInfiniteData>(commentsQueryKey(postId), (old) => {
		if (!old) return old;

		return {
			...old,
			pages: old.pages.map((page) => ({
				...page,
				items: page.items.map((item) =>
					item.id === commentId ? { ...item, status: 'ACTIVE' as const } : item,
				),
			})),
		};
	});
}

export function removeCommentItem(queryClient: QueryClient, postId: string, commentId: string): void {
	queryClient.setQueryData<CommentsInfiniteData>(commentsQueryKey(postId), (old) => {
		if (!old) return old;

		return {
			...old,
			pages: old.pages.map((page) => ({
				...page,
				items: page.items.filter((item) => item.id !== commentId),
			})),
		};
	});
}
