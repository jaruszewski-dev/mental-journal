import { io, type Socket } from 'socket.io-client';

import { getWsToken } from '@/features/realtime/api/get-ws-token';

function getWsUrl(): string {
	return process.env.NEXT_PUBLIC_WS_URL ?? 'http://localhost:3001';
}

let socket: Socket | null = null;
let connectPromise: Promise<Socket> | null = null;

export function getRealtimeSocket(): Socket | null {
	return socket;
}

export async function connectRealtimeSocket(): Promise<Socket> {
	if (socket?.connected) {
		return socket;
	}

	if (connectPromise) {
		return connectPromise;
	}

	connectPromise = (async () => {
		const { token } = await getWsToken();

		if (socket) {
			socket.auth = { token };
			socket.connect();
		} else {
			socket = io(getWsUrl(), {
				auth: { token },
				withCredentials: true,
				autoConnect: true,
				transports: ['websocket', 'polling'],
			});
		}

		await new Promise<void>((resolve, reject) => {
			if (!socket) {
				reject(new Error('Socket failed to initialize'));
				return;
			}

			if (socket.connected) {
				resolve();
				return;
			}

			const onConnect = () => {
				cleanup();
				resolve();
			};

			const onConnectError = (error: Error) => {
				cleanup();
				reject(error);
			};

			const cleanup = () => {
				socket?.off('connect', onConnect);
				socket?.off('connect_error', onConnectError);
			};

			socket.once('connect', onConnect);
			socket.once('connect_error', onConnectError);
		});

		return socket!;
	})();

	try {
		return await connectPromise;
	} finally {
		connectPromise = null;
	}
}

export function disconnectRealtimeSocket(): void {
	connectPromise = null;

	if (!socket) {
		return;
	}

	socket.removeAllListeners();
	socket.disconnect();
	socket = null;
}
