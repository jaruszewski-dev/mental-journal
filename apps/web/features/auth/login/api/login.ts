import { apiClient } from "@/lib/api-client";

import type { LoginFormValues } from "../validations/login.schema";

export type LoginResponse = {
  id: string;
  anonName: string;
};

export async function loginUser(
  values: LoginFormValues,
): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>("/auth/login", values);
  return data;
}
