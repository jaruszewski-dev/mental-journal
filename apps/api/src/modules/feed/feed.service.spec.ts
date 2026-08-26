import { Test, TestingModule } from '@nestjs/testing';

import { PostStatus } from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import { FEED_LIST_TAKE } from './consts/feed.const';
import { ListFeedQueryDto } from './dtos/list-feed-query.dto';
import { FeedService } from './feed.service';

const makePost = (
  overrides: Partial<{
    id: string;
    content: string;
    mood: number | null;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
    anonName: string;
  }> = {},
) => ({
  id: 'post-1',
  content: 'Public post',
  mood: 4,
  tags: ['therapy'],
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  author: { anonName: overrides.anonName ?? 'Anon' },
  ...overrides,
});

describe('FeedService', () => {
  let feedService: FeedService;

  const prismaService = {
    post: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedService,
        { provide: PrismaService, useValue: prismaService },
      ],
    }).compile();

    feedService = module.get(FeedService);
  });

  describe('feed', () => {
    it('should return a page and hasMore when take+1 rows come back', async () => {
      const dto: ListFeedQueryDto = {};
      const posts = Array.from({ length: FEED_LIST_TAKE + 1 }, (_, i) =>
        makePost({ id: `post-${i}` }),
      );

      prismaService.post.findMany.mockResolvedValue(posts);

      const result = await feedService.feed(dto);

      expect(prismaService.post.findMany).toHaveBeenCalledWith({
        where: {
          status: PostStatus.ACTIVE,
          deletedAt: null,
        },
        include: {
          author: {
            select: { anonName: true },
          },
        },
        take: FEED_LIST_TAKE + 1,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      });
      expect(result.items).toHaveLength(FEED_LIST_TAKE);
      expect(result.meta.hasMore).toBe(true);
      expect(result.meta.nextCursor).toEqual({
        id: posts[FEED_LIST_TAKE - 1].id,
        createdAt: posts[FEED_LIST_TAKE - 1].createdAt,
      });
    });

    it('should filter by tags when provided', async () => {
      prismaService.post.findMany.mockResolvedValue([makePost()]);

      await feedService.feed({ tags: ['therapy'] });

      expect(prismaService.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            tags: { hasSome: ['therapy'] },
          }),
        }),
      );
    });

    it('should apply cursor when provided', async () => {
      const lastCreatedAt = new Date('2026-01-02T00:00:00.000Z');
      const lastCursorId = 'post-cursor';

      prismaService.post.findMany.mockResolvedValue([]);

      const result = await feedService.feed({
        lastCreatedAt,
        lastCursorId,
      });

      expect(prismaService.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [
              { createdAt: { lt: lastCreatedAt } },
              { createdAt: lastCreatedAt, id: { lt: lastCursorId } },
            ],
          }),
        }),
      );
      expect(result).toEqual({
        items: [],
        meta: { hasMore: false, nextCursor: null },
      });
    });
  });
});
