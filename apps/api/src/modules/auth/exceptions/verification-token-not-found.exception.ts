import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@repo/api-types';

import { ErrorPath } from '../../../common/consts/error-path.const';
import { AppException } from '../../../common/exceptions/app.exception';

export class VerificationTokenNotFoundException extends AppException {
  constructor() {
    super(
      `${ErrorPath.AUTH}: verification token not found`,
      HttpStatus.NOT_FOUND,
      ErrorCode.AUTH_VERIFICATION_TOKEN_NOT_FOUND,
    );
  }
}
