import { TemplateQuestion } from "../templates/types";

export interface SavedProgressRecord {
  version?: number;
  questionId?: string;
  stepIndex?: number;
  answers?: Record<string, unknown>;
}

/** Pick the visible step index to resume from a saved record. */
export function resolveResumeStep(
  saved: SavedProgressRecord,
  visibleQuestions: Pick<TemplateQuestion, "id">[],
  allQuestions: Pick<TemplateQuestion, "id">[] = visibleQuestions
): number {
  if (visibleQuestions.length === 0) return 0;
  const reviewIndex = visibleQuestions.length;

  if (saved.questionId === "__review__") {
    return reviewIndex;
  }

  if (saved.questionId) {
    const visIdx = visibleQuestions.findIndex((q) => q.id === saved.questionId);
    if (visIdx >= 0) return visIdx;

    const fullIdx = allQuestions.findIndex((q) => q.id === saved.questionId);
    if (fullIdx >= 0) {
      let best = 0;
      for (let i = 0; i < visibleQuestions.length; i++) {
        const fi = allQuestions.findIndex((q) => q.id === visibleQuestions[i].id);
        if (fi >= 0 && fi < fullIdx) best = i;
      }
      return best;
    }
  }

  if (typeof saved.stepIndex === "number" && Number.isFinite(saved.stepIndex)) {
    return Math.min(Math.max(0, saved.stepIndex), reviewIndex);
  }

  return 0;
}

export function parseSavedProgress(raw: string): SavedProgressRecord | null {
  try {
    const parsed = JSON.parse(raw) as SavedProgressRecord;
    if (!parsed || typeof parsed !== "object") return null;
    if (!parsed.answers || typeof parsed.answers !== "object") return null;
    if (
      parsed.questionId === undefined &&
      (typeof parsed.stepIndex !== "number" || !Number.isFinite(parsed.stepIndex))
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function visibleQuestionsForAnswers(
  questions: TemplateQuestion[],
  answers: Record<string, unknown>,
  isVisible: (q: TemplateQuestion, ans: Record<string, unknown>, all: TemplateQuestion[]) => boolean
): TemplateQuestion[] {
  return questions.filter((q) => isVisible(q, answers as never, questions));
}

export function buildProgressSnapshot(
  stepIndex: number,
  visibleQuestions: Pick<TemplateQuestion, "id">[],
  answers: Record<string, unknown>
): SavedProgressRecord {
  const reviewIndex = visibleQuestions.length;
  const questionId =
    stepIndex >= reviewIndex
      ? "__review__"
      : visibleQuestions[stepIndex]?.id;
  return {
    version: 1,
    questionId,
    stepIndex,
    answers,
  };
}