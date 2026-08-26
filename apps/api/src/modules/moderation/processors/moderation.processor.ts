import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bullmq';

import {
  CommentStatus,
  PostStatus,
  UserStatus,
} from '../../../generated/prisma/enums';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  MODERATION_QUEUE,
  ModerateCommentJobData,
  ModeratePostJobData,
  ModerationJobName,
} from '../../queue/consts/queue.const';
import {
  TRUST_SCORE_ALLOW_DELTA,
  TRUST_SCORE_BLOCK_DELTA,
  TRUST_SCORE_SHADOWBAN_THRESHOLD,
  computeShadowBannedUntil,
} from '../consts/trust-score.const';
import {
  MODERATE_CONTENT_PORT,
  ModerateContentPort,
} from '../ports/moderate-content.port';

type ModerationJobData = ModeratePostJobData | ModerateCommentJobData;

@Processor(MODERATION_QUEUE)
export class ModerationProcessor extends WorkerHost {
  private readonly logger = new Logger(ModerationProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(MODERATE_CONTENT_PORT)
    private readonly moderateContentPort: ModerateContentPort,
  ) {
    super();
  }

  async process(job: Job<ModerationJobData>): Promise<void> {
    switch (job.name) {
      case ModerationJobName.MODERATE_POST:
        await this.moderatePost(job.data as ModeratePostJobData);
        return;
      case ModerationJobName.MODERATE_COMMENT:
        await this.moderateComment(job.data as ModerateCommentJobData);
        return;
      default:
        this.logger.warn(`Unknown moderation job: ${job.name}`);
    }
  }

  private async moderatePost(data: ModeratePostJobData): Promise<void> {
    const post = await this.prisma.post.findFirst({
      where: {
        id: data.postId,
        status: PostStatus.PENDING,
        deletedAt: null,
      },
      select: { id: true, content: true, authorId: true },
    });

    if (!post) {
      this.logger.warn(`Post ${data.postId} not found or not pending`);
      return;
    }

    const result = await this.moderateContentPort.execute({
      content: post.content,
      type: 'journal_entry',
    });

    await this.prisma.post.update({
      where: { id: post.id },
      data: {
        status: result.allow ? PostStatus.ACTIVE : PostStatus.HIDDEN,
      },
    });

    await this.applyTrustScore(post.authorId, result.allow, result.reason);
  }

  private async moderateComment(data: ModerateCommentJobData): Promise<void> {
    const comment = await this.prisma.comment.findFirst({
      where: {
        id: data.commentId,
        status: CommentStatus.PENDING,
        deletedAt: null,
      },
      select: { id: true, content: true, authorId: true },
    });

    if (!comment) {
      this.logger.warn(`Comment ${data.commentId} not found or not pending`);
      return;
    }

    const result = await this.moderateContentPort.execute({
      content: comment.content,
      type: 'comment',
    });

    await this.prisma.comment.update({
      where: { id: comment.id },
      data: {
        status: result.allow ? CommentStatus.ACTIVE : CommentStatus.HIDDEN,
      },
    });

    await this.applyTrustScore(comment.authorId, result.allow, result.reason);
  }

  private async applyTrustScore(
    authorId: string,
    allowed: boolean,
    reason?: string,
  ): Promise<void> {
    const delta = allowed ? TRUST_SCORE_ALLOW_DELTA : TRUST_SCORE_BLOCK_DELTA;

    const user = await this.prisma.user.update({
      where: { id: authorId },
      data: { trustScore: { increment: delta } },
      select: { id: true, trustScore: true, status: true },
    });

    if (!allowed && user.status === UserStatus.SHADOWBANNED) {
      await this.prisma.$transaction([
        this.prisma.user.update({
          where: { id: authorId },
          data: {
            status: UserStatus.BANNED,
            bannedAt: new Date(),
            bannedReason: reason
              ? `shadowban_block:${reason}`
              : 'shadowban_block',
            shadowBannedUntil: null,
          },
        }),
        ...this.hidePendingContent(authorId),
      ]);

      this.logger.warn(
        `User ${authorId} permanently banned after shadowban block (trustScore=${user.trustScore})`,
      );
      return;
    }

    if (
      user.status === UserStatus.ACTIVE &&
      user.trustScore <= TRUST_SCORE_SHADOWBAN_THRESHOLD
    ) {
      await this.prisma.$transaction([
        this.prisma.user.update({
          where: { id: authorId },
          data: {
            status: UserStatus.SHADOWBANNED,
            bannedAt: new Date(),
            bannedReason: reason
              ? `trust_score:${reason}`
              : 'trust_score_threshold',
            shadowBannedUntil: computeShadowBannedUntil(),
          },
        }),
        ...this.hidePendingContent(authorId),
      ]);

      this.logger.warn(
        `User ${authorId} shadowbanned (trustScore=${user.trustScore})`,
      );
    }
  }

  private hidePendingContent(authorId: string) {
    return [
      this.prisma.post.updateMany({
        where: {
          authorId,
          status: PostStatus.PENDING,
          deletedAt: null,
        },
        data: { status: PostStatus.HIDDEN },
      }),
      this.prisma.comment.updateMany({
        where: {
          authorId,
          status: CommentStatus.PENDING,
          deletedAt: null,
        },
        data: { status: CommentStatus.HIDDEN },
      }),
    ] as const;
  }
}
