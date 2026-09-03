import { Module } from '@nestjs/common';

import { AccountCanActGuard } from '../../common/guards/account-can-act.guard';
import { PUBLISH_ENTRY_PORT } from '../journal/ports/publish-entry.port';
import { UserModule } from '../user/user.module';
import { PublishEntryAdapter } from './adapters/publish-entry.adapter';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';

@Module({
  imports: [UserModule],
  controllers: [FeedController],
  providers: [
    FeedService,
    AccountCanActGuard,
    { provide: PUBLISH_ENTRY_PORT, useClass: PublishEntryAdapter },
  ],
  exports: [PUBLISH_ENTRY_PORT],
})
export class FeedModule {}
