import React from "react";

export interface ProgressProps {
  current: number;
  total: number;
  label: string;
}

export function Progress({ current, total, label }: ProgressProps) {
  const safeTotal = Math.max(1, total);
  const safeCurrent = Math.min(Math.max(1, current), safeTotal);
  const widthPct = Math.round((safeCurrent / safeTotal) * 100);

  return (
    <div className="space-y-2 w-full">
      <p className="text-sm font-medium text-[var(--muted)]">{label}</p>
      <div
        role="progressbar"
        aria-valuenow={safeCurrent}
        aria-valuemin={1}
        aria-valuemax={safeTotal}
        aria-label={label}
        className="w-full h-1 bg-[var(--line)] rounded-full overflow-hidden"
      >
        <div
          className="h-full bg-[var(--widget-accent)] mezgeb-panel-transition"
          style={{ width: `${widthPct}%` }}
        />
      </div>
    </div>
  );
}
