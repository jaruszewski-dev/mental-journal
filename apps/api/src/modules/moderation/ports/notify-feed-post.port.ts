export type NotifyFeedPostInput = {
  postId: string;
  authorId: string;
};

export interface NotifyFeedPostPort {
  notifyActive(input: NotifyFeedPostInput): void;
  notifyHidden(input: NotifyFeedPostInput): void;
}

export const NOTIFY_FEED_POST_PORT = Symbol('NOTIFY_FEED_POST_PORT');
