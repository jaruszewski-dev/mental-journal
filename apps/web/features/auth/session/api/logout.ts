import { apiClient } from "@/lib/api-client";

export type LogoutResponse = {
  message: string;
};

export async function logoutUser(): Promise<LogoutResponse> {
  const { data } = await apiClient.post<LogoutResponse>("/auth/logout");
  return data;
}
