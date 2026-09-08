import { apiClient } from '@/lib/api-client';

export type DeleteEntryResponse = {
	id: string;
};

export async function deleteEntry(entryId: string): Promise<DeleteEntryResponse> {
	const { data } = await apiClient.delete<DeleteEntryResponse>(`/journal/${entryId}`);
	return data;
}
