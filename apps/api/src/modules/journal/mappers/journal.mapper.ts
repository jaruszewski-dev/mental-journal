import type { JournalEntry, Post } from '../../../generated/prisma/client';
import { PostStatus } from '../../../generated/prisma/enums';
import { EntryItemDto } from '../dtos/list-entries-response.dto';

export type EntryWithPost = JournalEntry & {
  post: Pick<Post, 'id' | 'status' | 'deletedAt'> | null;
};

export type Entry = EntryWithPost;

export class JournalMapper {
  static toEntryItemDto(entry: EntryWithPost): EntryItemDto {
    const post = entry.post && entry.post.deletedAt == null ? entry.post : null;

    return {
      id: entry.id,
      content: entry.content,
      mood: entry.mood ?? undefined,
      tags: entry.tags,
      visibility: post ? 'public' : 'private',
      postStatus: post
        ? post.status === PostStatus.PENDING
          ? PostStatus.PENDING
          : post.status === PostStatus.HIDDEN
            ? PostStatus.HIDDEN
            : PostStatus.ACTIVE
        : undefined,
      postId: post?.id,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
    };
  }
}
