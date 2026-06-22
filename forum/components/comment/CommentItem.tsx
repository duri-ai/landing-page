import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Reply } from "lucide-react";
import type { CommentNode } from "@forum/data/types";
import { AuthorLine } from "@forum/components/post/AuthorLine";
import { CommentComposer } from "@forum/components/comment/CommentComposer";
import { useForumActions } from "@forum/data/useForum";
import { loginWithRedirect } from "@forum/config/site";
import { cn } from "@forum/lib/cn";

interface CommentItemProps {
  comment: CommentNode;
  postId: string;
  onChanged: () => void;
  depth?: number;
}

const MAX_INDENT = 5;

export function CommentItem({
  comment,
  postId,
  onChanged,
  depth = 0,
}: CommentItemProps) {
  const { isSignedIn } = useForumActions();
  const navigate = useNavigate();
  const location = useLocation();
  const [replying, setReplying] = useState(false);

  // Reply is gated: a signed-out tap takes the user to sign in (no inline
  // notice on replies, by design), returning here afterward.
  const onReply = () => {
    if (!isSignedIn) {
      navigate(loginWithRedirect(location.pathname + location.search));
      return;
    }
    setReplying((v) => !v);
  };

  return (
    <div className={cn(depth > 0 && "mt-3")}>
      <AuthorLine author={comment.author} createdAt={comment.createdAt} markSize={24} />
      <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-on-background">
        {comment.body}
      </p>

      <button
        type="button"
        onClick={onReply}
        className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-on-background-secondary transition-colors hover:text-brand-variant cursor-pointer"
      >
        <Reply size={13} strokeWidth={2} />
        Reply
      </button>

      {replying && (
        <div className="mt-2.5">
          <CommentComposer
            postId={postId}
            parentId={comment.id}
            autoFocus
            placeholder={`Reply to ${comment.author.company}`}
            onSubmitted={() => {
              setReplying(false);
              onChanged();
            }}
            onCancel={() => setReplying(false)}
          />
        </div>
      )}

      {comment.replies.length > 0 && (
        <div
          className={cn(
            "mt-3 border-l border-divider",
            depth < MAX_INDENT ? "ml-3 pl-4 sm:ml-3.5" : "ml-1 pl-2",
          )}
        >
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              onChanged={onChanged}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
