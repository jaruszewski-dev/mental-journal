import { ALL_JOURNAL_TAGS, type JournalTag } from '@repo/api-types';
import type { Post, User } from '../../../generated/prisma/client';
import { FeedItemDto } from '../dtos/list-feed-response.dto';

type PostWithAuthor = Post & { author: Pick<User, 'anonName'> };

export class FeedMapper {
  static toFeedItemDto(post: PostWithAuthor): FeedItemDto {
    return {
      id: post.id,
      content: post.content,
      mood: post.mood ?? undefined,
      tags: post.tags.filter((t): t is JournalTag =>
        (ALL_JOURNAL_TAGS as readonly string[]).includes(t),
      ),
      anonName: post.author.anonName,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }
}
