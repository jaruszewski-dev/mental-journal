'use client';

import { GlobeIcon, LockIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { EntryActionsMenu } from '@/components/entry-actions-menu';
import { formatFeedTime } from '@/features/feed/utils/format-feed-time';
import { cn } from '@/lib/utils';
import { MOOD_EMOJI } from '@/shared/consts/mood.const';

import type { JournalEntry } from '../api/get-entries';

type JournalEntryRowProps = {
	entry: JournalEntry;
	showDayLabel: boolean;
	dayLabel: string;
	showBorderBottom: boolean;
};

export function JournalEntryRow({
	entry,
	showDayLabel,
	dayLabel,
	showBorderBottom,
}: JournalEntryRowProps) {
	const locale = useLocale();
	const t = useTranslations('journal');
	const tMood = useTranslations('composer.mood');
	const tTags = useTranslations('composer.tags.items');
	const time = formatFeedTime(entry.createdAt, locale);

	const isPrivate = entry.visibility === 'private';
	const isPending = entry.postStatus === 'PENDING';
	const isHidden = entry.postStatus === 'HIDDEN';

	return (
		<div>
			{showDayLabel ? (
				<div className="flex items-center gap-3 px-4 pb-2 pt-5">
					<div className="h-px flex-1 bg-border" />
					<p className="shrink-0 text-xs font-medium tracking-wide text-muted-foreground">
						{dayLabel}
					</p>
					<div className="h-px flex-1 bg-border" />
				</div>
			) : null}

			<article
				className={cn(
					'px-4 py-3.5',
					showBorderBottom && 'border-b border-border',
				)}
			>				<div className="flex items-start justify-between gap-2">
					<div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
						<span
							className={cn(
								'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.7rem]',
								isPrivate || isHidden
									? 'bg-muted text-muted-foreground'
									: isPending
										? 'bg-sand/15 text-sand'
										: 'bg-accent text-foreground',
							)}
						>
							{isPrivate || isHidden ? (
								<LockIcon className="size-3 stroke-[1.5]" />
							) : (
								<GlobeIcon className="size-3 stroke-[1.5]" />
							)}
							{isPrivate
								? t('visibility.private')
								: isPending
									? t('visibility.pending')
									: isHidden
										? t('visibility.hidden')
										: t('visibility.public')}
						</span>
						<time
							dateTime={entry.createdAt}
							className="text-xs text-muted-foreground"
							title={new Date(entry.createdAt).toLocaleString(locale)}
						>
							{time}
						</time>
					</div>
					<EntryActionsMenu
						entryId={entry.id}
						canEdit={isPrivate}
						canPublish={isPrivate}
						entry={
							isPrivate
								? {
										content: entry.content,
										mood: entry.mood,
										tags: entry.tags,
									}
								: undefined
						}
					/>
				</div>

				<p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
					{entry.content}
				</p>

				{entry.mood != null || entry.tags.length > 0 ? (
					<div className="mt-3 flex flex-wrap items-center gap-1.5">
						{entry.mood != null ? (
							<span
								className="text-base"
								title={tMood(
									String(entry.mood) as '1' | '2' | '3' | '4' | '5',
								)}
							>
								{MOOD_EMOJI[entry.mood]}
							</span>
						) : null}

						{entry.tags.map((tag) => (
							<span
								key={tag}
								className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
							>
								{tTags(tag as Parameters<typeof tTags>[0])}
							</span>
						))}
					</div>
				) : null}
			</article>
		</div>
	);
}
