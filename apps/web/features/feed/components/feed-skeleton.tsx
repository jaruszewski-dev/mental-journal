import { cn } from "@/lib/utils";

import { Skeleton } from "@/components/ui/skeleton";

function FeedItemSkeleton() {
  return (
    <div className="border-b border-border px-4 py-4">
      <div className="flex items-center justify-between gap-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-10" />
      </div>

      <div className="mt-3 space-y-2">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-[92%]" />
        <Skeleton className="h-3.5 w-[68%]" />
      </div>

      <div className="mt-3 flex items-center gap-1.5">
        <Skeleton className="size-5 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
    </div>
  );
}

type FeedSkeletonProps = {
  count?: number;
  className?: string;
};

export function FeedSkeleton({ count = 4, className }: FeedSkeletonProps) {
  return (
    <div className={cn("flex flex-1 flex-col", className)} aria-hidden>
      {Array.from({ length: count }, (_, index) => (
        <FeedItemSkeleton key={index} />
      ))}
    </div>
  );
}
