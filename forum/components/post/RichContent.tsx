import { useMemo } from "react";
import { sanitizeHtml } from "@forum/lib/sanitize";
import { cn } from "@forum/lib/cn";

/** Renders sanitized post HTML produced by the WYSIWYG editor. */
export function RichContent({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  const clean = useMemo(() => sanitizeHtml(html), [html]);
  return (
    <div
      className={cn("forum-prose", className)}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
