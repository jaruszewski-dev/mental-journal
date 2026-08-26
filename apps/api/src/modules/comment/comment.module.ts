import { Module } from '@nestjs/common';

import { AccountCanActGuard } from '../../common/guards/account-can-act.guard';
import { UserModule } from '../user/user.module';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  imports: [UserModule],
  controllers: [CommentController],
  providers: [CommentService, AccountCanActGuard],
})
export class CommentModule {}
