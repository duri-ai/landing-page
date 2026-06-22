import type { ButtonHTMLAttributes } from "react";
import { cn } from "@forum/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-brand text-on-brand border border-brand hover:bg-brand-variant hover:border-brand-variant",
  secondary:
    "bg-background text-on-background border border-divider-strong hover:border-on-background-secondary",
  ghost:
    "bg-transparent text-on-background-secondary border border-transparent hover:text-on-background hover:bg-background-warm",
  danger:
    "bg-background text-danger border border-divider-strong hover:border-danger",
};

const SIZES: Record<Size, string> = {
  sm: "h-8 px-3 text-[0.8rem] gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
};

export function Button({
  variant = "secondary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xs font-medium leading-none",
        "transition-colors duration-150 cursor-pointer",
        "disabled:cursor-not-allowed disabled:opacity-50",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    />
  );
}
