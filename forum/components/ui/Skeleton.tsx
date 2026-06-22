import { cn } from "@forum/lib/cn";

/** Pulsing placeholder block used while data loads. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-xs bg-divider/70", className)}
      aria-hidden
    />
  );
}

/** A few placeholder question rows for the feed's loading state. */
export function PostListSkeleton() {
  return (
    <div className="divide-y divide-divider" aria-hidden>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex gap-3.5 py-5">
          <Skeleton className="h-10 w-10 shrink-0" />
          <div className="min-w-0 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="mt-2.5 h-3 w-full" />
            <Skeleton className="mt-4 h-3 w-40" />
          </div>
        </div>
      ))}
    </div>
  );
}
