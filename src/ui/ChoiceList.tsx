import React from "react";
import { Check } from "lucide-react";

export interface ChoiceOption {
  value: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  lang?: "en" | "am";
}

export interface ChoiceListProps {
  name: string;
  legend: string;
  options: ChoiceOption[];
  mode: "single" | "multi";
  value: string | string[];
  onChange: (next: string | string[]) => void;
  disabled?: boolean;
  hideLegend?: boolean;
}

export function ChoiceList({
  name,
  legend,
  options,
  mode,
  value,
  onChange,
  disabled = false,
  hideLegend = true,
}: ChoiceListProps) {
  const isSelected = (val: string) =>
    mode === "single"
      ? value === val
      : Array.isArray(value) && value.includes(val);

  const toggle = (val: string) => {
    if (disabled) return;
    if (mode === "single") {
      onChange(val);
    } else {
      const current = Array.isArray(value) ? value : [];
      const exists = current.includes(val);
      onChange(exists ? current.filter((v) => v !== val) : [...current, val]);
    }
  };

  return (
    <fieldset className="w-full border-0 p-0 m-0">
      <legend className={hideLegend ? "sr-only" : "text-base font-medium text-[var(--ink)] mb-3"}>
        {legend}
      </legend>
      <div className="grid grid-cols-1 gap-2.5">
        {options.map((opt) => {
          const selected = isSelected(opt.value);
          return (
            <label
              key={opt.value}
              lang={opt.lang}
              className={`mezgeb-transition flex items-center justify-between gap-3 min-h-[56px] px-4 py-3 rounded-[10px] cursor-pointer text-left ${
                selected
                  ? "border-2 border-[var(--accent)] bg-[var(--lilac)] text-[var(--ink)]"
                  : "border border-[var(--line-strong)] bg-[var(--paper)] text-[var(--ink)] hover:bg-[var(--stone)]"
              } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <input
                type={mode === "single" ? "radio" : "checkbox"}
                name={name}
                value={opt.value}
                checked={selected}
                disabled={disabled}
                onChange={() => toggle(opt.value)}
                className="sr-only"
              />
              <div className="flex items-start gap-3 min-w-0 flex-1">
                {opt.icon && (
                  <span className="shrink-0 mt-0.5 text-[var(--ink)]" aria-hidden="true">
                    {opt.icon}
                  </span>
                )}
                <div className="min-w-0 space-y-0.5">
                  <span className="block text-base font-medium text-[var(--ink)] leading-snug">
                    {opt.title}
                  </span>
                  {opt.description && (
                    <span className="block text-sm text-[var(--muted)] leading-snug">
                      {opt.description}
                    </span>
                  )}
                </div>
              </div>
              <span
                aria-hidden="true"
                className={`w-6 h-6 rounded-[6px] flex items-center justify-center shrink-0 ${
                  selected
                    ? "bg-[var(--accent)] text-[var(--paper)]"
                    : "border border-[var(--line-strong)] bg-[var(--paper)]"
                }`}
              >
                {selected && <Check size={16} strokeWidth={2} />}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
