import React from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";

export type BannerVariant = "info" | "success" | "warning" | "error";

export interface BannerProps {
  variant: BannerVariant;
  children: React.ReactNode;
  action?: React.ReactNode;
  role?: "status" | "alert";
  className?: string;
}

const BANNER_STYLES: Record<
  BannerVariant,
  { container: string; icon: React.ReactNode }
> = {
  info: {
    container: "bg-[var(--sand)] border-[var(--line)] text-[var(--ink)]",
    icon: <Info size={20} strokeWidth={1.75} className="text-[var(--ink)] shrink-0" aria-hidden="true" />,
  },
  success: {
    container: "bg-[var(--mint)] border-[var(--line)] text-[var(--mint-ink)]",
    icon: (
      <CheckCircle2
        size={20}
        strokeWidth={1.75}
        className="text-[var(--mint-ink)] shrink-0"
        aria-hidden="true"
      />
    ),
  },
  warning: {
    container: "bg-[var(--warn-bg)] border-[var(--line)] text-[var(--warn)]",
    icon: (
      <AlertTriangle
        size={20}
        strokeWidth={1.75}
        className="text-[var(--warn)] shrink-0"
        aria-hidden="true"
      />
    ),
  },
  error: {
    container: "bg-[var(--error-bg)] border-[var(--error)] text-[var(--error)]",
    icon: (
      <AlertCircle
        size={20}
        strokeWidth={1.75}
        className="text-[var(--error)] shrink-0"
        aria-hidden="true"
      />
    ),
  },
};

export function Banner({
  variant,
  children,
  action,
  role,
  className = "",
}: BannerProps) {
  const style = BANNER_STYLES[variant];
  const resolvedRole = role ?? (variant === "error" ? "alert" : "status");

  return (
    <div
      role={resolvedRole}
      className={`p-3.5 rounded-[10px] border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm font-medium ${style.container} ${className}`}
    >
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 shrink-0">{style.icon}</span>
        <div className="leading-snug">{children}</div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
