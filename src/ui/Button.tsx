import React from "react";
import { Loader2 } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "quiet" | "danger";
export type ButtonSize = "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingLabel?: string;
  disabledReason?: string;
  fullWidth?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--ink)] text-[var(--paper)] border border-[var(--ink)] rounded-[10px] hover:opacity-90",
  secondary:
    "bg-[var(--paper)] text-[var(--ink)] border border-[var(--ink)] rounded-[10px] hover:bg-[var(--stone)]",
  quiet:
    "bg-transparent text-[var(--ink)] border border-transparent rounded-[6px] hover:underline underline-offset-4 px-2",
  danger:
    "bg-[var(--error)] text-[var(--paper)] border border-[var(--error)] rounded-[10px] hover:opacity-90",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: "min-h-[40px] px-4 text-[0.9375rem]",
  lg: "min-h-[48px] px-5 text-base",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    loading = false,
    loadingLabel = "Saving…",
    disabledReason,
    fullWidth = false,
    disabled,
    className = "",
    children,
    type = "button",
    ...rest
  },
  ref
) {
  const isDisabled = Boolean(disabled || loading);
  const showReason = Boolean(disabledReason && disabled && !loading);

  const btn = (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={`mezgeb-transition inline-grid place-items-center font-medium whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...rest}
    >
      <span
        className={`col-start-1 row-start-1 inline-flex items-center justify-center gap-2 ${
          loading ? "invisible" : ""
        }`}
      >
        {children}
      </span>
      {loading && (
        <span className="col-start-1 row-start-1 inline-flex items-center justify-center gap-2">
          <Loader2 size={18} strokeWidth={1.75} className="animate-spin" aria-hidden="true" />
          <span>{loadingLabel}</span>
        </span>
      )}
    </button>
  );

  if (!showReason) return btn;

  return (
    <div className={fullWidth ? "w-full space-y-1.5" : "inline-flex flex-col gap-1.5"}>
      {btn}
      <p className="text-[0.8125rem] text-[var(--muted)] leading-snug">{disabledReason}</p>
    </div>
  );
});
