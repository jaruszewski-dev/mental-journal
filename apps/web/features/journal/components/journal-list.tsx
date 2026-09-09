'use client';

import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { useJournalInfiniteQuery } from '../hooks/use-journal-infinite-query';
import {
	formatJournalDayLabel,
	journalDayKey,
} from '../utils/format-journal-day';
import { JournalEntryRow } from './journal-entry-row';

const ESTIMATED_ITEM_SIZE = 96;
const ESTIMATED_ITEM_WITH_DAY = 132;
const LOADER_SIZE = 180;

function JournalSkeleton({
	count = 4,
	className,
}: {
	count?: number;
	className?: string;
}) {
	return (
		<div className={cn('flex flex-col', className)} aria-hidden>
			{Array.from({ length: count }, (_, i) => (
				<div key={i} className="border-b border-border px-4 py-4">
					<div className="mb-2 h-3 w-20 animate-pulse rounded bg-muted/60" />
					<div className="h-12 animate-pulse rounded bg-muted/40" />
				</div>
			))}
		</div>
	);
}

export function JournalList() {
	const t = useTranslations('journal');
	const locale = useLocale();
	const query = useJournalInfiniteQuery();
	const items = query.data?.pages.flatMap((page) => page.items) ?? [];
	const listRef = useRef<HTMLDivElement>(null);
	const [scrollMargin, setScrollMargin] = useState(0);

	const dayMeta = useMemo(() => {
		return items.map((entry, index) => {
			const key = journalDayKey(entry.createdAt);
			const prevKey = index > 0 ? journalDayKey(items[index - 1]!.createdAt) : null;
			const nextKey =
				index < items.length - 1
					? journalDayKey(items[index + 1]!.createdAt)
					: null;
			return {
				showDayLabel: key !== prevKey,
				dayLabel: formatJournalDayLabel(entry.createdAt, locale),
				showBorderBottom: nextKey === key,
			};
		});
	}, [items, locale]);

	const rowCount = query.hasNextPage ? items.length + 1 : items.length;

	const virtualizer = useWindowVirtualizer({
		count: rowCount,
		estimateSize: (index) => {
			if (index >= items.length) return LOADER_SIZE;
			return dayMeta[index]?.showDayLabel
				? ESTIMATED_ITEM_WITH_DAY
				: ESTIMATED_ITEM_SIZE;
		},
		overscan: 6,
		scrollMargin,
	});

	useLayoutEffect(() => {
		if (!listRef.current) return;
		setScrollMargin(listRef.current.offsetTop);
	}, [items.length, query.isPending]);

	const virtualItems = virtualizer.getVirtualItems();
	const lastVirtualIndex = virtualItems.at(-1)?.index;

	useEffect(() => {
		if (
			lastVirtualIndex == null ||
			lastVirtualIndex < items.length - 1 ||
			!query.hasNextPage ||
			query.isFetchingNextPage
		) {
			return;
		}

		void query.fetchNextPage();
	}, [
		lastVirtualIndex,
		items.length,
		query.hasNextPage,
		query.isFetchingNextPage,
		query.fetchNextPage,
	]);

	if (query.isPending) {
		return (
			<div aria-busy="true" aria-label={t('loading')}>
				<JournalSkeleton />
			</div>
		);
	}

	if (query.isError) {
		return (
			<div className="flex flex-col items-start gap-3 px-4 py-8">
				<p className="text-sm text-destructive">{t('error')}</p>
				<Button
					type="button"
					variant="outline"
					size="sm"
					className="cursor-pointer"
					onClick={() => query.refetch()}
				>
					{t('retry')}
				</Button>
			</div>
		);
	}

	if (items.length === 0) {
		return (
			<p className="px-4 py-8 text-sm text-muted-foreground">{t('empty')}</p>
		);
	}

	return (
		<div ref={listRef} className="relative w-full">
			<div
				className="relative w-full"
				style={{ height: `${virtualizer.getTotalSize()}px` }}
			>
				{virtualItems.map((virtualRow) => {
					const isLoaderRow = virtualRow.index >= items.length;
					const item = items[virtualRow.index];
					const meta = dayMeta[virtualRow.index];

					return (
						<div
							key={virtualRow.key}
							data-index={virtualRow.index}
							ref={virtualizer.measureElement}
							className="absolute top-0 left-0 w-full"
							style={{
								transform: `translateY(${
									virtualRow.start -
									virtualizer.options.scrollMargin
								}px)`,
							}}
						>
							{isLoaderRow ? (
								<div
									aria-busy={query.isFetchingNextPage}
									aria-label={t('loadingMore')}
								>
									<JournalSkeleton
										count={2}
										className={
											query.isFetchingNextPage
												? 'opacity-100'
												: 'opacity-55'
										}
									/>
								</div>
							) : item && meta ? (
								<JournalEntryRow
									entry={item}
									showDayLabel={meta.showDayLabel}
									dayLabel={meta.dayLabel}
									showBorderBottom={meta.showBorderBottom}
								/>
							) : null}
						</div>
					);
				})}
			</div>
		</div>
	);
}
