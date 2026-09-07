import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { JwtSignOptions } from '@nestjs/jwt';
import { JwtModule } from '@nestjs/jwt';

import { NOTIFY_FEED_POST_PORT } from '../moderation/ports/notify-feed-post.port';
import { NotifyFeedPostAdapter } from './adapters/notify-feed-post.adapter';
import { WsJwtGuard } from './guards/ws-jwt.guard';
import { RealtimeGateway } from './realtime.gateway';

const jwtModuleFactory = (config: ConfigService) => ({
  secret: config.getOrThrow<string>('JWT_ACCESS_SECRET'),
  signOptions: {
    expiresIn: config.get<string>('ACCESS_TOKEN_TTL', '15m'),
  } as JwtSignOptions,
});

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: jwtModuleFactory,
    }),
  ],
  providers: [
    RealtimeGateway,
    WsJwtGuard,
    NotifyFeedPostAdapter,
    {
      provide: NOTIFY_FEED_POST_PORT,
      useExisting: NotifyFeedPostAdapter,
    },
  ],
  exports: [RealtimeGateway, WsJwtGuard, NOTIFY_FEED_POST_PORT],
})
export class RealtimeModule {}
