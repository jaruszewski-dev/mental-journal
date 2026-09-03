import { apiClient } from "@/lib/api-client";

export type CreateEntryPayload = {
  content: string;
  mood?: number;
  tags?: string[];
  publish?: boolean;
};

type CreateEntryResponse = {
  id: string;
};

export async function createEntry(
  payload: CreateEntryPayload,
): Promise<CreateEntryResponse> {
  const { data } = await apiClient.post<CreateEntryResponse>(
    "/journal",
    payload,
  );
  return data;
}
