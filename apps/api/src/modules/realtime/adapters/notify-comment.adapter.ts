import { Injectable } from '@nestjs/common';

import {
  NotifyCommentInput,
  NotifyCommentPort,
} from '../../moderation/ports/notify-comment.port';
import { RealtimeGateway } from '../realtime.gateway';

@Injectable()
export class NotifyCommentAdapter implements NotifyCommentPort {
  constructor(private readonly realtimeGateway: RealtimeGateway) {}

  notifyActive(input: NotifyCommentInput): void {
    this.realtimeGateway.emitCommentActive(input);
  }

  notifyHidden(input: NotifyCommentInput): void {
    this.realtimeGateway.emitCommentHidden(input);
  }
}
