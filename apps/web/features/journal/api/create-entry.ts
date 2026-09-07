import { apiClient } from '@/lib/api-client';

import type { FeedItem } from '@/features/feed/api/get-feed';

export type CreateEntryPayload = {
	content: string;
	mood?: number;
	tags?: string[];
	publish?: boolean;
};

export type CreateEntryResponse = {
	id: string;
	post?: FeedItem;
};

export async function createEntry(payload: CreateEntryPayload): Promise<CreateEntryResponse> {
	const { data } = await apiClient.post<CreateEntryResponse>('/journal', payload);
	return data;
}
