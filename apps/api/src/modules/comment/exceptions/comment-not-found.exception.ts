import { HttpStatus } from '@nestjs/common';

import { ErrorPath } from '../../../common/consts/error-path.const';
import { AppException } from '../../../common/exceptions/app.exception';

export class CommentNotFoundException extends AppException {
  constructor() {
    super(`${ErrorPath.COMMENT}: comment not found`, HttpStatus.NOT_FOUND);
  }
}
