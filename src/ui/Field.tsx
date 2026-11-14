import React, { useId } from "react";
import { AlertCircle } from "lucide-react";

export interface FieldProps {
  id?: string;
  label: string;
  labelLang?: "en" | "am";
  hint?: string;
  error?: string;
  required?: boolean;
  rightSlot?: React.ReactNode;
  children?: React.ReactNode;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  inputRef?: React.Ref<HTMLInputElement>;
  as?: "input" | "textarea";
  textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
  textareaRef?: React.Ref<HTMLTextAreaElement>;
}

export function Field({
  id: providedId,
  label,
  labelLang,
  hint,
  error,
  required,
  rightSlot,
  children,
  inputProps,
  inputRef,
  as = "input",
  textareaProps,
  textareaRef,
}: FieldProps) {
  const autoId = useId();
  const fieldId = providedId ?? autoId;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-err` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  const hasError = Boolean(error);

  const baseControlClasses = `w-full rounded-[6px] text-base text-[var(--ink)] px-3.5 mezgeb-transition focus:outline-none ${
    hasError
      ? "border-2 border-[var(--error)] bg-[var(--error-bg)]"
      : "border border-[var(--line-strong)] bg-[var(--paper)] focus:border-2 focus:border-[var(--ink)]"
  }`;

  return (
    <div className="space-y-1.5 w-full text-left">
      <label
        htmlFor={fieldId}
        lang={labelLang}
        className="block text-base font-medium text-[var(--ink)]"
      >
        {label}
        {required === false && (
          <span className="ml-2 text-sm font-normal text-[var(--muted)]">
            {labelLang === "am" ? "(አማራጭ)" : "(optional)"}
          </span>
        )}
      </label>

      {hint && (
        <p id={hintId} className="text-sm text-[var(--muted)] leading-snug">
          {hint}
        </p>
      )}

      {children ? (
        children
      ) : (
        <div className="flex items-start gap-2">
          {as === "textarea" ? (
            <textarea
              ref={textareaRef}
              id={fieldId}
              aria-invalid={hasError || undefined}
              aria-describedby={describedBy}
              className={`${baseControlClasses} py-3 min-h-[104px] flex-1 ${
                textareaProps?.className ?? ""
              }`}
              {...textareaProps}
            />
          ) : (
            <input
              ref={inputRef}
              id={fieldId}
              aria-invalid={hasError || undefined}
              aria-describedby={describedBy}
              className={`${baseControlClasses} min-h-[48px] flex-1 ${
                inputProps?.className ?? ""
              }`}
              {...inputProps}
            />
          )}
          {rightSlot && <div className="shrink-0">{rightSlot}</div>}
        </div>
      )}

      {error && (
        <p
          id={errorId}
          role="alert"
          className="flex items-start gap-1.5 text-sm font-medium text-[var(--error)] pt-0.5"
        >
          <AlertCircle size={16} strokeWidth={1.75} className="shrink-0 mt-0.5" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
