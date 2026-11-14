/**
 * Small, shared building blocks for the template tools:
 * the gallery (/templates), the builder (/templates/builder) and the playground.
 * They keep these three pages visually consistent without touching the rest of the site.
 */
import React, { useId, useRef } from "react";
import { Lang } from "../../i18n";
import { BLANK_QUESTION_TYPES } from "../../templates/library";
import { MezgebTemplate, QuestionType, TemplateQuestion } from "../../templates/types";
import { QuestionIcon } from "../../ui/QuestionIcon";

/* ───────────────────────── helpers ───────────────────────── */

export function questionTypeName(type: QuestionType, lang: Lang): string {
  return BLANK_QUESTION_TYPES.find((d) => d.type === type)?.name[lang] ?? type;
}

/** Rough completion time: ~20 seconds per answer, rounded up to whole minutes. */
export function estimateMinutes(tpl: MezgebTemplate): number {
  const inputs = tpl.questions.filter((q) => q.type !== "info").length;
  return Math.max(1, Math.ceil((inputs * 20) / 60));
}

export function questionLabel(q: TemplateQuestion, lang: Lang): string {
  return q.label[lang]?.trim() || q.label.en?.trim() || q.label.am?.trim() || q.id;
}

/* ───────────────────────── Segmented control ───────────────────────── */

export interface SegmentOption<T extends string> {
  value: T;
  label: React.ReactNode;
  /** Accessible name when label is not plain text */
  ariaLabel?: string;
  lang?: Lang;
}

/**
 * A single-choice control drawn as a row of segments.
 * Semantics: radiogroup with roving tabindex and arrow-key movement.
 */
