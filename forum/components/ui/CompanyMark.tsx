import { cn } from "@forum/lib/cn";

/**
 * A company's mark: a sharp-cornered tile with the company initial. Used
 * everywhere an author is shown (posts, comments, the header). A real
 * logo is a later feature; the initial stands in for now.
 *
 * Each company gets a deterministic tint from a small, low-chroma palette
 * so a feed of authors stays scannable without turning into a rainbow.
 */
const TINTS: { bg: string; fg: string }[] = [
  { bg: "#e6f1ec", fg: "#00522e" }, // forest
  { bg: "#e7ebf2", fg: "#344661" }, // slate
  { bg: "#f3ecd9", fg: "#7a5b1e" }, // sand
  { bg: "#efe6fb", fg: "#5b2a8c" }, // violet
  { bg: "#def0f0", fg: "#0a5e66" }, // teal
  { bg: "#f5e7e0", fg: "#8a4a32" }, // clay
];

function tintFor(key: string) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) | 0;
  return TINTS[Math.abs(hash) % TINTS.length];
}

function initial(company: string): string {
  const c = company.trim();
  return c ? c[0].toUpperCase() : "?";
}

export function CompanyMark({
  company,
  size = 36,
  shape = "square",
  className,
}: {
  company: string;
  size?: number;
  shape?: "square" | "circle";
  className?: string;
}) {
  const tint = tintFor(company);
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center font-semibold select-none",
        shape === "circle" ? "rounded-full" : "rounded-xs",
        className,
      )}
      style={{
        width: size,
        height: size,
        backgroundColor: tint.bg,
        color: tint.fg,
        fontSize: size * 0.42,
      }}
      aria-hidden
    >
      {initial(company)}
    </span>
  );
}
