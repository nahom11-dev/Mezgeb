import { MezgebTemplate } from "../../../templates/types";

export function buildRegistrationPayload(
  tpl: MezgebTemplate,
  answers: Record<string, string>,
  demoLang: "en" | "am"
) {
  const profile: Record<string, string> = {};
  for (const q of tpl.questions) {
    if (q.type === "info" || q.type === "consent") continue;
    const val = answers[q.id];
    if (val) profile[q.maps_to || q.id] = val;
  }
  return {
    event: "onboarding.step_sync",
    template_id: tpl.id,
    lang: demoLang,
    profile,
    completed: false,
  };
}