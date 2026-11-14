import { Lang } from "./i18n";
import { MezgebTemplate, TemplateWarning } from "./templates/types";
import { validateTemplate } from "./templates/validate";

const AI_TIMEOUT_MS = 8000;
const VOICE_TIMEOUT_MS = 15000;

async function fetchWithTimeout(url: string, body: unknown, timeoutMs = AI_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } finally {
    window.clearTimeout(timer);
  }
}

export interface ServerCapabilities {
  voice: boolean;
  smartHelp: boolean;
  skillsAi: boolean;
  simplifyAi: boolean;
}

export async function getCapabilities(): Promise<ServerCapabilities> {
  try {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 4000);
    const res = await fetch("/api/capabilities", { signal: controller.signal });
    window.clearTimeout(timer);
    if (!res.ok) {
      return { voice: false, smartHelp: false, skillsAi: false, simplifyAi: false };
    }
    const data = await res.json();
    return {
      voice: Boolean(data.voice),
      smartHelp: Boolean(data.smartHelp),
      skillsAi: Boolean(data.skillsAi),
      simplifyAi: Boolean(data.simplifyAi),
    };
  } catch {
    return { voice: false, smartHelp: false, skillsAi: false, simplifyAi: false };
  }
}

export interface VoiceAnswerResult {
  ok: boolean;
  transcript: string;
  value: string;
  confidence: "high" | "medium" | "low";
  matchedValue: string | null;
  timedOut?: boolean;
}

export async function transcribeVoiceAnswer(params: {
  audioBase64: string;
  mimeType: string;
  questionLabel: string;
  expectedType: string;
  lang: Lang;
  options?: { value: string; label: string }[];
}): Promise<VoiceAnswerResult> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetchWithTimeout("/api/ai/voice", params, VOICE_TIMEOUT_MS);
      if (!res.ok) {
        if (res.status >= 500 && attempt === 0) continue;
        return { ok: false, transcript: "", value: "", confidence: "low", matchedValue: null };
      }
      const data = await res.json();
      return {
        ok: true,
        transcript: String(data.transcript ?? ""),
        value: String(data.value ?? data.transcript ?? ""),
        confidence:
          data.confidence === "high" || data.confidence === "medium" || data.confidence === "low"
            ? data.confidence
            : "medium",
        matchedValue: data.matchedValue ? String(data.matchedValue) : null,
      };
    } catch (err) {
      const timedOut = err instanceof DOMException && err.name === "AbortError";
      if (attempt === 0) continue;
      return { ok: false, transcript: "", value: "", confidence: "low", matchedValue: null, timedOut };
    }
  }
  return { ok: false, transcript: "", value: "", confidence: "low", matchedValue: null };
}

export interface ScreenSummaryForAi {
  stepNumber: number;
  questionId: string;
  questionLabel: string;
  fieldTypes: string[];
  errors: { fieldId: string; code: string; message: string }[];
  buttonNames: string[];
  // NOTE: Never include typed field values here.
}

export interface SmartHelpResult {
  usedAi: boolean;
  explanation: string;
  targetFieldId: string | null;
}

export async function getSmartHelp(params: {
  screenSummary: ScreenSummaryForAi;
  userProblem: string;
  lang: Lang;
  fallbackExplanation: string;
  fallbackTargetFieldId: string | null;
}): Promise<SmartHelpResult> {
  try {
    const res = await fetchWithTimeout("/api/ai/help", {
      screenSummary: params.screenSummary,
      userProblem: params.userProblem,
      lang: params.lang,
    });
    if (!res.ok) {
      return {
        usedAi: false,
        explanation: params.fallbackExplanation,
        targetFieldId: params.fallbackTargetFieldId,
      };
    }
    const data = await res.json();
    if (!data.explanation) {
      return {
        usedAi: false,
        explanation: params.fallbackExplanation,
        targetFieldId: params.fallbackTargetFieldId,
      };
    }
    return {
      usedAi: true,
      explanation: String(data.explanation),
      targetFieldId: data.targetFieldId ? String(data.targetFieldId) : params.fallbackTargetFieldId,
    };
  } catch {
    return {
      usedAi: false,
      explanation: params.fallbackExplanation,
      targetFieldId: params.fallbackTargetFieldId,
    };
  }
}

export async function simplifyQuestionLabel(params: {
  label: string;
  lang: Lang;
  fallbackHint: string;
}): Promise<{ usedAi: boolean; text: string }> {
  try {
    const res = await fetchWithTimeout("/api/ai/simplify", {
      label: params.label,
      lang: params.lang,
    });
    if (!res.ok) {
      return { usedAi: false, text: params.fallbackHint };
    }
    const data = await res.json();
    if (!data.simplified) {
      return { usedAi: false, text: params.fallbackHint };
    }
    return { usedAi: true, text: String(data.simplified) };
  } catch {
    return { usedAi: false, text: params.fallbackHint };
  }
}

export interface ExtractedSkill {
  name: string;
  evidence: string;
}

export interface SkillsExtractionResult {
  usedAi: boolean;
  skills: ExtractedSkill[];
}

