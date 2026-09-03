import axios from "axios";
import type { ErrorResponse } from "@repo/api-types";
import { ErrorCode } from "@repo/api-types";

export function getApiErrorBody(error: unknown): ErrorResponse | null {
  if (!axios.isAxiosError(error)) {
    return null;
  }

  const data = error.response?.data;
  if (!data || typeof data !== "object") {
    return null;
  }

  return data as ErrorResponse;
}

export function getApiErrorCode(error: unknown): string | null {
  return getApiErrorBody(error)?.code ?? null;
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  const message = getApiErrorBody(error)?.message;
  if (typeof message === "string" && message.length > 0) {
    return message;
  }

  return fallback;
}

type TranslateApiError = (key: string) => string;

const API_ERROR_MESSAGE_KEYS: Record<string, string> = {
  [ErrorCode.AUTH_INVALID_CREDENTIALS]: "AUTH_INVALID_CREDENTIALS",
  [ErrorCode.AUTH_ACCOUNT_NOT_VERIFIED]: "AUTH_ACCOUNT_NOT_VERIFIED",
  [ErrorCode.AUTH_VERIFICATION_TOKEN_NOT_FOUND]:
    "AUTH_VERIFICATION_TOKEN_NOT_FOUND",
  [ErrorCode.AUTH_VERIFICATION_TOKEN_EXPIRED]:
    "AUTH_VERIFICATION_TOKEN_EXPIRED",
  [ErrorCode.USER_ALREADY_EXISTS]: "USER_ALREADY_EXISTS",
};

export function resolveApiErrorMessage(
  error: unknown,
  t: TranslateApiError,
  fallbackKey = "generic",
): string {
  const code = getApiErrorCode(error);
  if (code && API_ERROR_MESSAGE_KEYS[code]) {
    return t(API_ERROR_MESSAGE_KEYS[code]!);
  }

  return t(fallbackKey);
}
