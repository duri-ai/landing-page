import { Lock } from "lucide-react";
import { cn } from "@forum/lib/cn";

/**
 * Marks a post as private: visible only to the author's organization and
 * the Duri team. Deliberately neutral (gray), not an alarm color.
 */
export function PrivateChip({
  size = "sm",
  className,
}: {
  size?: "sm" | "xs";
  className?: string;
}) {
  return (
    <span
      title="Private: only your organization and the Duri team can see this"
      className={cn(
        "inline-flex items-center gap-1 rounded-xs bg-on-background-secondary font-medium text-on-brand leading-none",
        size === "xs" ? "px-1.5 py-0.5 text-[0.65rem]" : "px-2 py-1 text-[0.7rem]",
        className,
      )}
    >
      <Lock size={size === "xs" ? 10 : 12} strokeWidth={2.5} />
      Private
    </span>
  );
}
