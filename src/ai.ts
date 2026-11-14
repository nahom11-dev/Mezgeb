import { Lang } from "./i18n";
import { apiUrl } from "./lib/apiBase";

const AI_TIMEOUT_MS = 8000;
const VOICE_TIMEOUT_MS = 15000;

async function fetchWithTimeout(url: string, body: unknown, timeoutMs = AI_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(apiUrl(url), {
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
  /** Who transcribes voice answers on this server (named next to the microphone). */
  voiceProvider?: VoiceProvider | null;
  /** Per interface language: who transcribes voice answers (null = voice off for that language). */
  voiceProviders?: Record<Lang, VoiceProvider | null>;
  /** Per language: who reads text aloud on the server (null = the browser's own voice). */
  readAloudProviders?: Record<Lang, ReadAloudProvider | null>;
}

export type VoiceProvider = "addis" | "elevenlabs" | "gemini";
export type ReadAloudProvider = "addis" | "elevenlabs";

export const PROVIDER_NAMES: Record<VoiceProvider, string> = { addis: "Addis AI", elevenlabs: "ElevenLabs", gemini: "Gemini" };

function asVoiceProvider(v: unknown): VoiceProvider | null {
  return v === "addis" || v === "elevenlabs" || v === "gemini" ? v : null;
}
function asReadAloudProvider(v: unknown): ReadAloudProvider | null {
  return v === "addis" || v === "elevenlabs" ? v : null;
}

export async function getCapabilities(): Promise<ServerCapabilities> {
  try {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 4000);
    const res = await fetch(apiUrl("/api/capabilities"), { signal: controller.signal });
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
      voiceProvider: asVoiceProvider(data.voiceProvider),
      voiceProviders: data.voiceProviders
        ? { am: asVoiceProvider(data.voiceProviders.am), en: asVoiceProvider(data.voiceProviders.en) }
        : undefined,
      readAloudProviders: data.readAloudProviders
        ? { am: asReadAloudProvider(data.readAloudProviders.am), en: asReadAloudProvider(data.readAloudProviders.en) }
        : undefined,
    };
  } catch {
    return { voice: false, smartHelp: false, skillsAi: false, simplifyAi: false };
  }
}

/** Server read-aloud (Addis AI for Amharic, ElevenLabs for English): MP3 for template text, or null on any failure. */
export async function fetchReadAloudAudio(text: string, lang: Lang, signal?: AbortSignal): Promise<Blob | null> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 12000);
  const onAbort = () => controller.abort();
  signal?.addEventListener("abort", onAbort);
  try {
    const res = await fetch(apiUrl("/api/tts"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, lang }),
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const blob = await res.blob();
    return blob.size > 0 ? blob : null;
  } catch {
    return null;
  } finally {
    window.clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
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
