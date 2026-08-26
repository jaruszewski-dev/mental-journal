import { Injectable } from '@nestjs/common';

import {
  CommentStatus,
  EntryStatus,
  EntryVisibility,
} from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import { COMMENTS_LIST_TAKE } from './consts/comment.const';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CreateCommentResponseDto } from './dtos/create-comment-response.dto';
import { DeleteCommentResponseDto } from './dtos/delete-comment-response.dto';
import { ListCommentsQueryDto } from './dtos/list-comments-query.dto';
import { ListCommentsResponseDto } from './dtos/list-comments-response.dto';
import { CommentNotFoundException } from './exceptions/comment-not-found.exception';
import { EntryNotCommentableException } from './exceptions/entry-not-commentable.exception';
import { CommentMapper } from './mappers/comment.mapper';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    dto: CreateCommentDto,
    authorId: string,
  ): Promise<CreateCommentResponseDto> {
    await this.assertEntryIsCommentable(dto.entryId);

    const { id } = await this.prisma.comment.create({
      data: {
        entryId: dto.entryId,
        authorId,
        content: dto.content,
      },
      select: { id: true },
    });

    return { id };
  }

  async findAll(dto: ListCommentsQueryDto): Promise<ListCommentsResponseDto> {
    await this.assertEntryIsCommentable(dto.entryId);

    const { entryId, lastCursorId, lastCreatedAt } = dto;

    const comments = await this.prisma.comment.findMany({
      where: {
        entryId,
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
        status: CommentStatus.ACTIVE,
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

  private async assertEntryIsCommentable(entryId: string): Promise<void> {
    const entry = await this.prisma.journalEntry.findFirst({
      where: {
        id: entryId,
        visibility: EntryVisibility.PUBLIC,
        status: EntryStatus.ACTIVE,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (!entry) throw new EntryNotCommentableException();
  }
}
