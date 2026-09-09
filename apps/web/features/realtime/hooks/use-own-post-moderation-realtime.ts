'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { activateFeedItem, removeFeedItem } from '@/features/feed/utils/feed-cache';
import { activateJournalPost, hideJournalPost } from '@/features/journal/utils/journal-cache';
import {
	type FeedNewPostPayload,
	type FeedPostHiddenPayload,
	RealtimeEvent,
} from '@/features/realtime/consts/realtime-events.const';
import { connectRealtimeSocket, getRealtimeSocket } from '@/features/realtime/lib/realtime-socket';
import { useAuthMeStore } from '@/store/auth-me.store';

export function useOwnPostModerationRealtime() {
	const queryClient = useQueryClient();
	const meUserId = useAuthMeStore((s) => s.me?.userId);
	const t = useTranslations('journal');

	useEffect(() => {
		if (!meUserId) return;

		let cancelled = false;

		const onNewPost = (payload: FeedNewPostPayload) => {
			if (payload.authorId !== meUserId) return;
			activateFeedItem(queryClient, payload.postId);
			activateJournalPost(queryClient, payload.postId);
		};

		const onPostHidden = (payload: FeedPostHiddenPayload) => {
			if (payload.authorId !== meUserId) return;
			removeFeedItem(queryClient, payload.postId);
			hideJournalPost(queryClient, payload.postId);
			toast.error(t('postRejected'), { position: 'bottom-center' });
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
	}, [meUserId, queryClient, t]);
}
