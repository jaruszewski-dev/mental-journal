import { Injectable } from '@nestjs/common';

import {
  NotifyFeedPostInput,
  NotifyFeedPostPort,
} from '../../moderation/ports/notify-feed-post.port';
import { RealtimeGateway } from '../realtime.gateway';

@Injectable()
export class NotifyFeedPostAdapter implements NotifyFeedPostPort {
  constructor(private readonly realtimeGateway: RealtimeGateway) {}

  notifyActive(input: NotifyFeedPostInput): void {
    this.realtimeGateway.emitFeedNewPost(input);
  }

  notifyHidden(input: NotifyFeedPostInput): void {
    this.realtimeGateway.emitFeedPostHidden(input);
  }
}
