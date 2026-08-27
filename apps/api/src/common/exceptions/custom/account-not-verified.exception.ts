import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@repo/api-types';

import { ErrorPath } from '../../consts/error-path.const';
import { AppException } from '../app.exception';

export class AccountNotVerifiedException extends AppException {
  constructor(path: ErrorPath) {
    super(
      `${path}: account is not verified`,
      HttpStatus.FORBIDDEN,
      ErrorCode.AUTH_ACCOUNT_NOT_VERIFIED,
    );
  }
}
