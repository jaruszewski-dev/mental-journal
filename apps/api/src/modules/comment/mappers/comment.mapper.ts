import type { Comment, User } from '../../../generated/prisma/client';
import { CommentItemDto } from '../dtos/list-comments-response.dto';

type CommentWithAuthor = Comment & {
  author: Pick<User, 'anonName' | 'avatarUrl'>;
};

export class CommentMapper {
  static toCommentItemDto(comment: CommentWithAuthor): CommentItemDto {
    return {
      id: comment.id,
      content: comment.content,
      anonName: comment.author.anonName,
      avatarUrl: comment.author.avatarUrl,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }
}
