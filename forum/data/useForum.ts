import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@forum/auth/AuthContext";
import {
  createComment as apiCreateComment,
  createPost as apiCreatePost,
  fetchComments,
  fetchPost,
  fetchPosts,
  notifyNewComment,
} from "@forum/data/api";
import { buildCommentTree } from "@forum/data/commentTree";
import type {
  CommentNode,
  NewCommentInput,
  NewPostInput,
  Post,
} from "@forum/data/types";

function reportError(e: unknown): void {
  // Never surface raw backend/Postgres error text to the UI (it can leak
  // schema and infra details). Keep the detail in the dev console only.
  if (import.meta.env.DEV) console.error("[forum]", e);
}

interface Async<T> {
  data: T;
  loading: boolean;
  error: boolean;
  reload: () => void;
}

/** All questions, newest first. Refetches when the signed-in user changes. */
export function usePosts(): Async<Post[]> {
  const { currentUser } = useAuth();
  const viewerId = currentUser?.id ?? null;
  const [data, setData] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      setData(await fetchPosts());
    } catch (e) {
      reportError(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    // viewerId is a dependency so private posts appear right after sign-in.
  }, [load, viewerId]);

  return { data, loading, error, reload: load };
}

export function usePost(postId: string | undefined): Async<Post | null> {
  const { currentUser } = useAuth();
  const viewerId = currentUser?.id ?? null;
  const [data, setData] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    if (!postId) {
      setData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(false);
    try {
      setData(await fetchPost(postId));
    } catch (e) {
      reportError(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    void load();
  }, [load, viewerId]);

  return { data, loading, error, reload: load };
}

export function useComments(postId: string | undefined): {
  tree: CommentNode[];
  count: number;
  loading: boolean;
  error: boolean;
  reload: () => void;
} {
  const [tree, setTree] = useState<CommentNode[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    if (!postId) {
      setTree([]);
      setCount(0);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(false);
    try {
      const comments = await fetchComments(postId);
      setCount(comments.length);
      setTree(buildCommentTree(comments));
    } catch (e) {
      reportError(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    void load();
  }, [load]);

  return { tree, count, loading, error, reload: load };
}

/** Write actions, bound to the signed-in author. Null/no-op when signed out. */
export function useForumActions() {
  const { currentUser } = useAuth();

  return useMemo(
    () => ({
      isSignedIn: currentUser !== null,
      async createPost(input: NewPostInput): Promise<string | null> {
        if (!currentUser) return null;
        return apiCreatePost(input, currentUser);
      },
      async createComment(input: NewCommentInput): Promise<string | null> {
        if (!currentUser) return null;
        const id = await apiCreateComment(input, currentUser);
        // Fire-and-forget the notification email; never block the user.
        void notifyNewComment(id);
        return id;
      },
    }),
    [currentUser],
  );
}
