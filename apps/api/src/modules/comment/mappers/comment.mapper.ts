import type { Comment, User } from '../../../generated/prisma/client';
import { CommentItemDto } from '../dtos/list-comments-response.dto';

type CommentWithAuthor = Comment & { author: Pick<User, 'anonName'> };

export class CommentMapper {
  static toCommentItemDto(comment: CommentWithAuthor): CommentItemDto {
    return {
      id: comment.id,
      content: comment.content,
      anonName: comment.author.anonName,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }
}
