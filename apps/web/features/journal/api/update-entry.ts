import { apiClient } from '@/lib/api-client';

export type UpdateEntryPayload = {
	content?: string;
	mood?: number;
	tags?: string[];
};

export type UpdateEntryResponse = {
	id: string;
};

export async function updateEntry(entryId: string, payload: UpdateEntryPayload): Promise<UpdateEntryResponse> {
	const { data } = await apiClient.patch<UpdateEntryResponse>(`/journal/${entryId}`, payload);
	return data;
}
