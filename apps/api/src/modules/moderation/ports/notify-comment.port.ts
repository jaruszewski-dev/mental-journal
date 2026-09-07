export type NotifyCommentInput = {
  commentId: string;
  postId: string;
  authorId: string;
};

export interface NotifyCommentPort {
  notifyActive(input: NotifyCommentInput): void;
  notifyHidden(input: NotifyCommentInput): void;
}

export const NOTIFY_COMMENT_PORT = Symbol('NOTIFY_COMMENT_PORT');
