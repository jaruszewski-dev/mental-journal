import { HttpStatus } from '@nestjs/common';

import { ErrorPath } from '../../../common/consts/error-path.const';
import { AppException } from '../../../common/exceptions/app.exception';

export class CurrentPasswordInvalidException extends AppException {
  constructor() {
    super(
      `${ErrorPath.AUTH}: current password is invalid`,
      HttpStatus.UNAUTHORIZED,
    );
  }
}
