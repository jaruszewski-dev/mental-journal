import { apiClient } from "@/lib/api-client";

export type VerifyEmailResponse = {
  message: string;
};

export async function verifyEmail(
  token: string,
): Promise<VerifyEmailResponse> {
  const { data } = await apiClient.get<VerifyEmailResponse>(
    "/auth/verify-email",
    { params: { token } },
  );
  return data;
}
