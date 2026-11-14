import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  DEFAULT_SECTIONS,
  DEFAULT_TEMPLATE_SETTINGS,
  DEFAULT_WIDGET_THEME,
  LEARNING_PLATFORM_TEMPLATE,
  TEMPLATES,
  getEffectiveSettings,
} from "../../templates";
import { createBlankQuestion } from "../../templates/library";
import {
  loadBuilderDraft,
  loadMyTemplates,
  saveBuilderDraft,
  saveToMyTemplates,
} from "../../templates/storage";
import { MezgebTemplate, QuestionType, TemplateQuestion } from "../../templates/types";
import { validateTemplate } from "../../templates/validate";

export type SaveStatus = "saved" | "dirty" | "saving";

const RECOMMENDED_CONSENT = {
  en: "I agree to create a profile. My support preferences stay private unless I choose to share them.",
  am: "መገለጫ ለመፍጠር ተስማምቻለሁ። ለማጋራት ካልመረጥኩ በስተቀር የድጋፍ ምርጫዎቼ ሚስጥራዊ ሆነው ይቆያሉ።",
};

function createEmptyFlow(): MezgebTemplate {
  const id = `flow-${Date.now().toString(36).slice(-6)}`;
  return {
    id,
    name: { en: "Untitled onboarding flow", am: "ያልተሰየመ የመጀመሪያ ምዝገባ" },
    description: { en: "Describe who signs up and what you ask.", am: "ማን እንደሚመዘገብ እና ምን እንደሚጠይቁ ይግለጹ።" },
    category: "custom",
    languages: ["am", "en"],
    idRoutes: ["partner_refer", "other_document"],
    supportNeeds: [],
    sections: structuredClone(DEFAULT_SECTIONS),
    settings: { ...DEFAULT_TEMPLATE_SETTINGS },
    theme: { ...DEFAULT_WIDGET_THEME },
    questions: [],
    consent: { ...RECOMMENDED_CONSENT },
    version: 1,
    updatedAt: new Date().toISOString(),
  };
}

function hydrateTemplate(raw: MezgebTemplate): MezgebTemplate {
  return {
    ...raw,
    sections: raw.sections?.length ? raw.sections : structuredClone(DEFAULT_SECTIONS),
    settings: getEffectiveSettings(raw),
    theme: raw.theme ?? { ...DEFAULT_WIDGET_THEME },
    updatedAt: raw.updatedAt ?? new Date().toISOString(),
  };
}

function loadInitialTemplate(location: ReturnType<typeof useLocation>, routeId?: string): MezgebTemplate {
  const stateObj = location.state as { template?: MezgebTemplate } | null;
  if (stateObj?.template) return hydrateTemplate(structuredClone(stateObj.template));

  if (routeId) {
    const decoded = decodeURIComponent(routeId);
    const builtIn = TEMPLATES.find((t) => t.id === decoded);
    const custom = loadMyTemplates().templates.find((t) => t.id === decoded);
    const found = builtIn ?? custom;
    if (found) {
      const cloned = structuredClone(found);
      if (builtIn) {
        cloned.id = `${cloned.id}-edit-${Date.now().toString(36).slice(-4)}`;
        cloned.category = "custom";
        cloned.tested = false;
      }
      return hydrateTemplate(cloned);
    }
  }

  const draft = loadBuilderDraft().template;
  if (draft) return hydrateTemplate(structuredClone(draft));

  return createEmptyFlow();
}

export function countAttentionIssues(tpl: MezgebTemplate): number {
  let n = 0;
  for (const q of tpl.questions) {
    if (!q.label.en.trim() && !q.label.am.trim()) n += 1;
    if ((q.type === "choice" || q.type === "multichoice") && (q.options?.length ?? 0) < 2) n += 1;
  }
  return n;
}

export function useFlowDraft() {
  const location = useLocation();
  const { id: routeId } = useParams<{ id?: string }>();
  const [template, setTemplate] = useState<MezgebTemplate>(() => loadInitialTemplate(location, routeId));
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [restoreSeed] = useState(() => structuredClone(LEARNING_PLATFORM_TEMPLATE));
  const snapshotRef = useRef(structuredClone(template));
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const attentionCount = useMemo(() => countAttentionIssues(template), [template]);

  const queueAutosave = useCallback((next: MezgebTemplate) => {
    setSaveStatus("dirty");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      setSaveStatus("saving");
      const stamped = { ...next, updatedAt: new Date().toISOString() };
      saveBuilderDraft(stamped);
      snapshotRef.current = structuredClone(stamped);
      setSaveStatus("saved");
    }, 600);
  }, []);

  const updateTemplate = useCallback(
    (updater: (prev: MezgebTemplate) => MezgebTemplate) => {
      setTemplate((prev) => {
        const next = updater(prev);
        queueAutosave(next);
        return next;
      });
    },
    [queueAutosave]
  );

  const setFlowName = (en: string) => {
    updateTemplate((t) => ({ ...t, name: { ...t.name, en: en.trim() || t.name.en } }));
  };

  const updateQuestion = (qid: string, patch: Partial<TemplateQuestion>) => {
    updateTemplate((t) => ({
      ...t,
      questions: t.questions.map((q) => (q.id === qid ? { ...q, ...patch } : q)),
    }));
  };

  const addQuestion = (type: QuestionType) => {
    const q = createBlankQuestion(type);
    updateTemplate((t) => ({ ...t, questions: [...t.questions, q] }));
  };

  const duplicateQuestion = (qid: string) => {
    updateTemplate((t) => {
      const idx = t.questions.findIndex((q) => q.id === qid);
      if (idx < 0) return t;
      const copy = structuredClone(t.questions[idx]);
      copy.id = `${copy.id}_copy_${Date.now().toString(36).slice(-4)}`;
      copy.maps_to = `${copy.maps_to}_copy`;
      const next = [...t.questions];
      next.splice(idx + 1, 0, copy);
      return { ...t, questions: next };
    });
  };

  const moveQuestion = (qid: string, dir: -1 | 1) => {
    updateTemplate((t) => {
      const idx = t.questions.findIndex((q) => q.id === qid);
      const target = idx + dir;
      if (idx < 0 || target < 0 || target >= t.questions.length) return t;
      const next = [...t.questions];
      const [item] = next.splice(idx, 1);
      next.splice(target, 0, item);
      return { ...t, questions: next };
    });
  };

  const deleteQuestion = (qid: string) => {
    updateTemplate((t) => ({ ...t, questions: t.questions.filter((q) => q.id !== qid) }));
  };

  const restoreTemplateQuestions = () => {
    updateTemplate((t) => ({
      ...t,
      questions: structuredClone(restoreSeed.questions),
      name: { en: restoreSeed.name.en, am: restoreSeed.name.am },
    }));
  };

  const discardChanges = () => {
    const snap = structuredClone(snapshotRef.current);
    setTemplate(snap);
    saveBuilderDraft(snap);
    setSaveStatus("saved");
  };

  const saveToLibrary = () => {
    const checked = validateTemplate(template);
    saveToMyTemplates(checked.template);
    snapshotRef.current = structuredClone(checked.template);
    setTemplate(checked.template);
    setSaveStatus("saved");
    return checked;
  };

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  return {
    template,
    saveStatus,
    attentionCount,
    setFlowName,
    updateQuestion,
    addQuestion,
    duplicateQuestion,
    moveQuestion,
    deleteQuestion,
    restoreTemplateQuestions,
    discardChanges,
    saveToLibrary,
    setTemplate,
  };
}