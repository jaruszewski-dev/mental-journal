import { HttpStatus } from '@nestjs/common';

import { ErrorPath } from '../../../common/consts/error-path.const';
import { AppException } from '../../../common/exceptions/app.exception';
import { AVATAR_MAX_BYTES } from '../consts/avatar.const';

export class AvatarTooLargeException extends AppException {
  constructor() {
    super(
      `${ErrorPath.STORAGE}: avatar must be at most ${AVATAR_MAX_BYTES} bytes`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
