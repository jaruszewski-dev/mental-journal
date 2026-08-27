import { apiClient } from "@/lib/api-client";
import type { AppLocale } from "@/i18n/routing";

import type { RegisterFormValues } from "../validations/register.schema";

export type RegisterPayload = RegisterFormValues & {
  locale: AppLocale;
};

export type RegisterResponse = {
  id: string;
  anonName: string;
};

export async function registerUser(
  payload: RegisterPayload,
): Promise<RegisterResponse> {
  const { data } = await apiClient.post<RegisterResponse>(
    "/auth/register",
    payload,
  );
  return data;
}
