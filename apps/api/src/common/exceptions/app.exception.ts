import { HttpException, HttpStatus } from '@nestjs/common';

export class AppException extends HttpException {
  readonly code: string | null;

  constructor(message: string, status: HttpStatus, code?: string) {
    super(
      {
        message,
        statusCode: status,
        ...(code ? { code } : {}),
      },
      status,
    );
    this.code = code ?? null;
    this.name = this.constructor.name;
  }
}
