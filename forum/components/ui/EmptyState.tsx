import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xs border border-dashed border-divider-strong bg-background px-6 py-14 text-center">
      {icon && (
        <div className="mb-3 text-on-background-secondary-variant" aria-hidden>
          {icon}
        </div>
      )}
      <p className="text-sm font-medium text-on-background">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-on-background-secondary">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
