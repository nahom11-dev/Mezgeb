import React, { useState } from "react";
import { MezgebTemplate } from "../../../templates/types";
import { CodeBlock, VoiceButton } from "../../../ui";

type Tab = "voice" | "schema" | "webhook";

export function FeatureSandbox({
  tpl,
  webhookPayload,
  onReset,
}: {
  tpl: MezgebTemplate;
  webhookPayload: object;
  onReset: () => void;
}) {
  const [tab, setTab] = useState<Tab>("voice");

  const tabs: { id: Tab; label: string }[] = [
    { id: "voice", label: "Voice answer" },
    { id: "schema", label: "Data schema" },
    { id: "webhook", label: "Webhook payload" },
  ];

  return (
    <section className="py-16 border-b border-[var(--console-line)]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <h2 className="text-2xl font-semibold text-[var(--ink)]">Try the features</h2>
        <button type="button" onClick={onReset} className="text-sm font-medium text-[var(--accent)] hover:underline">
          Reset demo
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3 flex lg:flex-col gap-2">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`text-left px-4 py-3 rounded-lg text-sm font-medium border ${
                tab === item.id
                  ? "bg-[var(--lilac)] border-[var(--accent)] text-[var(--accent)]"
                  : "border-[var(--console-line)] text-[var(--muted)] hover:text-[var(--ink)]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="lg:col-span-9 rounded-2xl border border-[var(--console-line)] bg-white p-6">
          {tab === "voice" && (
            <div className="space-y-4 max-w-md">
              <p className="text-sm text-[var(--muted)]">Tap the microphone to try voice input (demo only).</p>
              <VoiceButton state="idle" onStart={() => {}} onStop={() => {}} labels={{ speakLabel: "Speak answer" }} />
            </div>
          )}
          {tab === "schema" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--line)] text-xs uppercase text-[var(--muted)]">
                    <th className="py-2 pr-4">Field</th>
                    <th className="py-2 pr-4">Type</th>
                    <th className="py-2 pr-4">maps_to</th>
                    <th className="py-2">Required</th>
                  </tr>
                </thead>
                <tbody>
                  {tpl.questions
                    .filter((q) => q.type !== "info")
                    .map((q) => (
                      <tr key={q.id} className="border-b border-[var(--line)]">
                        <td className="py-2 pr-4 font-medium">{q.label.en}</td>
                        <td className="py-2 pr-4 font-mono text-xs">{q.type}</td>
                        <td className="py-2 pr-4 font-mono text-xs">{q.maps_to}</td>
                        <td className="py-2">{q.required ? "Yes" : "No"}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
          {tab === "webhook" && (
            <CodeBlock
              filename="webhook.json"
              code={JSON.stringify(webhookPayload, null, 2)}
              copyLabel="Copy"
              copiedLabel="Copied"
              copiedAnnouncement="Copied"
            />
          )}
        </div>
      </div>
    </section>
  );
}