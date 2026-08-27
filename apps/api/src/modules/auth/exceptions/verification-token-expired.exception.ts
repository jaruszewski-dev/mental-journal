import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@repo/api-types';

import { ErrorPath } from '../../../common/consts/error-path.const';
import { AppException } from '../../../common/exceptions/app.exception';

export class VerificationTokenExpiredException extends AppException {
  constructor() {
    super(
      `${ErrorPath.AUTH}: verification token expired`,
      HttpStatus.BAD_REQUEST,
      ErrorCode.AUTH_VERIFICATION_TOKEN_EXPIRED,
    );
  }
}
