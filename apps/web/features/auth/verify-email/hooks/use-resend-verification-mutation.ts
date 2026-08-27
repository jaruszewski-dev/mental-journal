"use client";

import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { resendVerification } from "@/features/auth/verify-email/api/resend-verification";
import { resolveApiErrorMessage } from "@/lib/api-error";

export function useResendVerificationMutation() {
  const t = useTranslations("auth.verifyEmail");
  const tApi = useTranslations("apiErrors");

  return useMutation({
    mutationFn: resendVerification,
    onSuccess: () => {
      toast.success(t("resendSuccess"));
    },
    onError: (error) => {
      toast.error(resolveApiErrorMessage(error, tApi));
    },
  });
}
