'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

import { useCommentsInfiniteQuery } from '../hooks/use-comments-infinite-query';
import { useDelayedPending } from '../hooks/use-delayed-pending';
import { CommentComposer } from './comment-composer';
import { CommentItem } from './comment-item';
import { CommentsSkeleton } from './comments-skeleton';

type CommentsSectionProps = {
	postId: string;
};

export function CommentsSection({ postId }: CommentsSectionProps) {
	const t = useTranslations('comments');
	const query = useCommentsInfiniteQuery(postId, true);
	const items = query.data?.pages.flatMap((page) => page.items) ?? [];
	const showSkeleton = useDelayedPending(query.isPending);

	return (
		<div className="flex flex-col gap-4 pt-1">
			{query.isPending ? (
				showSkeleton ? (
					<div aria-busy="true" aria-label={t('loading')}>
						<CommentsSkeleton />
					</div>
				) : (
					<div aria-busy="true" aria-label={t('loading')} className="min-h-4" />
				)
			) : query.isError ? (
				<div className="flex flex-col items-start gap-2">
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
			) : items.length === 0 ? (
				<p className="text-sm text-muted-foreground">{t('empty')}</p>
			) : (
				<div className="flex flex-col gap-3">
					<ul className="flex flex-col gap-3">
						{items.map((item) => (
							<CommentItem key={item.id} item={item} />
						))}
					</ul>

					{query.hasNextPage ? (
						<Button
							type="button"
							variant="ghost"
							size="sm"
							className="cursor-pointer self-start text-muted-foreground"
							disabled={query.isFetchingNextPage}
							onClick={() => query.fetchNextPage()}
						>
							{query.isFetchingNextPage ? t('loadingMore') : t('loadMore')}
						</Button>
					) : null}
				</div>
			)}

			<CommentComposer postId={postId} />
		</div>
	);
}
