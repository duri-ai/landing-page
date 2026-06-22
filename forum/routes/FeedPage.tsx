import { useNavigate, useLocation } from "react-router-dom";
import { PenLine } from "lucide-react";
import { usePosts } from "@forum/data/useForum";
import { useAuth } from "@forum/auth/AuthContext";
import { PostList } from "@forum/components/post/PostList";
import { PostListSkeleton } from "@forum/components/ui/Skeleton";
import { Button } from "@forum/components/ui/Button";
import { FORUM_INTRO, forumNew, loginWithRedirect } from "@forum/config/site";

/** Warm the lazily-loaded composer chunk so opening it feels instant. */
function prefetchComposer() {
  void import("@forum/routes/NewPostPage");
}

export function FeedPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: posts, loading } = usePosts();
  const { currentUser } = useAuth();
  const signedIn = currentUser !== null;

  const startPost = () => {
    if (!signedIn) {
      navigate(loginWithRedirect(location.pathname + location.search));
      return;
    }
    prefetchComposer();
    navigate(forumNew());
  };

  return (
    <div>
      <section>
        <h1 className="text-[1.7rem] font-semibold tracking-[-0.02em] text-on-background">
          {FORUM_INTRO.title}
        </h1>
        <p className="mt-2 max-w-[52ch] text-[0.975rem] leading-relaxed text-on-background-secondary">
          {FORUM_INTRO.description}
        </p>
        <div className="mt-5">
          <Button
            variant="primary"
            onMouseEnter={signedIn ? prefetchComposer : undefined}
            onClick={startPost}
          >
            <PenLine size={16} strokeWidth={2} />
            Post a question
          </Button>
        </div>
      </section>

      <div className="mt-8 border-t border-divider pt-2">
        {loading ? <PostListSkeleton /> : <PostList posts={posts} />}
      </div>
    </div>
  );
}
