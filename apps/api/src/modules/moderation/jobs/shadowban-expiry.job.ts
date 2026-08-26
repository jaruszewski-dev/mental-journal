import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { UserStatus } from '../../../generated/prisma/enums';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ShadowbanExpiryJob {
  private readonly logger = new Logger(ShadowbanExpiryJob.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(process.env.SHADOWBAN_EXPIRY_CRON ?? '0 0 * * *', {
    timeZone: process.env.SHADOWBAN_TIME_ZONE,
  })
  async liftExpiredShadowbans(): Promise<void> {
    const result = await this.prisma.user.updateMany({
      where: {
        status: UserStatus.SHADOWBANNED,
        shadowBannedUntil: { lte: new Date() },
      },
      data: {
        status: UserStatus.ACTIVE,
        shadowBannedUntil: null,
        bannedAt: null,
        bannedReason: null,
      },
    });

    if (result.count > 0) {
      this.logger.log(`Lifted ${result.count} expired shadowban(s)`);
    }
  }
}
