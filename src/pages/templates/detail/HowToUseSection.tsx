import React from "react";
import { Link } from "react-router-dom";
import { MezgebTemplate } from "../../../templates/types";
import { Button, CodeBlock } from "../../../ui";

export function HowToUseSection({ tpl, onOpenBuilder }: { tpl: MezgebTemplate; onOpenBuilder: () => void }) {
  const embed = `<script type="module" src="https://cdn.mezgeb.example/v1/mezgeb.js"></script>
<mezgeb-register site-key="pk_yoursite" template="${tpl.id}" lang="am"></mezgeb-register>`;

  const faqs = [
    {
      q: "Do I need to translate every question?",
      a: "Built-in templates include Amharic and English. When you edit in the builder, fill in both languages on each step.",
    },
    {
      q: "Where do registrations go?",
      a: "Your server exchanges a one-time token for a JSON profile using the REST API documented in /docs/api.",
    },
  ];

  return (
    <section id="how-to-use" className="py-16 scroll-mt-24">
      <h2 className="text-2xl font-semibold text-[var(--ink)] mb-6">How to use</h2>
      <div className="rounded-xl border border-[var(--console-line)] bg-[var(--stone)] p-6 mb-8 text-sm text-[var(--ink-2)]">
        <p className="font-semibold text-[var(--ink)] mb-2">Before you start</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Pick a site key from the Playground or your self-hosted config.</li>
          <li>Decide which ID routes this template allows ({tpl.idRoutes.length} configured).</li>
          <li>Test with screen reader and voice on a real phone.</li>
        </ul>
      </div>
      <ol className="space-y-8">
        <li className="space-y-2">
          <p className="font-semibold text-[var(--ink)]">1. Add the embed snippet</p>
          <CodeBlock filename="signup.html" code={embed} copyLabel="Copy" copiedLabel="Copied" copiedAnnouncement="Copied" />
        </li>
        <li className="space-y-2">
          <p className="font-semibold text-[var(--ink)]">2. Handle the webhook on your server</p>
          <p className="text-sm text-[var(--muted)]">
            See <Link to="/docs/api" className="text-[var(--accent)] underline">REST API docs</Link> for the exchange
            endpoint.
          </p>
        </li>
        <li className="space-y-2">
          <p className="font-semibold text-[var(--ink)]">3. Try it in the Playground</p>
          <Link to="/playground" className="text-sm text-[var(--accent)] underline">
            Open playground
          </Link>
        </li>
      </ol>
      <div className="mt-10 divide-y divide-[var(--line)] border-y border-[var(--line)]">
        {faqs.map((item) => (
          <details key={item.q} className="py-4 group">
            <summary className="font-medium text-[var(--ink)] cursor-pointer list-none flex justify-between">
              {item.q}
            </summary>
            <p className="pt-2 text-sm text-[var(--muted)] leading-relaxed">{item.a}</p>
          </details>
        ))}
      </div>
      <div className="mt-8">
        <Button variant="primary" size="lg" onClick={onOpenBuilder}>
          Open in builder
        </Button>
      </div>
    </section>
  );
}