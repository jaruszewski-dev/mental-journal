import { HttpStatus } from '@nestjs/common';

import { ErrorPath } from '../../../common/consts/error-path.const';
import { AppException } from '../../../common/exceptions/app.exception';

export class PostNotCommentableException extends AppException {
  constructor() {
    super(
      `${ErrorPath.COMMENT}: post not found or comments not allowed`,
      HttpStatus.NOT_FOUND,
    );
  }
}
