import type { ErrorCode } from "./error-codes";

export type FieldError = {
  field: string;
  message: string;
};

export type ErrorResponse = {
  status: number;
  error: string;
  message: string;
  path: string;
  timestamp: string;
  fieldErrors: FieldError[] | null;
  code: ErrorCode | string | null;
};
