'use client';

import { type ReactNode, useEffect } from 'react';

import {
	connectRealtimeSocket,
	disconnectRealtimeSocket,
} from '@/features/realtime/lib/realtime-socket';
import { useAuthMeStore } from '@/store/auth-me.store';

type RealtimeProviderProps = {
	children: ReactNode;
};

export function RealtimeProvider({ children }: RealtimeProviderProps) {
	const status = useAuthMeStore((s) => s.status);

	useEffect(() => {
		if (status !== 'authenticated') {
			disconnectRealtimeSocket();
			return;
		}

		let cancelled = false;

		void connectRealtimeSocket().catch(() => {
			if (!cancelled) {
				disconnectRealtimeSocket();
			}
		});

		return () => {
			cancelled = true;
			disconnectRealtimeSocket();
		};
	}, [status]);

	return <>{children}</>;
}
