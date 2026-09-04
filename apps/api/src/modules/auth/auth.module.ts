import { Module, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { JwtSignOptions } from '@nestjs/jwt';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AccountCanActGuard } from '../../common/guards/account-can-act.guard';
import { HashingService } from '../../common/services/hashing.service';
import { MailModule } from '../mail/mail.module';
import { SessionModule } from '../session/session.module';
import { UserModule } from '../user/user.module';
import { ResolvePasswordChangeAdapter } from './adapters/resolve-password-change.adapter';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RESOLVE_PASSWORD_CHANGE_PORT } from '../user/ports/resolve-password-change.port';
import { JwtStrategy } from './strategies/jwt.strategy';

const jwtModuleFactory = (config: ConfigService) => ({
  secret: config.getOrThrow<string>('JWT_ACCESS_SECRET'),
  signOptions: {
    expiresIn: config.get<string>('ACCESS_TOKEN_TTL', '15m'),
  } as JwtSignOptions,
});

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: jwtModuleFactory,
    }),
    MailModule,
    SessionModule,
  ],
  providers: [
    AuthService,
    HashingService,
    JwtStrategy,
    AccountCanActGuard,
    {
      provide: RESOLVE_PASSWORD_CHANGE_PORT,
      useClass: ResolvePasswordChangeAdapter,
    },
  ],
  controllers: [AuthController],
  exports: [RESOLVE_PASSWORD_CHANGE_PORT],
})
export class AuthModule {}
