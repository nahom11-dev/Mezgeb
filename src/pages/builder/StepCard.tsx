import React, { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { TemplateQuestion, QuestionType } from "../../templates/types";

const TYPE_LABELS: Record<QuestionType, string> = {
  text: "Short text",
  "work-story": "Long text",
  choice: "Single choice",
  multichoice: "Multiple choice",
  phone: "Phone",
  date: "Date",
  "id-routes": "ID options",
  support: "Support",
  "yes-no": "Yes / No",
  email: "Email",
  number: "Number",
  info: "Info",
  consent: "Consent",
};

export function StepCard({
  question,
  index,
  expanded,
  onToggle,
  onChange,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onDelete,
}: {
  question: TemplateQuestion;
  index: number;
  expanded: boolean;
  onToggle: () => void;
  onChange: (patch: Partial<TemplateQuestion>) => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const typeLabel = TYPE_LABELS[question.type] ?? question.type;
  const needsFix =
    !question.label.en.trim() ||
    (["choice", "multichoice"].includes(question.type) && (question.options?.length ?? 0) < 2);

  return (
    <article className="border border-[var(--console-line)] rounded-xl bg-white overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2.5 bg-[var(--console-paper)] border-b border-[var(--console-line)]">
        <span className="text-[var(--muted)] cursor-grab select-none" aria-hidden="true">
          ⋮⋮
        </span>
        <button
          type="button"
          onClick={onToggle}
          className="flex-1 flex items-center gap-3 text-left min-h-[44px]"
          aria-expanded={expanded}
        >
          <span className="font-mono text-xs text-[var(--muted)] tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-medium text-[var(--ink)] truncate flex-1">
            {question.label.en || question.label.am || "Untitled step"}
          </span>
          <span className="text-[10px] font-mono uppercase text-[var(--accent)] shrink-0">{typeLabel}</span>
          {needsFix && (
            <span className="text-[10px] font-semibold text-[var(--error)] shrink-0" title="Needs a fix">
              !
            </span>
          )}
        </button>
        <div className="relative">
          <button
            type="button"
            aria-label="Step actions"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((p) => !p)}
            className="w-9 h-9 rounded-lg hover:bg-white flex items-center justify-center text-[var(--muted)]"
          >
            <MoreHorizontal size={18} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-40 rounded-lg border border-[var(--line)] bg-white shadow-lg p-1 z-20 text-sm">
              <button type="button" className="w-full text-left px-3 py-2 rounded hover:bg-[var(--stone)]" onClick={() => { onDuplicate(); setMenuOpen(false); }}>
                Duplicate
              </button>
              <button type="button" className="w-full text-left px-3 py-2 rounded hover:bg-[var(--stone)]" onClick={() => { onMoveUp(); setMenuOpen(false); }}>
                Move up
              </button>
              <button type="button" className="w-full text-left px-3 py-2 rounded hover:bg-[var(--stone)]" onClick={() => { onMoveDown(); setMenuOpen(false); }}>
                Move down
              </button>
              <button
                type="button"
                className="w-full text-left px-3 py-2 rounded text-[var(--error)] hover:bg-[var(--stone)]"
                onClick={() => {
                  setMenuOpen(false);
                  setConfirmDelete(true);
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {expanded && (
        <div className="p-4 space-y-4 text-left">
          <label className="block space-y-1">
            <span className="text-xs font-semibold text-[var(--muted)]">Question (English)</span>
            <input
              className="w-full h-10 px-3 rounded-lg border border-[var(--line)] text-sm"
              value={question.label.en}
              onChange={(e) => onChange({ label: { ...question.label, en: e.target.value } })}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-semibold text-[var(--muted)]" lang="am">
              ጥያቄ (አማርኛ)
            </span>
            <input
              className="w-full h-10 px-3 rounded-lg border border-[var(--line)] text-sm"
              lang="am"
              value={question.label.am}
              onChange={(e) => onChange({ label: { ...question.label, am: e.target.value } })}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-semibold text-[var(--muted)]">Helper text (English)</span>
            <textarea
              className="w-full min-h-[72px] px-3 py-2 rounded-lg border border-[var(--line)] text-sm"
              value={question.hint?.en ?? ""}
              onChange={(e) => onChange({ hint: { en: e.target.value, am: question.hint?.am ?? "" } })}
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={question.required}
              onChange={(e) => onChange({ required: e.target.checked })}
            />
            Required
          </label>
          {(question.type === "choice" || question.type === "multichoice") && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-[var(--muted)]">Options (English)</p>
              {(question.options ?? []).map((opt, i) => (
                <input
                  key={opt.value}
                  className="w-full h-9 px-3 rounded border border-[var(--line)] text-sm"
                  value={opt.label.en}
                  onChange={(e) => {
                    const options = [...(question.options ?? [])];
                    options[i] = { ...opt, label: { ...opt.label, en: e.target.value } };
                    onChange({ options });
                  }}
                />
              ))}
            </div>
          )}
          {confirmDelete && (
            <div className="flex items-center gap-2 p-3 rounded-lg border border-[var(--error)] bg-[var(--warn-bg)] text-sm">
              <span>Delete this step?</span>
              <button type="button" className="font-semibold text-[var(--error)]" onClick={() => { onDelete(); setConfirmDelete(false); }}>
                Yes
              </button>
              <button type="button" onClick={() => setConfirmDelete(false)}>
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </article>
  );
}