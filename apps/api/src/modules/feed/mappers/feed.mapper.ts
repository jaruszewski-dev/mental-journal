import { ALL_JOURNAL_TAGS, type JournalTag } from '@repo/api-types';

import type { Post, User } from '../../../generated/prisma/client';
import { PostStatus } from '../../../generated/prisma/enums';
import { FeedItemDto } from '../dtos/list-feed-response.dto';

type PostWithAuthor = Post & {
  author: Pick<User, 'anonName' | 'avatarUrl'>;
};

export class FeedMapper {
  static toFeedItemDto(post: PostWithAuthor, viewerId: string): FeedItemDto {
    return {
      id: post.id,
      content: post.content,
      mood: post.mood ?? undefined,
      tags: post.tags.filter((t): t is JournalTag =>
        (ALL_JOURNAL_TAGS as readonly string[]).includes(t),
      ),
      status:
        post.status === PostStatus.PENDING
          ? PostStatus.PENDING
          : PostStatus.ACTIVE,
      anonName: post.author.anonName,
      avatarUrl: post.author.avatarUrl,
      isMine: post.authorId === viewerId,
      journalEntryId: post.journalEntryId,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }
}
