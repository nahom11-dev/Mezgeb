import React from "react";

export type BadgeVariant = "neutral" | "success" | "warning" | "error" | "accent";

export interface BadgeProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const BADGE_CLASSES: Record<BadgeVariant, string> = {
  neutral: "bg-[var(--stone)] text-[var(--ink)] border-[var(--line)]",
  success: "bg-[var(--mint)] text-[var(--mint-ink)] border-[var(--line)]",
  warning: "bg-[var(--warn-bg)] text-[var(--warn)] border-[var(--line)]",
  error: "bg-[var(--error-bg)] text-[var(--error)] border-[var(--error)]",
  accent: "bg-[var(--lilac)] text-[var(--ink)] border-[var(--line)]",
};

export function Badge({
  children,
  icon,
  variant = "neutral",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] border text-[0.8125rem] font-medium leading-none whitespace-nowrap ${BADGE_CLASSES[variant]} ${className}`}
    >
      <span>{children}</span>
      {icon && (
        <span className="shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}
    </span>
  );
}
