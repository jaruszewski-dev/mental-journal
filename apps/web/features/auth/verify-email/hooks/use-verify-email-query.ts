"use client";

import { useQuery } from "@tanstack/react-query";

import { verifyEmail } from "@/features/auth/verify-email/api/verify-email";

export function useVerifyEmailQuery(token: string | undefined) {
  return useQuery({
    queryKey: ["auth", "verify-email", token],
    queryFn: () => verifyEmail(token!),
    enabled: Boolean(token),
    retry: false,
    staleTime: Infinity,
  });
}
