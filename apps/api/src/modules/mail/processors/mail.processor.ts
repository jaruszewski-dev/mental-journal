import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

import {
  MAIL_QUEUE,
  MailJobName,
  SendVerificationEmailJobData,
} from '../../queue/consts/queue.const';
import { MailService } from '../mail.service';

@Processor(MAIL_QUEUE)
export class MailProcessor extends WorkerHost {
  private readonly logger = new Logger(MailProcessor.name);

  constructor(private readonly mailService: MailService) {
    super();
  }

  async process(job: Job<SendVerificationEmailJobData>): Promise<void> {
    switch (job.name) {
      case MailJobName.SEND_VERIFICATION_EMAIL:
        await this.mailService.sendVerificationEmail(job.data);
        return;
      default:
        this.logger.warn(`Unknown mail job: ${job.name}`);
    }
  }
}
