import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../../i18n";
import { LivePreview } from "./LivePreview";
import { StepList } from "./StepList";
import { useFlowDraft } from "./useFlowDraft";

export function BuilderPage() {
  const { t } = useI18n();
  const flow = useFlowDraft();
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(flow.template.name.en);
  const [previewOpen, setPreviewOpen] = useState(false);

  const saveLabel =
    flow.saveStatus === "saving"
      ? t("builderSaveSaving")
      : flow.saveStatus === "dirty"
        ? t("builderSaveRetry")
        : t("builderSaveSaved");

  const handleSave = () => {
    flow.saveToLibrary();
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[var(--builder-surface)] text-[var(--ink)]">
      <header className="sticky top-0 z-40 bg-[var(--paper)] border-b border-[var(--console-line)]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <Link to="/templates" className="text-sm font-medium text-[var(--ink)] hover:text-[var(--accent)] shrink-0">
            ← {t("navTemplates")}
          </Link>
          {editingName ? (
            <input
              autoFocus
              className="flex-1 max-w-xs h-9 px-2 rounded border border-[var(--accent)] text-sm"
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              onBlur={() => {
                flow.setFlowName(nameDraft);
                setEditingName(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  flow.setFlowName(nameDraft);
                  setEditingName(false);
                }
              }}
            />
          ) : (
            <button
              type="button"
              className="flex-1 text-left text-sm font-semibold truncate max-w-md"
              onClick={() => {
                setNameDraft(flow.template.name.en);
                setEditingName(true);
              }}
            >
              {flow.template.name.en}
            </button>
          )}
          <motionSaveDot saved={flow.saveStatus === "saved"} label={saveLabel} />
          <button
            type="button"
            onClick={handleSave}
            className="hidden sm:inline-flex min-h-[36px] px-4 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)]"
          >
            {t("saveButton")}
          </button>
          <button
            type="button"
            className="sm:hidden min-h-[36px] px-3 rounded-lg border border-[var(--line)] text-sm"
            onClick={() => setPreviewOpen((p) => !p)}
          >
            Preview
          </button>
        </div>
      </header>

      <div className="border-b border-[var(--console-line)] bg-[var(--console-paper)]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-sm">
          <span className="font-mono text-[11px] uppercase px-2 py-1 rounded-full bg-[var(--lilac)] text-[var(--accent)] font-semibold">
            Builder
          </span>
          <span className="text-[var(--muted)]">Draft autosaved locally</span>
          {flow.attentionCount > 0 && (
            <span className="text-xs font-medium text-[var(--warn)] bg-[var(--warn-bg)] px-2 py-1 rounded-md">
              {flow.attentionCount} steps need attention
            </span>
          )}
          <div className="flex items-center gap-2 ml-auto">
            <button type="button" onClick={flow.discardChanges} className="text-xs font-medium text-[var(--muted)] hover:text-[var(--ink)]">
              Discard changes
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="text-xs font-semibold text-[var(--accent)] hover:underline"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className={`lg:col-span-7 ${previewOpen ? "hidden lg:block" : ""}`}>
            <StepList
              questions={flow.template.questions}
              onUpdate={flow.updateQuestion}
              onAdd={flow.addQuestion}
              onDuplicate={flow.duplicateQuestion}
              onMove={flow.moveQuestion}
              onDelete={flow.deleteQuestion}
              onRestore={flow.restoreTemplateQuestions}
            />
          </div>
          <div className={`lg:col-span-5 ${previewOpen ? "block" : "hidden lg:block"}`}>
            <LivePreview template={flow.template} />
          </div>
        </div>
      </main>
    </div>
  );
}

function motionSaveDot({ saved, label }: { saved: boolean; label: string }) {
  return (
    <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-[var(--muted)]">
      <span className={`w-2 h-2 rounded-full ${saved ? "bg-[var(--mint-ink)]" : "bg-[var(--warn)]"}`} aria-hidden />
      {label}
    </span>
  );
}

export default BuilderPage;