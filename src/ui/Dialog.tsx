import React, { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidthClass?: string;
  closeLabel?: string;
  primaryAction?: React.ReactNode;
}

export function Dialog({
  open,
  onClose,
  title,
  children,
  maxWidthClass = "max-w-lg",
  closeLabel = "Close",
  primaryAction,
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;

    if (open) {
      returnFocusRef.current = document.activeElement as HTMLElement | null;
      if (!el.open && typeof el.showModal === "function") {
        el.showModal();
      }
      window.setTimeout(() => {
        headingRef.current?.focus();
      }, 10);
    } else if (el.open && typeof el.close === "function") {
      el.close();
      window.setTimeout(() => {
        returnFocusRef.current?.focus();
      }, 10);
    }
  }, [open]);

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) {
          onClose();
        }
      }}
      style={{ boxShadow: "var(--shadow-float)" }}
      className={`mezgeb-dialog m-auto w-[calc(100%-24px)] ${maxWidthClass} max-h-[90vh] rounded-[16px] border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] p-0 overflow-hidden`}
    >
      <div className="flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-[var(--line)] flex items-center justify-between gap-4">
          <h2
            id={titleId}
            ref={headingRef}
            tabIndex={-1}
            className="text-lg font-semibold text-[var(--ink)] outline-none"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="min-w-[44px] min-h-[44px] rounded-[10px] border border-[var(--line-strong)] bg-[var(--paper)] text-[var(--ink)] hover:bg-[var(--stone)] inline-flex items-center justify-center cursor-pointer shrink-0"
          >
            <X size={20} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 text-left">{children}</div>

        {primaryAction && (
          <div className="px-6 py-4 border-t border-[var(--line)] flex items-center justify-end gap-3 bg-[var(--paper)]">
            {primaryAction}
          </div>
        )}
      </div>
    </dialog>
  );
}
