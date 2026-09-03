import { HttpStatus } from '@nestjs/common';

import { ErrorPath } from '../../../common/consts/error-path.const';
import { AppException } from '../../../common/exceptions/app.exception';

export class InvalidAvatarException extends AppException {
  constructor(reason: string) {
    super(`${ErrorPath.STORAGE}: ${reason}`, HttpStatus.BAD_REQUEST);
  }
}
