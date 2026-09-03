"use client";

import { useEffect, type ReactNode } from "react";

import { useAuthMeStore } from "@/store/auth-me.store";

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const fetchMe = useAuthMeStore((s) => s.fetchMe);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return <>{children}</>;
}
