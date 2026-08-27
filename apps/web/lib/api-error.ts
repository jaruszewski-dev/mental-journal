import axios from "axios";

type ApiErrorBody = {
  message?: string;
};

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!axios.isAxiosError(error)) {
    return fallback;
  }

  const data = error.response?.data as ApiErrorBody | undefined;
  if (typeof data?.message === "string" && data.message.length > 0) {
    return data.message;
  }

  return fallback;
}
