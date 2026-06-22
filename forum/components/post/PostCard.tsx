import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import type { Post } from "@forum/data/types";
import { CompanyMark } from "@forum/components/ui/CompanyMark";
import { PrivateChip } from "@forum/components/ui/PrivateChip";
import { forumPost } from "@forum/config/site";
import { relativeTime, absoluteTime } from "@forum/lib/time";
import { sanitizeHtml } from "@forum/lib/sanitize";

function excerpt(html: string, max = 150): string {
  const text = sanitizeHtml(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
}

export function PostCard({ post }: { post: Post }) {
  const summary = excerpt(post.bodyHtml);

  return (
    <Link
      to={forumPost(post.id)}
      className="group -mx-3 block rounded-xs px-3 py-4 transition-colors duration-150 hover:bg-background sm:py-5"
    >
      <div className="flex gap-3.5">
        <CompanyMark company={post.author.company} size={40} className="mt-0.5" />

        <div className="min-w-0 flex-1">
          {post.isPrivate && <PrivateChip className="mb-2" />}

          <h3 className="text-[1.05rem] font-semibold leading-snug text-on-background transition-colors duration-150 group-hover:text-brand-variant">
            {post.title}
          </h3>

          {summary && (
            <p className="mt-2.5 line-clamp-1 text-sm text-on-background-secondary">
              {summary}
            </p>
          )}

          <div className="mt-4 flex items-center gap-2 text-xs text-on-background-secondary">
            <span className="font-medium text-on-background">
              {post.author.company}
            </span>
            <span className="text-on-background-secondary-variant" aria-hidden>
              ·
            </span>
            <time dateTime={post.createdAt} title={absoluteTime(post.createdAt)}>
              {relativeTime(post.createdAt)}
            </time>
            <span className="ml-auto inline-flex items-center gap-1.5">
              <MessageSquare size={14} strokeWidth={2} />
              {post.commentCount}{" "}
              {post.commentCount === 1 ? "comment" : "comments"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
