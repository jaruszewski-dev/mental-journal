'use client';

import { MoreHorizontalIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

type EntryActionsMenuProps = {
	className?: string;
};

export function EntryActionsMenu({ className }: EntryActionsMenuProps) {
	const t = useTranslations('entryActions');

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				type="button"
				aria-label={t('menu')}
				className={cn(
					'inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground',
					'transition-colors hover:bg-muted hover:text-foreground',
					'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
					className,
				)}
			>
				<MoreHorizontalIcon className="size-4 stroke-[1.5]" />
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" sideOffset={4} className="min-w-40">
				<DropdownMenuItem className="cursor-pointer gap-2">
					<PencilIcon className="size-3.5 stroke-[1.5]" />
					{t('edit')}
				</DropdownMenuItem>
				<DropdownMenuItem
					variant="destructive"
					className="cursor-pointer gap-2"
				>
					<Trash2Icon className="size-3.5 stroke-[1.5]" />
					{t('delete')}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
