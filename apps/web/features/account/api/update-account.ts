import { apiClient } from "@/lib/api-client";

export type UpdateAccountInput = {
  anonName?: string;
  currentPassword?: string;
  newPassword?: string;
  avatar?: File;
};

export type UpdateAccountResult = {
  id: string;
  anonName: string;
  avatarUrl: string | null;
};

export async function updateAccount(
  input: UpdateAccountInput,
): Promise<UpdateAccountResult> {
  const formData = new FormData();

  if (input.anonName !== undefined) {
    formData.append("anonName", input.anonName);
  }

  if (input.currentPassword !== undefined) {
    formData.append("currentPassword", input.currentPassword);
  }

  if (input.newPassword !== undefined) {
    formData.append("newPassword", input.newPassword);
  }

  if (input.avatar !== undefined) {
    formData.append("avatar", input.avatar);
  }

  const { data } = await apiClient.patch<UpdateAccountResult>(
    "/users/me",
    formData,
  );

  return data;
}
