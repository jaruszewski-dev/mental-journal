"use client";

import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { loginUser } from "@/features/auth/login/api/login";
import { useRouter } from "@/i18n/navigation";
import { resolveApiErrorMessage } from "@/lib/api-error";

export function useLoginMutation() {
  const router = useRouter();
  const t = useTranslations("apiErrors");

  return useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      router.replace("/");
    },
    onError: (error) => {
      toast.error(resolveApiErrorMessage(error, t));
    },
  });
}
