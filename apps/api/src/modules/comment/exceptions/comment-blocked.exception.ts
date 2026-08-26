import { HttpStatus } from '@nestjs/common';

import { ErrorPath } from '../../../common/consts/error-path.const';
import { AppException } from '../../../common/exceptions/app.exception';

export class CommentBlockedException extends AppException {
  constructor(reason?: string) {
    super(
      reason
        ? `${ErrorPath.COMMENT}: comment blocked (${reason})`
        : `${ErrorPath.COMMENT}: comment blocked by moderation`,
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
