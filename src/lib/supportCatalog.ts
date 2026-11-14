/** Shared support / accommodation values for widget, API, and jobs data. */

export const LEARNER_SUPPORT_VALUES = [
  "screen_reader",
  "extra_time",
  "step_free",
  "sign_language",
  "large_print",
  "quiet_room",
] as const;

export const EMPLOYER_JOB_EXTRA_VALUES = ["flexible_hours", "remote_option"] as const;

export const JOB_ACCOMMODATION_VALUES = [...LEARNER_SUPPORT_VALUES, ...EMPLOYER_JOB_EXTRA_VALUES] as const;

export type LearnerSupportValue = (typeof LEARNER_SUPPORT_VALUES)[number];
export type JobAccommodationValue = (typeof JOB_ACCOMMODATION_VALUES)[number];

const INTERPRETER_RE = /^interpreter:(am|en)$/;

export function isValidSupportValue(value: string, allowEmployerExtras = false): boolean {
  const v = String(value ?? "").trim();
  if (INTERPRETER_RE.test(v)) return true;
  const list: readonly string[] = allowEmployerExtras ? JOB_ACCOMMODATION_VALUES : LEARNER_SUPPORT_VALUES;
  return list.includes(v);
}

export function parseInterpreterValue(value: string): { lang: "am" | "en" } | null {
  const m = INTERPRETER_RE.exec(String(value ?? "").trim());
  if (!m) return null;
  return { lang: m[1] as "am" | "en" };
}

export function normalizeSupportNeeds(
  needs: unknown,
  allowEmployerExtras = false
): { ok: true; needs: string[] } | { ok: false; error: string } {
  if (!Array.isArray(needs)) return { ok: false, error: "needs must be an array" };
  const out: string[] = [];
  for (const raw of needs) {
    const v = String(raw ?? "").trim();
    if (!v || v === "prefer-not") continue;
    if (!isValidSupportValue(v, allowEmployerExtras)) {
      return { ok: false, error: `Unknown support value: ${v}` };
    }
    out.push(v);
  }
  return { ok: true, needs: out };
}