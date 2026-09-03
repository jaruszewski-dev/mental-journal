import { create } from "zustand";

import { apiClient } from "@/lib/api-client";

export type AuthMe = {
  userId: string;
  anonName?: string;
};

type AuthMeStatus = "idle" | "loading" | "authenticated" | "unauthenticated" | "error";

type AuthMeStoreState = {
  me: AuthMe | null;
  status: AuthMeStatus;
  error: unknown | null;
  fetchMe: () => Promise<void>;
  clearMe: () => void;
};

export const useAuthMeStore = create<AuthMeStoreState>((set) => ({
  me: null,
  status: "idle",
  error: null,

  async fetchMe() {
    set({ status: "loading", error: null });

    try {
      const { data } = await apiClient.get<AuthMe>("/auth/me");
      set({ me: data, status: "authenticated", error: null });
    } catch (error) {
      set({ me: null, status: "unauthenticated", error });
    }
  },

  clearMe() {
    set({ me: null, status: "unauthenticated", error: null });
  },
}));

