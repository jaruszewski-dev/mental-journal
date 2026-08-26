import { HttpStatus } from '@nestjs/common';

import { ErrorPath } from '../../../common/consts/error-path.const';
import { AppException } from '../../../common/exceptions/app.exception';

export class ModerationFailedException extends AppException {
  constructor() {
    super(
      `${ErrorPath.MODERATION}: Failed to moderate content`,
      HttpStatus.BAD_GATEWAY,
    );
  }
}
