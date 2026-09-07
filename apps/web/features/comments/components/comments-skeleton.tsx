import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

function CommentItemSkeleton() {
	return (
		<div className="py-3">
			<div className="flex items-center justify-between gap-3">
				<div className="flex items-center gap-2">
					<Skeleton className="size-7 rounded-full" />
					<Skeleton className="h-4 w-24" />
				</div>
				<Skeleton className="h-3 w-8" />
			</div>
			<div className="mt-2 space-y-1.5 pl-9">
				<Skeleton className="h-3.5 w-full" />
				<Skeleton className="h-3.5 w-[80%]" />
			</div>
		</div>
	);
}

type CommentsSkeletonProps = {
	count?: number;
	className?: string;
};

export function CommentsSkeleton({ count = 3, className }: CommentsSkeletonProps) {
	return (
		<div className={cn('divide-y divide-border', className)} aria-hidden>
			{Array.from({ length: count }, (_, index) => (
				<CommentItemSkeleton key={index} />
			))}
		</div>
	);
}
