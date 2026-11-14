import React from "react";
import { Volume2, VolumeX } from "lucide-react";

export interface ReadAloudButtonProps {
  text: string;
  lang: "en" | "am";
  audioUrl?: string;
  speaking: boolean;
  onToggle: () => void;
  label?: string;
  stopLabel?: string;
  widgetSize?: boolean;
  className?: string;
}

/**
 * Checks whether read-aloud is available, or should still show a control (Amharic fallback note).
 */
export function useCanReadAloud(
  lang: "en" | "am",
  audioUrl?: string,
  serverReadAloud?: boolean,
  recordedUrl?: string | null
): boolean {
  if (recordedUrl || audioUrl) return true;
  if (serverReadAloud) return true;
  if (lang === "am") return true;
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function ReadAloudButton({
  lang,
  audioUrl,
  speaking,
  onToggle,
  label = "Read aloud",
  stopLabel = "Stop reading",
  widgetSize = false,
  className = "",
  serverReadAloud,
  recordedUrl,
}: ReadAloudButtonProps & { serverReadAloud?: boolean; recordedUrl?: string | null }) {
  const available = useCanReadAloud(lang, audioUrl, serverReadAloud, recordedUrl);
  if (!available) return null;

  const iconSize = widgetSize ? 20 : 18;

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={speaking}
      className={`mezgeb-transition inline-flex items-center gap-2 min-h-[44px] px-3.5 rounded-[10px] border border-[var(--line-strong)] bg-[var(--paper)] text-sm font-medium text-[var(--ink)] hover:bg-[var(--stone)] cursor-pointer ${className}`}
    >
      {speaking ? (
        <VolumeX size={iconSize} strokeWidth={1.75} aria-hidden="true" />
      ) : (
        <Volume2 size={iconSize} strokeWidth={1.75} aria-hidden="true" />
      )}
      <span>{speaking ? stopLabel : label}</span>
    </button>
  );
}