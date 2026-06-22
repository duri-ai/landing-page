import { supabase } from "@shared/client";
import type {
  Author,
  Comment,
  NewCommentInput,
  NewPostInput,
  Post,
} from "@forum/data/types";

const POST_COLUMNS =
  "id, author_id, author_company, title, body_html, is_private, created_at";
const COMMENT_COLUMNS =
  "id, post_id, parent_id, author_id, author_company, body, created_at";

interface PostRow {
  id: string;
  author_id: string;
  author_company: string;
  title: string;
  body_html: string;
  is_private: boolean;
  created_at: string;
  forum_comments?: { count: number }[];
}

interface CommentRow {
  id: string;
  post_id: string;
  parent_id: string | null;
  author_id: string;
  author_company: string;
  body: string;
  created_at: string;
}

function rowToPost(row: PostRow): Post {
  return {
    id: row.id,
    author: { id: row.author_id, company: row.author_company },
    title: row.title,
    bodyHtml: row.body_html,
    isPrivate: row.is_private,
    createdAt: row.created_at,
    commentCount: row.forum_comments?.[0]?.count ?? 0,
  };
}

function rowToComment(row: CommentRow): Comment {
  return {
    id: row.id,
    postId: row.post_id,
    parentId: row.parent_id,
    author: { id: row.author_id, company: row.author_company },
    body: row.body,
    createdAt: row.created_at,
  };
}

/** All questions visible to the viewer, newest first (with comment counts). */
export async function fetchPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from("forum_posts")
    .select(`${POST_COLUMNS}, forum_comments(count)`)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as PostRow[]).map(rowToPost);
}

export async function fetchPost(id: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from("forum_posts")
    .select(`${POST_COLUMNS}, forum_comments(count)`)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? rowToPost(data as PostRow) : null;
}

export async function createPost(
  input: NewPostInput,
  author: Author,
): Promise<string> {
  const { data, error } = await supabase
    .from("forum_posts")
    .insert({
      author_id: author.id,
      author_company: author.company,
      title: input.title,
      body_html: input.bodyHtml,
      is_private: input.isPrivate,
    })
    .select("id")
    .single();
  if (error) throw error;
  return (data as { id: string }).id;
}

export async function fetchComments(postId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from("forum_comments")
    .select(COMMENT_COLUMNS)
    .eq("post_id", postId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data as CommentRow[]).map(rowToComment);
}

export async function createComment(
  input: NewCommentInput,
  author: Author,
): Promise<string> {
  const { data, error } = await supabase
    .from("forum_comments")
    .insert({
      post_id: input.postId,
      parent_id: input.parentId,
      author_id: author.id,
      author_company: author.company,
      body: input.body,
    })
    .select("id")
    .single();
  if (error) throw error;
  return (data as { id: string }).id;
}

const BACKEND_URL = (
  (import.meta.env.VITE_BACKEND_URL as string | undefined) ?? ""
).replace(/\/+$/, "");

/**
 * Ask the backend to email the post / parent-comment author about a new
 * comment. Best-effort and fire-and-forget: the backend is the source of
 * truth (it dedupes and skips self-notifications), so failures here never
 * block the user.
 */
export async function notifyNewComment(commentId: string): Promise<void> {
  if (!BACKEND_URL) return;
  try {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) return;
    await fetch(`${BACKEND_URL}/forum/notify-comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ comment_id: commentId }),
      keepalive: true,
    });
  } catch {
    // Notifications are non-critical; ignore transport errors.
  }
}
