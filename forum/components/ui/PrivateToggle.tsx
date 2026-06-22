import { Lock } from "lucide-react";
import { cn } from "@forum/lib/cn";

/**
 * Compact private switch for the composers. When on, the item will be
 * visible only to its author and the Duri team.
 */
export function PrivateToggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={cn(
        "group inline-flex items-center gap-2 rounded-xs px-2 py-1.5 text-xs font-medium transition-colors duration-150 cursor-pointer",
        value ? "text-on-background" : "text-on-background-secondary hover:text-on-background",
      )}
      title="Only your organization and the Duri team can see private posts"
    >
      <span
        className={cn(
          "relative h-4 w-7 rounded-full transition-colors duration-150",
          value ? "bg-on-background" : "bg-divider-strong",
        )}
        aria-hidden
      >
        <span
          className={cn(
            "absolute top-0.5 h-3 w-3 rounded-full bg-background transition-[left] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]",
            value ? "left-3.5" : "left-0.5",
          )}
        />
      </span>
      <span className="inline-flex items-center gap-1">
        <Lock size={12} strokeWidth={2.25} />
        Private
      </span>
    </button>
  );
}
