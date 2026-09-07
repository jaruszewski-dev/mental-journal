import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Socket } from 'socket.io';

import type { AuthUser } from '../../../common/decorators/current-user.decorator';
import type { AuthenticatedSocketData } from '../types/authenticated-socket-data.type';

type AuthedSocket = Socket & { data: AuthenticatedSocketData };

export const CurrentSocketUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser => {
    const client = ctx.switchToWs().getClient<AuthedSocket>();
    return client.data.user;
  },
);
