/** Domain models shared across the forum UI and the data layer. */

/**
 * The author of a post or comment, shown as a company: an initial mark
 * plus the company name. (Individual identity / avatars are a later
 * feature; for now a company is all we surface.)
 */
export interface Author {
  id: string;
  company: string;
}

export interface Post {
  id: string;
  author: Author;
  title: string;
  /** Sanitized HTML produced by the WYSIWYG editor. */
  bodyHtml: string;
  createdAt: string;
  /** Private = visible only to the author and the Duri team. */
  isPrivate: boolean;
  commentCount: number;
}

export interface Comment {
  id: string;
  postId: string;
  parentId: string | null;
  author: Author;
  /** Plain text; comments are intentionally lighter than posts. */
  body: string;
  createdAt: string;
}

/** A comment with its replies resolved into a tree for rendering. */
export interface CommentNode extends Comment {
  replies: CommentNode[];
}

export interface NewPostInput {
  title: string;
  bodyHtml: string;
  isPrivate: boolean;
}

export interface NewCommentInput {
  postId: string;
  parentId: string | null;
  body: string;
}
