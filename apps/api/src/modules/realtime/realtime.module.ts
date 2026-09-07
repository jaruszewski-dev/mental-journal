import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { JwtSignOptions } from '@nestjs/jwt';
import { JwtModule } from '@nestjs/jwt';

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
  providers: [RealtimeGateway, WsJwtGuard],
  exports: [RealtimeGateway, WsJwtGuard],
})
export class RealtimeModule {}
