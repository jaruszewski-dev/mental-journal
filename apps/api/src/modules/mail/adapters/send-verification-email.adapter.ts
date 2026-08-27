import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

import {
  SendVerificationEmailInput,
  SendVerificationEmailPort,
} from '../../auth/ports/send-verification-email.port';
import {
  MAIL_QUEUE,
  MailJobName,
  SendVerificationEmailJobData,
} from '../../queue/consts/queue.const';

@Injectable()
export class SendVerificationEmailAdapter implements SendVerificationEmailPort {
  constructor(
    @InjectQueue(MAIL_QUEUE)
    private readonly mailQueue: Queue<SendVerificationEmailJobData>,
  ) {}

  async execute({
    to,
    verificationLink,
    locale,
  }: SendVerificationEmailInput): Promise<void> {
    await this.mailQueue.add(MailJobName.SEND_VERIFICATION_EMAIL, {
      to,
      verificationLink,
      locale,
    });
  }
}
