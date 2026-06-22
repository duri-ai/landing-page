import type { Comment, CommentNode } from "@forum/data/types";

/** Build the nested reply tree from a flat, chronological comment list. */
export function buildCommentTree(flat: Comment[]): CommentNode[] {
  const nodes = new Map<string, CommentNode>();
  for (const comment of flat) nodes.set(comment.id, { ...comment, replies: [] });

  const roots: CommentNode[] = [];
  for (const node of nodes.values()) {
    const parent = node.parentId ? nodes.get(node.parentId) : null;
    if (parent) parent.replies.push(node);
    else roots.push(node);
  }

  const oldestFirst = (a: CommentNode, b: CommentNode) =>
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  const sortTree = (list: CommentNode[]) => {
    list.sort(oldestFirst);
    for (const n of list) sortTree(n.replies);
  };
  sortTree(roots);

  return roots;
}
