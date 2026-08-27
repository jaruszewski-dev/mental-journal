import { apiClient } from "@/lib/api-client";

export type ResendVerificationPayload = {
  email: string;
};

export type ResendVerificationResponse = {
  message: string;
};

export async function resendVerification(
  payload: ResendVerificationPayload,
): Promise<ResendVerificationResponse> {
  const { data } = await apiClient.post<ResendVerificationResponse>(
    "/auth/resend-verification",
    payload,
  );
  return data;
}
