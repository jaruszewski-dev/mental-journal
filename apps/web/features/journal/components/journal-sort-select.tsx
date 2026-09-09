'use client';

import { useTranslations } from 'next-intl';

import type { JournalListSort } from '../consts/journal-query-key';

const SORT_OPTIONS = [
	{ sortBy: 'date', orderBy: 'desc', key: 'dateDesc' },
	{ sortBy: 'date', orderBy: 'asc', key: 'dateAsc' },
	{ sortBy: 'mood', orderBy: 'desc', key: 'moodDesc' },
	{ sortBy: 'mood', orderBy: 'asc', key: 'moodAsc' },
] as const;

type JournalSortSelectProps = {
	value: JournalListSort;
	onChange: (sort: JournalListSort) => void;
};

export function JournalSortSelect({ value, onChange }: JournalSortSelectProps) {
	const t = useTranslations('journal.sort');

	const selected =
		SORT_OPTIONS.find((option) => option.sortBy === value.sortBy && option.orderBy === value.orderBy)
			?.key ?? 'dateDesc';

	return (
		<div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
			<p className="text-xs font-medium text-muted-foreground">{t('label')}</p>
			<select
				className="h-8 cursor-pointer rounded-lg border border-border bg-background px-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
				value={selected}
				onChange={(event) => {
					const option = SORT_OPTIONS.find(
						(item) => item.key === event.target.value,
					);
					if (!option) return;
					onChange({ sortBy: option.sortBy, orderBy: option.orderBy });
				}}
			>
				{SORT_OPTIONS.map((option) => (
					<option key={option.key} value={option.key}>
						{t(option.key)}
					</option>
				))}
			</select>
		</div>
	);
}
