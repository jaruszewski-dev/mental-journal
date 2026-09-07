'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { toast } from 'sonner';

import {
	type CommentActivePayload,
	type CommentHiddenPayload,
	RealtimeEvent,
} from '@/features/realtime/consts/realtime-events.const';
import {
	connectRealtimeSocket,
	getRealtimeSocket,
} from '@/features/realtime/lib/realtime-socket';
import { useAuthMeStore } from '@/store/auth-me.store';

import { activateCommentItem, removeCommentItem } from '../utils/comments-cache';

export function useCommentRealtime(postId: string): void {
	const t = useTranslations('comments');
	const queryClient = useQueryClient();
	const meUserId = useAuthMeStore((s) => s.me?.userId);

	useEffect(() => {
		let cancelled = false;

		const onActive = (payload: CommentActivePayload) => {
			if (payload.postId !== postId) return;
			if (payload.authorId !== meUserId) return;
			activateCommentItem(queryClient, postId, payload.commentId);
		};

		const onHidden = (payload: CommentHiddenPayload) => {
			if (payload.postId !== postId) return;
			if (payload.authorId !== meUserId) return;
			removeCommentItem(queryClient, postId, payload.commentId);
			toast.error(t('rejected'), { position: 'bottom-center' });
		};

		void connectRealtimeSocket()
			.then((socket) => {
				if (cancelled) return;
				socket.on(RealtimeEvent.COMMENT_ACTIVE, onActive);
				socket.on(RealtimeEvent.COMMENT_HIDDEN, onHidden);
			})
			.catch(() => undefined);

		return () => {
			cancelled = true;
			const socket = getRealtimeSocket();
			socket?.off(RealtimeEvent.COMMENT_ACTIVE, onActive);
			socket?.off(RealtimeEvent.COMMENT_HIDDEN, onHidden);
		};
	}, [meUserId, postId, queryClient, t]);
}
