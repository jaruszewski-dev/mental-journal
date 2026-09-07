import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

function CommentItemSkeleton() {
	return (
		<div className="flex gap-2.5">
			<Skeleton className="mt-0.5 size-7 shrink-0 rounded-full" />
			<div className="min-w-0 flex-1 space-y-1.5">
				<div className="flex items-center gap-2">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-3 w-8" />
				</div>
				<Skeleton className="h-3.5 w-full" />
				<Skeleton className="h-3.5 w-[70%]" />
			</div>
		</div>
	);
}

type CommentsSkeletonProps = {
	count?: number;
	className?: string;
};

export function CommentsSkeleton({
	count = 3,
	className,
}: CommentsSkeletonProps) {
	return (
		<div className={cn('flex flex-col gap-3', className)} aria-hidden>
			{Array.from({ length: count }, (_, index) => (
				<CommentItemSkeleton key={index} />
			))}
		</div>
	);
}
