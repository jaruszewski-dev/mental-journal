import { UserStatus } from '../../generated/prisma/enums';
import { ErrorPath } from '../consts/error-path.const';
import { ShadowbannedFromPublicException } from '../exceptions/custom/shadowbanned-from-public.exception';

export function assertCanActPublicly(
  status: UserStatus,
  errorPath: ErrorPath,
): void {
  if (status === UserStatus.SHADOWBANNED) {
    throw new ShadowbannedFromPublicException(errorPath);
  }
}
