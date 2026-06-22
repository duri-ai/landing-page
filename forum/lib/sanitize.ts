import DOMPurify from "dompurify";
import type { Config } from "dompurify";

/**
 * Allowlist that matches what the TipTap editor can produce. Even though
 * the editor schema already constrains output, post bodies are
 * user-generated, so everything is sanitized again before it is rendered
 * with ``dangerouslySetInnerHTML``.
 */
const CONFIG: Config = {
  ALLOWED_TAGS: [
    "p",
    "br",
    "strong",
    "em",
    "s",
    "code",
    "pre",
    "blockquote",
    "h1",
    "h2",
    "h3",
    "ul",
    "ol",
    "li",
    "a",
    "hr",
  ],
  ALLOWED_ATTR: ["href", "target", "rel"],
  ALLOW_DATA_ATTR: false,
};

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, CONFIG) as string;
}

/** Rough emptiness check so we never publish a blank editor document. */
export function isHtmlEmpty(html: string): boolean {
  const text = html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
  return text.length === 0;
}
