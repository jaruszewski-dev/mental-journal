'use client';

import { MoreHorizontalIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	EditEntryDialog,
	type EditEntryValues,
} from '@/features/journal/components/edit-entry-dialog';
import { useDeleteEntryMutation } from '@/features/journal/hooks/use-delete-entry-mutation';
import { cn } from '@/lib/utils';

type EntryActionsMenuProps = {
	entryId: string;
	canEdit?: boolean;
	entry?: EditEntryValues;
	className?: string;
};

export function EntryActionsMenu({
	entryId,
	canEdit = false,
	entry,
	className,
}: EntryActionsMenuProps) {
	const t = useTranslations('entryActions');
	const deleteMutation = useDeleteEntryMutation();
	const [editOpen, setEditOpen] = useState(false);

	return (
		<>
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
					{canEdit && entry ? (
						<DropdownMenuItem
							className="cursor-pointer gap-2"
							onClick={() => setEditOpen(true)}
						>
							<PencilIcon className="size-3.5 stroke-[1.5]" />
							{t('edit')}
						</DropdownMenuItem>
					) : null}
					<DropdownMenuItem
						variant="destructive"
						disabled={deleteMutation.isPending}
						className="cursor-pointer gap-2"
						onClick={() => deleteMutation.mutate(entryId)}
					>
						<Trash2Icon className="size-3.5 stroke-[1.5]" />
						{t('delete')}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{canEdit && entry ? (
				<EditEntryDialog
					entryId={entryId}
					entry={entry}
					open={editOpen}
					onOpenChange={setEditOpen}
				/>
			) : null}
		</>
	);
}
