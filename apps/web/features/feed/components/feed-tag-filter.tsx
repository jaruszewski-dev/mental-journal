'use client';

import { TagIcon, XIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import { JOURNAL_TAG_CATALOG, type JournalTag } from '@/features/journal/validations/entry.schema';
import { cn } from '@/lib/utils';

type FeedTagFilterProps = {
	value: JournalTag[];
	onChange: (tags: JournalTag[]) => void;
};

export function FeedTagFilter({ value, onChange }: FeedTagFilterProps) {
	const t = useTranslations('feed.filters');
	const tTags = useTranslations('composer.tags');
	const [open, setOpen] = useState(false);
	const rootRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) return;

		function handleClickOutside(e: MouseEvent) {
			const target = e.target;
			if (!(target instanceof Element)) return;
			if (rootRef.current?.contains(target)) return;
			setOpen(false);
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [open]);

	function toggleTag(tag: JournalTag) {
		if (value.includes(tag)) {
			onChange(value.filter((item) => item !== tag));
			return;
		}
		onChange([...value, tag]);
	}

	return (
		<div ref={rootRef} className="border-b border-border px-4 py-3">
			<div className="flex flex-wrap items-center gap-1.5">
				<button
					type="button"
					className={cn(
						'flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors',
						open || value.length > 0
							? 'bg-sand/15 text-foreground'
							: 'bg-muted text-muted-foreground hover:text-foreground',
					)}
					onClick={() => setOpen((current) => !current)}
				>
					<TagIcon className="size-3.5" />
					{t('tags')}
					{value.length > 0 ? (
						<span className="text-muted-foreground">
							{value.length}
						</span>
					) : null}
				</button>

				{value.map((tag) => (
					<button
						key={tag}
						type="button"
						className="flex cursor-pointer items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs text-foreground transition-colors hover:bg-accent/80"
						onClick={() => toggleTag(tag)}
					>
						{tTags(`items.${tag}`)}
						<XIcon className="size-3 opacity-60" />
					</button>
				))}

				{value.length > 0 ? (
					<button
						type="button"
						className="cursor-pointer px-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
						onClick={() => onChange([])}
					>
						{t('clear')}
					</button>
				) : null}
			</div>

			{open ? (
				<div className="mt-3 max-h-48 space-y-3 overflow-y-auto rounded-lg bg-muted/40 p-3 ring-1 ring-border">
					{(
						Object.entries(JOURNAL_TAG_CATALOG) as [
							keyof typeof JOURNAL_TAG_CATALOG,
							readonly JournalTag[],
						][]
					).map(([category, tags]) => (
						<div key={category}>
							<p className="mb-1.5 text-[0.65rem] font-medium tracking-wide text-muted-foreground uppercase">
								{tTags(`categories.${category}`)}
							</p>
							<div className="flex flex-wrap gap-1.5">
								{tags.map((tag) => {
									const selected =
										value.includes(tag);
									return (
										<button
											key={tag}
											type="button"
											className={cn(
												'cursor-pointer rounded-full px-2.5 py-1 text-xs transition-colors',
												selected
													? 'bg-primary text-primary-foreground'
													: 'bg-background text-muted-foreground ring-1 ring-border hover:text-foreground',
											)}
											onClick={() =>
												toggleTag(
													tag,
												)
											}
										>
											{tTags(
												`items.${tag}`,
											)}
										</button>
									);
								})}
							</div>
						</div>
					))}
				</div>
			) : null}
		</div>
	);
}
