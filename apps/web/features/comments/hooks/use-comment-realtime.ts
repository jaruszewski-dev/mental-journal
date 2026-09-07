'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

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
	}, [meUserId, postId, queryClient]);
}
