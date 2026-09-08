import { Injectable } from '@nestjs/common';

import { PostStatus } from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import { FEED_LIST_TAKE } from './consts/feed.const';
import { ListFeedQueryDto } from './dtos/list-feed-query.dto';
import { ListFeedResponseDto } from './dtos/list-feed-response.dto';
import { FeedMapper } from './mappers/feed.mapper';

@Injectable()
export class FeedService {
  constructor(private readonly prisma: PrismaService) {}

  async feed(
    viewerId: string,
    dto: ListFeedQueryDto,
  ): Promise<ListFeedResponseDto> {
    const { lastCreatedAt, lastCursorId, tags } = dto;

    const posts = await this.prisma.post.findMany({
      where: {
        deletedAt: null,
        OR: [
          { status: PostStatus.ACTIVE },
          { status: PostStatus.PENDING, authorId: viewerId },
        ],
        ...(tags?.length ? { tags: { hasSome: tags } } : {}),
        ...(lastCursorId && lastCreatedAt
          ? {
              AND: [
                {
                  OR: [
                    { createdAt: { lt: lastCreatedAt } },
                    { createdAt: lastCreatedAt, id: { lt: lastCursorId } },
                  ],
                },
              ],
            }
          : {}),
      },
      include: {
        author: {
          select: { anonName: true, avatarUrl: true },
        },
      },
      take: FEED_LIST_TAKE + 1,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    });

    const hasMore = posts.length > FEED_LIST_TAKE;
    const page = hasMore ? posts.slice(0, FEED_LIST_TAKE) : posts;
    const last = page[page.length - 1];

    return {
      items: page.map((post) => FeedMapper.toFeedItemDto(post, viewerId)),
      meta: {
        hasMore,
        nextCursor:
          !hasMore || !last ? null : { id: last.id, createdAt: last.createdAt },
      },
    };
  }
}
