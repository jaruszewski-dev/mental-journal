"use client";

import { useMutation } from "@tanstack/react-query";
import { ErrorCode } from "@repo/api-types";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { loginUser } from "@/features/auth/login/api/login";
import { useRouter } from "@/i18n/navigation";
import { getApiErrorCode, resolveApiErrorMessage } from "@/lib/api-error";
import { useAuthMeStore } from "@/store/auth-me.store";

type UseLoginMutationOptions = {
  onUnverified?: () => void;
};

export function useLoginMutation(options?: UseLoginMutationOptions) {
  const router = useRouter();
  const t = useTranslations("apiErrors");
  const fetchMe = useAuthMeStore((s) => s.fetchMe);

  return useMutation({
    mutationFn: loginUser,
    onSuccess: async () => {
      await fetchMe();
      router.replace("/");
    },
    onError: (error) => {
      toast.error(resolveApiErrorMessage(error, t));

      if (getApiErrorCode(error) === ErrorCode.AUTH_ACCOUNT_NOT_VERIFIED) {
        options?.onUnverified?.();
      }
    },
  });
}
