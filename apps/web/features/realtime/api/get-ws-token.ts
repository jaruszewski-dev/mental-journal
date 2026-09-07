import { apiClient } from '@/lib/api-client';

export type WsTokenResult = {
	token: string;
};

export async function getWsToken(): Promise<WsTokenResult> {
	const { data } = await apiClient.get<WsTokenResult>('/auth/ws-token');
	return data;
}
