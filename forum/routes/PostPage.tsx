import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { usePost, useComments } from "@forum/data/useForum";
import { AuthorLine } from "@forum/components/post/AuthorLine";
import { RichContent } from "@forum/components/post/RichContent";
import { PrivateChip } from "@forum/components/ui/PrivateChip";
import { EmptyState } from "@forum/components/ui/EmptyState";
import { Skeleton } from "@forum/components/ui/Skeleton";
import { CommentComposer } from "@forum/components/comment/CommentComposer";
import { CommentList } from "@forum/components/comment/CommentList";
import { Button } from "@forum/components/ui/Button";
import { forumHome } from "@forum/config/site";

export function PostPage() {
  const { id } = useParams();
  const { data: post, loading } = usePost(id);
  const {
    tree,
    count,
    loading: commentsLoading,
    reload: reloadComments,
  } = useComments(id);

  return (
    <div className="flex flex-col gap-6">
      <Link
        to={forumHome()}
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-on-background-secondary transition-colors hover:text-on-background"
      >
        <ArrowLeft size={15} strokeWidth={2} />
        All questions
      </Link>

      {loading ? (
        <article className="rounded-xs border border-divider bg-background p-5 sm:p-6">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="mt-4 h-6 w-3/4" />
          <Skeleton className="mt-4 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-5/6" />
        </article>
      ) : !post ? (
        <EmptyState
          title="This question could not be found"
          description="It may have been removed or the link is incorrect."
          action={
            <Link to={forumHome()}>
              <Button variant="secondary" size="sm">
                Back to all questions
              </Button>
            </Link>
          }
        />
      ) : (
        <>
          <article className="rounded-xs border border-divider bg-background p-5 sm:p-6">
            <AuthorLine author={post.author} createdAt={post.createdAt} markSize={32} />
            {post.isPrivate && <PrivateChip className="mt-4" />}
            <h1 className="mt-3.5 text-2xl font-semibold leading-tight tracking-[-0.01em] text-on-background">
              {post.title}
            </h1>
            <RichContent html={post.bodyHtml} className="mt-4" />
          </article>

          <section>
            {/* Comment input first, then the count heading sits right above
                the thread. */}
            <CommentComposer postId={post.id} onSubmitted={reloadComments} />

            <h2 className="mt-6 flex items-center gap-1.5 text-sm font-semibold text-on-background">
              <MessageSquare size={15} strokeWidth={2} className="text-on-background-secondary" />
              {count} {count === 1 ? "comment" : "comments"}
            </h2>

            <div className="mt-3 border-t border-divider">
              <CommentList
                comments={tree}
                postId={post.id}
                loading={commentsLoading}
                onChanged={reloadComments}
              />
            </div>
          </section>
        </>
      )}
    </div>
  );
}
