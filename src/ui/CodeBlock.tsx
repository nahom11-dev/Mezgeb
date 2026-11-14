import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { useLiveAnnouncer } from "../components/LiveAnnouncer";

export interface CodeBlockProps {
  code: string;
  filename?: string;
  copyLabel?: string;
  copiedLabel?: string;
  copiedAnnouncement?: string;
  className?: string;
  /** Wrap long lines instead of scrolling sideways (narrow panels). */
  wrap?: boolean;
}

export function CodeBlock({
  code,
  filename,
  copyLabel = "Copy code",
  copiedLabel = "Copied",
  copiedAnnouncement = "Copied to clipboard",
  className = "",
  wrap = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const { announce } = useLiveAnnouncer();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Clipboard fallback ignored cleanly in restricted environments
    }
    setCopied(true);
    announce(copiedAnnouncement);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`rounded-[10px] border border-[var(--line)] bg-[var(--stone)] overflow-hidden text-left ${className}`}
    >
      <div className="px-4 py-2 border-b border-[var(--line)] flex items-center justify-between gap-3">
        <span
          className="text-xs font-medium text-[var(--muted)] truncate"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {filename ?? ""}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="mezgeb-transition inline-flex items-center gap-1.5 min-h-[36px] px-3 rounded-[6px] border border-[var(--line-strong)] bg-[var(--paper)] text-xs font-medium text-[var(--ink)] hover:bg-[var(--stone)] cursor-pointer shrink-0"
        >
          {copied ? (
            <Check size={14} strokeWidth={1.75} className="text-[var(--mint-ink)]" aria-hidden="true" />
          ) : (
            <Copy size={14} strokeWidth={1.75} aria-hidden="true" />
          )}
          <span>{copied ? copiedLabel : copyLabel}</span>
        </button>
      </div>
      <pre
        tabIndex={0}
        className={`p-4 text-[0.875rem] leading-relaxed text-[var(--ink)] overflow-x-auto m-0 ${wrap ? "whitespace-pre-wrap break-words" : ""}`}
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}
