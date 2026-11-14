import React, { useEffect, useRef } from "react";
import { CloseIcon } from "./Icons";
import { useI18n } from "../i18n";

interface AccessibleDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  maxWidthClass?: string;
  children: React.ReactNode;
}

export function AccessibleDialog({
  open,
  onClose,
  title,
  maxWidthClass = "max-w-xl",
  children,
}: AccessibleDialogProps) {
  const { t } = useI18n();
  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const titleId = React.useId();

  useEffect(() => {
    if (!open) return;
    openerRef.current = document.activeElement as HTMLElement | null;

    const dialogEl = dialogRef.current;
    if (!dialogEl) return;

    const focusableSelector =
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const focusFirst = () => {
      const focusables = dialogEl.querySelectorAll<HTMLElement>(focusableSelector);
      if (focusables.length > 0) {
        focusables[0].focus();
      } else {
        dialogEl.focus();
      }
    };

    const timer = window.setTimeout(focusFirst, 10);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const focusables = Array.from(dialogEl.querySelectorAll<HTMLElement>(focusableSelector)).filter(
          (el) => el.offsetParent !== null
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
      if (openerRef.current && typeof openerRef.current.focus === "function") {
        openerRef.current.focus();
      }
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`w-full ${maxWidthClass} rounded-[16px] bg-white border border-[#E7E7E4] shadow-2xl p-6 max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E7E7E4]">
          <h2 id={titleId} className="text-xl font-semibold text-[#111111] tracking-tight">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("closeButton")}
            className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-lg border border-[#E7E7E4] text-[#111111] hover:bg-[#F5F5F3]"
          >
            <CloseIcon size={18} />
          </button>
        </div>
        <div className="pt-5">{children}</div>
      </div>
    </div>
  );
}
