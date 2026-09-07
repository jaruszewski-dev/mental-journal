'use client';

import { useLocale } from 'next-intl';

import { UserAvatar } from '@/components/user-avatar';
import { formatFeedTime } from '@/features/feed/utils/format-feed-time';

import type { CommentItem as CommentItemType } from '../api/get-comments';

type CommentItemProps = {
	item: CommentItemType;
};

export function CommentItem({ item }: CommentItemProps) {
	const locale = useLocale();
	const time = formatFeedTime(item.createdAt, locale);

	return (
		<li className="flex gap-2.5">
			<UserAvatar
				anonName={item.anonName}
				avatarUrl={item.avatarUrl}
				className="mt-0.5 size-7 text-xs"
			/>
			<div className="min-w-0 flex-1">
				<div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
					<p className="truncate text-sm font-medium text-foreground">
						{item.anonName}
					</p>
					<time
						dateTime={item.createdAt}
						className="shrink-0 text-xs text-muted-foreground"
						title={new Date(item.createdAt).toLocaleString(locale)}
					>
						{time}
					</time>
				</div>
				<p className="mt-0.5 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
					{item.content}
				</p>
			</div>
		</li>
	);
}
