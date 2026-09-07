export const RealtimeEvent = {
	FEED_NEW_POST: 'feed:new-post',
	FEED_POST_HIDDEN: 'feed:post-hidden',
	COMMENT_ACTIVE: 'comment:active',
	COMMENT_HIDDEN: 'comment:hidden',
} as const;

export type FeedNewPostPayload = {
	postId: string;
	authorId: string;
};

export type FeedPostHiddenPayload = {
	postId: string;
	authorId: string;
};

export type CommentActivePayload = {
	commentId: string;
	postId: string;
	authorId: string;
};

export type CommentHiddenPayload = {
	commentId: string;
	postId: string;
	authorId: string;
};
