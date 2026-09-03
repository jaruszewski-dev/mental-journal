import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

import { PostStatus } from '../../../generated/prisma/enums';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  ModeratePostJobData,
  MODERATION_QUEUE,
  ModerationJobName,
} from '../../queue/consts/queue.const';
import {
  PublishEntryInput,
  PublishEntryPort,
} from '../../journal/ports/publish-entry.port';

@Injectable()
export class PublishEntryAdapter implements PublishEntryPort {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(MODERATION_QUEUE)
    private readonly moderationQueue: Queue<ModeratePostJobData>,
  ) {}

  async execute(input: PublishEntryInput): Promise<{ id: string }> {
    const { authorId, journalEntryId, content, mood, tags } = input;

    const post = await this.prisma.post.create({
      data: {
        authorId,
        journalEntryId,
        content,
        mood,
        tags,
        status: PostStatus.PENDING,
      },
      select: { id: true },
    });

    await this.moderationQueue.add(ModerationJobName.MODERATE_POST, {
      postId: post.id,
      authorId,
    });

    return { id: post.id };
  }
}
