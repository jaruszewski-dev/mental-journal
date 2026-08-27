"use client";

import { useMutation } from "@tanstack/react-query";

import { registerUser } from "@/features/auth/api/register";

export function useRegisterMutation() {
  return useMutation({
    mutationFn: registerUser,
  });
}
