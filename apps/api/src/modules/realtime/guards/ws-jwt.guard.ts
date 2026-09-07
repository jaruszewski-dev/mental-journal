import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import type { Socket } from 'socket.io';

import type { AuthenticatedSocketData } from '../types/authenticated-socket-data.type';

type AuthedSocket = Socket & { data: AuthenticatedSocketData };

@Injectable()
export class WsJwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient<AuthedSocket>();

    if (!client.data?.user?.userId) {
      throw new WsException('Unauthorized');
    }

    return true;
  }
}
