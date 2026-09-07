export const RealtimeEvent = {
	FEED_NEW_POST: 'feed:new-post',
	FEED_POST_HIDDEN: 'feed:post-hidden',
} as const;

export type FeedNewPostPayload = {
	postId: string;
	authorId: string;
};

export type FeedPostHiddenPayload = {
	postId: string;
	authorId: string;
};
