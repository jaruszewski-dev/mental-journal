import { apiClient } from "@/lib/api-client";

import type { RegisterFormValues } from "../validations/register.schema";

export type RegisterResponse = {
  id: string;
  anonName: string;
};

export async function registerUser(
  values: RegisterFormValues,
): Promise<RegisterResponse> {
  const { data } = await apiClient.post<RegisterResponse>(
    "/auth/register",
    values,
  );
  return data;
}
