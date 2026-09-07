import type { AuthUser } from '../../../common/decorators/current-user.decorator';

export type AuthenticatedSocketData = {
  user: AuthUser;
};
