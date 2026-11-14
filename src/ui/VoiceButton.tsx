import React from "react";
import { Check, Loader2, Mic, RotateCcw, Square } from "lucide-react";

export type VoiceState = "idle" | "listening" | "processing" | "review" | "failed";

export interface VoiceButtonProps {
  state: VoiceState;
  onStart: () => void;
  onStop: () => void;
  onKeep?: () => void;
  onRetry?: () => void;
  transcript?: string;
  onTranscriptChange?: (val: string) => void;
  seconds?: number;
  disabled?: boolean;
  disabledReason?: string;
  widgetSize?: boolean;
  labels?: {
    speakLabel?: string;
    listeningLabel?: string;
    processingLabel?: string;
    keepLabel?: string;
    tryAgainLabel?: string;
    failedMessage?: string;
    transcriptLabel?: string;
  };
}

const WAVE_HEIGHTS = [10, 18, 26, 14, 24, 16, 22, 12];

export function VoiceButton({
  state,
  onStart,
  onStop,
  onKeep,
  onRetry,
  transcript = "",
  onTranscriptChange,
  seconds = 0,
  disabled = false,
  disabledReason,
  widgetSize = false,
  labels = {},
}: VoiceButtonProps) {
  const {
    speakLabel = "Speak your answer",
    listeningLabel = "Listening… tap to stop",
    processingLabel = "Writing what you said…",
    keepLabel = "Keep",
    tryAgainLabel = "Try again",
    failedMessage = "We could not hear that. Try again or type your answer.",
    transcriptLabel = "Check what Mezgeb heard",
  } = labels;

  const iconSize = widgetSize ? 24 : 20;

  if (state === "listening") {
    return (
      <div className="space-y-1.5">
        <button
          type="button"
          onClick={onStop}
          aria-label={listeningLabel}
          className="min-h-[48px] px-3.5 rounded-[10px] border-2 border-[var(--accent)] bg-[var(--lilac)] text-[var(--ink)] inline-flex items-center gap-3 font-medium text-sm cursor-pointer"
        >
          <Square size={16} strokeWidth={1.75} className="text-[var(--accent)] shrink-0" aria-hidden="true" />
          <span className="inline-flex items-center gap-[3px] h-6" aria-hidden="true">
            {WAVE_HEIGHTS.map((h, i) => (
              <span
                key={i}
                className="mezgeb-wave-bar w-[2px] rounded-full bg-[var(--accent-soft)]"
                style={{
                  height: `${h}px`,
                  animationDelay: `${i * 80}ms`,
                }}
              />
            ))}
          </span>
          <span>{listeningLabel}</span>
          {seconds > 0 && (
            <span className="font-mono text-xs text-[var(--muted)]">{seconds}s</span>
          )}
        </button>
      </div>
    );
  }

  if (state === "processing") {
    return (
      <div
        role="status"
        className="min-h-[48px] px-3.5 rounded-[10px] border border-[var(--line-strong)] bg-[var(--lilac)] text-[var(--ink)] inline-flex items-center gap-2.5 text-sm font-medium"
      >
        <Loader2 size={18} strokeWidth={1.75} className="animate-spin text-[var(--accent)]" aria-hidden="true" />
        <span>{processingLabel}</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="inline-flex flex-col items-start gap-1">
        <button
          type="button"
          disabled={disabled}
          onClick={onStart}
          aria-label={speakLabel}
          title={speakLabel}
          className="w-[48px] h-[48px] rounded-[10px] border border-[var(--line-strong)] bg-[var(--paper)] text-[var(--ink)] hover:bg-[var(--stone)] inline-flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mezgeb-transition"
        >
          <Mic size={iconSize} strokeWidth={1.75} aria-hidden="true" />
        </button>
        {disabled && disabledReason && (
          <p className="text-[0.8125rem] text-[var(--muted)]">{disabledReason}</p>
        )}
      </div>

      {state === "review" && (
        <div
          role="region"
          aria-label={transcriptLabel}
          className="p-3.5 rounded-[10px] border-2 border-[var(--accent)] bg-[var(--lilac)] space-y-2.5 text-left"
        >
          <p className="text-xs font-semibold text-[var(--ink)]">{transcriptLabel}</p>
          {onTranscriptChange ? (
            <input
              type="text"
              value={transcript}
              onChange={(e) => onTranscriptChange(e.target.value)}
              aria-label={transcriptLabel}
              className="w-full min-h-[44px] px-3 rounded-[6px] border border-[var(--line-strong)] bg-[var(--paper)] text-base text-[var(--ink)]"
            />
          ) : (
            <p className="px-2.5 py-1.5 rounded-[6px] bg-[var(--paper)] border border-[var(--line)] text-base font-medium text-[var(--ink)]">
              {transcript}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2">
            {onKeep && (
              <button
                type="button"
                onClick={onKeep}
                className="min-h-[40px] px-3.5 rounded-[10px] bg-[var(--ink)] text-[var(--paper)] text-sm font-medium inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Check size={16} strokeWidth={1.75} aria-hidden="true" />
                <span>{keepLabel}</span>
              </button>
            )}
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="min-h-[40px] px-3.5 rounded-[10px] bg-[var(--paper)] border border-[var(--ink)] text-[var(--ink)] text-sm font-medium inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw size={15} strokeWidth={1.75} aria-hidden="true" />
                <span>{tryAgainLabel}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {state === "failed" && (
        <div
          role="status"
          className="p-3 rounded-[10px] border border-[var(--warn)] bg-[var(--warn-bg)] text-sm text-[var(--warn)] font-medium"
        >
          {failedMessage}
        </div>
      )}
    </div>
  );
}
