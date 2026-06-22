import type { Post } from "@forum/data/types";
import { PostCard } from "@forum/components/post/PostCard";

export function PostList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  return (
    <div className="divide-y divide-divider">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
