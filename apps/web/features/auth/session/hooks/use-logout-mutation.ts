"use client";

import { useMutation } from "@tanstack/react-query";

import { logoutUser } from "@/features/auth/session/api/logout";
import { useRouter } from "@/i18n/navigation";

export function useLogoutMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: logoutUser,
    onSettled: () => {
      router.replace("/login");
    },
  });
}
