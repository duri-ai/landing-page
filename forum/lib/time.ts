/** Compact, forum-style relative timestamps (``just now``, ``3h``, ``2d``). */

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const YEAR = 365 * DAY;

export function relativeTime(iso: string, now: Date = new Date()): string {
  const then = new Date(iso).getTime();
  const seconds = Math.max(0, Math.round((now.getTime() - then) / 1000));

  if (seconds < 45) return "just now";
  if (seconds < HOUR) return `${Math.round(seconds / MINUTE)}m`;
  if (seconds < DAY) return `${Math.round(seconds / HOUR)}h`;
  if (seconds < WEEK) return `${Math.round(seconds / DAY)}d`;
  if (seconds < YEAR) return `${Math.round(seconds / WEEK)}w`;
  return `${Math.round(seconds / YEAR)}y`;
}

/** Full timestamp for the ``title`` tooltip. */
export function absoluteTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
