import React from "react";

export interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`p-8 rounded-[10px] border border-[var(--line)] bg-[var(--paper)] space-y-3 text-left ${className}`}
    >
      <p className="text-lg font-semibold text-[var(--ink)]">{title}</p>
      <p className="text-base text-[var(--muted)] max-w-[60ch] leading-relaxed">{description}</p>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
