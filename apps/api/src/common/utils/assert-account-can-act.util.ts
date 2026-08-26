import { UserStatus } from '../../generated/prisma/enums';
import { ErrorPath } from '../consts/error-path.const';
import { AccountNotAllowedException } from '../exceptions/custom/account-not-allowed.exception';
import { AccountNotVerifiedException } from '../exceptions/custom/account-not-verified.exception';
import { UserNotFoundException } from '../exceptions/custom/user-not-found.exception';
import { AssertUser } from '../interfaces/assert-user';

const ALLOWED_STATUSES: ReadonlySet<UserStatus> = new Set([
  UserStatus.ACTIVE,
  UserStatus.SHADOWBANNED,
]);

export function assertAccountCanAct(
  user: AssertUser | null,
  errorPath: ErrorPath,
) {
  if (!user) throw new UserNotFoundException(errorPath);

  if (!ALLOWED_STATUSES.has(user.status))
    throw new AccountNotAllowedException(errorPath);

  if (!user.emailVerified) throw new AccountNotVerifiedException(errorPath);
}
