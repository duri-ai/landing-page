import type { Author } from "@forum/data/types";
import { CompanyMark } from "@forum/components/ui/CompanyMark";
import { relativeTime, absoluteTime } from "@forum/lib/time";
import { cn } from "@forum/lib/cn";

/** Company + timestamp line shared by post detail and comments. */
export function AuthorLine({
  author,
  createdAt,
  markSize = 28,
  className,
}: {
  author: Author;
  createdAt: string;
  markSize?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2 text-xs", className)}>
      <CompanyMark company={author.company} size={markSize} />
      <span className="font-medium text-on-background">{author.company}</span>
      <span className="text-on-background-secondary-variant" aria-hidden>
        ·
      </span>
      <time
        dateTime={createdAt}
        title={absoluteTime(createdAt)}
        className="text-on-background-secondary"
      >
        {relativeTime(createdAt)}
      </time>
    </div>
  );
}
