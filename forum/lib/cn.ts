/** Join truthy class names. Tiny, dependency-free ``clsx`` stand-in. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
