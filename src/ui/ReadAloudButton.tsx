import React, { useEffect, useState } from "react";
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
 * Checks whether an Amharic speech voice or pre-recorded audio exists.
 * In Amharic mode, if neither exists, the button is hidden rather than broken.
 */
export function useCanReadAloud(
  lang: "en" | "am",
  audioUrl?: string,
  serverReadAloud?: boolean
): boolean {
  const [hasAmVoice, setHasAmVoice] = useState<boolean>(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
    return window.speechSynthesis.getVoices().some((v) => v.lang.toLowerCase().startsWith("am"));
  });

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const check = () => {
      const voices = window.speechSynthesis.getVoices();
      setHasAmVoice(voices.some((v) => v.lang.toLowerCase().startsWith("am")));
    };
    check();
    window.speechSynthesis.addEventListener?.("voiceschanged", check);
    return () => {
      window.speechSynthesis.removeEventListener?.("voiceschanged", check);
    };
  }, []);

  if (audioUrl) return true;
  if (serverReadAloud) return true;
  if (lang === "am") return hasAmVoice;
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
}: ReadAloudButtonProps & { serverReadAloud?: boolean }) {
  const available = useCanReadAloud(lang, audioUrl, serverReadAloud);
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
