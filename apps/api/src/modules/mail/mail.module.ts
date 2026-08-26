import { Module } from '@nestjs/common';

import { SEND_VERIFICATION_EMAIL_PORT } from '../auth/ports/send-verification-email.port';
import { SendVerificationEmailAdapter } from './adapters/send-verification-email.adapter';
import { MailService } from './mail.service';
import { MailProcessor } from './processors/mail.processor';

@Module({
  providers: [
    MailService,
    MailProcessor,
    {
      provide: SEND_VERIFICATION_EMAIL_PORT,
      useClass: SendVerificationEmailAdapter,
    },
  ],
  exports: [SEND_VERIFICATION_EMAIL_PORT],
})
export class MailModule {}
