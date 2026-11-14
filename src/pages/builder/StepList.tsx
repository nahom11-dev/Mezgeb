import React, { useState } from "react";
import { Plus } from "lucide-react";
import { QuestionType, TemplateQuestion } from "../../templates/types";
import { StepCard } from "./StepCard";

const ADD_TYPES: { type: QuestionType; label: string }[] = [
  { type: "text", label: "Short text" },
  { type: "work-story", label: "Long text" },
  { type: "choice", label: "Single choice" },
  { type: "multichoice", label: "Multiple choice" },
];

export function StepList({
  questions,
  onUpdate,
  onAdd,
  onDuplicate,
  onMove,
  onDelete,
  onRestore,
}: {
  questions: TemplateQuestion[];
  onUpdate: (id: string, patch: Partial<TemplateQuestion>) => void;
  onAdd: (type: QuestionType) => void;
  onDuplicate: (id: string) => void;
  onMove: (id: string, dir: -1 | 1) => void;
  onDelete: (id: string) => void;
  onRestore: () => void;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [addOpen, setAddOpen] = useState(false);
  const [collapseAll, setCollapseAll] = useState(false);

  const toggle = (id: string) => {
    setExpanded((p) => ({ ...p, [id]: !p[id] }));
    setCollapseAll(false);
  };

  const setAll = (open: boolean) => {
    const next: Record<string, boolean> = {};
    for (const q of questions) next[q.id] = open;
    setExpanded(next);
    setCollapseAll(!open);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--ink)]">Steps</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--lilac)] text-[var(--accent)]">
            {questions.length}
          </span>
        </div>
        <button type="button" className="text-xs font-medium text-[var(--accent)] hover:underline" onClick={() => setAll(collapseAll)}>
          {collapseAll ? "Expand all" : "Collapse all"}
        </button>
      </div>

      {questions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--line-strong)] p-8 text-center space-y-3">
          <p className="font-semibold text-[var(--ink)]">No steps yet</p>
          <p className="text-sm text-[var(--muted)]">Add your first step or restore a starter set from the learning template.</p>
          <motionButtons onRestore={onRestore} onAdd={() => onAdd("text")} />
        </div>
      ) : (
        <ul className="space-y-3">
          {questions.map((q, i) => (
            <li key={q.id}>
              <StepCard
                question={q}
                index={i}
                expanded={expanded[q.id] ?? i === 0}
                onToggle={() => toggle(q.id)}
                onChange={(patch) => onUpdate(q.id, patch)}
                onDuplicate={() => onDuplicate(q.id)}
                onMoveUp={() => onMove(q.id, -1)}
                onMoveDown={() => onMove(q.id, 1)}
                onDelete={() => onDelete(q.id)}
              />
            </li>
          ))}
        </ul>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => setAddOpen((p) => !p)}
          className="w-full flex items-center justify-center gap-2 min-h-[48px] border-2 border-dashed border-[var(--line-strong)] rounded-xl text-sm font-semibold text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
        >
          <Plus size={18} />
          Add step
        </button>
        {addOpen && (
          <div className="absolute left-0 right-0 mt-2 rounded-xl border border-[var(--line)] bg-white shadow-lg p-2 z-10">
            {ADD_TYPES.map((item) => (
              <button
                key={item.type}
                type="button"
                className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-[var(--stone)] text-sm"
                onClick={() => {
                  onAdd(item.type);
                  setAddOpen(false);
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function motionButtons({ onRestore, onAdd }: { onRestore: () => void; onAdd: () => void }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <button type="button" onClick={onRestore} className="px-4 py-2 rounded-lg border border-[var(--line)] text-sm font-medium">
        Restore template questions
      </button>
      <button type="button" onClick={onAdd} className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium">
        Add first step
      </button>
    </div>
  );
}