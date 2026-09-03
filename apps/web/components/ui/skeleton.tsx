import { cn } from "@/lib/utils";

type SkeletonProps = React.ComponentProps<"div">;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-muted/70",
        "after:absolute after:inset-0 after:-translate-x-full after:animate-[skeleton-shimmer_1.4s_ease-in-out_infinite]",
        "after:bg-gradient-to-r after:from-transparent after:via-background/50 after:to-transparent",
        className,
      )}
      {...props}
    />
  );
}
