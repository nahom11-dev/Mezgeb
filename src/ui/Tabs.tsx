import React, { useRef } from "react";

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
}

export interface TabsProps {
  ariaLabel: string;
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  idPrefix?: string;
}

export function Tabs({
  ariaLabel,
  tabs,
  activeId,
  onChange,
  idPrefix = "mezgeb-tab",
}: TabsProps) {
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    let nextIdx: number | null = null;
    if (e.key === "ArrowRight") nextIdx = (idx + 1) % tabs.length;
    else if (e.key === "ArrowLeft") nextIdx = (idx - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") nextIdx = 0;
    else if (e.key === "End") nextIdx = tabs.length - 1;

    if (nextIdx !== null) {
      e.preventDefault();
      const nextTab = tabs[nextIdx];
      onChange(nextTab.id);
      btnRefs.current[nextIdx]?.focus();
    }
  };

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="flex items-center gap-1 border-b border-[var(--line)] overflow-x-auto"
    >
      {tabs.map((tab, idx) => {
        const active = tab.id === activeId;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              btnRefs.current[idx] = el;
            }}
            id={`${idPrefix}-${tab.id}`}
            role="tab"
            type="button"
            aria-selected={active}
            aria-controls={`${idPrefix}-panel-${tab.id}`}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={`mezgeb-transition min-h-[44px] px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 inline-flex items-center gap-2 cursor-pointer ${
              active
                ? "border-[var(--ink)] text-[var(--ink)] font-semibold"
                : "border-transparent text-[var(--muted)] hover:text-[var(--ink)]"
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="px-1.5 py-0.5 rounded-[6px] bg-[var(--stone)] border border-[var(--line)] text-xs font-medium text-[var(--ink)]">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
