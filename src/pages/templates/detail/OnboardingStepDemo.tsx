import React, { useMemo, useState } from "react";
import { MezgebTemplate } from "../../../templates/types";
import { Button, CodeBlock } from "../../../ui";
import { useTs } from "../strings";
import { buildRegistrationPayload } from "./buildRegistrationPayload";

const SAMPLE_VALUES: Record<string, string> = {
  text: "Hana Tesfaye",
  phone: "0912345678",
  email: "hana@example.com",
  choice: "option_1",
  number: "3",
  date: "1995-09-12",
  "work-story": "I sold produce at Merkato for two years.",
};

export function OnboardingStepDemo({
  tpl,
  demoLang,
  onPayload,
}: {
  tpl: MezgebTemplate;
  demoLang: "en" | "am";
  onPayload: (json: object) => void;
}) {
  const s = useTs();
  const steps = useMemo(() => tpl.questions.filter((q) => q.type !== "info" && q.type !== "consent"), [tpl]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [review, setReview] = useState(false);

  const current = steps[index];
  const progress = steps.length ? Math.round(((review ? steps.length : index) / steps.length) * 100) : 0;

  const payload = useMemo(() => {
    const p = buildRegistrationPayload(tpl, answers, demoLang);
    return { ...p, completed: review };
  }, [tpl, answers, demoLang, review]);

  React.useEffect(() => {
    onPayload(payload);
  }, [payload, onPayload]);

  const fillSample = () => {
    if (!current) return;
    const sample = SAMPLE_VALUES[current.type] ?? (demoLang === "am" ? "ናሙና" : "Sample answer");
    setAnswers((a) => ({ ...a, [current.id]: sample }));
  };

  const next = () => {
    if (index >= steps.length - 1) setReview(true);
    else setIndex((i) => i + 1);
  };

  const back = () => {
    if (review) {
      setReview(false);
      setIndex(steps.length - 1);
      return;
    }
    setIndex((i) => Math.max(0, i - 1));
  };

  return (
    <div className="space-y-4">
      <div className="h-2 rounded-full bg-[var(--stone)] overflow-hidden">
        <div className="h-full bg-[var(--accent)] transition-all" style={{ width: `${progress}%` }} />
      </div>
      {!review && current ? (
        <div className="rounded-2xl border border-[var(--console-line)] bg-white p-6 space-y-4">
          <p className="text-xs font-mono text-[var(--accent)]">
            {s.f("galleryStepOf", { n: index + 1, total: steps.length })}
          </p>
          <p className="text-lg font-semibold text-[var(--ink)]" lang={demoLang}>
            {current.label[demoLang] || current.label.en}
          </p>
          {current.hint && (
            <p className="text-sm text-[var(--muted)]">{current.hint[demoLang] || current.hint.en}</p>
          )}
          <input
            className="w-full h-11 px-3 rounded-lg border border-[var(--line)]"
            value={answers[current.id] ?? ""}
            onChange={(e) => setAnswers((a) => ({ ...a, [current.id]: e.target.value }))}
            aria-label={current.label.en}
          />
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={fillSample}>
              Fill sample
            </Button>
            <Button variant="secondary" size="sm" onClick={back} disabled={index === 0}>
              Back
            </Button>
            <Button variant="primary" size="sm" onClick={next}>
              Next
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--console-line)] bg-white p-6 space-y-3">
          <h3 className="font-semibold text-[var(--ink)]">Review</h3>
          <ul className="text-sm space-y-2">
            {steps.map((q) => (
              <li key={q.id} className="flex justify-between gap-4 border-b border-[var(--line)] pb-2">
                <span className="text-[var(--muted)]">{q.label.en}</span>
                <span className="font-medium text-[var(--ink)]">{answers[q.id] || "—"}</span>
              </li>
            ))}
          </ul>
          <Button variant="secondary" size="sm" onClick={back}>
            Back
          </Button>
        </div>
      )}
    </div>
  );
}

export function ResultPreviewPanel({ payload }: { payload: object }) {
  const code = JSON.stringify(payload, null, 2);
  return (
    <motionSticky className="space-y-3">
      <h3 className="text-sm font-semibold text-[var(--ink)]">Result preview</h3>
      <CodeBlock
        filename="registration.json"
        code={code}
        copyLabel="Copy"
        copiedLabel="Copied"
        copiedAnnouncement="Copied"
      />
    </motionSticky>
  );
}

function motionSticky({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`sticky top-24 ${className ?? ""}`}>{children}</div>;
}