import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import type { AuthUser } from '../../common/decorators/current-user.decorator';
import type { AuthenticatedSocketData } from './types/authenticated-socket-data.type';
import { extractAccessTokenFromSocket } from './utils/extract-access-token-from-socket.util';

type JwtPayload = {
  sub: string;
  anonName?: string;
};

type AuthedSocket = Socket & { data: AuthenticatedSocketData };

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  },
})
export class RealtimeGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(RealtimeGateway.name);

  @WebSocketServer()
  server!: Server;

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket): Promise<void> {
    try {
      const token = extractAccessTokenFromSocket(client);
      if (!token) {
        throw new Error('Missing access token');
      }

      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      if (!payload.sub) {
        throw new Error('Invalid token payload');
      }

      const user: AuthUser = {
        userId: payload.sub,
        anonName: payload.anonName,
      };

      (client as AuthedSocket).data.user = user;
      this.logger.debug(`connected ${client.id} userId=${user.userId}`);
    } catch (error) {
      this.logger.debug(
        `unauthorized socket ${client.id}: ${
          error instanceof Error ? error.message : 'unknown'
        }`,
      );
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket): void {
    const userId = (client as AuthedSocket).data?.user?.userId ?? 'unknown';
    this.logger.debug(`disconnected ${client.id} userId=${userId}`);
  }
}
