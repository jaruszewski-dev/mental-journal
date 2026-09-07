'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
	type FeedNewPostPayload,
	type FeedPostHiddenPayload,
	RealtimeEvent,
} from '@/features/realtime/consts/realtime-events.const';
import {
	connectRealtimeSocket,
	getRealtimeSocket,
} from '@/features/realtime/lib/realtime-socket';
import { useAuthMeStore } from '@/store/auth-me.store';

import { feedQueryKey } from '../consts/feed-query-key';
import { activateFeedItem, removeFeedItem } from '../utils/feed-cache';

export function FeedNewPostsButton() {
	const t = useTranslations('feed');
	const queryClient = useQueryClient();
	const meUserId = useAuthMeStore((s) => s.me?.userId);
	const [hasNewPosts, setHasNewPosts] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);

	useEffect(() => {
		let cancelled = false;

		const onNewPost = (payload: FeedNewPostPayload) => {
			if (payload.authorId === meUserId) {
				activateFeedItem(queryClient, payload.postId);
				return;
			}
			setHasNewPosts(true);
		};

		const onPostHidden = (payload: FeedPostHiddenPayload) => {
			if (payload.authorId === meUserId) {
				removeFeedItem(queryClient, payload.postId);
			}
		};

		void connectRealtimeSocket()
			.then((socket) => {
				if (cancelled) return;
				socket.on(RealtimeEvent.FEED_NEW_POST, onNewPost);
				socket.on(RealtimeEvent.FEED_POST_HIDDEN, onPostHidden);
			})
			.catch(() => undefined);

		return () => {
			cancelled = true;
			const socket = getRealtimeSocket();
			socket?.off(RealtimeEvent.FEED_NEW_POST, onNewPost);
			socket?.off(RealtimeEvent.FEED_POST_HIDDEN, onPostHidden);
		};
	}, [meUserId, queryClient]);

	const handleClick = useCallback(async () => {
		setIsRefreshing(true);
		try {
			await queryClient.refetchQueries({ queryKey: feedQueryKey });
			setHasNewPosts(false);
			window.scrollTo({ top: 0, behavior: 'smooth' });
		} finally {
			setIsRefreshing(false);
		}
	}, [queryClient]);

	if (!hasNewPosts) {
		return null;
	}

	return (
		<div className="pointer-events-none fixed inset-x-0 top-3 z-30 flex justify-center px-4 md:left-56 lg:left-64">
			<Button
				type="button"
				size="sm"
				className="pointer-events-auto cursor-pointer rounded-full shadow-md"
				disabled={isRefreshing}
				onClick={() => void handleClick()}
			>
				{t('newPosts')}
			</Button>
		</div>
	);
}
