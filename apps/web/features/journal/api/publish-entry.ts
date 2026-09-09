import { apiClient } from '@/lib/api-client';

import type { FeedItem } from '@/features/feed/api/get-feed';

export type PublishEntryResponse = {
	id: string;
	post?: FeedItem;
};

export async function publishEntry(entryId: string): Promise<PublishEntryResponse> {
	const { data } = await apiClient.post<PublishEntryResponse>(
		`/journal/${entryId}/publish`,
	);
	return data;
}
