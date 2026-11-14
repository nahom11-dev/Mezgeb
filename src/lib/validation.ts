import { ScreenSummaryForAi } from "../ai";
import { MezgebTemplate, TemplateQuestion } from "../templates/types";
import {
  ethiopianToGregorian,
  formatGregorianIso,
  isValidEthiopianDate,
  isValidGregorianDate,
} from "./ethiopianCalendar";

export function validatePhone(raw: unknown): boolean {
  if (typeof raw !== "string") return false;
  const trimmed = raw.trim();
  // Reject any letters
  if (/[a-zA-Z]/.test(trimmed)) return false;
  const digits = trimmed.replace(/[\s\-()]/g, "");
  return /^0[97]\d{8}$/.test(digits);
}

export function normalizePhoneDigits(raw: unknown): string {
  return String(raw ?? "").replace(/\D/g, "").slice(0, 10);
}

export function buildHelpScreenSummary(params: {
  stepNumber: number;
  currentQuestion: TemplateQuestion | null;
  lang: "en" | "am";
  errors: { fieldId: string; code: string; message: string }[];
  buttonNames: string[];
  reviewTitle: string;
}): ScreenSummaryForAi {
  return {
    stepNumber: params.stepNumber,
    questionId: params.currentQuestion?.id ?? "review",
    questionLabel: params.currentQuestion
      ? params.currentQuestion.label[params.lang]
      : params.reviewTitle,
    fieldTypes: params.currentQuestion ? [params.currentQuestion.type] : ["review", "checkbox"],
    errors: params.errors.map((err) => ({
      fieldId: err.fieldId,
      code: err.code,
      message: err.message,
    })),
    buttonNames: [...params.buttonNames],
  };
}

export function isQuestionVisible(
  q: TemplateQuestion,
  answers: Record<string, unknown>,
  allQuestions: TemplateQuestion[]
): boolean {
  if (!q.showIf || !q.showIf.questionId) return true;
  const targetIdx = allQuestions.findIndex((item) => item.id === q.showIf?.questionId);
  const myIdx = allQuestions.findIndex((item) => item.id === q.id);
  if (targetIdx === -1 || (myIdx !== -1 && targetIdx >= myIdx)) {
    return true;
  }
  const parent = allQuestions[targetIdx];
  if (!isQuestionVisible(parent, answers, allQuestions)) return false;

  const actual = answers[q.showIf.questionId];
  const expected = q.showIf.equals;
  if (Array.isArray(expected)) {
    if (Array.isArray(actual)) {
      return expected.some((v) => actual.includes(v));
    }
    return expected.includes(String(actual ?? ""));
  }
  if (Array.isArray(actual)) {
    return actual.includes(String(expected));
  }
  return String(actual ?? "") === String(expected);
}

export function buildCompletedProfile(params: {
  answers: Record<string, unknown>;
  template: MezgebTemplate;
}): { profile: Record<string, unknown>; supportShared: boolean } {
  const { answers, template } = params;
  const profile: Record<string, unknown> = {};

  for (const q of template.questions) {
    if (!isQuestionVisible(q, answers, template.questions)) {
      continue;
    }

    if (q.type === "info") {
      continue;
    }

    if (q.type === "date") {
      const cal = answers.dob_calendar === "greg" ? "greg" : "eth";
      if (cal === "eth") {
        const d = Number(answers.dob_eth_day);
        const m = Number(answers.dob_eth_month);
        const y = Number(answers.dob_eth_year);
        if (isValidEthiopianDate(y, m, d)) {
          const greg = ethiopianToGregorian({ year: y, month: m, day: d });
          profile.date_of_birth = formatGregorianIso(greg);
          profile.date_of_birth_ethiopian = { year: y, month: m, day: d };
        }
      } else {
        const d = Number(answers.dob_greg_day);
        const m = Number(answers.dob_greg_month);
        const y = Number(answers.dob_greg_year);
        if (isValidGregorianDate(y, m, d)) {
          profile.date_of_birth = formatGregorianIso({ year: y, month: m, day: d });
        }
      }
      continue;
    }

    if (q.type === "id-routes") {
      const route = answers.id_route;
      if (route) {
        if (route === "partner_refer") {
          profile.id_route = "partner_pending";
          if (answers.partner_org) {
            profile.partner_org = String(answers.partner_org);
          }
        } else {
          profile.id_route = String(route);
        }
      }
      continue;
    }

    if (q.type === "support") {
      // Support needs handled separately according to sharing toggle
      continue;
    }

    if (q.type === "work-story") {
      if (Array.isArray(answers.skills) && answers.skills.length > 0) {
        profile.skills = answers.skills;
      }
      if (typeof answers.work_story === "string" && answers.work_story.trim()) {
        profile.work_story = answers.work_story.trim();
      }
      continue;
    }

    if (q.type === "phone") {
      const digits = normalizePhoneDigits(answers[q.id]);
      if (digits) {
        profile[q.maps_to || "phone"] = digits;
      }
      continue;
    }

    if (q.type === "consent") {
      if (answers[q.id] !== undefined) {
        profile[q.maps_to || q.id] = Boolean(answers[q.id]);
      }
      continue;
    }

    const val = answers[q.id];
    if (val === undefined || val === null) continue;
    if (typeof val === "string" && val.trim() === "") continue;
    if (Array.isArray(val) && val.length === 0) continue;

    if (q.type === "number") {
      const num = Number(val);
      profile[q.maps_to] = Number.isFinite(num) ? num : val;
    } else if ((q.type === "choice" || q.type === "yes-no") && q.options) {
      const opt = q.options.find((o) => o.value === val);
      profile[q.maps_to] = q.id === "language" || q.type === "yes-no" ? val : opt ? opt.label.en : val;
    } else {
      profile[q.maps_to] = val;
    }
  }

  const supportShared = Boolean(answers.support_share_platform);
  profile.support_shared = supportShared;
  if (supportShared && Array.isArray(answers.support_needs) && answers.support_needs.length > 0) {
    profile.support_needs = answers.support_needs;
  }

  return { profile, supportShared };
}
