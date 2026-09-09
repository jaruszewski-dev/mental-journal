'use client';

import { MoreHorizontalIcon, Trash2Icon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeleteCommentMutation } from '@/features/comments/hooks/use-delete-comment-mutation';
import { cn } from '@/lib/utils';

type CommentActionsMenuProps = {
	commentId: string;
	postId: string;
	className?: string;
};

export function CommentActionsMenu({
	commentId,
	postId,
	className,
}: CommentActionsMenuProps) {
	const t = useTranslations('comments');
	const deleteMutation = useDeleteCommentMutation();

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
				<DropdownMenuItem
					variant="destructive"
					disabled={deleteMutation.isPending}
					className="cursor-pointer gap-2"
					onClick={() =>
						deleteMutation.mutate({ commentId, postId })
					}
				>
					<Trash2Icon className="size-3.5 stroke-[1.5]" />
					{t('delete')}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
