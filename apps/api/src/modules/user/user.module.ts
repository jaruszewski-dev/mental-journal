import { Module, forwardRef } from '@nestjs/common';

import { AccountCanActGuard } from '../../common/guards/account-can-act.guard';
import { AuthModule } from '../auth/auth.module';
import { FIND_USER_BY_EMAIL_PORT } from '../auth/ports/find-user-by-email.port';
import { ISSUE_EMAIL_VERIFICATION_PORT } from '../auth/ports/issue-email-verification.port';
import { REGISTER_USER_PORT } from '../auth/ports/register-user.port';
import { VERIFY_EMAIL_PORT } from '../auth/ports/verify-email.port';
import { FindUserByEmailAdapter } from './adapters/find-user-by-email.adapter';
import { FindUserByIdAdapter } from './adapters/find-user-by-id.adapter';
import { IssueEmailVerificationAdapter } from './adapters/issue-email-verification.adapter';
import { RegisterUserAdapter } from './adapters/register-user.adapter';
import { VerifyEmailAdapter } from './adapters/verify-email.adapter';
import { FIND_USER_BY_ID_PORT } from './ports/find-user-by-id.port';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [forwardRef(() => AuthModule)],
  providers: [
    UserService,
    AccountCanActGuard,
    { provide: REGISTER_USER_PORT, useClass: RegisterUserAdapter },
    { provide: FIND_USER_BY_EMAIL_PORT, useClass: FindUserByEmailAdapter },
    { provide: VERIFY_EMAIL_PORT, useClass: VerifyEmailAdapter },
    {
      provide: ISSUE_EMAIL_VERIFICATION_PORT,
      useClass: IssueEmailVerificationAdapter,
    },
    { provide: FIND_USER_BY_ID_PORT, useClass: FindUserByIdAdapter },
  ],
  controllers: [UserController],
  exports: [
    REGISTER_USER_PORT,
    FIND_USER_BY_EMAIL_PORT,
    VERIFY_EMAIL_PORT,
    ISSUE_EMAIL_VERIFICATION_PORT,
    FIND_USER_BY_ID_PORT,
  ],
})
export class UserModule {}
