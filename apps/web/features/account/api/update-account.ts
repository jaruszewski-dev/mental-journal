import { apiClient } from "@/lib/api-client";

export type UpdateAccountInput = {
  anonName?: string;
  currentPassword?: string;
  newPassword?: string;
};

export type UpdateAccountResult = {
  id: string;
  anonName: string;
  avatarUrl: string | null;
};

export async function updateAccount(
  input: UpdateAccountInput,
): Promise<UpdateAccountResult> {
  const { data } = await apiClient.patch<UpdateAccountResult>("/users/me", input);
  return data;
}
