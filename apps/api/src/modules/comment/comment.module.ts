import { Module } from '@nestjs/common';

import { AccountCanActGuard } from '../../common/guards/account-can-act.guard';
import { ModerationModule } from '../moderation/moderation.module';
import { UserModule } from '../user/user.module';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  imports: [UserModule, ModerationModule],
  controllers: [CommentController],
  providers: [CommentService, AccountCanActGuard],
})
export class CommentModule {}
