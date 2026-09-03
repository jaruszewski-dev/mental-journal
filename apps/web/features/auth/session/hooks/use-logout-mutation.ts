"use client";

import { useMutation } from "@tanstack/react-query";

import { logoutUser } from "@/features/auth/session/api/logout";
import { useRouter } from "@/i18n/navigation";
import { useAuthMeStore } from "@/store/auth-me.store";

export function useLogoutMutation() {
  const router = useRouter();
  const clearMe = useAuthMeStore((s) => s.clearMe);

  return useMutation({
    mutationFn: logoutUser,
    onSettled: () => {
      clearMe();
      router.replace("/login");
    },
  });
}
