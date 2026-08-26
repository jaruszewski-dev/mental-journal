import { HttpStatus } from '@nestjs/common';

import { ErrorPath } from '../../consts/error-path.const';
import { AppException } from '../app.exception';

export class ShadowbannedFromPublicException extends AppException {
  constructor(path: ErrorPath) {
    super(
      `${path}: shadowbanned accounts cannot publish or comment`,
      HttpStatus.FORBIDDEN,
    );
  }
}
