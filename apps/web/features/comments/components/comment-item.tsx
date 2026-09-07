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
		<li className="py-3">
			<div className="flex items-center justify-between gap-3">
				<div className="flex min-w-0 items-center gap-2">
					<UserAvatar
						anonName={item.anonName}
						avatarUrl={item.avatarUrl}
						className="size-7 text-xs"
					/>
					<p className="truncate text-sm font-medium text-foreground">
						{item.anonName}
					</p>
				</div>
				<time
					dateTime={item.createdAt}
					className="shrink-0 text-xs text-muted-foreground"
					title={new Date(item.createdAt).toLocaleString(locale)}
				>
					{time}
				</time>
			</div>
			<p className="mt-1.5 pl-9 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
				{item.content}
			</p>
		</li>
	);
}
