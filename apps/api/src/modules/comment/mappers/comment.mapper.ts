import type { Comment, User } from '../../../generated/prisma/client';
import { CommentStatus } from '../../../generated/prisma/enums';
import { CommentItemDto } from '../dtos/list-comments-response.dto';

type CommentWithAuthor = Comment & {
  author: Pick<User, 'anonName' | 'avatarUrl'>;
};

export class CommentMapper {
  static toCommentItemDto(
    comment: CommentWithAuthor,
    viewerId: string,
  ): CommentItemDto {
    return {
      id: comment.id,
      content: comment.content,
      status:
        comment.status === CommentStatus.PENDING
          ? CommentStatus.PENDING
          : CommentStatus.ACTIVE,
      anonName: comment.author.anonName,
      avatarUrl: comment.author.avatarUrl,
      isMine: comment.authorId === viewerId,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }
}
