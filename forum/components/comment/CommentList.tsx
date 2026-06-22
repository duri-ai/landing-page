import type { CommentNode } from "@forum/data/types";
import { CommentItem } from "@forum/components/comment/CommentItem";
import { Skeleton } from "@forum/components/ui/Skeleton";

export function CommentList({
  comments,
  postId,
  loading = false,
  onChanged,
}: {
  comments: CommentNode[];
  postId: string;
  loading?: boolean;
  onChanged: () => void;
}) {
  if (loading && comments.length === 0) {
    return (
      <div className="space-y-5 py-5" aria-hidden>
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="h-4 w-40" />
            <Skeleton className="mt-2 h-4 w-full" />
            <Skeleton className="mt-1.5 h-4 w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-on-background-secondary">
        No comments yet. Start the discussion.
      </p>
    );
  }

  return (
    <div className="divide-y divide-divider">
      {comments.map((comment) => (
        <div key={comment.id} className="py-5 first:pt-2">
          <CommentItem comment={comment} postId={postId} onChanged={onChanged} />
        </div>
      ))}
    </div>
  );
}
