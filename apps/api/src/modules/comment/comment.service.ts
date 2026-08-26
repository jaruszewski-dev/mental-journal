import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

import { ErrorPath } from '../../common/consts/error-path.const';
import { assertCanActPublicly } from '../../common/utils/assert-can-act-publicly.util';
import {
  CommentStatus,
  PostStatus,
  UserStatus,
} from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import {
  ModerateCommentJobData,
  ModeratePostJobData,
  MODERATION_QUEUE,
  ModerationJobName,
} from '../queue/consts/queue.const';
import { COMMENTS_LIST_TAKE } from './consts/comment.const';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CreateCommentResponseDto } from './dtos/create-comment-response.dto';
import { DeleteCommentResponseDto } from './dtos/delete-comment-response.dto';
import { ListCommentsQueryDto } from './dtos/list-comments-query.dto';
import { ListCommentsResponseDto } from './dtos/list-comments-response.dto';
import { CommentNotFoundException } from './exceptions/comment-not-found.exception';
import { PostNotCommentableException } from './exceptions/post-not-commentable.exception';
import { CommentMapper } from './mappers/comment.mapper';

@Injectable()
export class CommentService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(MODERATION_QUEUE)
    private readonly moderationQueue: Queue<
      ModeratePostJobData | ModerateCommentJobData
    >,
  ) {}

  async create(
    dto: CreateCommentDto,
    authorId: string,
  ): Promise<CreateCommentResponseDto> {
    await this.assertAuthorCanComment(authorId);
    await this.assertPostIsCommentable(dto.postId);

    const { id } = await this.prisma.comment.create({
      data: {
        postId: dto.postId,
        authorId,
        content: dto.content,
        status: CommentStatus.PENDING,
      },
      select: { id: true },
    });

    await this.moderationQueue.add(ModerationJobName.MODERATE_COMMENT, {
      commentId: id,
      authorId,
    });

    return { id };
  }

  async findAll(dto: ListCommentsQueryDto): Promise<ListCommentsResponseDto> {
    await this.assertPostIsCommentable(dto.postId);

    const { postId, lastCursorId, lastCreatedAt } = dto;

    const comments = await this.prisma.comment.findMany({
      where: {
        postId,
        status: CommentStatus.ACTIVE,
        deletedAt: null,
        ...(lastCursorId && lastCreatedAt
          ? {
              OR: [
                { createdAt: { lt: lastCreatedAt } },
                { createdAt: lastCreatedAt, id: { lt: lastCursorId } },
              ],
            }
          : {}),
      },
      include: {
        author: {
          select: { anonName: true },
        },
      },
      take: COMMENTS_LIST_TAKE + 1,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    });

    const hasMore = comments.length > COMMENTS_LIST_TAKE;
    const page = hasMore ? comments.slice(0, COMMENTS_LIST_TAKE) : comments;
    const last = page[page.length - 1];

    return {
      items: page.map(CommentMapper.toCommentItemDto),
      meta: {
        hasMore,
        nextCursor:
          !hasMore || !last ? null : { id: last.id, createdAt: last.createdAt },
      },
    };
  }

  async delete(
    commentId: string,
    authorId: string,
  ): Promise<DeleteCommentResponseDto> {
    const existing = await this.prisma.comment.findFirst({
      where: {
        id: commentId,
        authorId,
        status: { in: [CommentStatus.ACTIVE, CommentStatus.PENDING] },
        deletedAt: null,
      },
    });

    if (!existing) throw new CommentNotFoundException();

    const { id } = await this.prisma.comment.update({
      where: { id: commentId },
      data: { deletedAt: new Date() },
      select: { id: true },
    });

    return { id };
  }

  private async assertAuthorCanComment(authorId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: authorId },
      select: { status: true },
    });

    assertCanActPublicly(user?.status ?? UserStatus.BANNED, ErrorPath.COMMENT);
  }

  private async assertPostIsCommentable(postId: string): Promise<void> {
    const post = await this.prisma.post.findFirst({
      where: {
        id: postId,
        status: PostStatus.ACTIVE,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (!post) throw new PostNotCommentableException();
  }
}