export async function extractSkillsFromStory(params: {
  story: string;
  lang: Lang;
}): Promise<SkillsExtractionResult> {
  try {
    const res = await fetchWithTimeout("/api/ai/skills", params);
    if (!res.ok) {
      return { usedAi: false, skills: [] };
    }
    const data = await res.json();
    if (!Array.isArray(data.skills) || data.skills.length === 0) {
      return { usedAi: false, skills: [] };
    }
    return {
      usedAi: true,
      skills: data.skills.slice(0, 6).map((s: { name?: string; evidence?: string }) => ({
        name: String(s.name ?? ""),
        evidence: String(s.evidence ?? ""),
      })),
    };
  } catch {
    return { usedAi: false, skills: [] };
  }
}

export interface TemplateDraftResult {
  usedAi: boolean;
  template: MezgebTemplate;
  warnings: TemplateWarning[];
  validationErrors: string[];
}

export async function draftTemplateWithAi(params: {
  baseTemplate: MezgebTemplate;
  description: string;
  lang: Lang;
}): Promise<TemplateDraftResult> {
  const buildFallbackWarnings = (): TemplateWarning[] => {
    const lower = params.description.toLowerCase();
    const warnings: TemplateWarning[] = [];
    if (lower.includes("email")) {
      warnings.push({
        questionId: "email",
        issue: "Collects data you may not need (email is optional for many learners)",
        suggestion: "Make email optional or rely on phone + SMS link instead.",
      });
    }
    if (lower.includes("medical") || lower.includes("diagnosis") || lower.includes("disability type")) {
      warnings.push({
        questionId: "support_needs",
        issue: "Asks for medical information",
        suggestion: "Replace with practical support options (no diagnosis or proof).",
      });
    }
    if (lower.includes(" and ") && lower.split(",").some((part) => part.includes(" and "))) {
      warnings.push({
        questionId: "combined_field",
        issue: "Asks two things at once",
        suggestion: "Split combined fields so there is only one clear question per screen.",
      });
    }
    return warnings;
  };

  try {
    const res = await fetchWithTimeout("/api/ai/template-draft", params);
    if (!res.ok) {
      return {
        usedAi: false,
        template: structuredClone(params.baseTemplate),
        warnings: buildFallbackWarnings(),
        validationErrors: [],
      };
    }
    const data = await res.json();
    if (!Array.isArray(data.questions) || data.questions.length === 0) {
      return {
        usedAi: false,
        template: structuredClone(params.baseTemplate),
        warnings: buildFallbackWarnings(),
        validationErrors: [],
      };
    }
    const rawDrafted: MezgebTemplate = {
      ...structuredClone(params.baseTemplate),
      id: `${params.baseTemplate.id}-custom`,
      name: data.name ?? params.baseTemplate.name,
      description: data.description ?? params.baseTemplate.description,
      questions: data.questions,
    };
    const validated = validateTemplate(rawDrafted);
    return {
      usedAi: true,
      template: validated.template,
      warnings: Array.isArray(data.warnings) ? data.warnings : [],
      validationErrors: validated.errors,
    };
  } catch {
    return {
      usedAi: false,
      template: structuredClone(params.baseTemplate),
      warnings: buildFallbackWarnings(),
      validationErrors: [],
    };
  }
}

export interface ImproveQuestionResult {
  usedAi: boolean;
  label?: { am: string; en: string };
  hint?: { am: string; en: string };
  reason?: string;
}

export async function improveQuestionWithAi(params: {
  question: { type: string; label: { am: string; en: string }; hint?: { am: string; en: string } };
  lang: Lang;
}): Promise<ImproveQuestionResult> {
  try {
    const res = await fetchWithTimeout("/api/ai/improve-question", params);
    if (!res.ok) return { usedAi: false };
    const data = await res.json();
    if (!data.label?.en || !data.label?.am) return { usedAi: false };
    return {
      usedAi: true,
      label: { en: String(data.label.en), am: String(data.label.am) },
      hint: data.hint ? { en: String(data.hint.en ?? ""), am: String(data.hint.am ?? "") } : undefined,
      reason: String(data.reason ?? ""),
    };
  } catch {
    return { usedAi: false };
  }
}

export async function translateTextsWithAi(params: {
  texts: { key: string; text: string }[];
  from: Lang;
  to: Lang;
}): Promise<{ usedAi: boolean; texts: { key: string; text: string }[] }> {
  try {
    const res = await fetchWithTimeout("/api/ai/translate", params);
    if (!res.ok) return { usedAi: false, texts: [] };
    const data = await res.json();
    if (!Array.isArray(data.texts)) return { usedAi: false, texts: [] };
    return {
      usedAi: true,
      texts: data.texts.map((item: { key?: unknown; text?: unknown }) => ({
        key: String(item?.key ?? ""),
        text: String(item?.text ?? ""),
      })),
    };
  } catch {
    return { usedAi: false, texts: [] };
  }
}

export async function checkQuestionWithAi(params: {
  question: unknown;
}): Promise<{
  usedAi: boolean;
  issues: { severity: "must" | "should" | "tip"; issue: string; suggestion: string }[];
}> {
  try {
    const res = await fetchWithTimeout("/api/ai/check-question", params);
    if (!res.ok) return { usedAi: false, issues: [] };
    const data = await res.json();
    if (!Array.isArray(data.issues)) return { usedAi: false, issues: [] };
    return {
      usedAi: true,
      issues: data.issues,
    };
  } catch {
    return { usedAi: false, issues: [] };
  }
}