export function Segmented<T extends string>({
  label,
  hideLabel = false,
  value,
  options,
  onChange,
  size = "md",
  fullWidth = false,
}: {
  label: string;
  hideLabel?: boolean;
  value: T;
  options: SegmentOption<T>[];
  onChange: (v: T) => void;
  size?: "sm" | "md";
  fullWidth?: boolean;
}) {
  const labelId = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const idx = Math.max(
    0,
    options.findIndex((o) => o.value === value)
  );

  const move = (e: React.KeyboardEvent, i: number) => {
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % options.length;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp")
      next = (i - 1 + options.length) % options.length;
    if (next === null) return;
    e.preventDefault();
    onChange(options[next].value);
    refs.current[next]?.focus();
  };

  return (
    <div className={fullWidth ? "w-full" : "inline-flex flex-col"}>
      <span
        id={labelId}
        className={hideLabel ? "sr-only" : "block text-[13px] font-medium text-[var(--muted)] mb-1.5"}
      >
        {label}
      </span>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        className={`${fullWidth ? "flex w-full" : "inline-flex"} items-stretch rounded-[10px] bg-[var(--stone)] border border-[var(--line)] p-[3px] gap-[2px]`}
      >
        {options.map((o, i) => {
          const on = i === idx;
          return (
            <button
              key={o.value}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={on}
              aria-label={o.ariaLabel}
              lang={o.lang}
              tabIndex={on ? 0 : -1}
              onClick={() => onChange(o.value)}
              onKeyDown={(e) => move(e, i)}
              className={`mezgeb-transition ${fullWidth ? "flex-1" : ""} inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-[8px] cursor-pointer ${
                size === "sm" ? "min-h-[32px] px-2.5 text-[13px]" : "min-h-[38px] px-3.5 text-sm"
              } ${
                on
                  ? "bg-[var(--paper)] text-[var(--ink)] font-semibold shadow-[0_1px_2px_rgba(17,17,17,0.08)] border border-[var(--line)]"
                  : "text-[var(--muted)] font-medium hover:text-[var(--ink)] border border-transparent"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ───────────────────────── Switch row ───────────────────────── */

export function SwitchRow({
  id,
  label,
  description,
  checked,
  onChange,
  disabled,
  compact = false,
}: {
  id?: string;
  label: string;
  description?: React.ReactNode;
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  compact?: boolean;
}) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const descId = description ? `${inputId}-desc` : undefined;
  return (
    <div className={`flex items-start justify-between gap-4 ${compact ? "py-2" : "py-3"}`}>
      <div className="min-w-0">
        <label
          htmlFor={inputId}
          className={`block font-medium text-[var(--ink)] cursor-pointer ${compact ? "text-sm" : "text-[15px]"}`}
        >
          {label}
        </label>
        {description && (
          <p id={descId} className="text-[13px] leading-snug text-[var(--muted)] mt-0.5">
            {description}
          </p>
        )}
      </div>
      <input
        id={inputId}
        type="checkbox"
        role="switch"
        aria-describedby={descId}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="mz-switch mt-0.5"
      />
    </div>
  );
}

/* ───────────────────────── Template mark ───────────────────────── */

/** The template's own logo letter on its own accent colour: the quickest way to tell templates apart. */
export function TemplateMark({
  tpl,
  size = 40,
}: {
  tpl: MezgebTemplate;
  size?: number;
}) {
  const accent = tpl.theme?.accent ?? "var(--accent)";
  const letter = (tpl.theme?.logoLetter || tpl.name.en?.[0] || "M").slice(0, 2);
  return (
    <span
      aria-hidden="true"
      style={{ backgroundColor: accent, width: size, height: size, fontSize: size * 0.42 }}
      className="inline-flex items-center justify-center rounded-[10px] text-white font-semibold shrink-0 select-none"
    >
      {letter}
    </span>
  );
}

/* ───────────────────────── Flow outline ───────────────────────── */

/**
 * The template's questions as an ordered list — the real shape of the sign-up.
 * Numbers are meaningful here: this is the order a learner sees.
 */
export function FlowOutline({
  tpl,
  lang,
  max,
  activeId,
  onSelect,
  moreLabel,
  optionalLabel,
  dense = false,
}: {
  tpl: MezgebTemplate;
  lang: Lang;
  max?: number;
  activeId?: string | null;
  onSelect?: (id: string) => void;
  moreLabel?: (n: number) => string;
  optionalLabel?: string;
  dense?: boolean;
}) {
  const accent = tpl.theme?.accent ?? "var(--accent)";
  const shown = typeof max === "number" ? tpl.questions.slice(0, max) : tpl.questions;
  const hidden = tpl.questions.length - shown.length;

  return (
    <ol className="relative">
      {shown.map((q, i) => {
        const active = activeId === q.id;
        const body = (
          <>
            <span
              className="w-6 text-right text-[12px] tabular-nums text-[var(--muted)] shrink-0"
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <span
              className="w-7 h-7 rounded-[8px] inline-flex items-center justify-center shrink-0 border"
              style={{
                backgroundColor: active ? accent : "var(--paper)",
                borderColor: active ? accent : "var(--line)",
                color: active ? "#fff" : "var(--ink-2)",
              }}
            >
              <QuestionIcon name={q.icon} size={15} />
            </span>
            <span
              lang={lang}
              className={`flex-1 min-w-0 truncate text-left ${dense ? "text-[13px]" : "text-sm"} ${
                active ? "font-semibold text-[var(--ink)]" : "text-[var(--ink-2)]"
              }`}
            >
              {questionLabel(q, lang)}
            </span>
            {!q.required && optionalLabel && (
              <span className="text-[12px] text-[var(--muted)] shrink-0">{optionalLabel}</span>
            )}
          </>
        );
        return (
          <li key={q.id}>
            {onSelect ? (
              <button
                type="button"
                aria-current={active ? "step" : undefined}
                onClick={() => onSelect(q.id)}
                className={`mezgeb-transition w-full flex items-center gap-2.5 rounded-[8px] px-1.5 ${
                  dense ? "min-h-[36px]" : "min-h-[40px]"
                } cursor-pointer ${active ? "bg-[var(--stone)]" : "hover:bg-[var(--stone)]"}`}
              >
                {body}
              </button>
            ) : (
              <div className={`flex items-center gap-2.5 px-1.5 ${dense ? "min-h-[34px]" : "min-h-[38px]"}`}>
                {body}
              </div>
            )}
          </li>
        );
      })}
      {hidden > 0 && moreLabel && (
        <li className="flex items-center gap-2.5 px-1.5 min-h-[30px]">
          <span className="w-6 shrink-0" aria-hidden="true" />
          <span className="text-[13px] text-[var(--muted)] pl-[38px]">{moreLabel(hidden)}</span>
        </li>
      )}
    </ol>
  );
}

/* ───────────────────────── Phone frame ───────────────────────── */

export function PhoneFrame({
  children,
  width = 390,
  className = "",
}: {
  children: React.ReactNode;
  width?: number;
  className?: string;
}) {
  return (
    <div className={`mz-phone w-full mx-auto ${className}`} style={{ maxWidth: width + 22 }}>
      <div className="mz-phone-screen">{children}</div>
    </div>
  );
}

/* ───────────────────────── Fact list ───────────────────────── */

/** Key facts as a definition list (value large, label small) instead of a dotted meta string. */
export function FactList({
  facts,
  className = "",
}: {
  facts: { label: string; value: React.ReactNode }[];
  className?: string;
}) {
  return (
    <dl className={`flex flex-wrap gap-x-5 gap-y-2 ${className}`}>
      {facts.map((f) => (
        <div key={f.label} className="flex flex-col-reverse">
          <dt className="text-[12px] text-[var(--muted)] leading-tight">{f.label}</dt>
          <dd className="text-[15px] font-semibold text-[var(--ink)] tabular-nums leading-tight">
            {f.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* ───────────────────────── Menu button ───────────────────────── */

export const menuItemClass =
  "w-full text-left px-3 min-h-[38px] rounded-[6px] text-sm text-[var(--ink)] hover:bg-[var(--stone)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer";
export const menuItemDangerClass =
  "w-full text-left px-3 min-h-[38px] rounded-[6px] text-sm text-[var(--error)] hover:bg-[var(--error-bg)] cursor-pointer";
export const menuSurfaceClass =
  "absolute right-0 top-full mt-1 z-40 min-w-[200px] rounded-[12px] border border-[var(--line)] bg-[var(--paper)] p-1.5 space-y-0.5 text-left shadow-[var(--shadow-float)]";

export const iconButtonClass =
  "mezgeb-transition w-10 h-10 rounded-[10px] border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] hover:bg-[var(--stone)] disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center cursor-pointer shrink-0";

export const selectClass =
  "w-full min-h-[44px] px-3 rounded-[10px] border border-[var(--line-strong)] bg-[var(--paper)] text-[15px] text-[var(--ink)] cursor-pointer";

export const inputClass =
  "w-full min-h-[44px] px-3 rounded-[10px] border border-[var(--line-strong)] bg-[var(--paper)] text-[15px] text-[var(--ink)]";
