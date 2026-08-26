import { getQueueToken } from '@nestjs/bullmq';
import { Test, TestingModule } from '@nestjs/testing';

import { ShadowbannedFromPublicException } from '../../common/exceptions/custom/shadowbanned-from-public.exception';
import {
  CommentStatus,
  PostStatus,
  UserStatus,
} from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import {
  MODERATION_QUEUE,
  ModerationJobName,
} from '../queue/consts/queue.const';
import { CommentService } from './comment.service';
import { COMMENTS_LIST_TAKE } from './consts/comment.const';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { ListCommentsQueryDto } from './dtos/list-comments-query.dto';
import { CommentNotFoundException } from './exceptions/comment-not-found.exception';
import { PostNotCommentableException } from './exceptions/post-not-commentable.exception';

const AUTHOR_ID = 'user-1';
const POST_ID = 'post-1';
const COMMENT_ID = 'comment-1';

const makeCreateDto = (
  overrides: Partial<CreateCommentDto> = {},
): CreateCommentDto => ({
  postId: POST_ID,
  content: 'Supportive comment',
  ...overrides,
});

const makeComment = (
  overrides: Partial<{
    id: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    anonName: string;
  }> = {},
) => ({
  id: COMMENT_ID,
  content: 'Supportive comment',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  author: { anonName: overrides.anonName ?? 'Anon' },
  ...overrides,
});

describe('CommentService', () => {
  let commentService: CommentService;

  const prismaService = {
    user: {
      findUnique: jest.fn(),
    },
    post: {
      findFirst: jest.fn(),
    },
    comment: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  const moderationQueue = {
    add: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        { provide: PrismaService, useValue: prismaService },
        { provide: getQueueToken(MODERATION_QUEUE), useValue: moderationQueue },
      ],
    }).compile();

    commentService = module.get(CommentService);
  });

  describe('create', () => {
    it('should create comment and enqueue moderation', async () => {
      const dto = makeCreateDto();

      prismaService.user.findUnique.mockResolvedValue({
        status: UserStatus.ACTIVE,
      });
      prismaService.post.findFirst.mockResolvedValue({ id: POST_ID });
      prismaService.comment.create.mockResolvedValue({ id: COMMENT_ID });
      moderationQueue.add.mockResolvedValue(undefined);

      const result = await commentService.create(dto, AUTHOR_ID);

      expect(prismaService.comment.create).toHaveBeenCalledWith({
        data: {
          postId: POST_ID,
          authorId: AUTHOR_ID,
          content: dto.content,
          status: CommentStatus.PENDING,
        },
        select: { id: true },
      });
      expect(moderationQueue.add).toHaveBeenCalledWith(
        ModerationJobName.MODERATE_COMMENT,
        { commentId: COMMENT_ID, authorId: AUTHOR_ID },
      );
      expect(result).toEqual({ id: COMMENT_ID });
    });

    it('should throw when author is shadowbanned', async () => {
      prismaService.user.findUnique.mockResolvedValue({
        status: UserStatus.SHADOWBANNED,
      });

      await expect(
        commentService.create(makeCreateDto(), AUTHOR_ID),
      ).rejects.toThrow(ShadowbannedFromPublicException);

      expect(prismaService.comment.create).not.toHaveBeenCalled();
    });

    it('should throw when post is not commentable', async () => {
      prismaService.user.findUnique.mockResolvedValue({
        status: UserStatus.ACTIVE,
      });
      prismaService.post.findFirst.mockResolvedValue(null);

      await expect(
        commentService.create(makeCreateDto(), AUTHOR_ID),
      ).rejects.toThrow(PostNotCommentableException);

      expect(prismaService.comment.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return a page and hasMore when take+1 rows come back', async () => {
      const dto: ListCommentsQueryDto = { postId: POST_ID };
      const comments = Array.from({ length: COMMENTS_LIST_TAKE + 1 }, (_, i) =>
        makeComment({ id: `comment-${i}` }),
      );

      prismaService.post.findFirst.mockResolvedValue({ id: POST_ID });
      prismaService.comment.findMany.mockResolvedValue(comments);

      const result = await commentService.findAll(dto);

      expect(prismaService.post.findFirst).toHaveBeenCalledWith({
        where: {
          id: POST_ID,
          status: PostStatus.ACTIVE,
          deletedAt: null,
        },
        select: { id: true },
      });
      expect(result.items).toHaveLength(COMMENTS_LIST_TAKE);
      expect(result.meta.hasMore).toBe(true);
      expect(result.meta.nextCursor).toEqual({
        id: comments[COMMENTS_LIST_TAKE - 1].id,
        createdAt: comments[COMMENTS_LIST_TAKE - 1].createdAt,
      });
    });

    it('should throw when post is not commentable', async () => {
      prismaService.post.findFirst.mockResolvedValue(null);

      await expect(commentService.findAll({ postId: POST_ID })).rejects.toThrow(
        PostNotCommentableException,
      );
    });
  });

  describe('delete', () => {
    it('should soft-delete own comment', async () => {
      prismaService.comment.findFirst.mockResolvedValue({ id: COMMENT_ID });
      prismaService.comment.update.mockResolvedValue({ id: COMMENT_ID });

      const result = await commentService.delete(COMMENT_ID, AUTHOR_ID);

      expect(prismaService.comment.update).toHaveBeenCalledWith({
        where: { id: COMMENT_ID },
        data: { deletedAt: expect.any(Date) },
        select: { id: true },
      });
      expect(result).toEqual({ id: COMMENT_ID });
    });

    it('should throw when comment not found', async () => {
      prismaService.comment.findFirst.mockResolvedValue(null);

      await expect(
        commentService.delete(COMMENT_ID, AUTHOR_ID),
      ).rejects.toThrow(CommentNotFoundException);
    });
  });
});
