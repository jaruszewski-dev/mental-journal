import { HttpStatus } from '@nestjs/common';
import type { ErrorResponse, FieldError } from '@repo/api-types';

export function buildErrorResponse(
  status: number,
  message: string,
  path: string,
  fieldErrors: FieldError[] | null,
  error?: string,
  code?: string | null,
): ErrorResponse {
  return {
    status,
    error: error ?? String(HttpStatus[status] ?? 'Error'),
    message,
    path,
    timestamp: new Date().toISOString(),
    fieldErrors,
    code: code ?? null,
  };
}

export function parseHttpException(response: string | object): {
  message: string;
  fieldErrors: FieldError[] | null;
  code: string | null;
} {
  if (typeof response === 'string') {
    return { message: response, fieldErrors: null, code: null };
  }

  const res = response as Record<string, unknown>;
  const code = typeof res.code === 'string' ? res.code : null;

  if (Array.isArray(res.fieldErrors)) {
    return {
      message: String(res.message ?? 'Validation failed'),
      fieldErrors: res.fieldErrors as FieldError[],
      code,
    };
  }

  const rawMessage = res.message;

  if (Array.isArray(rawMessage)) {
    return {
      message: 'Validation failed',
      fieldErrors: rawMessage.map((msg) => ({
        field: 'unknown',
        message: String(msg),
      })),
      code,
    };
  }

  return {
    message: String(rawMessage ?? res.error ?? 'Error'),
    fieldErrors: null,
    code,
  };
}
