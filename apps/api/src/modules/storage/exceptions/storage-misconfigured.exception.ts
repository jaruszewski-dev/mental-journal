import { HttpStatus } from '@nestjs/common';

import { ErrorPath } from '../../../common/consts/error-path.const';
import { AppException } from '../../../common/exceptions/app.exception';

export class StorageMisconfiguredException extends AppException {
  constructor() {
    super(
      `${ErrorPath.STORAGE}: public URL is not configured`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
