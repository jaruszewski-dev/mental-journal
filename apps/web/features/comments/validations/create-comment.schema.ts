import { z } from 'zod';

import { MAX_COMMENT_CONTENT_LENGTH, MIN_COMMENT_CONTENT_LENGTH } from '../consts/comment.const';

export function createCommentSchema(errors: { contentRequired: string; contentMax: string }) {
	return z.object({
		content: z
			.string()
			.trim()
			.min(MIN_COMMENT_CONTENT_LENGTH, errors.contentRequired)
			.max(MAX_COMMENT_CONTENT_LENGTH, errors.contentMax),
	});
}

export type CreateCommentFormValues = z.infer<ReturnType<typeof createCommentSchema>>;
