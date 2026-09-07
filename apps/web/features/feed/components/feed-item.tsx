'use client';

import { ChevronDownIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';

import { UserAvatar } from '@/components/user-avatar';
import { CommentsSection } from '@/features/comments/components/comments-section';
import { cn } from '@/lib/utils';

import type { FeedItem as FeedItemType } from '../api/get-feed';
import { formatFeedTime } from '../utils/format-feed-time';

const MOOD_EMOJI: Record<number, string> = {
	1: '😞',
	2: '😕',
	3: '😐',
	4: '🙂',
	5: '😊',
};

type FeedItemProps = {
	item: FeedItemType;
};

export function FeedItem({ item }: FeedItemProps) {
	const locale = useLocale();
	const t = useTranslations('feed.comments');
	const tTags = useTranslations('composer.tags.items');
	const tMood = useTranslations('composer.mood');
	const time = formatFeedTime(item.createdAt, locale);
	const [commentsOpen, setCommentsOpen] = useState(false);

	return (
		<article className="border-b border-border px-4 py-4">
			<div className="flex items-center justify-between gap-3">
				<div className="flex min-w-0 items-center gap-2.5">
					<UserAvatar
						anonName={item.anonName}
						avatarUrl={item.avatarUrl}
						className="size-8 text-sm"
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

			<p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
				{item.content}
			</p>

			{(item.mood != null || item.tags.length > 0) && (
				<div className="mt-3 flex flex-wrap items-center gap-1.5">
					{item.mood != null ? (
						<span
							className="text-base"
							title={tMood(
								String(item.mood) as
									| '1'
									| '2'
									| '3'
									| '4'
									| '5',
							)}
						>
							{MOOD_EMOJI[item.mood]}
						</span>
					) : null}

					{item.tags.map((tag) => (
						<span
							key={tag}
							className={cn(
								'rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground',
							)}
						>
							{tTags(tag as Parameters<typeof tTags>[0])}
						</span>
					))}
				</div>
			)}

			<div className="mt-3 flex items-center">
				<button
					type="button"
					aria-expanded={commentsOpen}
					onClick={() => setCommentsOpen((open) => !open)}
					className={cn(
						'inline-flex cursor-pointer items-center gap-1 text-xs text-muted-foreground',
						'transition-colors hover:text-foreground',
						'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
						commentsOpen && 'text-foreground',
					)}
				>
					{t('toggle')}
					<ChevronDownIcon
						className={cn(
							'size-3.5 stroke-[1.5] transition-transform duration-150',
							commentsOpen && 'rotate-180',
						)}
					/>
				</button>
			</div>

			{commentsOpen ? (
				<div className="mt-3 border-t border-border/60 pt-3">
					<CommentsSection postId={item.id} />
				</div>
			) : null}
		</article>
	);
}
