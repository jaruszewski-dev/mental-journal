"use client";

import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { updateAccount } from "@/features/account/api/update-account";
import { resolveApiErrorMessage } from "@/lib/api-error";
import { useAuthMeStore } from "@/store/auth-me.store";

export function useUpdateAccountMutation() {
  const t = useTranslations("account");
  const tApi = useTranslations("apiErrors");
  const me = useAuthMeStore((s) => s.me);

  return useMutation({
    mutationFn: updateAccount,
    onSuccess: (data) => {
      if (me) {
        useAuthMeStore.setState({
          me: { ...me, anonName: data.anonName },
        });
      }
      toast.success(t("success"), { position: "bottom-center" });
    },
    onError: (error) => {
      toast.error(resolveApiErrorMessage(error, tApi), {
        position: "bottom-center",
      });
    },
  });
}
