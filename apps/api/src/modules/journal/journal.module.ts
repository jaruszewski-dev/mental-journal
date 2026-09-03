import { Module } from '@nestjs/common';

import { AccountCanActGuard } from '../../common/guards/account-can-act.guard';
import { FeedModule } from '../feed/feed.module';
import { UserModule } from '../user/user.module';
import { JournalController } from './journal.controller';
import { JournalService } from './journal.service';

@Module({
  imports: [UserModule, FeedModule],
  providers: [JournalService, AccountCanActGuard],
  controllers: [JournalController],
})
export class JournalModule {}
