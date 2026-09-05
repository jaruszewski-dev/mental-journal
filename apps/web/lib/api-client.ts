import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

import { routing, type AppLocale } from "@/i18n/routing";

type RetryConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export const apiClient = axios.create({
  baseURL: "/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    config.headers.set("Content-Type", undefined);
  }
  return config;
});

let refreshPromise: Promise<void> | null = null;

function getLoginPath(): string {
  if (typeof window === "undefined") {
    return "/login";
  }

  const maybeLocale = window.location.pathname.split("/")[1];
  if (
    maybeLocale &&
    (routing.locales as readonly string[]).includes(maybeLocale) &&
    maybeLocale !== routing.defaultLocale
  ) {
    return `/${maybeLocale as AppLocale}/login`;
  }

  return "/login";
}

function redirectToLogin(): void {
  if (typeof window === "undefined") {
    return;
  }

  const target = getLoginPath();
  if (window.location.pathname === target) {
    return;
  }

  window.location.assign(target);
}

function shouldSkipRefresh(url?: string): boolean {
  if (!url) {
    return false;
  }

  return [
    "/auth/login",
    "/auth/register",
    "/auth/refresh",
    "/auth/logout",
    "/auth/verify-email",
    "/auth/resend-verification",
  ].some((path) => url.includes(path));
}

function refreshSession(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = apiClient
      .post("/auth/refresh")
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      shouldSkipRefresh(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      await refreshSession();
      return apiClient(originalRequest);
    } catch {
      redirectToLogin();
      return Promise.reject(error);
    }
  },
);
