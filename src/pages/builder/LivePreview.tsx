import React, { useState } from "react";
import { MezgebWidget } from "../../components/MezgebWidget";
import { MezgebTemplate } from "../../templates/types";

export function LivePreview({ template }: { template: MezgebTemplate }) {
  const [resetKey, setResetKey] = useState(0);

  return (
    <div className="space-y-3 sticky top-24">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-[var(--ink)]">Live preview</h2>
        <button
          type="button"
          onClick={() => setResetKey((k) => k + 1)}
          className="text-xs font-medium text-[var(--accent)] hover:underline"
        >
          Reset preview
        </button>
      </div>
      <div className="mx-auto w-full max-w-[340px] rounded-[32px] border-[3px] border-[var(--console-line)] bg-[#FBF9F8] p-3 shadow-sm">
        <div className="min-h-[520px] rounded-[20px] overflow-hidden bg-white border border-[var(--line)]">
          <MezgebWidget
            key={`${template.id}-${resetKey}-${template.questions.length}`}
            template={template}
            lang="en"
            storageKey={`mezgeb_builder_preview_${template.id}`}
          />
        </div>
      </div>
      <p className="text-[11px] text-[var(--muted)] text-center">Preview follows your draft. Nothing is sent to a server.</p>
    </div>
  );
}