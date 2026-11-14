import React, { useEffect } from "react";
import { X } from "lucide-react";

export interface ToastProps {
  open: boolean;
  message: string;
  onDismiss: () => void;
  action?: { label: string; onClick: () => void };
  dismissLabel?: string;
}

export function Toast({
  open,
  message,
  onDismiss,
  action,
  dismissLabel = "Dismiss",
}: ToastProps) {
  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(onDismiss, 6000);
    return () => window.clearTimeout(timer);
  }, [open, message, onDismiss]);

  if (!open) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{ boxShadow: "var(--shadow-float)" }}
      className="fixed bottom-4 left-4 z-50 max-w-[calc(100vw-32px)] sm:max-w-md bg-[var(--ink)] text-[var(--paper)] px-4 py-3 rounded-[10px] flex items-center gap-3 text-sm"
    >
      <span className="flex-1 leading-snug">{message}</span>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="font-semibold underline underline-offset-4 min-h-[36px] px-1 text-[var(--paper)] cursor-pointer shrink-0"
        >
          {action.label}
        </button>
      )}
      <button
        type="button"
        onClick={onDismiss}
        aria-label={dismissLabel}
        className="min-w-[36px] min-h-[36px] rounded-[6px] inline-flex items-center justify-center text-[var(--paper)] hover:opacity-80 cursor-pointer shrink-0"
      >
        <X size={16} strokeWidth={1.75} aria-hidden="true" />
      </button>
    </div>
  );
}
