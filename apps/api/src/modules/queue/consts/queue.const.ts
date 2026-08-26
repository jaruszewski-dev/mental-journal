export const MODERATION_QUEUE = 'moderation';

export const ModerationJobName = {
  MODERATE_POST: 'moderate-post',
  MODERATE_COMMENT: 'moderate-comment',
} as const;

export type ModeratePostJobData = {
  postId: string;
  authorId: string;
};

export type ModerateCommentJobData = {
  commentId: string;
  authorId: string;
};

export const MAIL_QUEUE = 'mail';

export const MailJobName = {
  SEND_VERIFICATION_EMAIL: 'send-verification-email',
} as const;

export type SendVerificationEmailJobData = {
  to: string;
  verificationLink: string;
};
