import React from "react";
import type { Lang } from "../i18n";

// Ethiopic letters (incl. supplement/extended) plus the spaces and Ethiopic punctuation between words.
const ETHIOPIC_RUN = /([ሀ-᎟ⶀ-⷟](?:[ሀ-᎟ⶀ-⷟\s፠-፨?!]*[ሀ-᎟ⶀ-⷟፡-፨?!])?)/;
const HAS_ETHIOPIC = /[ሀ-᎟ⶀ-⷟]/;
const HAS_LATIN = /[A-Za-z]/;

/**
 * Marks text in the other language so screen readers switch voice (WCAG 3.1.2 Language of Parts).
 * English UI: Ethiopic runs get <span lang="am">. Amharic UI: Latin runs get <span lang="en">.
 * Text already in the UI language is returned unchanged.
 */
export function withLang(text: string, uiLang: Lang): React.ReactNode {
  if (!text) return text;
  const hasEth = HAS_ETHIOPIC.test(text);
  if (uiLang === "en" && !hasEth) return text;
  if (uiLang === "am" && !HAS_LATIN.test(text)) return text;

  const parts = text.split(ETHIOPIC_RUN).filter((p) => p !== "");
  return parts.map((part, i) => {
    const isEth = HAS_ETHIOPIC.test(part);
    if (uiLang === "en" && isEth) return <span key={i} lang="am">{part}</span>;
    if (uiLang === "am" && !isEth && HAS_LATIN.test(part)) return <span key={i} lang="en">{part}</span>;
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}
