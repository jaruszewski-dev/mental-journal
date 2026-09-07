import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

import { PostStatus } from '../../../generated/prisma/enums';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  PublishEntryInput,
  PublishEntryPort,
  PublishEntryResult,
} from '../../journal/ports/publish-entry.port';
import {
  ModeratePostJobData,
  MODERATION_QUEUE,
  ModerationJobName,
} from '../../queue/consts/queue.const';

@Injectable()
export class PublishEntryAdapter implements PublishEntryPort {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(MODERATION_QUEUE)
    private readonly moderationQueue: Queue<ModeratePostJobData>,
  ) {}

  async execute(input: PublishEntryInput): Promise<PublishEntryResult> {
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
      select: {
        id: true,
        content: true,
        mood: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: { anonName: true, avatarUrl: true },
        },
      },
    });

    await this.moderationQueue.add(ModerationJobName.MODERATE_POST, {
      postId: post.id,
      authorId,
    });

    return {
      id: post.id,
      content: post.content,
      mood: post.mood,
      tags: post.tags,
      status: 'PENDING',
      anonName: post.author.anonName,
      avatarUrl: post.author.avatarUrl,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }
}
