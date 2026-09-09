'use client';

import { useLocale, useTranslations } from 'next-intl';

import { UserAvatar } from '@/components/user-avatar';
import { formatFeedTime } from '@/features/feed/utils/format-feed-time';
import { cn } from '@/lib/utils';

import type { CommentItem as CommentItemType } from '../api/get-comments';
import { CommentActionsMenu } from './comment-actions-menu';

type CommentItemProps = {
	item: CommentItemType;
	postId: string;
};

export function CommentItem({ item, postId }: CommentItemProps) {
	const locale = useLocale();
	const t = useTranslations('comments');
	const time = formatFeedTime(item.createdAt, locale);
	const isPending = item.status === 'PENDING';

	return (
		<li
			className={cn('flex gap-2.5 transition-opacity', isPending && 'opacity-50')}
		>
			<UserAvatar
				anonName={item.anonName}
				avatarUrl={item.avatarUrl}
				className="mt-0.5 size-7 text-xs"
			/>
			<div className="min-w-0 flex-1">
				<div className="flex items-start justify-between gap-2">
					<div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
						<p className="truncate text-sm font-medium text-foreground">
							{item.anonName}
						</p>
						{isPending ? (
							<span className="text-xs text-muted-foreground">
								{t('pendingReview')}
							</span>
						) : null}
						<time
							dateTime={item.createdAt}
							className="shrink-0 text-xs text-muted-foreground"
							title={new Date(item.createdAt).toLocaleString(locale)}
						>
							{time}
						</time>
					</div>
					{item.isMine ? (
						<CommentActionsMenu commentId={item.id} postId={postId} />
					) : null}
				</div>
				<p className="mt-0.5 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
					{item.content}
				</p>
			</div>
		</li>
	);
}
