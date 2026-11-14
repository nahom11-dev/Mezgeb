import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  checkQuestionWithAi,
  draftTemplateWithAi,
  improveQuestionWithAi,
  translateTextsWithAi,
} from "../ai";
import { AccessibleDialog } from "../components/AccessibleDialog";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CopyIcon,
  DownloadIcon,
  GitBranchIcon,
  GripIcon,
  LockIcon,
  MoreHorizontalIcon,
  PlusIcon,
  QuestionIcon,
  RedoIcon,
  ShieldIcon,
  TrashIcon,
  UndoIcon,
  VolumeIcon,
} from "../components/Icons";
import { Layout } from "../components/Layout";
import { useLiveAnnouncer } from "../components/LiveAnnouncer";
import { MezgebWidget } from "../components/MezgebWidget";
import { Lang, TranslationKeys, useI18n } from "../i18n";
import { safeSetSession } from "../lib/storage";
import {
  DEFAULT_SECTIONS,
  DEFAULT_TEMPLATE_SETTINGS,
  getEffectiveSettings,
  LEARNING_PLATFORM_TEMPLATE,
  SUPPORT_OPTIONS,
  TEMPLATES,
} from "../templates";
import {
  BLANK_QUESTION_TYPES,
  COMMON_FIELD_SUGGESTIONS,
  createBlankQuestion,
  parsePastedFormFields,
  READY_MADE_QUESTIONS,
  slugifyFieldKey,
} from "../templates/library";
import {
  loadBuilderDraft,
  loadMyTemplates,
  saveBuilderDraft,
  saveToMyTemplates,
} from "../templates/storage";
import {
  CheckerIssue,
  IdRoute,
  MezgebTemplate,
  QuestionOption,
  QuestionType,
  TemplateCategory,
  TemplateQuestion,
  TemplateSettings,
  ValidationPreset,
} from "../templates/types";
import {
  ALLOWED_QUESTION_TYPES,
  applyCheckerAutoFix,
  AVAILABLE_ICONS,
  evaluateTemplateChecker,
  hexContrastAgainstWhite,
  validateTemplate,
} from "../templates/validate";

type InspectorTab = "question" | "settings" | "look" | "checker" | "export";
type MobilePanel = "outline" | "edit" | "preview";

const ACCENT_SWATCHES = [
  "#6A4FC4",
  "#1F5C46",
  "#111111",
  "#1D4ED8",
  "#9A3412",
  "#7C2D12",
];

const RECOMMENDED_CONSENT = {
  en: "I agree to create a profile. My support preferences stay private unless I choose to share them.",
  am: "መገለጫ ለመፍጠር ተስማምቻለሁ። ለማጋራት ካልመረጥኩ በስተቀር የድጋፍ ምርጫዎቼ ሚስጥራዊ ሆነው ይቆያሉ።",
};

function downloadJsonFile(tpl: MezgebTemplate) {
  const blob = new Blob([JSON.stringify(tpl, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${tpl.id || "mezgeb-template"}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function getIdRouteLabelKey(route: IdRoute): TranslationKeys {
  switch (route) {
    case "fayda":
      return "idRouteFayda";
    case "refugee_id":
      return "idRouteRefugee";
    case "other_document":
      return "idRouteOther";
    case "partner_refer":
      return "idRoutePartner";
  }
}

export function TemplateBuilderPage() {
  const { lang, setLang, t } = useI18n();
  const { announce } = useLiveAnnouncer();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Initialize from ?id=, router state, or leave on Start Screen
  const [template, setTemplate] = useState<MezgebTemplate | null>(() => {
    const stateObj = location.state as { template?: MezgebTemplate } | null;
    if (stateObj?.template) {
      const cloned = structuredClone(stateObj.template);
      return {
        ...cloned,
        sections: cloned.sections?.length ? cloned.sections : structuredClone(DEFAULT_SECTIONS),
        settings: getEffectiveSettings(cloned),
        theme: cloned.theme ?? { accent: "#6A4FC4", platformName: "Learnhub", logoLetter: "L" },
      };
    }
    const idParam = searchParams.get("id");
    if (idParam) {
      const builtIn = TEMPLATES.find((item) => item.id === idParam);
      const custom = loadMyTemplates().templates.find((item) => item.id === idParam);
      const found = builtIn ?? custom;
      if (found) {
        const cloned = structuredClone(found);
        return {
          ...cloned,
          id: builtIn ? `${cloned.id}-custom-${Date.now().toString(36).slice(-4)}` : cloned.id,
          category: builtIn ? "custom" : cloned.category ?? "custom",
          tested: false,
          sections: cloned.sections?.length ? cloned.sections : structuredClone(DEFAULT_SECTIONS),
          settings: getEffectiveSettings(cloned),
          theme: cloned.theme ?? { accent: "#6A4FC4", platformName: "Learnhub", logoLetter: "L" },
        };
      }
    }
    return null;
  });

  const savedDraft = useMemo(() => loadBuilderDraft().template, []);

  // Undo / Redo (last 30 snapshots in memory)
  const [undoStack, setUndoStack] = useState<MezgebTemplate[]>([]);
  const [redoStack, setRedoStack] = useState<MezgebTemplate[]>([]);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [storageBlocked, setStorageBlocked] = useState(false);

  // Navigation & panel state
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(() =>
    template?.questions[0]?.id ?? null
  );
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>("question");
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>("outline");
  const [nameEditLang, setNameEditLang] = useState<Lang>(lang);

  // Start Screen state
  const [startDescribeOpen, setStartDescribeOpen] = useState<boolean>(
    () => searchParams.get("mode") === "describe"
  );
  const [describeText, setDescribeText] = useState("");
  const [describeLang, setDescribeLang] = useState<Lang>(lang);
  const [describeBaseId, setDescribeBaseId] = useState("learning-platform");
  const [draftLoading, setDraftLoading] = useState(false);
  const [startNotice, setStartNotice] = useState<string | null>(null);
  const [pasteText, setPasteText] = useState("");
  const [importOpen, setImportOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState("");
  const [importError, setImportError] = useState<string | null>(null);

  // Outline sections & menus
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [renamingSectionId, setRenamingSectionId] = useState<string | null>(null);
  const [sectionRenameDraft, setSectionRenameDraft] = useState("");
  const [rowMenuId, setRowMenuId] = useState<string | null>(null);
  const [draggedQuestionId, setDraggedQuestionId] = useState<string | null>(null);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [libraryTab, setLibraryTab] = useState<"ready" | "blank">("ready");
  const [deletedToast, setDeletedToast] = useState<{
    question: TemplateQuestion;
    index: number;
    label: string;
  } | null>(null);
  const deleteToastTimerRef = useRef<number | null>(null);

  // Inspector sub-UI state
  const [typeChangeConfirm, setTypeChangeConfirm] = useState<QuestionType | null>(null);
  const [pasteOptionsOpen, setPasteOptionsOpen] = useState(false);
  const [pasteOptionsText, setPasteOptionsText] = useState("");
  const [manualOptValues, setManualOptValues] = useState<Record<number, boolean>>({});
  const [noAmharicVoiceNote, setNoAmharicVoiceNote] = useState(false);
  const [audioPlayError, setAudioPlayError] = useState<string | null>(null);

  // AI tools state
  const [aiImproveSuggestion, setAiImproveSuggestion] = useState<{
    questionId: string;
    label: { am: string; en: string };
    hint?: { am: string; en: string };
    reason?: string;
  } | null>(null);
  const [aiTranslateNeedsReview, setAiTranslateNeedsReview] = useState<Record<string, boolean>>({});
  const [aiQuestionIssues, setAiQuestionIssues] = useState<CheckerIssue[]>([]);
  const [aiToolBusy, setAiToolBusy] = useState(false);
  const [aiToolMessage, setAiToolMessage] = useState<string | null>(null);
  const [aiCheckerIssues, setAiCheckerIssues] = useState<CheckerIssue[]>([]);
  const [aiCheckerBusy, setAiCheckerBusy] = useState(false);

  // Preview toggles
  const [previewAiOff, setPreviewAiOff] = useState(false);
  const [previewOffline, setPreviewOffline] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"phone" | "desktop">("phone");
  const [previewKey, setPreviewKey] = useState(0);

  // Export & feedback
  const [exportFeedback, setExportFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  const previewSectionRef = useRef<HTMLElement>(null);
  const describeTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (startDescribeOpen && !template) {
      describeTextareaRef.current?.focus();
    }
  }, [startDescribeOpen, template]);

  // Ensure selectedQuestionId always points to a valid question when template changes
  useEffect(() => {
    if (!template) return;
    if (!selectedQuestionId || !template.questions.some((q) => q.id === selectedQuestionId)) {
      setSelectedQuestionId(template.questions[0]?.id ?? null);
    }
  }, [template, selectedQuestionId]);

  // Autosave draft to localStorage in try/catch
  useEffect(() => {
    if (!template) return;
    setSaveStatus("saving");
    const timer = window.setTimeout(() => {
      const res = saveBuilderDraft(template);
      if (res.blocked) {
        setStorageBlocked(true);
        setSaveStatus("unsaved");
      } else {
        setStorageBlocked(false);
        setSaveStatus("saved");
      }
    }, 250);
    return () => window.clearTimeout(timer);
  }, [template]);

  const applyTemplateChange = useCallback(
    (updater: (curr: MezgebTemplate) => MezgebTemplate) => {
      setTemplate((curr) => {
        if (!curr) return curr;
        const next = updater(curr);
        setUndoStack((prev) => [...prev.slice(-29), curr]);
        setRedoStack([]);
        return next;
      });
    },
    []
  );

  const handleUndo = useCallback(() => {
    if (!template || undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev.slice(-29), template]);
    setTemplate(previous);
    announce(t("builderUndo"));
  }, [template, undoStack, announce, t]);

  const handleRedo = useCallback(() => {
    if (!template || redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [...prev.slice(-29), template]);
    setTemplate(next);
    announce(t("builderRedo"));
  }, [template, redoStack, announce, t]);

  const selectedIndex = useMemo(
    () => (template && selectedQuestionId ? template.questions.findIndex((q) => q.id === selectedQuestionId) : -1),
    [template, selectedQuestionId]
  );

  const selectedQuestion = useMemo(
    () => (template && selectedIndex >= 0 ? template.questions[selectedIndex] : null),
    [template, selectedIndex]
  );

  const ruleCheckerIssues = useMemo(
    () => (template ? evaluateTemplateChecker(template) : []),
    [template]
  );

  const allCheckerIssues = useMemo(
    () => [...ruleCheckerIssues, ...aiCheckerIssues],
    [ruleCheckerIssues, aiCheckerIssues]
  );

  const checkerCounts = useMemo(() => {
    let must = 0;
    let should = 0;
    let tips = 0;
    for (const iss of allCheckerIssues) {
      if (iss.severity === "must") must++;
      else if (iss.severity === "should") should++;
      else tips++;
    }
    return { must, should, tips };
  }, [allCheckerIssues]);

  const issueByQuestionId = useMemo(() => {
    const map = new Map<string, "must" | "should" | "tip">();
    for (const iss of allCheckerIssues) {
      if (!iss.questionId) continue;
      const existing = map.get(iss.questionId);
      if (
        !existing ||
        (iss.severity === "must" && existing !== "must") ||
        (iss.severity === "should" && existing === "tip")
      ) {
        map.set(iss.questionId, iss.severity);
      }
    }
    return map;
  }, [allCheckerIssues]);

  // Question operations (move, duplicate, delete with undo toast)
  const moveQuestionById = useCallback(
    (questionId: string, delta: -1 | 1) => {
      if (!template) return;
      const idx = template.questions.findIndex((q) => q.id === questionId);
      const targetIdx = idx + delta;
      if (idx < 0 || targetIdx < 0 || targetIdx >= template.questions.length) return;
      const movedLabel = template.questions[idx].label[lang] || template.questions[idx].label.en || questionId;
      applyTemplateChange((curr) => {
        const qs = [...curr.questions];
        const [item] = qs.splice(idx, 1);
        qs.splice(targetIdx, 0, item);
        return { ...curr, questions: qs };
      });
      announce(
        t("builderMovedAnnouncement", { label: movedLabel, pos: targetIdx + 1 })
      );
    },
    [template, lang, applyTemplateChange, announce, t]
  );

  const duplicateQuestionById = useCallback(
    (questionId: string) => {
      if (!template) return;
      const idx = template.questions.findIndex((q) => q.id === questionId);
      if (idx < 0) return;
      const source = template.questions[idx];
      const newId = `${source.id}_copy_${Date.now().toString(36).slice(-4)}`;
      const existingMaps = new Set(template.questions.map((q) => q.maps_to));
      let newMaps = `${source.maps_to}_copy`;
      let n = 2;
      while (existingMaps.has(newMaps)) {
        newMaps = `${source.maps_to}_copy_${n++}`;
      }
      const copy: TemplateQuestion = {
        ...structuredClone(source),
        id: newId,
        label: {
          en: source.label.en ? `${source.label.en} (copy)` : "",
          am: source.label.am ? `${source.label.am} (ቅጂ)` : "",
        },
        maps_to: source.type === "info" ? `custom_${newId}` : newMaps,
      };
      applyTemplateChange((curr) => {
        const qs = [...curr.questions];
        qs.splice(idx + 1, 0, copy);
        return { ...curr, questions: qs };
      });
      setSelectedQuestionId(newId);
      setRowMenuId(null);
    },
    [template, applyTemplateChange]
  );

  const deleteQuestionById = useCallback(
    (questionId: string) => {
      if (!template) return;
      const idx = template.questions.findIndex((q) => q.id === questionId);
      if (idx < 0) return;
      const removed = template.questions[idx];
      const removedLabel = removed.label[lang] || removed.label.en || removed.id;

      applyTemplateChange((curr) => ({
        ...curr,
        questions: curr.questions.filter((q) => q.id !== questionId),
      }));
      setRowMenuId(null);

      if (selectedQuestionId === questionId) {
        const fallback = template.questions[idx + 1] ?? template.questions[idx - 1] ?? null;
        setSelectedQuestionId(fallback?.id ?? null);
      }

      if (deleteToastTimerRef.current) {
        window.clearTimeout(deleteToastTimerRef.current);
      }
      setDeletedToast({ question: removed, index: idx, label: removedLabel });
      announce(t("builderDeletedToast", { label: removedLabel }));
      deleteToastTimerRef.current = window.setTimeout(() => {
        setDeletedToast(null);
      }, 8000);
    },
    [template, lang, applyTemplateChange, selectedQuestionId, announce, t]
  );

  const handleRestoreDeletedToast = () => {
    if (!deletedToast || !template) return;
    const { question, index } = deletedToast;
    applyTemplateChange((curr) => {
      const qs = [...curr.questions];
      qs.splice(Math.min(index, qs.length), 0, question);
      return { ...curr, questions: qs };
    });
    setSelectedQuestionId(question.id);
    setDeletedToast(null);
  };

  // Global keyboard shortcuts for Builder
  useEffect(() => {
    if (!template) return;
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const isTextInput =
        tag === "input" || tag === "textarea" || tag === "select" || Boolean(target?.isContentEditable);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
        if (isTextInput) return;
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "d") {
        e.preventDefault();
        if (selectedQuestionId) duplicateQuestionById(selectedQuestionId);
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        setInspectorTab("checker");
        setMobilePanel("edit");
        announce(
          t("checkerSummary", {
            must: checkerCounts.must,
            should: checkerCounts.should,
            tips: checkerCounts.tips,
          })
        );
        return;
      }

      if (e.key === "?" && !isTextInput) {
        e.preventDefault();
        setShortcutsOpen(true);
        return;
      }

      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        !isTextInput &&
        selectedQuestionId &&
        target?.closest("[data-outline-list]")
      ) {
        e.preventDefault();
        deleteQuestionById(selectedQuestionId);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    template,
    selectedQuestionId,
    handleUndo,
    handleRedo,
    duplicateQuestionById,
    deleteQuestionById,
    checkerCounts,
    announce,
    t,
  ]);

  // Open template helper
  const openTemplateInBuilder = (tpl: MezgebTemplate, initialTab: InspectorTab = "question") => {
    const cloned = structuredClone(tpl);
    const ready: MezgebTemplate = {
      ...cloned,
      sections: cloned.sections?.length ? cloned.sections : structuredClone(DEFAULT_SECTIONS),
      settings: getEffectiveSettings(cloned),
      theme: cloned.theme ?? { accent: "#6A4FC4", platformName: "Learnhub", logoLetter: "L" },
    };
    setTemplate(ready);
    setUndoStack([]);
    setRedoStack([]);
    setAiCheckerIssues([]);
    setAiQuestionIssues([]);
    setExportFeedback(null);
    setSelectedQuestionId(ready.questions[0]?.id ?? null);
    setInspectorTab(initialTab);
    setMobilePanel("outline");
  };

  // Start Screen handlers
  const handleStartFromBuiltIn = (base: MezgebTemplate) => {
    const copy: MezgebTemplate = {
      ...structuredClone(base),
      id: `${base.id}-custom-${Date.now().toString(36).slice(-4)}`,
      name: {
        en: `${base.name.en} (custom)`,
        am: `${base.name.am} (የግል)`,
      },
      category: "custom",
      tested: false,
      version: 1,
      updatedAt: new Date().toISOString(),
    };
    openTemplateInBuilder(copy, "question");
  };

  const handleDescribeWithAi = async () => {
    if (!describeText.trim()) return;
    setStartNotice(null);
    setDraftLoading(true);
    const base = TEMPLATES.find((item) => item.id === describeBaseId) ?? LEARNING_PLATFORM_TEMPLATE;
    const res = await draftTemplateWithAi({
      baseTemplate: base,
      description: describeText,
      lang: describeLang,
    });
    setDraftLoading(false);
    if (!res.usedAi) {
      setStartNotice(t("templatesBuilderFallbackNotice"));
      return;
    }
    const drafted: MezgebTemplate = {
      ...res.template,
      id: `ai-draft-${Date.now().toString(36).slice(-4)}`,
      category: "custom",
      tested: false,
      sections: structuredClone(DEFAULT_SECTIONS),
      settings: getEffectiveSettings(base),
      theme: { ...base.theme! },
    };
    openTemplateInBuilder(drafted, res.validationErrors.length > 0 || res.warnings.length > 0 ? "checker" : "question");
  };

  const handlePasteFieldsOffline = async (useAiImprove = false) => {
    if (!pasteText.trim()) return;
    const questions = parsePastedFormFields(pasteText);
    if (questions.length === 0) return;

    if (useAiImprove && !previewOffline && !previewAiOff) {
      setDraftLoading(true);
      const base = LEARNING_PLATFORM_TEMPLATE;
      const res = await draftTemplateWithAi({
        baseTemplate: base,
        description: `Convert and improve these form fields into accessible questions: ${pasteText}`,
        lang,
      });
      setDraftLoading(false);
      if (res.usedAi) {
        openTemplateInBuilder(
          {
            ...res.template,
            id: `pasted-ai-${Date.now().toString(36).slice(-4)}`,
            category: "custom",
            tested: false,
          },
          "checker"
        );
        return;
      }
    }

    const customTpl: MezgebTemplate = {
      id: `pasted-form-${Date.now().toString(36).slice(-4)}`,
      name: { en: "Custom sign-up template", am: "የግል የምዝገባ ቅጽ" },
      description: {
        en: "Created from pasted form fields.",
        am: "ከተለጠፉ የቅጽ መስኮች የተፈጠረ።",
      },
      category: "custom",
      bestFor: { en: "Custom programme intake", am: "የግል ፕሮግራም ምዝገባ" },
      tested: false,
      languages: ["am", "en"],
      idRoutes: ["fayda", "refugee_id", "other_document", "partner_refer"],
      supportNeeds: SUPPORT_OPTIONS.map((o) => o.value),
      sections: structuredClone(DEFAULT_SECTIONS),
      settings: { ...DEFAULT_TEMPLATE_SETTINGS },
      theme: { accent: "#6A4FC4", platformName: "Learnhub", logoLetter: "L" },
      questions,
      consent: { ...RECOMMENDED_CONSENT },
    };
    openTemplateInBuilder(customTpl, "checker");
  };

  const handleImportJsonSubmit = () => {
    setImportError(null);
    try {
      const parsed = JSON.parse(importJsonText) as MezgebTemplate;
      if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.questions)) {
        setImportError(t("builderImportJsonBadFormat"));
        return;
      }
      const checked = validateTemplate(parsed);
      setImportOpen(false);
      openTemplateInBuilder(
        checked.template,
        checked.valid ? "question" : "checker"
      );
    } catch {
      setImportError(t("builderImportJsonBadFormat"));
    }
  };

  // Insert question from library after selected question
  const insertQuestionIntoTemplate = (rawQ: TemplateQuestion) => {
    if (!template) return;
    const existingIds = new Set(template.questions.map((q) => q.id));
    const existingMaps = new Set(template.questions.map((q) => q.maps_to));

    let nextId = rawQ.id;
    let n = 2;
    while (existingIds.has(nextId)) {
      nextId = `${rawQ.id}_${n++}`;
    }

    let nextMaps = rawQ.maps_to;
    if (
      nextMaps &&
      !nextMaps.startsWith("custom_") &&
      rawQ.type !== "info" &&
      rawQ.type !== "id-routes" &&
      rawQ.type !== "support" &&
      rawQ.type !== "work-story"
    ) {
      let m = 2;
      while (existingMaps.has(nextMaps)) {
        nextMaps = `${rawQ.maps_to}_${m++}`;
      }
    }

    const qToInsert: TemplateQuestion = {
      ...structuredClone(rawQ),
      id: nextId,
      maps_to: rawQ.type === "info" ? `custom_${nextId}` : nextMaps,
    };

    const insertPos = selectedIndex >= 0 ? selectedIndex + 1 : template.questions.length;
    applyTemplateChange((curr) => {
      const qs = [...curr.questions];
      qs.splice(insertPos, 0, qToInsert);
      return { ...curr, questions: qs };
    });
    setSelectedQuestionId(nextId);
    setLibraryOpen(false);
    setInspectorTab("question");
  };

  // Update selected question helper
  const updateSelectedQuestion = (updater: (q: TemplateQuestion) => TemplateQuestion) => {
    if (!selectedQuestionId) return;
    applyTemplateChange((curr) => ({
      ...curr,
      questions: curr.questions.map((q) => (q.id === selectedQuestionId ? updater(q) : q)),
    }));
  };

  // Read aloud preview (never speak Amharic with an English voice)
  const previewReadAloud = (text: string, targetLang: Lang, audioUrl?: string) => {
    if (!text.trim()) return;
    if (audioUrl) {
      try {
        const audio = new Audio(audioUrl);
        setAudioPlayError(null);
        audio.onerror = () => setAudioPlayError(t("inspAudioPlayError"));
        audio.play().catch(() => setAudioPlayError(t("inspAudioPlayError")));
        return;
      } catch {
        setAudioPlayError(t("inspAudioPlayError"));
        return;
      }
    }
    if (!("speechSynthesis" in window)) return;
    const voices = window.speechSynthesis.getVoices();
    const hasAm = voices.some((v) => v.lang.toLowerCase().startsWith("am"));
    if (targetLang === "am" && !hasAm) {
      setNoAmharicVoiceNote(true);
      return;
    }
    setNoAmharicVoiceNote(false);
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = targetLang === "am" ? "am-ET" : "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utt);
  };

  // Validate / save / playground handlers
  const handleRunSaveToMyTemplates = () => {
    if (!template) return;
    const check = validateTemplate(template);
    const mustCount = evaluateTemplateChecker(template).filter((i) => i.severity === "must").length;
    if (!check.valid || mustCount > 0) {
      setInspectorTab("checker");
      setExportFeedback({ type: "error", text: t("exportValidationBlocked") });
      return;
    }
    const res = saveToMyTemplates(template);
    if (res.blocked) {
      setStorageBlocked(true);
      setExportFeedback({ type: "error", text: t("exportStorageBlocked") });
    } else {
      setExportFeedback({ type: "success", text: t("exportSavedSuccess") });
      announce(t("exportSavedSuccess"));
    }
  };

  const handleUseInPlayground = () => {
    if (!template) return;
    const check = validateTemplate(template);
    const mustCount = evaluateTemplateChecker(template).filter((i) => i.severity === "must").length;
    if (!check.valid || mustCount > 0) {
      setInspectorTab("checker");
      setMobilePanel("edit");
      setExportFeedback({ type: "error", text: t("exportValidationBlocked") });
      announce(t("exportValidationBlocked"));
      return;
    }
    safeSetSession("mezgeb_custom_template", JSON.stringify(template));
    navigate("/playground");
  };

  const aiToolsOnline =
    !previewAiOff && !previewOffline && (typeof navigator === "undefined" || navigator.onLine);

  // ============================================================================
  // START SCREEN RENDER
  // ============================================================================
  if (!template) {
    const startBrowserOffline =
      typeof navigator !== "undefined" && navigator.onLine === false;

    return (
      <Layout>
        <div className="max-w-[1160px] mx-auto px-4 sm:px-6 md:px-10 py-10 md:py-12 space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <Link to="/templates" className="text-sm font-medium text-[#6A4FC4] underline">
                ← {t("builderBackGallery")}
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#111111]">
                {t("builderStartTitle")}
              </h1>
              <p className="text-base text-[#6B6B6B]">{t("builderStartSubtitle")}</p>
            </div>

            <button
              type="button"
              onClick={() => {
                setImportError(null);
                setImportOpen(true);
              }}
              className="text-sm font-semibold text-[#6A4FC4] underline min-h-[44px] px-2"
            >
              {t("builderImportJsonLink")}
            </button>
          </div>

          {savedDraft && (
            <div className="mezgeb-card p-5 bg-[#EEEBF8]/60 border-[#8F6FE0] flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#111111]">
                  {savedDraft.name[lang] || savedDraft.name.en} ({savedDraft.questions.length}{" "}
                  {t("templatesCompareColQuestions").toLowerCase()})
                </p>
                <p className="text-xs text-[#6B6B6B]">{t("builderStatusSaved")}</p>
              </div>
              <button
                type="button"
                onClick={() => openTemplateInBuilder(savedDraft, "question")}
                className="mezgeb-btn-primary text-sm"
              >
                {t("templatesCustomizeBtn")}
              </button>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-6 items-start">
            {/* Choice 1: Start from a template */}
            <section className="mezgeb-card p-6 space-y-4">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-[#111111]">
                  {t("builderStartFromTplTitle")}
                </h2>
                <p className="text-sm text-[#6B6B6B]">{t("builderStartFromTplDesc")}</p>
              </div>
              <div className="space-y-2.5">
                {TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => handleStartFromBuiltIn(tpl)}
                    className="w-full text-left p-3.5 rounded-xl border border-[#E7E7E4] bg-[#F5F5F3]/60 hover:bg-[#EEEBF8]/50 hover:border-[#8F6FE0] transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#111111] truncate">
                        {tpl.name[lang]}
                      </p>
                      <p className="text-xs text-[#6B6B6B] truncate">
                        {t("templatesQuestionsCount", { count: tpl.questions.length })}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-[#6A4FC4] shrink-0">
                      {t("templatesCustomizeBtn")} →
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* Choice 2: Describe what you need */}
            <section
              className={`mezgeb-card p-6 space-y-4 ${
                startDescribeOpen ? "border-[#6A4FC4] ring-1 ring-[#6A4FC4]" : ""
              }`}
            >
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-[#111111]">
                  {t("builderStartDescribeTitle")}
                </h2>
                <p className="text-sm text-[#6B6B6B]">{t("builderStartDescribeDesc")}</p>
              </div>

              <p className="text-xs text-[#6B6B6B] bg-[#F5F5F3] px-3 py-2 rounded-lg border border-[#E7E7E4]">
                {startBrowserOffline
                  ? t("builderStartDescribeAiOffNote")
                  : t("cloudAiNotice")}
              </p>

              {startNotice && (
                <p role="status" className="text-xs text-[#111111] bg-[#F9F3EA] p-2.5 rounded-lg">
                  {startNotice}
                </p>
              )}

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label
                      htmlFor="desc-base"
                      className="block text-xs font-medium text-[#111111] mb-1"
                    >
                      {t("templatesBuilderStartFrom")}
                    </label>
                    <select
                      id="desc-base"
                      value={describeBaseId}
                      onChange={(e) => setDescribeBaseId(e.target.value)}
                      className="w-full min-h-[38px] px-2.5 rounded-lg border border-[#E7E7E4] bg-white text-xs"
                    >
                      {TEMPLATES.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name[lang]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="desc-lang"
                      className="block text-xs font-medium text-[#111111] mb-1"
                    >
                      {t("templatesBuilderLangLabel")}
                    </label>
                    <select
                      id="desc-lang"
                      value={describeLang}
                      onChange={(e) => setDescribeLang(e.target.value as Lang)}
                      className="w-full min-h-[38px] px-2.5 rounded-lg border border-[#E7E7E4] bg-white text-xs"
                    >
                      <option value="am">{t("optLangAm")}</option>
                      <option value="en">{t("optLangEn")}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="desc-input"
                    className="block text-xs font-medium text-[#111111] mb-1"
                  >
                    {t("templatesBuilderInputLabel")}
                  </label>
                  <textarea
                    ref={describeTextareaRef}
                    id="desc-input"
                    rows={4}
                    value={describeText}
                    onChange={(e) => {
                      setDescribeText(e.target.value);
                      setStartDescribeOpen(true);
                    }}
                    placeholder={t("templatesBuilderPlaceholder")}
                    className="w-full p-3 rounded-xl border border-[#E7E7E4] bg-white text-sm"
                  />
                </div>

                <button
                  type="button"
                  disabled={draftLoading || !describeText.trim() || startBrowserOffline}
                  onClick={handleDescribeWithAi}
                  className="mezgeb-btn-primary w-full text-sm disabled:opacity-50"
                >
                  {draftLoading ? t("templatesBuilderDrafting") : t("templatesBuilderDraftBtn")}
                </button>
              </div>
            </section>

            {/* Choice 3: Paste your current form */}
            <section className="mezgeb-card p-6 space-y-4">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-[#111111]">
                  {t("builderStartPasteTitle")}
                </h2>
                <p className="text-sm text-[#6B6B6B]">{t("builderStartPasteDesc")}</p>
              </div>

              <div>
                <label
                  htmlFor="paste-form-fields"
                  className="block text-xs font-medium text-[#111111] mb-1"
                >
                  {t("builderStartPasteTitle")}
                </label>
                <textarea
                  id="paste-form-fields"
                  rows={5}
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  placeholder={t("builderStartPastePlaceholder")}
                  className="w-full p-3 rounded-xl border border-[#E7E7E4] bg-white text-sm font-mono"
                />
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  disabled={!pasteText.trim()}
                  onClick={() => handlePasteFieldsOffline(false)}
                  className="mezgeb-btn-primary w-full text-sm disabled:opacity-50"
                >
                  {t("builderStartPasteCreateBtn")}
                </button>
                {!startBrowserOffline && (
                  <button
                    type="button"
                    disabled={draftLoading || !pasteText.trim()}
                    onClick={() => handlePasteFieldsOffline(true)}
                    className="mezgeb-btn-secondary w-full text-sm disabled:opacity-50"
                  >
                    {t("builderStartPasteAiBtn")}
                  </button>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* Import JSON Dialog */}
        <AccessibleDialog
          open={importOpen}
          onClose={() => setImportOpen(false)}
          title={t("builderImportJsonTitle")}
          maxWidthClass="max-w-lg"
        >
          <div className="space-y-4">
            <p className="text-sm text-[#6B6B6B]">{t("builderImportJsonDesc")}</p>
            <div>
              <label
                htmlFor="import-json-file"
                className="block text-sm font-medium text-[#111111] mb-1"
              >
                {t("builderImportJsonFileLabel")}
              </label>
              <input
                id="import-json-file"
                type="file"
                accept=".json,application/json"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    setImportJsonText(typeof reader.result === "string" ? reader.result : "");
                    setImportError(null);
                  };
                  reader.readAsText(file);
                }}
                className="block w-full text-sm text-[#6B6B6B]"
              />
            </div>

            <div>
              <label
                htmlFor="import-json-text"
                className="block text-sm font-medium text-[#111111] mb-1"
              >
                {t("builderImportJsonTextLabel")}
              </label>
              <textarea
                id="import-json-text"
                rows={8}
                value={importJsonText}
                onChange={(e) => {
                  setImportJsonText(e.target.value);
                  setImportError(null);
                }}
                className="w-full p-3 rounded-xl border border-[#E7E7E4] text-xs font-mono"
              />
            </div>

            {importError && (
              <p role="alert" className="text-sm text-red-700 font-medium">
                {importError}
              </p>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setImportOpen(false)}
                className="mezgeb-btn-secondary text-sm"
              >
                {t("cancelButton")}
              </button>
              <button
                type="button"
                onClick={handleImportJsonSubmit}
                disabled={!importJsonText.trim()}
                className="mezgeb-btn-primary text-sm disabled:opacity-50"
              >
                {t("builderImportJsonBtn")}
              </button>
            </div>
          </div>
        </AccessibleDialog>
      </Layout>
    );
  }

  // ============================================================================
  // THREE-PANEL BUILDER RENDER
  // ============================================================================
  const sections = template.sections?.length ? template.sections : DEFAULT_SECTIONS;
  const sectionIds = new Set(sections.map((s) => s.id));
  const unsortedQuestions = template.questions.filter(
    (q) => !q.section || !sectionIds.has(q.section)
  );
  const effectiveSettings = getEffectiveSettings(template);
  const currentTheme = template.theme ?? {
    accent: "#6A4FC4",
    platformName: "Learnhub",
    logoLetter: "L",
  };
  const accentContrast = hexContrastAgainstWhite(currentTheme.accent);
  const contrastPasses = accentContrast >= 4.5;

  const embedSnippet = `<script src="https://cdn.mezgeb.example/v1/widget.js" defer></script>
<mezgeb-register
  template="${template.id}"
  lang="${lang}"
  accent="${currentTheme.accent}"
></mezgeb-register>`;

  // Determine earlier questions for "Show this question only if…"
  const earlierQuestions = selectedIndex > 0 ? template.questions.slice(0, selectedIndex) : [];
  const condSourceQuestion = selectedQuestion?.showIf
    ? earlierQuestions.find((q) => q.id === selectedQuestion.showIf?.questionId) ?? null
    : null;

  const isDuplicateMapsTo =
    Boolean(selectedQuestion) &&
    selectedQuestion!.type !== "info" &&
    Boolean(selectedQuestion!.maps_to.trim()) &&
    !selectedQuestion!.maps_to.startsWith("custom_") &&
    template.questions.some(
      (q) => q.id !== selectedQuestion!.id && q.maps_to.trim() === selectedQuestion!.maps_to.trim()
    );

  // Support options for Template Settings tab (linked to support question if present)
  const supportQuestion = template.questions.find((q) => q.type === "support");
  const editableSupportOptions: QuestionOption[] =
    supportQuestion?.options && supportQuestion.options.length > 0
      ? supportQuestion.options
      : SUPPORT_OPTIONS;

  return (
    <Layout>
      <h1 className="sr-only">
        {t("builderTitle")}: {template.name[lang] || template.name.en}
      </h1>

      {/* STICKY TOP BAR */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-sm border-b border-[#E7E7E4]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 min-w-0">
            <Link
              to="/templates"
              className="text-xs font-semibold text-[#6A4FC4] underline whitespace-nowrap"
            >
              ← {t("builderBackGallery")}
            </Link>
            <button
              type="button"
              onClick={() => setTemplate(null)}
              className="text-xs font-medium text-[#6B6B6B] hover:text-[#111111] underline whitespace-nowrap"
            >
              {t("builderNewTemplateBtn")}
            </button>

            <div className="flex items-center gap-1.5 border border-[#E7E7E4] rounded-xl px-2 py-1 bg-[#FAF9F6]">
              <input
                type="text"
                aria-label={
                  nameEditLang === "en" ? t("templatesRenameLabelEn") : t("templatesRenameLabelAm")
                }
                value={template.name[nameEditLang]}
                placeholder={t("builderNamePlaceholder")}
                onChange={(e) => {
                  const val = e.target.value;
                  applyTemplateChange((curr) => ({
                    ...curr,
                    name: { ...curr.name, [nameEditLang]: val },
                  }));
                }}
                className="bg-transparent text-sm font-semibold text-[#111111] min-w-[160px] sm:min-w-[220px] focus:outline-none"
              />
              <div className="inline-flex rounded-lg border border-[#E7E7E4] bg-white p-0.5 text-[11px] font-semibold">
                <button
                  type="button"
                  aria-pressed={nameEditLang === "en"}
                  onClick={() => setNameEditLang("en")}
                  className={`px-1.5 py-0.5 rounded ${
                    nameEditLang === "en" ? "bg-[#111111] text-white" : "text-[#6B6B6B]"
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  aria-pressed={nameEditLang === "am"}
                  onClick={() => setNameEditLang("am")}
                  className={`px-1.5 py-0.5 rounded ${
                    nameEditLang === "am" ? "bg-[#111111] text-white" : "text-[#6B6B6B]"
                  }`}
                >
                  አማ
                </button>
              </div>
            </div>

            <span aria-live="polite" className="text-xs text-[#6B6B6B] whitespace-nowrap">
              {saveStatus === "saving"
                ? t("builderStatusSaving")
                : saveStatus === "unsaved"
                  ? t("builderStatusUnsaved")
                  : t("builderStatusSaved")}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleUndo}
              disabled={undoStack.length === 0}
              aria-label={t("builderUndo")}
              title={`${t("builderUndo")} (Ctrl/Cmd+Z)`}
              className="mezgeb-btn-secondary min-h-[36px] px-2.5 text-xs inline-flex items-center gap-1 disabled:opacity-40"
            >
              <UndoIcon size={14} />
              <span className="hidden xl:inline">{t("builderUndo")}</span>
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={redoStack.length === 0}
              aria-label={t("builderRedo")}
              title={`${t("builderRedo")} (Ctrl/Cmd+Shift+Z)`}
              className="mezgeb-btn-secondary min-h-[36px] px-2.5 text-xs inline-flex items-center gap-1 disabled:opacity-40"
            >
              <RedoIcon size={14} />
              <span className="hidden xl:inline">{t("builderRedo")}</span>
            </button>
            <button
              type="button"
              onClick={() => setShortcutsOpen(true)}
              aria-label={t("shortcutsTitle")}
              title={`${t("builderShortcutsBtn")} (?)`}
              className="mezgeb-btn-secondary min-h-[36px] px-2.5 text-xs font-bold"
            >
              ?
            </button>
            <button
              type="button"
              onClick={() => {
                setInspectorTab("checker");
                setMobilePanel("edit");
                announce(
                  t("checkerSummary", {
                    must: checkerCounts.must,
                    should: checkerCounts.should,
                    tips: checkerCounts.tips,
                  })
                );
              }}
              className="mezgeb-btn-secondary min-h-[36px] px-3 text-xs inline-flex items-center gap-1.5"
            >
              <span>{t("builderCheckBtn")}</span>
              {(checkerCounts.must > 0 || checkerCounts.should > 0) && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[11px] font-bold ${
                    checkerCounts.must > 0
                      ? "bg-red-100 text-red-800"
                      : "bg-amber-100 text-amber-900"
                  }`}
                >
                  {checkerCounts.must + checkerCounts.should}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setMobilePanel("preview");
                previewSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
              }}
              className="mezgeb-btn-secondary min-h-[36px] px-3 text-xs min-[900px]:hidden"
            >
              {t("builderPreviewBtn")}
            </button>
            <button
              type="button"
              onClick={() => {
                setInspectorTab("export");
                setMobilePanel("edit");
              }}
              className="mezgeb-btn-secondary min-h-[36px] px-3 text-xs"
            >
              {t("builderExportBtn")}
            </button>
            <button
              type="button"
              onClick={handleUseInPlayground}
              className="mezgeb-btn-primary min-h-[36px] px-3.5 text-xs"
            >
              {t("builderUsePlaygroundBtn")}
            </button>
          </div>
        </div>

        {/* Mobile panel tabs (< 900px) */}
        <div
          role="tablist"
          aria-label={t("builderTitle")}
          className="min-[900px]:hidden flex border-t border-[#E7E7E4] bg-[#FAF9F6]"
        >
          {(
            [
              { id: "outline", label: t("builderTabOutline") },
              { id: "edit", label: t("builderTabEdit") },
              { id: "preview", label: t("builderTabPreview") },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={mobilePanel === tab.id}
              onClick={() => setMobilePanel(tab.id)}
              className={`flex-1 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
                mobilePanel === tab.id
                  ? "border-[#6A4FC4] text-[#111111] bg-white"
                  : "border-transparent text-[#6B6B6B]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {storageBlocked && (
        <div
          role="status"
          className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-4"
        >
          <p className="text-xs text-[#111111] bg-[#F9F3EA] border border-[#E7E7E4] rounded-xl px-4 py-2.5">
            {t("exportStorageBlocked")}
          </p>
        </div>
      )}

      {/* Undo toast for deleted question */}
      {deletedToast && (
        <div
          role="status"
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-[#111111] text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-3 text-sm"
        >
          <span>{t("builderDeletedToast", { label: deletedToast.label })}</span>
          <button
            type="button"
            onClick={handleRestoreDeletedToast}
            className="underline font-semibold text-[#C8B9FA] min-h-[32px] px-1"
          >
            {t("builderUndoDeleteBtn")}
          </button>
        </div>
      )}

      {/* MAIN THREE-PANEL WORKSPACE */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 min-[900px]:grid-cols-[26%_38%_36%] gap-5 items-start">
        {/* LEFT PANEL: OUTLINE */}
        <aside
          aria-labelledby="outline-heading"
          className={`mezgeb-card p-4 space-y-4 ${
            mobilePanel === "outline" ? "block" : "hidden min-[900px]:block"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <h2 id="outline-heading" className="text-base font-bold text-[#111111]">
              {t("builderPanelOutlineHeading")}
            </h2>
            <button
              type="button"
              onClick={() => {
                const newSecId = `sec_${Date.now().toString(36).slice(-4)}`;
                applyTemplateChange((curr) => ({
                  ...curr,
                  sections: [
                    ...(curr.sections ?? DEFAULT_SECTIONS),
                    {
                      id: newSecId,
                      title: { en: t("builderNewSectionName"), am: t("builderNewSectionName") },
                    },
                  ],
                }));
              }}
              className="text-xs font-semibold text-[#6A4FC4] underline min-h-[32px] px-1"
            >
              + {t("builderAddSectionBtn")}
            </button>
          </div>

          <div className="space-y-3" data-outline-list>
            {sections.map((sec) => {
              const secQuestions = template.questions.filter((q) => q.section === sec.id);
              const isCollapsed = Boolean(collapsedSections[sec.id]);
              return (
                <div key={sec.id} className="border border-[#E7E7E4] rounded-xl bg-[#FAF9F6] overflow-hidden">
                  <div className="px-3 py-2 flex items-center justify-between gap-2 bg-[#F5F5F3] border-b border-[#E7E7E4]">
                    {renamingSectionId === sec.id ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          applyTemplateChange((curr) => ({
                            ...curr,
                            sections: (curr.sections ?? DEFAULT_SECTIONS).map((s) =>
                              s.id === sec.id
                                ? { ...s, title: { ...s.title, [lang]: sectionRenameDraft.trim() || s.title[lang] } }
                                : s
                            ),
                          }));
                          setRenamingSectionId(null);
                        }}
                        className="flex items-center gap-1 flex-1"
                      >
                        <input
                          type="text"
                          value={sectionRenameDraft}
                          onChange={(e) => setSectionRenameDraft(e.target.value)}
                          aria-label={t("builderRenameSection")}
                          className="w-full px-2 py-1 text-xs rounded border border-[#E7E7E4] bg-white"
                          autoFocus
                        />
                        <button type="submit" className="text-xs font-semibold text-[#6A4FC4] px-1.5">
                          {t("saveButton")}
                        </button>
                      </form>
                    ) : (
                      <button
                        type="button"
                        aria-expanded={!isCollapsed}
                        onClick={() =>
                          setCollapsedSections((prev) => ({ ...prev, [sec.id]: !prev[sec.id] }))
                        }
                        className="flex items-center gap-1.5 text-left text-xs font-bold text-[#111111] flex-1 min-w-0"
                      >
                        {isCollapsed ? <ChevronDownIcon size={14} /> : <ChevronUpIcon size={14} />}
                        <span className="truncate">{sec.title[lang] || sec.title.en}</span>
                        <span className="text-[#6B6B6B] font-normal">({secQuestions.length})</span>
                      </button>
                    )}

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setRenamingSectionId(sec.id);
                          setSectionRenameDraft(sec.title[lang] || sec.title.en);
                        }}
                        aria-label={`${t("builderRenameSection")}: ${sec.title[lang]}`}
                        className="text-[11px] text-[#6B6B6B] hover:text-[#111111] px-1"
                      >
                        ✎
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          applyTemplateChange((curr) => ({
                            ...curr,
                            sections: (curr.sections ?? DEFAULT_SECTIONS).filter((s) => s.id !== sec.id),
                            questions: curr.questions.map((q) =>
                              q.section === sec.id ? { ...q, section: undefined } : q
                            ),
                          }));
                        }}
                        aria-label={`${t("builderDeleteSection")}: ${sec.title[lang]}`}
                        className="text-[#6B6B6B] hover:text-red-700 p-1"
                      >
                        <TrashIcon size={12} />
                      </button>
                    </div>
                  </div>

                  {!isCollapsed && (
                    <ul className="p-1.5 space-y-1">
                      {secQuestions.map((q) => {
                        const globalIdx = template.questions.findIndex((item) => item.id === q.id);
                        const isSelected = q.id === selectedQuestionId;
                        const severity = issueByQuestionId.get(q.id);
                        return (
                          <li
                            key={q.id}
                            draggable
                            onDragStart={() => setDraggedQuestionId(q.id)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => {
                              if (!draggedQuestionId || draggedQuestionId === q.id) return;
                              const fromIdx = template.questions.findIndex((x) => x.id === draggedQuestionId);
                              const toIdx = template.questions.findIndex((x) => x.id === q.id);
                              if (fromIdx < 0 || toIdx < 0) return;
                              const movedLabel = template.questions[fromIdx].label[lang] || draggedQuestionId;
                              applyTemplateChange((curr) => {
                                const qs = [...curr.questions];
                                const [item] = qs.splice(fromIdx, 1);
                                qs.splice(toIdx, 0, { ...item, section: sec.id });
                                return { ...curr, questions: qs };
                              });
                              announce(t("builderMovedAnnouncement", { label: movedLabel, pos: toIdx + 1 }));
                              setDraggedQuestionId(null);
                            }}
                            className="relative"
                          >
                            <div
                              className={`flex items-center gap-1.5 rounded-lg border px-2 py-2 transition-colors ${
                                isSelected
                                  ? "bg-[#EEEBF8] border-[#6A4FC4]"
                                  : "bg-white border-[#E7E7E4] hover:bg-[#F5F5F3]"
                              }`}
                            >
                              <span aria-hidden="true" className="text-[#6B6B6B] cursor-grab shrink-0">
                                <GripIcon size={13} />
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedQuestionId(q.id);
                                  setRowMenuId(null);
                                }}
                                onKeyDown={(e) => {
                                  if (e.altKey && e.key === "ArrowUp") {
                                    e.preventDefault();
                                    moveQuestionById(q.id, -1);
                                  } else if (e.altKey && e.key === "ArrowDown") {
                                    e.preventDefault();
                                    moveQuestionById(q.id, 1);
                                  }
                                }}
                                aria-current={isSelected ? "true" : undefined}
                                className="flex-1 min-w-0 text-left flex items-start gap-1.5"
                              >
                                <span className="mt-0.5 shrink-0 text-[#6B6B6B]">
                                  <QuestionIcon name={q.icon} size={14} />
                                </span>
                                <span className="flex-1 min-w-0">
                                  <span className="block text-xs font-medium text-[#111111] truncate">
                                    {globalIdx + 1}. {q.label[lang] || q.label.en || t("inspMissingBadge")}
                                  </span>
                                  <span className="mt-0.5 flex flex-wrap items-center gap-1">
                                    {q.required && (
                                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#F5F5F3] text-[#111111] font-medium">
                                        {t("builderRequiredBadge")}
                                      </span>
                                    )}
                                    {q.sensitive && (
                                      <span
                                        title={t("builderSensitiveBadge")}
                                        className="inline-flex items-center gap-0.5 text-[10px] px-1 py-0.2 rounded bg-[#F9F3EA] text-[#111111]"
                                      >
                                        <LockIcon size={10} />
                                      </span>
                                    )}
                                    {q.showIf && (
                                      <span
                                        title={t("builderBranchBadge")}
                                        className="inline-flex items-center gap-0.5 text-[10px] px-1 py-0.2 rounded bg-[#EEEBF8] text-[#6A4FC4]"
                                      >
                                        <GitBranchIcon size={10} />
                                      </span>
                                    )}
                                    {severity && (
                                      <span
                                        aria-label={
                                          severity === "must"
                                            ? t("checkerMustBadge")
                                            : severity === "should"
                                              ? t("checkerShouldBadge")
                                              : t("checkerTipBadge")
                                        }
                                        className={`w-2 h-2 rounded-full inline-block ${
                                          severity === "must"
                                            ? "bg-red-600"
                                            : severity === "should"
                                              ? "bg-amber-500"
                                              : "bg-[#6B6B6B]"
                                        }`}
                                      />
                                    )}
                                  </span>
                                </span>
                              </button>

                              <button
                                type="button"
                                aria-label={t("templatesMoreActions")}
                                aria-expanded={rowMenuId === q.id}
                                aria-haspopup="menu"
                                onClick={() => setRowMenuId((prev) => (prev === q.id ? null : q.id))}
                                className="p-1 rounded hover:bg-[#E7E7E4]/60 text-[#6B6B6B] shrink-0"
                              >
                                <MoreHorizontalIcon size={14} />
                              </button>
                            </div>

                            {rowMenuId === q.id && (
                              <div
                                role="menu"
                                className="absolute right-1 top-10 z-20 w-48 rounded-xl border border-[#E7E7E4] bg-white shadow-lg py-1 text-xs"
                              >
                                <button
                                  type="button"
                                  role="menuitem"
                                  disabled={globalIdx === 0}
                                  onClick={() => {
                                    moveQuestionById(q.id, -1);
                                    setRowMenuId(null);
                                  }}
                                  className="w-full text-left px-3 py-2 hover:bg-[#F5F5F3] disabled:opacity-40"
                                >
                                  {t("templatesMoveUp")}
                                </button>
                                <button
                                  type="button"
                                  role="menuitem"
                                  disabled={globalIdx === template.questions.length - 1}
                                  onClick={() => {
                                    moveQuestionById(q.id, 1);
                                    setRowMenuId(null);
                                  }}
                                  className="w-full text-left px-3 py-2 hover:bg-[#F5F5F3] disabled:opacity-40"
                                >
                                  {t("templatesMoveDown")}
                                </button>
                                <div className="px-3 py-1.5 border-t border-b border-[#E7E7E4] space-y-1">
                                  <span className="block text-[11px] font-medium text-[#6B6B6B]">
                                    {t("builderMoveToSection")}
                                  </span>
                                  <select
                                    aria-label={t("builderMoveToSection")}
                                    value={q.section ?? ""}
                                    onChange={(e) => {
                                      const nextSec = e.target.value || undefined;
                                      applyTemplateChange((curr) => ({
                                        ...curr,
                                        questions: curr.questions.map((item) =>
                                          item.id === q.id ? { ...item, section: nextSec } : item
                                        ),
                                      }));
                                      const targetSecName =
                                        sections.find((s) => s.id === nextSec)?.title[lang] ??
                                        t("builderUnsortedSection");
                                      announce(
                                        t("builderSectionMovedAnnouncement", {
                                          label: q.label[lang] || q.id,
                                          section: targetSecName,
                                        })
                                      );
                                      setRowMenuId(null);
                                    }}
                                    className="w-full px-1.5 py-1 rounded border border-[#E7E7E4] bg-white text-xs"
                                  >
                                    {sections.map((optSec) => (
                                      <option key={optSec.id} value={optSec.id}>
                                        {optSec.title[lang] || optSec.title.en}
                                      </option>
                                    ))}
                                    <option value="">{t("builderUnsortedSection")}</option>
                                  </select>
                                </div>
                                <button
                                  type="button"
                                  role="menuitem"
                                  onClick={() => duplicateQuestionById(q.id)}
                                  className="w-full text-left px-3 py-2 hover:bg-[#F5F5F3]"
                                >
                                  {t("templatesActionDuplicate")}
                                </button>
                                <button
                                  type="button"
                                  role="menuitem"
                                  onClick={() => deleteQuestionById(q.id)}
                                  className="w-full text-left px-3 py-2 text-red-700 hover:bg-red-50"
                                >
                                  {t("templatesActionDelete")}
                                </button>
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}

            {/* Unsorted questions (when a section is deleted or ungrouped) */}
            {unsortedQuestions.length > 0 && (
              <div className="border border-[#E7E7E4] rounded-xl bg-[#FAF9F6] overflow-hidden">
                <div className="px-3 py-2 bg-[#F5F5F3] border-b border-[#E7E7E4] text-xs font-bold text-[#111111]">
                  {t("builderUnsortedSection")} ({unsortedQuestions.length})
                </div>
                <ul className="p-1.5 space-y-1">
                  {unsortedQuestions.map((q) => {
                    const globalIdx = template.questions.findIndex((item) => item.id === q.id);
                    const isSelected = q.id === selectedQuestionId;
                    const severity = issueByQuestionId.get(q.id);
                    return (
                      <li key={q.id} className="relative">
                        <div
                          className={`flex items-center gap-1.5 rounded-lg border px-2 py-2 ${
                            isSelected
                              ? "bg-[#EEEBF8] border-[#6A4FC4]"
                              : "bg-white border-[#E7E7E4] hover:bg-[#F5F5F3]"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => setSelectedQuestionId(q.id)}
                            onKeyDown={(e) => {
                              if (e.altKey && e.key === "ArrowUp") {
                                e.preventDefault();
                                moveQuestionById(q.id, -1);
                              } else if (e.altKey && e.key === "ArrowDown") {
                                e.preventDefault();
                                moveQuestionById(q.id, 1);
                              }
                            }}
                            className="flex-1 min-w-0 text-left flex items-center gap-1.5 text-xs font-medium text-[#111111]"
                          >
                            <QuestionIcon name={q.icon} size={14} />
                            <span className="truncate">
                              {globalIdx + 1}. {q.label[lang] || q.label.en}
                            </span>
                            {severity && (
                              <span
                                className={`w-2 h-2 rounded-full shrink-0 ${
                                  severity === "must"
                                    ? "bg-red-600"
                                    : severity === "should"
                                      ? "bg-amber-500"
                                      : "bg-[#6B6B6B]"
                                }`}
                              />
                            )}
                          </button>
                          <button
                            type="button"
                            aria-label={t("templatesActionDuplicate")}
                            onClick={() => duplicateQuestionById(q.id)}
                            className="text-xs text-[#6B6B6B] px-1"
                          >
                            <CopyIcon size={12} />
                          </button>
                          <button
                            type="button"
                            aria-label={t("templatesActionDelete")}
                            onClick={() => deleteQuestionById(q.id)}
                            className="text-xs text-red-700 px-1"
                          >
                            <TrashIcon size={12} />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setLibraryTab("ready");
              setLibraryOpen(true);
            }}
            className="mezgeb-btn-primary w-full text-sm inline-flex items-center justify-center gap-1.5"
          >
            <PlusIcon size={16} />
            <span>{t("builderAddQuestionBtn")}</span>
          </button>
        </aside>

        {/* MIDDLE PANEL: INSPECTOR + TABS */}
        <section
          aria-labelledby="edit-heading"
          className={`mezgeb-card p-5 space-y-5 ${
            mobilePanel === "edit" ? "block" : "hidden min-[900px]:block"
          }`}
        >
          <div className="space-y-3">
            <h2 id="edit-heading" className="text-base font-bold text-[#111111]">
              {t("builderPanelEditHeading")}
            </h2>

            <div
              role="tablist"
              aria-label={t("builderPanelEditHeading")}
              className="flex flex-wrap gap-1 border-b border-[#E7E7E4]"
            >
              {(
                [
                  { id: "question", label: t("inspTabQuestion") },
                  { id: "settings", label: t("inspTabSettings") },
                  { id: "look", label: t("inspTabLook") },
                  {
                    id: "checker",
                    label: `${t("inspTabChecker")} (${checkerCounts.must + checkerCounts.should})`,
                  },
                  { id: "export", label: t("inspTabExport") },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={inspectorTab === tab.id}
                  onClick={() => setInspectorTab(tab.id)}
                  className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
                    inspectorTab === tab.id
                      ? "border-[#6A4FC4] text-[#111111]"
                      : "border-transparent text-[#6B6B6B] hover:text-[#111111]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* INSPECTOR TAB 1: QUESTION */}
          {inspectorTab === "question" && (
            <div className="space-y-4">
              {!selectedQuestion ? (
                <p className="text-sm text-[#6B6B6B] py-6">{t("builderNoQuestionSelected")}</p>
              ) : (
                <>
                  {/* Group 1: Question */}
                  <details open className="border border-[#E7E7E4] rounded-xl bg-[#FAF9F6]">
                    <summary className="px-4 py-3 text-sm font-semibold text-[#111111] cursor-pointer">
                      {t("inspGroupQuestion")}
                    </summary>
                    <div className="p-4 pt-2 space-y-4 bg-white rounded-b-xl border-t border-[#E7E7E4]">
                      <div>
                        <label
                          htmlFor="insp-q-type"
                          className="block text-xs font-medium text-[#111111] mb-1"
                        >
                          {t("inspTypeLabel")}
                        </label>
                        <select
                          id="insp-q-type"
                          value={selectedQuestion.type}
                          onChange={(e) => {
                            const nextType = e.target.value as QuestionType;
                            const hasOptionsLoss =
                              (selectedQuestion.type === "choice" ||
                                selectedQuestion.type === "multichoice") &&
                              (selectedQuestion.options?.length ?? 0) > 0 &&
                              nextType !== "choice" &&
                              nextType !== "multichoice" &&
                              nextType !== "support";

                            if (hasOptionsLoss) {
                              setTypeChangeConfirm(nextType);
                              return;
                            }
                            updateSelectedQuestion((q) => {
                              const nextQ: TemplateQuestion = { ...q, type: nextType };
                              if (
                                (nextType === "choice" || nextType === "multichoice") &&
                                (!nextQ.options || nextQ.options.length === 0)
                              ) {
                                nextQ.options = [
                                  { value: "option_1", label: { en: "Option 1", am: "አማራጭ 1" } },
                                  { value: "option_2", label: { en: "Option 2", am: "አማራጭ 2" } },
                                ];
                              } else if (nextType === "yes-no") {
                                nextQ.options = [
                                  { value: "yes", label: { en: "Yes", am: "አዎ" } },
                                  { value: "no", label: { en: "No", am: "አይ" } },
                                ];
                              }
                              return nextQ;
                            });
                          }}
                          className="w-full min-h-[40px] px-3 rounded-xl border border-[#E7E7E4] bg-white text-sm"
                        >
                          {ALLOWED_QUESTION_TYPES.map((qType) => {
                            const desc = BLANK_QUESTION_TYPES.find((d) => d.type === qType);
                            return (
                              <option key={qType} value={qType}>
                                {desc ? desc.name[lang] : qType} ({qType})
                              </option>
                            );
                          })}
                        </select>

                        {typeChangeConfirm && (
                          <div
                            role="alert"
                            className="mt-2 p-3 rounded-xl bg-[#F9F3EA] border border-[#E7E7E4] text-xs space-y-2"
                          >
                            <p className="text-[#111111] font-medium">{t("inspTypeChangeWarn")}</p>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const nextType = typeChangeConfirm;
                                  setTypeChangeConfirm(null);
                                  updateSelectedQuestion((q) => ({
                                    ...q,
                                    type: nextType,
                                    options:
                                      nextType === "yes-no"
                                        ? [
                                            { value: "yes", label: { en: "Yes", am: "አዎ" } },
                                            { value: "no", label: { en: "No", am: "አይ" } },
                                          ]
                                        : undefined,
                                  }));
                                }}
                                className="mezgeb-btn-primary text-xs min-h-[32px] px-3"
                              >
                                {t("yesButton")}
                              </button>
                              <button
                                type="button"
                                onClick={() => setTypeChangeConfirm(null)}
                                className="mezgeb-btn-secondary text-xs min-h-[32px] px-3"
                              >
                                {t("cancelButton")}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Side-by-side EN / AM Labels */}
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <label htmlFor="insp-label-en" className="text-xs font-medium text-[#111111]">
                              {t("inspLabelEn")}
                            </label>
                            <span className="text-[11px] text-[#6B6B6B]">
                              {!selectedQuestion.label.en.trim() ? (
                                <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-semibold">
                                  {t("inspMissingBadge")}
                                </span>
                              ) : (
                                t("inspCharsCount", { count: selectedQuestion.label.en.length })
                              )}
                            </span>
                          </div>
                          <textarea
                            id="insp-label-en"
                            rows={2}
                            value={selectedQuestion.label.en}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateSelectedQuestion((q) => ({
                                ...q,
                                label: { ...q.label, en: val },
                              }));
                            }}
                            className="w-full p-2.5 rounded-xl border border-[#E7E7E4] text-sm"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              previewReadAloud(
                                `${selectedQuestion.label.en}. ${selectedQuestion.hint?.en ?? ""}`,
                                "en",
                                selectedQuestion.audio?.en
                              )
                            }
                            className="inline-flex items-center gap-1 text-xs font-medium text-[#6A4FC4] underline"
                          >
                            <VolumeIcon size={13} />
                            <span>{t("inspTestReadAloud")} (EN)</span>
                          </button>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <label htmlFor="insp-label-am" className="text-xs font-medium text-[#111111]">
                              {t("inspLabelAm")}
                            </label>
                            <span className="text-[11px] text-[#6B6B6B]">
                              {!selectedQuestion.label.am.trim() ? (
                                <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-semibold">
                                  {t("inspMissingBadge")}
                                </span>
                              ) : (
                                t("inspCharsCount", { count: selectedQuestion.label.am.length })
                              )}
                            </span>
                          </div>
                          <textarea
                            id="insp-label-am"
                            rows={2}
                            value={selectedQuestion.label.am}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateSelectedQuestion((q) => ({
                                ...q,
                                label: { ...q.label, am: val },
                              }));
                              setAiTranslateNeedsReview((prev) => ({
                                ...prev,
                                [selectedQuestion.id]: false,
                              }));
                            }}
                            className="w-full p-2.5 rounded-xl border border-[#E7E7E4] text-sm"
                          />
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                previewReadAloud(
                                  `${selectedQuestion.label.am}. ${selectedQuestion.hint?.am ?? ""}`,
                                  "am",
                                  selectedQuestion.audio?.am
                                )
                              }
                              className="inline-flex items-center gap-1 text-xs font-medium text-[#6A4FC4] underline"
                            >
                              <VolumeIcon size={13} />
                              <span>{t("inspTestReadAloud")} (አማ)</span>
                            </button>
                            {aiTranslateNeedsReview[selectedQuestion.id] && (
                              <span className="inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                                <span>{t("inspAiTranslateNeedsReview")}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setAiTranslateNeedsReview((prev) => ({
                                      ...prev,
                                      [selectedQuestion.id]: false,
                                    }))
                                  }
                                  className="underline font-semibold"
                                >
                                  {t("inspAiTranslateReviewed")}
                                </button>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {noAmharicVoiceNote && (
                        <p className="text-xs text-[#6B6B6B] bg-[#F5F5F3] p-2.5 rounded-lg">
                          {t("widgetNoAmharicVoice")}
                        </p>
                      )}

                      {/* Hints EN / AM */}
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="insp-hint-en" className="block text-xs font-medium text-[#111111] mb-1">
                            {t("inspHintEn")}
                          </label>
                          <input
                            id="insp-hint-en"
                            type="text"
                            value={selectedQuestion.hint?.en ?? ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateSelectedQuestion((q) => ({
                                ...q,
                                hint: { am: q.hint?.am ?? "", en: val },
                              }));
                            }}
                            className="w-full min-h-[38px] px-3 rounded-xl border border-[#E7E7E4] text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="insp-hint-am" className="block text-xs font-medium text-[#111111] mb-1">
                            {t("inspHintAm")}
                          </label>
                          <input
                            id="insp-hint-am"
                            type="text"
                            value={selectedQuestion.hint?.am ?? ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateSelectedQuestion((q) => ({
                                ...q,
                                hint: { en: q.hint?.en ?? "", am: val },
                              }));
                            }}
                            className="w-full min-h-[38px] px-3 rounded-xl border border-[#E7E7E4] text-sm"
                          />
                        </div>
                      </div>

                      {/* Placeholders EN / AM */}
                      {["text", "phone", "email", "number", "work-story"].includes(
                        selectedQuestion.type
                      ) && (
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div>
                            <label
                              htmlFor="insp-ph-en"
                              className="block text-xs font-medium text-[#111111] mb-1"
                            >
                              {t("inspPlaceholderEn")}
                            </label>
                            <input
                              id="insp-ph-en"
                              type="text"
                              value={selectedQuestion.placeholder?.en ?? ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateSelectedQuestion((q) => ({
                                  ...q,
                                  placeholder: { am: q.placeholder?.am ?? "", en: val },
                                }));
                              }}
                              className="w-full min-h-[38px] px-3 rounded-xl border border-[#E7E7E4] text-sm"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="insp-ph-am"
                              className="block text-xs font-medium text-[#111111] mb-1"
                            >
                              {t("inspPlaceholderAm")}
                            </label>
                            <input
                              id="insp-ph-am"
                              type="text"
                              value={selectedQuestion.placeholder?.am ?? ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateSelectedQuestion((q) => ({
                                  ...q,
                                  placeholder: { en: q.placeholder?.en ?? "", am: val },
                                }));
                              }}
                              className="w-full min-h-[38px] px-3 rounded-xl border border-[#E7E7E4] text-sm"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </details>

                  {/* Group 2: Answer Options (choice, multichoice, yes-no) */}
                  {(selectedQuestion.type === "choice" ||
                    selectedQuestion.type === "multichoice" ||
                    selectedQuestion.type === "yes-no") && (
                    <details open className="border border-[#E7E7E4] rounded-xl bg-[#FAF9F6]">
                      <summary className="px-4 py-3 text-sm font-semibold text-[#111111] cursor-pointer">
                        {t("inspGroupOptions")} ({(selectedQuestion.options ?? []).length})
                      </summary>
                      <div className="p-4 pt-3 space-y-3 bg-white rounded-b-xl border-t border-[#E7E7E4]">
                        {selectedQuestion.type === "yes-no" && (
                          <p className="text-xs text-[#6B6B6B]">{t("inspYesNoEditNote")}</p>
                        )}

                        <div className="space-y-2">
                          {(selectedQuestion.type === "yes-no" &&
                          (!selectedQuestion.options || selectedQuestion.options.length < 2)
                            ? [
                                { value: "yes", label: { en: "Yes", am: "አዎ" } },
                                { value: "no", label: { en: "No", am: "አይ" } },
                              ]
                            : selectedQuestion.options ?? []
                          ).map((opt, idx) => (
                            <div
                              key={`${idx}-${opt.value}`}
                              onKeyDown={(e) => {
                                if (selectedQuestion.type === "yes-no") return;
                                if (e.altKey && e.key === "ArrowUp" && idx > 0) {
                                  e.preventDefault();
                                  updateSelectedQuestion((q) => {
                                    const opts = [...(q.options ?? [])];
                                    const [m] = opts.splice(idx, 1);
                                    opts.splice(idx - 1, 0, m);
                                    return { ...q, options: opts };
                                  });
                                } else if (
                                  e.altKey &&
                                  e.key === "ArrowDown" &&
                                  idx < (selectedQuestion.options?.length ?? 0) - 1
                                ) {
                                  e.preventDefault();
                                  updateSelectedQuestion((q) => {
                                    const opts = [...(q.options ?? [])];
                                    const [m] = opts.splice(idx, 1);
                                    opts.splice(idx + 1, 0, m);
                                    return { ...q, options: opts };
                                  });
                                }
                              }}
                              className="p-2.5 rounded-xl border border-[#E7E7E4] bg-[#FAF9F6] space-y-2"
                            >
                              <div className="grid sm:grid-cols-3 gap-2">
                                <div>
                                  <label className="block text-[11px] text-[#6B6B6B] mb-0.5">
                                    {t("inspOptEn")}
                                  </label>
                                  <input
                                    type="text"
                                    value={opt.label.en}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      updateSelectedQuestion((q) => {
                                        const opts = [
                                          ...(q.options && q.options.length >= 2
                                            ? q.options
                                            : [
                                                { value: "yes", label: { en: "Yes", am: "አዎ" } },
                                                { value: "no", label: { en: "No", am: "አይ" } },
                                              ]),
                                        ];
                                        const autoVal =
                                          selectedQuestion.type !== "yes-no" && !manualOptValues[idx]
                                            ? slugifyFieldKey(val)
                                            : opts[idx].value;
                                        opts[idx] = {
                                          ...opts[idx],
                                          value: autoVal,
                                          label: { ...opts[idx].label, en: val },
                                        };
                                        return { ...q, options: opts };
                                      });
                                    }}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#E7E7E4] bg-white text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] text-[#6B6B6B] mb-0.5">
                                    {t("inspOptAm")}
                                  </label>
                                  <input
                                    type="text"
                                    value={opt.label.am}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      updateSelectedQuestion((q) => {
                                        const opts = [
                                          ...(q.options && q.options.length >= 2
                                            ? q.options
                                            : [
                                                { value: "yes", label: { en: "Yes", am: "አዎ" } },
                                                { value: "no", label: { en: "No", am: "አይ" } },
                                              ]),
                                        ];
                                        opts[idx] = {
                                          ...opts[idx],
                                          label: { ...opts[idx].label, am: val },
                                        };
                                        return { ...q, options: opts };
                                      });
                                    }}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#E7E7E4] bg-white text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] text-[#6B6B6B] mb-0.5">
                                    {t("inspOptValue")}
                                  </label>
                                  <input
                                    type="text"
                                    disabled={selectedQuestion.type === "yes-no"}
                                    value={opt.value}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setManualOptValues((prev) => ({ ...prev, [idx]: true }));
                                      updateSelectedQuestion((q) => {
                                        const opts = [...(q.options ?? [])];
                                        opts[idx] = { ...opts[idx], value: val };
                                        return { ...q, options: opts };
                                      });
                                    }}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#E7E7E4] bg-white text-xs font-mono disabled:opacity-60"
                                  />
                                </div>
                              </div>

                              {selectedQuestion.type !== "yes-no" && (
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    type="button"
                                    disabled={idx === 0}
                                    onClick={() =>
                                      updateSelectedQuestion((q) => {
                                        const opts = [...(q.options ?? [])];
                                        const [m] = opts.splice(idx, 1);
                                        opts.splice(idx - 1, 0, m);
                                        return { ...q, options: opts };
                                      })
                                    }
                                    className="text-xs text-[#6B6B6B] hover:text-[#111111] disabled:opacity-40"
                                  >
                                    {t("templatesMoveUp")}
                                  </button>
                                  <button
                                    type="button"
                                    disabled={idx === (selectedQuestion.options?.length ?? 0) - 1}
                                    onClick={() =>
                                      updateSelectedQuestion((q) => {
                                        const opts = [...(q.options ?? [])];
                                        const [m] = opts.splice(idx, 1);
                                        opts.splice(idx + 1, 0, m);
                                        return { ...q, options: opts };
                                      })
                                    }
                                    className="text-xs text-[#6B6B6B] hover:text-[#111111] disabled:opacity-40"
                                  >
                                    {t("templatesMoveDown")}
                                  </button>
                                  <button
                                    type="button"
                                    aria-label={t("inspOptDelete")}
                                    onClick={() =>
                                      updateSelectedQuestion((q) => ({
                                        ...q,
                                        options: (q.options ?? []).filter((_, i) => i !== idx),
                                      }))
                                    }
                                    className="text-xs text-red-700 hover:underline"
                                  >
                                    {t("inspOptDelete")}
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {selectedQuestion.type !== "yes-no" && (
                          <div className="space-y-2 pt-1">
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  updateSelectedQuestion((q) => {
                                    const nextNum = (q.options?.length ?? 0) + 1;
                                    return {
                                      ...q,
                                      options: [
                                        ...(q.options ?? []),
                                        {
                                          value: `option_${nextNum}`,
                                          label: { en: `Option ${nextNum}`, am: "" },
                                        },
                                      ],
                                    };
                                  })
                                }
                                className="mezgeb-btn-secondary text-xs min-h-[34px] px-3"
                              >
                                {t("inspOptAdd")}
                              </button>
                              <button
                                type="button"
                                onClick={() => setPasteOptionsOpen((v) => !v)}
                                className="mezgeb-btn-secondary text-xs min-h-[34px] px-3"
                              >
                                {t("inspOptPasteBtn")}
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  updateSelectedQuestion((q) => {
                                    if ((q.options ?? []).some((o) => o.value === "other")) return q;
                                    return {
                                      ...q,
                                      options: [
                                        ...(q.options ?? []),
                                        { value: "other", label: { en: "Other", am: "ሌላ" } },
                                      ],
                                    };
                                  })
                                }
                                className="mezgeb-btn-secondary text-xs min-h-[34px] px-3"
                              >
                                {t("inspOptAddOther")}
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  updateSelectedQuestion((q) => {
                                    if ((q.options ?? []).some((o) => o.value === "prefer_not_to_say")) {
                                      return q;
                                    }
                                    return {
                                      ...q,
                                      options: [
                                        ...(q.options ?? []),
                                        {
                                          value: "prefer_not_to_say",
                                          label: { en: "Prefer not to say", am: "መናገር አልፈልግም" },
                                        },
                                      ],
                                    };
                                  })
                                }
                                className="mezgeb-btn-secondary text-xs min-h-[34px] px-3"
                              >
                                {t("inspOptAddPreferNot")}
                              </button>
                            </div>

                            {pasteOptionsOpen && (
                              <div className="p-3 rounded-xl bg-[#F5F5F3] border border-[#E7E7E4] space-y-2">
                                <label
                                  htmlFor="paste-opts-area"
                                  className="block text-xs font-medium text-[#111111]"
                                >
                                  {t("inspOptPasteLabel")}
                                </label>
                                <textarea
                                  id="paste-opts-area"
                                  rows={3}
                                  value={pasteOptionsText}
                                  onChange={(e) => setPasteOptionsText(e.target.value)}
                                  className="w-full p-2 rounded-lg border border-[#E7E7E4] bg-white text-xs"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const lines = pasteOptionsText
                                      .split(/\r?\n/)
                                      .map((s) => s.trim())
                                      .filter(Boolean);
                                    if (lines.length === 0) return;
                                    updateSelectedQuestion((q) => {
                                      const existing = [...(q.options ?? [])];
                                      const usedVals = new Set(existing.map((o) => o.value));
                                      for (const line of lines) {
                                        let v = slugifyFieldKey(line);
                                        let k = 2;
                                        while (usedVals.has(v)) {
                                          v = `${slugifyFieldKey(line)}_${k++}`;
                                        }
                                        usedVals.add(v);
                                        existing.push({ value: v, label: { en: line, am: "" } });
                                      }
                                      return { ...q, options: existing };
                                    });
                                    setPasteOptionsText("");
                                    setPasteOptionsOpen(false);
                                  }}
                                  className="mezgeb-btn-primary text-xs min-h-[34px] px-3"
                                >
                                  {t("inspOptPasteApply")}
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </details>
                  )}

                  {/* Group 3: Rules */}
                  <details className="border border-[#E7E7E4] rounded-xl bg-[#FAF9F6]">
                    <summary className="px-4 py-3 text-sm font-semibold text-[#111111] cursor-pointer">
                      {t("inspGroupRules")}
                    </summary>
                    <div className="p-4 pt-3 space-y-3 bg-white rounded-b-xl border-t border-[#E7E7E4]">
                      {selectedQuestion.type !== "info" && (
                        <>
                          <label className="flex items-center justify-between gap-3 cursor-pointer">
                            <span className="text-sm text-[#111111]">{t("inspRequiredToggle")}</span>
                            <input
                              type="checkbox"
                              checked={selectedQuestion.required}
                              onChange={(e) => {
                                const req = e.target.checked;
                                updateSelectedQuestion((q) => ({
                                  ...q,
                                  required: req,
                                  skippable: req ? false : q.skippable,
                                }));
                              }}
                              className="w-5 h-5 accent-[#6A4FC4]"
                            />
                          </label>

                          <div>
                            <label
                              className={`flex items-center justify-between gap-3 ${
                                selectedQuestion.required ? "opacity-60" : "cursor-pointer"
                              }`}
                            >
                              <span className="text-sm text-[#111111]">{t("inspSkippableToggle")}</span>
                              <input
                                type="checkbox"
                                disabled={selectedQuestion.required}
                                checked={Boolean(selectedQuestion.skippable) && !selectedQuestion.required}
                                onChange={(e) =>
                                  updateSelectedQuestion((q) => ({
                                    ...q,
                                    skippable: e.target.checked,
                                  }))
                                }
                                className="w-5 h-5 accent-[#6A4FC4]"
                              />
                            </label>
                            {selectedQuestion.required && (
                              <p className="text-xs text-[#6B6B6B] mt-1">
                                {t("inspSkippableDisabledNote")}
                              </p>
                            )}
                          </div>
                        </>
                      )}

                      {["text", "phone", "email"].includes(selectedQuestion.type) && (
                        <div>
                          <label
                            htmlFor="insp-preset"
                            className="block text-xs font-medium text-[#111111] mb-1"
                          >
                            {t("inspPresetLabel")}
                          </label>
                          <select
                            id="insp-preset"
                            value={selectedQuestion.validation?.preset ?? "none"}
                            onChange={(e) => {
                              const preset = e.target.value as ValidationPreset;
                              updateSelectedQuestion((q) => ({
                                ...q,
                                validation: { ...(q.validation ?? {}), preset },
                              }));
                            }}
                            className="w-full min-h-[38px] px-3 rounded-xl border border-[#E7E7E4] bg-white text-sm"
                          >
                            <option value="none">{t("inspPresetNone")}</option>
                            <option value="ethiopian-phone">{t("inspPresetPhone")}</option>
                            <option value="email">{t("inspPresetEmail")}</option>
                            <option value="digits-only">{t("inspPresetDigits")}</option>
                            <option value="letters-only">{t("inspPresetLetters")}</option>
                          </select>
                        </div>
                      )}

                      {["text", "email", "work-story"].includes(selectedQuestion.type) && (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label
                              htmlFor="insp-min-len"
                              className="block text-xs font-medium text-[#111111] mb-1"
                            >
                              {t("inspMinLength")}
                            </label>
                            <input
                              id="insp-min-len"
                              type="number"
                              min={0}
                              value={selectedQuestion.validation?.minLength ?? ""}
                              onChange={(e) => {
                                const val = e.target.value === "" ? undefined : Number(e.target.value);
                                updateSelectedQuestion((q) => ({
                                  ...q,
                                  validation: { ...(q.validation ?? {}), minLength: val },
                                }));
                              }}
                              className="w-full min-h-[38px] px-3 rounded-xl border border-[#E7E7E4] text-sm"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="insp-max-len"
                              className="block text-xs font-medium text-[#111111] mb-1"
                            >
                              {t("inspMaxLength")}
                            </label>
                            <input
                              id="insp-max-len"
                              type="number"
                              min={1}
                              value={selectedQuestion.validation?.maxLength ?? ""}
                              onChange={(e) => {
                                const val = e.target.value === "" ? undefined : Number(e.target.value);
                                updateSelectedQuestion((q) => ({
                                  ...q,
                                  validation: { ...(q.validation ?? {}), maxLength: val },
                                }));
                              }}
                              className="w-full min-h-[38px] px-3 rounded-xl border border-[#E7E7E4] text-sm"
                            />
                          </div>
                        </div>
                      )}

                      {selectedQuestion.type === "number" && (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label
                              htmlFor="insp-min-num"
                              className="block text-xs font-medium text-[#111111] mb-1"
                            >
                              {t("inspMinVal")}
                            </label>
                            <input
                              id="insp-min-num"
                              type="number"
                              value={selectedQuestion.validation?.min ?? ""}
                              onChange={(e) => {
                                const val = e.target.value === "" ? undefined : Number(e.target.value);
                                updateSelectedQuestion((q) => ({
                                  ...q,
                                  validation: { ...(q.validation ?? {}), min: val },
                                }));
                              }}
                              className="w-full min-h-[38px] px-3 rounded-xl border border-[#E7E7E4] text-sm"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="insp-max-num"
                              className="block text-xs font-medium text-[#111111] mb-1"
                            >
                              {t("inspMaxVal")}
                            </label>
                            <input
                              id="insp-max-num"
                              type="number"
                              value={selectedQuestion.validation?.max ?? ""}
                              onChange={(e) => {
                                const val = e.target.value === "" ? undefined : Number(e.target.value);
                                updateSelectedQuestion((q) => ({
                                  ...q,
                                  validation: { ...(q.validation ?? {}), max: val },
                                }));
                              }}
                              className="w-full min-h-[38px] px-3 rounded-xl border border-[#E7E7E4] text-sm"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </details>

                  {/* Group 4: Show this question only if… */}
                  <details className="border border-[#E7E7E4] rounded-xl bg-[#FAF9F6]">
                    <summary className="px-4 py-3 text-sm font-semibold text-[#111111] cursor-pointer">
                      {t("inspGroupShowIf")}
                    </summary>
                    <div className="p-4 pt-3 space-y-3 bg-white rounded-b-xl border-t border-[#E7E7E4]">
                      {earlierQuestions.length === 0 ? (
                        <p className="text-xs text-[#6B6B6B]">{t("inspShowIfNoEarlier")}</p>
                      ) : (
                        <>
                          <div>
                            <label
                              htmlFor="insp-showif-q"
                              className="block text-xs font-medium text-[#111111] mb-1"
                            >
                              {t("inspShowIfQuestion")}
                            </label>
                            <select
                              id="insp-showif-q"
                              value={selectedQuestion.showIf?.questionId ?? ""}
                              onChange={(e) => {
                                const targetId = e.target.value;
                                if (!targetId) {
                                  updateSelectedQuestion((q) => {
                                    const copy = { ...q };
                                    delete copy.showIf;
                                    return copy;
                                  });
                                  return;
                                }
                                const targetQ = earlierQuestions.find((x) => x.id === targetId);
                                const defaultEq =
                                  targetQ?.options?.[0]?.value ??
                                  (targetQ?.type === "yes-no" ? "yes" : targetQ?.type === "id-routes" ? "fayda" : "");
                                updateSelectedQuestion((q) => ({
                                  ...q,
                                  showIf: { questionId: targetId, equals: defaultEq },
                                }));
                              }}
                              className="w-full min-h-[38px] px-3 rounded-xl border border-[#E7E7E4] bg-white text-sm"
                            >
                              <option value="">{t("inspShowIfAlways")}</option>
                              {earlierQuestions.map((eq) => (
                                <option key={eq.id} value={eq.id}>
                                  {eq.label[lang] || eq.label.en}
                                </option>
                              ))}
                            </select>
                          </div>

                          {condSourceQuestion && selectedQuestion.showIf && (
                            <div className="space-y-2.5">
                              <span className="block text-xs font-medium text-[#111111]">
                                {t("inspShowIfEquals")}
                              </span>

                              {condSourceQuestion.type === "choice" ||
                              condSourceQuestion.type === "multichoice" ||
                              condSourceQuestion.type === "yes-no" ? (
                                <div className="flex flex-wrap gap-2">
                                  {(condSourceQuestion.options?.length
                                    ? condSourceQuestion.options
                                    : condSourceQuestion.type === "yes-no"
                                      ? [
                                          { value: "yes", label: { en: "Yes", am: "አዎ" } },
                                          { value: "no", label: { en: "No", am: "አይ" } },
                                        ]
                                      : []
                                  ).map((opt) => {
                                    const curEq = selectedQuestion.showIf!.equals;
                                    const active = Array.isArray(curEq)
                                      ? curEq.includes(opt.value)
                                      : curEq === opt.value;
                                    return (
                                      <button
                                        key={opt.value}
                                        type="button"
                                        aria-pressed={active}
                                        onClick={() =>
                                          updateSelectedQuestion((q) => {
                                            const prev = q.showIf?.equals;
                                            const arr = Array.isArray(prev)
                                              ? prev
                                              : prev
                                                ? [prev]
                                                : [];
                                            const nextArr = active
                                              ? arr.filter((x) => x !== opt.value)
                                              : [...arr, opt.value];
                                            return {
                                              ...q,
                                              showIf: {
                                                questionId: condSourceQuestion.id,
                                                equals:
                                                  nextArr.length === 1
                                                    ? nextArr[0]
                                                    : nextArr.length === 0
                                                      ? opt.value
                                                      : nextArr,
                                              },
                                            };
                                          })
                                        }
                                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium ${
                                          active
                                            ? "bg-[#EEEBF8] border-[#6A4FC4] text-[#111111]"
                                            : "bg-white border-[#E7E7E4] text-[#6B6B6B]"
                                        }`}
                                      >
                                        {opt.label[lang] || opt.label.en || opt.value}
                                      </button>
                                    );
                                  })}
                                </div>
                              ) : condSourceQuestion.type === "id-routes" ? (
                                <div className="flex flex-wrap gap-2">
                                  {(["fayda", "refugee_id", "other_document", "partner_refer"] as IdRoute[]).map(
                                    (route) => {
                                      const curEq = selectedQuestion.showIf!.equals;
                                      const active = Array.isArray(curEq)
                                        ? curEq.includes(route)
                                        : curEq === route;
                                      return (
                                        <button
                                          key={route}
                                          type="button"
                                          aria-pressed={active}
                                          onClick={() =>
                                            updateSelectedQuestion((q) => ({
                                              ...q,
                                              showIf: { questionId: condSourceQuestion.id, equals: route },
                                            }))
                                          }
                                          className={`px-3 py-1.5 rounded-lg border text-xs font-medium ${
                                            active
                                              ? "bg-[#EEEBF8] border-[#6A4FC4] text-[#111111]"
                                              : "bg-white border-[#E7E7E4] text-[#6B6B6B]"
                                          }`}
                                        >
                                          {t(getIdRouteLabelKey(route))}
                                        </button>
                                      );
                                    }
                                  )}
                                </div>
                              ) : (
                                <input
                                  type="text"
                                  value={
                                    Array.isArray(selectedQuestion.showIf.equals)
                                      ? selectedQuestion.showIf.equals.join(", ")
                                      : selectedQuestion.showIf.equals
                                  }
                                  onChange={(e) =>
                                    updateSelectedQuestion((q) => ({
                                      ...q,
                                      showIf: {
                                        questionId: condSourceQuestion.id,
                                        equals: e.target.value,
                                      },
                                    }))
                                  }
                                  className="w-full min-h-[38px] px-3 rounded-xl border border-[#E7E7E4] text-sm"
                                />
                              )}

                              <p className="text-xs text-[#111111] bg-[#EEEBF8]/60 px-3 py-2 rounded-lg">
                                {t("inspShowIfSummary", {
                                  question:
                                    condSourceQuestion.label[lang] || condSourceQuestion.label.en,
                                  answer: Array.isArray(selectedQuestion.showIf.equals)
                                    ? selectedQuestion.showIf.equals.join(", ")
                                    : (() => {
                                        const opt = condSourceQuestion.options?.find(
                                          (o) => o.value === selectedQuestion.showIf?.equals
                                        );
                                        return opt
                                          ? opt.label[lang] || opt.label.en
                                          : String(selectedQuestion.showIf.equals);
                                      })(),
                                })}
                              </p>

                              <button
                                type="button"
                                onClick={() =>
                                  updateSelectedQuestion((q) => {
                                    const copy = { ...q };
                                    delete copy.showIf;
                                    return copy;
                                  })
                                }
                                className="text-xs font-semibold text-red-700 underline"
                              >
                                {t("inspShowIfRemove")}
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </details>

                  {/* Group 5: Accessibility and voice */}
                  <details className="border border-[#E7E7E4] rounded-xl bg-[#FAF9F6]">
                    <summary className="px-4 py-3 text-sm font-semibold text-[#111111] cursor-pointer">
                      {t("inspGroupA11y")}
                    </summary>
                    <div className="p-4 pt-3 space-y-4 bg-white rounded-b-xl border-t border-[#E7E7E4]">
                      {selectedQuestion.type !== "info" && (
                        <label className="flex items-center justify-between gap-3 cursor-pointer">
                          <span className="text-sm text-[#111111]">{t("inspAllowVoiceToggle")}</span>
                          <input
                            type="checkbox"
                            checked={selectedQuestion.allowVoice !== false}
                            onChange={(e) =>
                              updateSelectedQuestion((q) => ({ ...q, allowVoice: e.target.checked }))
                            }
                            className="w-5 h-5 accent-[#6A4FC4]"
                          />
                        </label>
                      )}

                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label htmlFor="insp-audio-am" className="block text-xs font-medium text-[#111111]">
                            {t("inspAudioAmLabel")}
                          </label>
                          <div className="flex gap-1.5">
                            <input
                              id="insp-audio-am"
                              type="url"
                              value={selectedQuestion.audio?.am ?? ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateSelectedQuestion((q) => ({
                                  ...q,
                                  audio: { ...(q.audio ?? {}), am: val || undefined },
                                }));
                              }}
                              className="flex-1 min-w-0 min-h-[36px] px-2.5 rounded-lg border border-[#E7E7E4] text-xs"
                            />
                            {selectedQuestion.audio?.am && (
                              <button
                                type="button"
                                onClick={() => previewReadAloud("", "am", selectedQuestion.audio?.am)}
                                className="mezgeb-btn-secondary text-xs min-h-[36px] px-2.5"
                              >
                                {t("inspAudioPlayTest")}
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label htmlFor="insp-audio-en" className="block text-xs font-medium text-[#111111]">
                            {t("inspAudioEnLabel")}
                          </label>
                          <div className="flex gap-1.5">
                            <input
                              id="insp-audio-en"
                              type="url"
                              value={selectedQuestion.audio?.en ?? ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateSelectedQuestion((q) => ({
                                  ...q,
                                  audio: { ...(q.audio ?? {}), en: val || undefined },
                                }));
                              }}
                              className="flex-1 min-w-0 min-h-[36px] px-2.5 rounded-lg border border-[#E7E7E4] text-xs"
                            />
                            {selectedQuestion.audio?.en && (
                              <button
                                type="button"
                                onClick={() => previewReadAloud("", "en", selectedQuestion.audio?.en)}
                                className="mezgeb-btn-secondary text-xs min-h-[36px] px-2.5"
                              >
                                {t("inspAudioPlayTest")}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      {audioPlayError && <p className="text-xs text-red-700">{audioPlayError}</p>}

                      {/* Icon picker with radio-group semantics */}
                      <div className="space-y-1.5">
                        <span id="icon-picker-label" className="block text-xs font-medium text-[#111111]">
                          {t("inspIconLabel")}
                        </span>
                        <div
                          role="radiogroup"
                          aria-labelledby="icon-picker-label"
                          className="grid grid-cols-4 sm:grid-cols-4 gap-1.5"
                        >
                          {AVAILABLE_ICONS.map((ic) => {
                            const selected = selectedQuestion.icon === ic.id;
                            return (
                              <button
                                key={ic.id}
                                type="button"
                                role="radio"
                                aria-checked={selected}
                                onClick={() =>
                                  updateSelectedQuestion((q) => ({ ...q, icon: ic.id }))
                                }
                                className={`px-2 py-2 rounded-lg border text-[11px] flex flex-col items-center gap-1 transition-colors ${
                                  selected
                                    ? "bg-[#EEEBF8] border-[#6A4FC4] text-[#111111] font-semibold"
                                    : "bg-white border-[#E7E7E4] text-[#6B6B6B] hover:bg-[#F5F5F3]"
                                }`}
                              >
                                <QuestionIcon name={ic.id} size={15} />
                                <span className="truncate max-w-full">{ic.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3">
                        <div>
                          <label
                            htmlFor="insp-errhelp-en"
                            className="block text-xs font-medium text-[#111111] mb-1"
                          >
                            {t("inspErrorHelpEn")}
                          </label>
                          <textarea
                            id="insp-errhelp-en"
                            rows={2}
                            value={selectedQuestion.errorHelp?.en ?? ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateSelectedQuestion((q) => ({
                                ...q,
                                errorHelp: { am: q.errorHelp?.am ?? "", en: val },
                              }));
                            }}
                            className="w-full p-2.5 rounded-xl border border-[#E7E7E4] text-xs"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="insp-errhelp-am"
                            className="block text-xs font-medium text-[#111111] mb-1"
                          >
                            {t("inspErrorHelpAm")}
                          </label>
                          <textarea
                            id="insp-errhelp-am"
                            rows={2}
                            value={selectedQuestion.errorHelp?.am ?? ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateSelectedQuestion((q) => ({
                                ...q,
                                errorHelp: { en: q.errorHelp?.en ?? "", am: val },
                              }));
                            }}
                            className="w-full p-2.5 rounded-xl border border-[#E7E7E4] text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </details>

                  {/* Group 6: Data and privacy */}
                  <details className="border border-[#E7E7E4] rounded-xl bg-[#FAF9F6]">
                    <summary className="px-4 py-3 text-sm font-semibold text-[#111111] cursor-pointer">
                      {t("inspGroupPrivacy")}
                    </summary>
                    <div className="p-4 pt-3 space-y-3 bg-white rounded-b-xl border-t border-[#E7E7E4]">
                      <div>
                        <label
                          htmlFor="insp-maps-to"
                          className="block text-xs font-medium text-[#111111] mb-1"
                        >
                          {t("inspMapsToLabel")}
                        </label>
                        <input
                          id="insp-maps-to"
                          type="text"
                          list="mezgeb-common-fields"
                          value={selectedQuestion.maps_to}
                          onChange={(e) =>
                            updateSelectedQuestion((q) => ({ ...q, maps_to: e.target.value }))
                          }
                          className="w-full min-h-[38px] px-3 rounded-xl border border-[#E7E7E4] text-sm font-mono"
                        />
                        <datalist id="mezgeb-common-fields">
                          {COMMON_FIELD_SUGGESTIONS.map((f) => (
                            <option key={f} value={f} />
                          ))}
                        </datalist>
                        {isDuplicateMapsTo && (
                          <p role="alert" className="text-xs text-red-700 font-medium mt-1">
                            {t("inspMapsToDuplicate", { field: selectedQuestion.maps_to })}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="flex items-center justify-between gap-3 cursor-pointer">
                          <span className="text-sm text-[#111111]">{t("inspSensitiveToggle")}</span>
                          <input
                            type="checkbox"
                            checked={Boolean(selectedQuestion.sensitive)}
                            onChange={(e) =>
                              updateSelectedQuestion((q) => ({ ...q, sensitive: e.target.checked }))
                            }
                            className="w-5 h-5 accent-[#6A4FC4]"
                          />
                        </label>
                        <p className="text-xs text-[#6B6B6B]">{t("inspSensitiveExplain")}</p>
                      </div>
                    </div>
                  </details>

                  {/* Group 7: AI tools (gated by online & AI on, Accept/Discard required) */}
                  <details className="border border-[#E7E7E4] rounded-xl bg-[#FAF9F6]">
                    <summary className="px-4 py-3 text-sm font-semibold text-[#111111] cursor-pointer">
                      {t("inspGroupAi")}
                    </summary>
                    <div className="p-4 pt-3 space-y-3 bg-white rounded-b-xl border-t border-[#E7E7E4]">
                      {!aiToolsOnline ? (
                        <p className="text-xs text-[#6B6B6B]">{t("inspAiUnavailable")}</p>
                      ) : (
                        <>
                          <p className="text-xs text-[#6B6B6B] bg-[#F5F5F3] px-3 py-2 rounded-lg">
                            {t("cloudAiNotice")}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              disabled={aiToolBusy}
                              onClick={async () => {
                                setAiToolBusy(true);
                                setAiToolMessage(null);
                                const res = await improveQuestionWithAi({
                                  question: {
                                    type: selectedQuestion.type,
                                    label: selectedQuestion.label,
                                    hint: selectedQuestion.hint,
                                  },
                                  lang,
                                });
                                setAiToolBusy(false);
                                if (!res.usedAi || !res.label) {
                                  setAiToolMessage(t("inspAiUnavailable"));
                                  return;
                                }
                                setAiImproveSuggestion({
                                  questionId: selectedQuestion.id,
                                  label: res.label,
                                  hint: res.hint,
                                  reason: res.reason,
                                });
                              }}
                              className="mezgeb-btn-secondary text-xs min-h-[36px] px-3"
                            >
                              {t("inspAiImproveBtn")}
                            </button>

                            <button
                              type="button"
                              disabled={aiToolBusy}
                              onClick={async () => {
                                const missing: { key: string; text: string; target: "en" | "am" }[] = [];
                                if (selectedQuestion.label.en.trim() && !selectedQuestion.label.am.trim()) {
                                  missing.push({ key: "label", text: selectedQuestion.label.en, target: "am" });
                                } else if (selectedQuestion.label.am.trim() && !selectedQuestion.label.en.trim()) {
                                  missing.push({ key: "label", text: selectedQuestion.label.am, target: "en" });
                                }
                                if (selectedQuestion.hint?.en?.trim() && !selectedQuestion.hint?.am?.trim()) {
                                  missing.push({ key: "hint", text: selectedQuestion.hint.en, target: "am" });
                                } else if (selectedQuestion.hint?.am?.trim() && !selectedQuestion.hint?.en?.trim()) {
                                  missing.push({ key: "hint", text: selectedQuestion.hint.am, target: "en" });
                                }
                                (selectedQuestion.options ?? []).forEach((opt, i) => {
                                  if (opt.label.en.trim() && !opt.label.am.trim()) {
                                    missing.push({ key: `opt_${i}`, text: opt.label.en, target: "am" });
                                  } else if (opt.label.am.trim() && !opt.label.en.trim()) {
                                    missing.push({ key: `opt_${i}`, text: opt.label.am, target: "en" });
                                  }
                                });

                                if (missing.length === 0) {
                                  setAiToolMessage(t("inspAiNothingMissing"));
                                  return;
                                }

                                setAiToolBusy(true);
                                setAiToolMessage(null);
                                const targetLang = missing[0].target;
                                const fromLang: Lang = targetLang === "am" ? "en" : "am";
                                const batch = missing.filter((m) => m.target === targetLang);
                                const res = await translateTextsWithAi({
                                  texts: batch.map((b) => ({ key: b.key, text: b.text })),
                                  from: fromLang,
                                  to: targetLang,
                                });
                                setAiToolBusy(false);

                                if (!res.usedAi || res.texts.length === 0) {
                                  setAiToolMessage(t("inspAiUnavailable"));
                                  return;
                                }

                                const translatedMap = new Map(res.texts.map((item) => [item.key, item.text]));
                                updateSelectedQuestion((q) => {
                                  const next = { ...q, label: { ...q.label } };
                                  if (translatedMap.has("label")) {
                                    next.label[targetLang] = translatedMap.get("label")!;
                                  }
                                  if (translatedMap.has("hint")) {
                                    next.hint = {
                                      en: q.hint?.en ?? "",
                                      am: q.hint?.am ?? "",
                                      [targetLang]: translatedMap.get("hint")!,
                                    };
                                  }
                                  if (next.options) {
                                    next.options = next.options.map((opt, idx) =>
                                      translatedMap.has(`opt_${idx}`)
                                        ? {
                                            ...opt,
                                            label: {
                                              ...opt.label,
                                              [targetLang]: translatedMap.get(`opt_${idx}`)!,
                                            },
                                          }
                                        : opt
                                    );
                                  }
                                  return next;
                                });
                                setAiTranslateNeedsReview((prev) => ({
                                  ...prev,
                                  [selectedQuestion.id]: true,
                                }));
                              }}
                              className="mezgeb-btn-secondary text-xs min-h-[36px] px-3"
                            >
                              {t("inspAiTranslateBtn")}
                            </button>

                            <button
                              type="button"
                              disabled={aiToolBusy}
                              onClick={async () => {
                                setAiToolBusy(true);
                                setAiToolMessage(null);
                                const res = await checkQuestionWithAi({
                                  question: {
                                    type: selectedQuestion.type,
                                    label: selectedQuestion.label,
                                    hint: selectedQuestion.hint,
                                    required: selectedQuestion.required,
                                    sensitive: selectedQuestion.sensitive,
                                  },
                                });
                                setAiToolBusy(false);
                                if (!res.usedAi) {
                                  setAiToolMessage(t("inspAiUnavailable"));
                                  return;
                                }
                                setAiQuestionIssues(
                                  res.issues.map((iss, idx) => ({
                                    id: `ai-q-${selectedQuestion.id}-${idx}`,
                                    severity: iss.severity,
                                    questionId: selectedQuestion.id,
                                    issue: iss.issue,
                                    suggestion: iss.suggestion,
                                    fromAi: true,
                                  }))
                                );
                              }}
                              className="mezgeb-btn-secondary text-xs min-h-[36px] px-3"
                            >
                              {t("inspAiCheckBtn")}
                            </button>
                          </div>

                          {aiToolMessage && (
                            <p className="text-xs text-[#6B6B6B]">{aiToolMessage}</p>
                          )}

                          {aiImproveSuggestion &&
                            aiImproveSuggestion.questionId === selectedQuestion.id && (
                              <div className="p-3 rounded-xl bg-[#EEEBF8]/60 border border-[#8F6FE0] space-y-2 text-xs">
                                <p className="font-semibold text-[#111111]">
                                  {t("inspAiSuggestionTitle")}
                                </p>
                                <p className="text-[#111111]">EN: {aiImproveSuggestion.label.en}</p>
                                <p className="text-[#111111]">AM: {aiImproveSuggestion.label.am}</p>
                                {aiImproveSuggestion.reason && (
                                  <p className="text-[#6B6B6B]">{aiImproveSuggestion.reason}</p>
                                )}
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const sug = aiImproveSuggestion;
                                      updateSelectedQuestion((q) => ({
                                        ...q,
                                        label: sug.label,
                                        hint: sug.hint ?? q.hint,
                                      }));
                                      setAiImproveSuggestion(null);
                                    }}
                                    className="mezgeb-btn-primary text-xs min-h-[32px] px-3"
                                  >
                                    {t("inspAiAcceptBtn")}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setAiImproveSuggestion(null)}
                                    className="mezgeb-btn-secondary text-xs min-h-[32px] px-3"
                                  >
                                    {t("inspAiDiscardBtn")}
                                  </button>
                                </div>
                              </div>
                            )}

                          {aiQuestionIssues.length > 0 && (
                            <div className="p-3 rounded-xl bg-[#F9F3EA] border border-[#E7E7E4] space-y-2 text-xs">
                              <p className="font-semibold text-[#111111]">
                                {t("inspAiSuggestionTitle")}
                              </p>
                              <ul className="space-y-1.5">
                                {aiQuestionIssues.map((iss) => (
                                  <li key={iss.id}>
                                    <p className="font-medium text-[#111111]">{iss.issue}</p>
                                    <p className="text-[#6B6B6B]">{iss.suggestion}</p>
                                  </li>
                                ))}
                              </ul>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setAiCheckerIssues((prev) => [
                                      ...prev.filter((p) => p.questionId !== selectedQuestion.id),
                                      ...aiQuestionIssues,
                                    ]);
                                    setAiQuestionIssues([]);
                                  }}
                                  className="mezgeb-btn-primary text-xs min-h-[32px] px-3"
                                >
                                  {t("inspAiAcceptBtn")}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setAiQuestionIssues([])}
                                  className="mezgeb-btn-secondary text-xs min-h-[32px] px-3"
                                >
                                  {t("inspAiDiscardBtn")}
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </details>
                </>
              )}
            </div>
          )}

          {/* INSPECTOR TAB 2: TEMPLATE SETTINGS */}
          {inspectorTab === "settings" && (
            <div className="space-y-6">
              <div>
                <label htmlFor="set-cat" className="block text-xs font-medium text-[#111111] mb-1">
                  {t("setCategoryLabel")}
                </label>
                <select
                  id="set-cat"
                  value={template.category ?? "custom"}
                  onChange={(e) =>
                    applyTemplateChange((curr) => ({
                      ...curr,
                      category: e.target.value as TemplateCategory,
                    }))
                  }
                  className="w-full min-h-[38px] px-3 rounded-xl border border-[#E7E7E4] bg-white text-sm"
                >
                  <option value="learning">{t("catLearning")}</option>
                  <option value="jobs">{t("catJobs")}</option>
                  <option value="employer">{t("catEmployer")}</option>
                  <option value="ngo">{t("catNgo")}</option>
                  <option value="custom">{t("catCustom")}</option>
                </select>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="set-best-en" className="block text-xs font-medium text-[#111111] mb-1">
                    {t("setBestForEn")}
                  </label>
                  <input
                    id="set-best-en"
                    type="text"
                    value={template.bestFor?.en ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      applyTemplateChange((curr) => ({
                        ...curr,
                        bestFor: { am: curr.bestFor?.am ?? "", en: val },
                      }));
                    }}
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E7E7E4] text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="set-best-am" className="block text-xs font-medium text-[#111111] mb-1">
                    {t("setBestForAm")}
                  </label>
                  <input
                    id="set-best-am"
                    type="text"
                    value={template.bestFor?.am ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      applyTemplateChange((curr) => ({
                        ...curr,
                        bestFor: { en: curr.bestFor?.en ?? "", am: val },
                      }));
                    }}
                    className="w-full min-h-[38px] px-3 rounded-xl border border-[#E7E7E4] text-sm"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="set-desc-en" className="block text-xs font-medium text-[#111111] mb-1">
                    {t("setDescEn")}
                  </label>
                  <textarea
                    id="set-desc-en"
                    rows={2}
                    value={template.description.en}
                    onChange={(e) => {
                      const val = e.target.value;
                      applyTemplateChange((curr) => ({
                        ...curr,
                        description: { ...curr.description, en: val },
                      }));
                    }}
                    className="w-full p-2.5 rounded-xl border border-[#E7E7E4] text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="set-desc-am" className="block text-xs font-medium text-[#111111] mb-1">
                    {t("setDescAm")}
                  </label>
                  <textarea
                    id="set-desc-am"
                    rows={2}
                    value={template.description.am}
                    onChange={(e) => {
                      const val = e.target.value;
                      applyTemplateChange((curr) => ({
                        ...curr,
                        description: { ...curr.description, am: val },
                      }));
                    }}
                    className="w-full p-2.5 rounded-xl border border-[#E7E7E4] text-sm"
                  />
                </div>
              </div>

              {/* Accepted ID routes */}
              <fieldset className="space-y-2 border-t border-[#E7E7E4] pt-4">
                <legend className="text-sm font-semibold text-[#111111]">
                  {t("setIdRoutesTitle")}
                </legend>
                <div className="grid sm:grid-cols-2 gap-2">
                  {(["fayda", "refugee_id", "other_document", "partner_refer"] as IdRoute[]).map(
                    (route) => {
                      const checked = template.idRoutes.includes(route);
                      return (
                        <label
                          key={route}
                          className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[#E7E7E4] bg-[#FAF9F6] cursor-pointer text-sm"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              const on = e.target.checked;
                              applyTemplateChange((curr) => ({
                                ...curr,
                                idRoutes: on
                                  ? [...curr.idRoutes, route]
                                  : curr.idRoutes.filter((r) => r !== route),
                              }));
                            }}
                            className="w-4 h-4 accent-[#6A4FC4]"
                          />
                          <span>{t(getIdRouteLabelKey(route))}</span>
                        </label>
                      );
                    }
                  )}
                </div>
                {template.idRoutes.length === 0 && (
                  <p role="alert" className="text-xs text-red-700 font-medium">
                    {t("setIdRoutesError")}
                  </p>
                )}
                {template.idRoutes.length === 1 && template.idRoutes[0] === "fayda" && (
                  <p role="status" className="text-xs text-amber-900 bg-amber-50 p-2 rounded-lg">
                    {t("setIdRoutesFaydaWarn")}
                  </p>
                )}
              </fieldset>

              {/* Support options list */}
              <div className="space-y-2.5 border-t border-[#E7E7E4] pt-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-[#111111]">{t("setSupportTitle")}</h3>
                  <button
                    type="button"
                    onClick={() =>
                      applyTemplateChange((curr) => ({
                        ...curr,
                        supportNeeds: SUPPORT_OPTIONS.map((o) => o.value),
                        questions: curr.questions.map((q) =>
                          q.type === "support" ? { ...q, options: structuredClone(SUPPORT_OPTIONS) } : q
                        ),
                      }))
                    }
                    className="text-xs font-semibold text-[#6A4FC4] underline"
                  >
                    {t("setSupportRestoreBtn")}
                  </button>
                </div>

                <div className="space-y-2">
                  {editableSupportOptions.map((opt, idx) => (
                    <div key={`${idx}-${opt.value}`} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
                      <input
                        type="text"
                        aria-label={`${t("inspOptEn")} ${idx + 1}`}
                        value={opt.label.en}
                        onChange={(e) => {
                          const val = e.target.value;
                          const nextOpts = editableSupportOptions.map((o, i) =>
                            i === idx ? { ...o, label: { ...o.label, en: val } } : o
                          );
                          applyTemplateChange((curr) => ({
                            ...curr,
                            supportNeeds: nextOpts.map((o) => o.value),
                            questions: curr.questions.map((q) =>
                              q.type === "support" ? { ...q, options: nextOpts } : q
                            ),
                          }));
                        }}
                        className="px-2.5 py-1.5 rounded-lg border border-[#E7E7E4] text-xs"
                      />
                      <input
                        type="text"
                        aria-label={`${t("inspOptAm")} ${idx + 1}`}
                        value={opt.label.am}
                        onChange={(e) => {
                          const val = e.target.value;
                          const nextOpts = editableSupportOptions.map((o, i) =>
                            i === idx ? { ...o, label: { ...o.label, am: val } } : o
                          );
                          applyTemplateChange((curr) => ({
                            ...curr,
                            supportNeeds: nextOpts.map((o) => o.value),
                            questions: curr.questions.map((q) =>
                              q.type === "support" ? { ...q, options: nextOpts } : q
                            ),
                          }));
                        }}
                        className="px-2.5 py-1.5 rounded-lg border border-[#E7E7E4] text-xs"
                      />
                      <button
                        type="button"
                        aria-label={t("inspOptDelete")}
                        onClick={() => {
                          const nextOpts = editableSupportOptions.filter((_, i) => i !== idx);
                          applyTemplateChange((curr) => ({
                            ...curr,
                            supportNeeds: nextOpts.map((o) => o.value),
                            questions: curr.questions.map((q) =>
                              q.type === "support" ? { ...q, options: nextOpts } : q
                            ),
                          }));
                        }}
                        className="text-red-700 p-1"
                      >
                        <TrashIcon size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const nextOpts: QuestionOption[] = [
                        ...editableSupportOptions,
                        {
                          value: `support_${Date.now().toString(36).slice(-4)}`,
                          label: { en: "New support option", am: "አዲስ የድጋፍ አማራጭ" },
                        },
                      ];
                      applyTemplateChange((curr) => ({
                        ...curr,
                        supportNeeds: nextOpts.map((o) => o.value),
                        questions: curr.questions.map((q) =>
                          q.type === "support" ? { ...q, options: nextOpts } : q
                        ),
                      }));
                    }}
                    className="mezgeb-btn-secondary text-xs min-h-[34px] px-3"
                  >
                    {t("inspOptAdd")}
                  </button>
                </div>
              </div>

              {/* 7 Features toggles */}
              <div className="space-y-2.5 border-t border-[#E7E7E4] pt-4">
                <h3 className="text-sm font-semibold text-[#111111]">{t("setFeaturesTitle")}</h3>
                {(
                  [
                    { key: "voice", label: t("featVoice"), desc: t("setFeatVoiceDesc") },
                    { key: "readAloud", label: t("featReadAloud"), desc: t("setFeatReadAloudDesc") },
                    { key: "smartHelp", label: t("featHelp"), desc: t("setFeatHelpDesc") },
                    { key: "partnerReferral", label: t("featPartner"), desc: t("setFeatPartnerDesc") },
                    { key: "smsResume", label: t("featSms"), desc: t("setFeatSmsDesc") },
                    { key: "offline", label: t("featOffline"), desc: t("setFeatOfflineDesc") },
                    { key: "sayItSimply", label: t("featSimplify"), desc: t("setFeatSimplifyDesc") },
                  ] as { key: keyof TemplateSettings; label: string; desc: string }[]
                ).map((feat) => (
                  <label
                    key={feat.key}
                    className="flex items-start justify-between gap-3 p-2.5 rounded-xl border border-[#E7E7E4] bg-[#FAF9F6] cursor-pointer"
                  >
                    <div>
                      <span className="block text-sm font-medium text-[#111111]">{feat.label}</span>
                      <span className="block text-xs text-[#6B6B6B]">{feat.desc}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={effectiveSettings[feat.key]}
                      onChange={(e) => {
                        const on = e.target.checked;
                        applyTemplateChange((curr) => ({
                          ...curr,
                          settings: { ...getEffectiveSettings(curr), [feat.key]: on },
                        }));
                      }}
                      className="w-5 h-5 accent-[#6A4FC4] mt-0.5 shrink-0"
                    />
                  </label>
                ))}
              </div>

              {/* Consent statement */}
              <div className="space-y-3 border-t border-[#E7E7E4] pt-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-[#111111]">{t("setConsentTitle")}</h3>
                  <button
                    type="button"
                    onClick={() =>
                      applyTemplateChange((curr) => ({
                        ...curr,
                        consent: { ...RECOMMENDED_CONSENT },
                      }))
                    }
                    className="text-xs font-semibold text-[#6A4FC4] underline"
                  >
                    {t("setConsentRecommendedBtn")}
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="set-consent-en" className="block text-xs font-medium text-[#111111] mb-1">
                      {t("setConsentEn")}
                    </label>
                    <textarea
                      id="set-consent-en"
                      rows={3}
                      value={template.consent.en}
                      onChange={(e) => {
                        const val = e.target.value;
                        applyTemplateChange((curr) => ({
                          ...curr,
                          consent: { ...curr.consent, en: val },
                        }));
                      }}
                      className="w-full p-2.5 rounded-xl border border-[#E7E7E4] text-xs"
                    />
                  </div>
                  <div>
                    <label htmlFor="set-consent-am" className="block text-xs font-medium text-[#111111] mb-1">
                      {t("setConsentAm")}
                    </label>
                    <textarea
                      id="set-consent-am"
                      rows={3}
                      value={template.consent.am}
                      onChange={(e) => {
                        const val = e.target.value;
                        applyTemplateChange((curr) => ({
                          ...curr,
                          consent: { ...curr.consent, am: val },
                        }));
                      }}
                      className="w-full p-2.5 rounded-xl border border-[#E7E7E4] text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* INSPECTOR TAB 3: LOOK */}
          {inspectorTab === "look" && (
            <div className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="look-plat" className="block text-xs font-medium text-[#111111] mb-1">
                    {t("lookPlatformName")}
                  </label>
                  <input
                    id="look-plat"
                    type="text"
                    value={currentTheme.platformName}
                    onChange={(e) => {
                      const val = e.target.value;
                      applyTemplateChange((curr) => ({
                        ...curr,
                        theme: { ...currentTheme, platformName: val },
                      }));
                    }}
                    className="w-full min-h-[40px] px-3 rounded-xl border border-[#E7E7E4] text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="look-letter" className="block text-xs font-medium text-[#111111] mb-1">
                    {t("lookLogoLetter")}
                  </label>
                  <input
                    id="look-letter"
                    type="text"
                    maxLength={2}
                    value={currentTheme.logoLetter}
                    onChange={(e) => {
                      const val = e.target.value;
                      applyTemplateChange((curr) => ({
                        ...curr,
                        theme: { ...currentTheme, logoLetter: val },
                      }));
                    }}
                    className="w-full min-h-[40px] px-3 rounded-xl border border-[#E7E7E4] text-sm font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <label htmlFor="look-accent-color" className="block text-xs font-medium text-[#111111]">
                  {t("lookAccentLabel")}
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    id="look-accent-color"
                    type="color"
                    value={currentTheme.accent}
                    onChange={(e) => {
                      const val = e.target.value;
                      applyTemplateChange((curr) => ({
                        ...curr,
                        theme: { ...currentTheme, accent: val },
                      }));
                    }}
                    className="w-12 h-10 rounded-lg border border-[#E7E7E4] cursor-pointer"
                  />
                  <input
                    type="text"
                    aria-label={`${t("lookAccentLabel")} hex`}
                    value={currentTheme.accent}
                    onChange={(e) => {
                      const val = e.target.value;
                      applyTemplateChange((curr) => ({
                        ...curr,
                        theme: { ...currentTheme, accent: val },
                      }));
                    }}
                    className="w-28 min-h-[40px] px-3 rounded-xl border border-[#E7E7E4] text-sm font-mono"
                  />
                  <div className="flex items-center gap-1.5">
                    {ACCENT_SWATCHES.map((swatch) => (
                      <button
                        key={swatch}
                        type="button"
                        aria-label={`${t("lookAccentLabel")} ${swatch}`}
                        onClick={() =>
                          applyTemplateChange((curr) => ({
                            ...curr,
                            theme: { ...currentTheme, accent: swatch },
                          }))
                        }
                        className={`w-7 h-7 rounded-full border-2 ${
                          currentTheme.accent.toLowerCase() === swatch.toLowerCase()
                            ? "border-[#111111] scale-110"
                            : "border-white"
                        }`}
                        style={{ backgroundColor: swatch }}
                      />
                    ))}
                  </div>
                </div>

                <div
                  role="status"
                  className={`p-3 rounded-xl text-xs font-medium ${
                    contrastPasses
                      ? "bg-[#E4F2EC] text-[#1F5C46]"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {contrastPasses
                    ? t("lookContrastPass", { ratio: accentContrast })
                    : t("lookContrastFail", { ratio: accentContrast })}
                  {!contrastPasses && <span className="block mt-1">{t("lookSaveBlockedNote")}</span>}
                </div>
              </div>
            </div>
          )}

          {/* INSPECTOR TAB 4: CHECKER */}
          {inspectorTab === "checker" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-[#F5F5F3] border border-[#E7E7E4]">
                <p aria-live="polite" className="text-xs font-semibold text-[#111111]">
                  {t("checkerSummary", {
                    must: checkerCounts.must,
                    should: checkerCounts.should,
                    tips: checkerCounts.tips,
                  })}
                </p>

                {aiToolsOnline && (
                  <button
                    type="button"
                    disabled={aiCheckerBusy}
                    onClick={async () => {
                      setAiCheckerBusy(true);
                      const targetList = template.questions.slice(0, 6);
                      const collected: CheckerIssue[] = [];
                      for (const q of targetList) {
                        const res = await checkQuestionWithAi({
                          question: {
                            type: q.type,
                            label: q.label,
                            hint: q.hint,
                            required: q.required,
                            sensitive: q.sensitive,
                          },
                        });
                        if (res.usedAi) {
                          res.issues.forEach((iss, idx) => {
                            collected.push({
                              id: `ai-chk-${q.id}-${idx}`,
                              severity: iss.severity,
                              questionId: q.id,
                              issue: iss.issue,
                              suggestion: iss.suggestion,
                              fromAi: true,
                            });
                          });
                        }
                      }
                      setAiCheckerBusy(false);
                      setAiCheckerIssues(collected);
                    }}
                    className="mezgeb-btn-secondary text-xs min-h-[34px] px-3"
                  >
                    {aiCheckerBusy ? t("checkerAiRunning") : t("checkerRunAiBtn")}
                  </button>
                )}
              </div>

              {allCheckerIssues.length === 0 ? (
                <p className="text-sm text-[#1F5C46] bg-[#E4F2EC] p-4 rounded-xl">
                  {t("checkerEmpty")}
                </p>
              ) : (
                <ul className="space-y-2.5">
                  {allCheckerIssues.map((iss) => (
                    <li
                      key={iss.id}
                      className="p-3.5 rounded-xl border border-[#E7E7E4] bg-white space-y-2"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            iss.severity === "must"
                              ? "bg-red-100 text-red-800"
                              : iss.severity === "should"
                                ? "bg-amber-100 text-amber-900"
                                : "bg-[#F5F5F3] text-[#6B6B6B]"
                          }`}
                        >
                          {iss.severity === "must"
                            ? t("checkerMustBadge")
                            : iss.severity === "should"
                              ? t("checkerShouldBadge")
                              : t("checkerTipBadge")}
                        </span>
                        {iss.fromAi && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#EEEBF8] text-[#6A4FC4] font-semibold">
                            {t("checkerAiTag")}
                          </span>
                        )}
                      </div>

                      <p className="text-sm font-medium text-[#111111]">{iss.issue}</p>
                      <p className="text-xs text-[#6B6B6B]">{iss.suggestion}</p>

                      <div className="flex flex-wrap gap-2">
                        {iss.questionId && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedQuestionId(iss.questionId!);
                              setInspectorTab("question");
                            }}
                            className="mezgeb-btn-secondary text-xs min-h-[32px] px-3"
                          >
                            {t("checkerGoToBtn")}
                          </button>
                        )}
                        {iss.autoFixId && (
                          <button
                            type="button"
                            onClick={() =>
                              applyTemplateChange((curr) =>
                                applyCheckerAutoFix(curr, iss.autoFixId!)
                              )
                            }
                            className="mezgeb-btn-primary text-xs min-h-[32px] px-3"
                          >
                            {t("checkerFixBtn")}
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* INSPECTOR TAB 5: EXPORT */}
          {inspectorTab === "export" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-[#111111] mb-2">
                  {t("exportEmbedTitle")}
                </h3>
                <pre className="p-3.5 rounded-xl bg-[#161616] text-[#E4F2EC] text-xs font-mono overflow-x-auto">
                  <code>{embedSnippet}</code>
                </pre>
              </div>

              {exportFeedback && (
                <div
                  role="status"
                  className={`p-3 rounded-xl text-xs font-medium ${
                    exportFeedback.type === "success"
                      ? "bg-[#E4F2EC] text-[#1F5C46]"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {exportFeedback.text}
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleRunSaveToMyTemplates}
                  disabled={!contrastPasses}
                  className="mezgeb-btn-primary text-sm disabled:opacity-50"
                >
                  {t("exportSaveMyTemplates")}
                </button>
                <button
                  type="button"
                  onClick={handleUseInPlayground}
                  disabled={!contrastPasses}
                  className="mezgeb-btn-secondary text-sm disabled:opacity-50"
                >
                  {t("exportOpenPlayground")}
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(JSON.stringify(template, null, 2));
                      announce(t("copiedAnnouncement"));
                    } catch {
                      // ignore
                    }
                  }}
                  className="mezgeb-btn-secondary text-sm inline-flex items-center justify-center gap-1.5"
                >
                  <CopyIcon size={14} />
                  <span>{t("exportCopyJson")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => downloadJsonFile(template)}
                  className="mezgeb-btn-secondary text-sm inline-flex items-center justify-center gap-1.5"
                >
                  <DownloadIcon size={14} />
                  <span>{t("exportDownloadJson")}</span>
                </button>
              </div>
            </div>
          )}
        </section>

        {/* RIGHT PANEL: LIVE PREVIEW */}
        <aside
          id="builder-preview-region"
          ref={previewSectionRef}
          aria-labelledby="preview-heading"
          className={`mezgeb-card p-4 space-y-4 ${
            mobilePanel === "preview" ? "block" : "hidden min-[900px]:block"
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="preview-heading" className="text-base font-bold text-[#111111]">
              {t("builderPanelPreviewHeading")}
            </h2>

            <div className="flex flex-wrap items-center gap-1.5">
              {/* Language EN / አማ */}
              <div className="inline-flex rounded-lg border border-[#E7E7E4] bg-[#F5F5F3] p-0.5 text-xs font-semibold">
                <button
                  type="button"
                  aria-pressed={lang === "en"}
                  onClick={() => setLang("en")}
                  className={`px-2 py-1 rounded-md ${
                    lang === "en" ? "bg-white text-[#111111] shadow-sm" : "text-[#6B6B6B]"
                  }`}
                >
                  {t("langEnglish")}
                </button>
                <button
                  type="button"
                  aria-pressed={lang === "am"}
                  onClick={() => setLang("am")}
                  className={`px-2 py-1 rounded-md ${
                    lang === "am" ? "bg-white text-[#111111] shadow-sm" : "text-[#6B6B6B]"
                  }`}
                >
                  {t("langAmharic")}
                </button>
              </div>

              {/* Phone / Desktop */}
              <div className="inline-flex rounded-lg border border-[#E7E7E4] bg-[#F5F5F3] p-0.5 text-xs font-semibold">
                <button
                  type="button"
                  aria-pressed={previewDevice === "phone"}
                  onClick={() => setPreviewDevice("phone")}
                  className={`px-2 py-1 rounded-md ${
                    previewDevice === "phone" ? "bg-white text-[#111111] shadow-sm" : "text-[#6B6B6B]"
                  }`}
                >
                  {t("templatesPreviewPhone")}
                </button>
                <button
                  type="button"
                  aria-pressed={previewDevice === "desktop"}
                  onClick={() => setPreviewDevice("desktop")}
                  className={`px-2 py-1 rounded-md ${
                    previewDevice === "desktop" ? "bg-white text-[#111111] shadow-sm" : "text-[#6B6B6B]"
                  }`}
                >
                  {t("templatesPreviewDesktop")}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                aria-pressed={previewAiOff}
                onClick={() => setPreviewAiOff((v) => !v)}
                className={`px-2.5 py-1 rounded-lg border font-medium ${
                  previewAiOff
                    ? "bg-[#111111] text-white border-[#111111]"
                    : "bg-white text-[#111111] border-[#E7E7E4]"
                }`}
              >
                {t("previewAiOff")}
              </button>
              <button
                type="button"
                aria-pressed={previewOffline}
                onClick={() => setPreviewOffline((v) => !v)}
                className={`px-2.5 py-1 rounded-lg border font-medium ${
                  previewOffline
                    ? "bg-[#111111] text-white border-[#111111]"
                    : "bg-white text-[#111111] border-[#E7E7E4]"
                }`}
              >
                {t("previewOffline")}
              </button>
            </div>
            <button
              type="button"
              onClick={() => setPreviewKey((k) => k + 1)}
              className="text-xs font-semibold text-[#6A4FC4] underline"
            >
              {t("previewRestart")}
            </button>
          </div>

          <div
            className={
              previewDevice === "phone"
                ? "w-full max-w-[390px] mx-auto border-[6px] border-[#161616] rounded-[28px] overflow-hidden shadow-sm bg-[#FAF9F6]"
                : "w-full"
            }
          >
            <MezgebWidget
              key={`builder-pv-${previewKey}`}
              template={template}
              aiEnabled={!previewAiOff}
              offline={previewOffline}
              ephemeralPreview
              jumpToQuestionId={selectedQuestionId}
              accentColor={currentTheme.accent}
              platformName={currentTheme.platformName}
              storageKey={`mezgeb_builder_ephemeral_${template.id}`}
            />
          </div>

          <p className="text-xs text-[#6B6B6B] text-center">{t("previewNoSaveNote")}</p>
        </aside>
      </div>

      {/* QUESTION LIBRARY DIALOG */}
      <AccessibleDialog
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        title={t("qLibTitle")}
        maxWidthClass="max-w-3xl"
      >
        <div className="space-y-4">
          <div role="tablist" className="flex gap-2 border-b border-[#E7E7E4]">
            <button
              type="button"
              role="tab"
              aria-selected={libraryTab === "ready"}
              onClick={() => setLibraryTab("ready")}
              className={`px-4 py-2 text-sm font-semibold border-b-2 ${
                libraryTab === "ready"
                  ? "border-[#6A4FC4] text-[#111111]"
                  : "border-transparent text-[#6B6B6B]"
              }`}
            >
              {t("qLibTabReady")} ({READY_MADE_QUESTIONS.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={libraryTab === "blank"}
              onClick={() => setLibraryTab("blank")}
              className={`px-4 py-2 text-sm font-semibold border-b-2 ${
                libraryTab === "blank"
                  ? "border-[#6A4FC4] text-[#111111]"
                  : "border-transparent text-[#6B6B6B]"
              }`}
            >
              {t("qLibTabBlank")} ({BLANK_QUESTION_TYPES.length})
            </button>
          </div>

          {libraryTab === "ready" && (
            <div className="grid sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
              {READY_MADE_QUESTIONS.map((item) => {
                const q: TemplateQuestion = {
                  ...structuredClone(item.question),
                  id: item.presetId,
                };
                return (
                  <div
                    key={item.presetId}
                    className="p-3.5 rounded-xl border border-[#E7E7E4] bg-[#FAF9F6] flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2 text-xs text-[#6B6B6B]">
                        <span className="inline-flex items-center gap-1.5 font-semibold text-[#111111]">
                          <QuestionIcon name={q.icon} size={14} />
                          <span>{q.label[lang]}</span>
                        </span>
                        <span className="font-mono text-[11px]">{q.type}</span>
                      </div>
                      <p className="text-xs text-[#111111]">{q.label.en}</p>
                      <p className="text-xs text-[#6B6B6B]">{q.label.am}</p>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      {q.sensitive ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-[#111111]">
                          <ShieldIcon size={12} />
                          <span>{t("templatesSensitiveBadge")}</span>
                        </span>
                      ) : (
                        <span />
                      )}
                      <button
                        type="button"
                        onClick={() => insertQuestionIntoTemplate(q)}
                        className="mezgeb-btn-primary text-xs min-h-[34px] px-3"
                      >
                        {t("qLibAddBtn")}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {libraryTab === "blank" && (
            <div className="grid sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
              {BLANK_QUESTION_TYPES.map((desc) => (
                <div
                  key={desc.type}
                  className="p-3.5 rounded-xl border border-[#E7E7E4] bg-[#FAF9F6] flex flex-col justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#111111]">
                      <QuestionIcon name={desc.icon} size={16} />
                      <span>{desc.name[lang]}</span>
                    </div>
                    <p className="text-xs text-[#6B6B6B]">{desc.description[lang]}</p>
                    <p className="text-xs text-[#111111] italic">{desc.example[lang]}</p>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => insertQuestionIntoTemplate(createBlankQuestion(desc.type))}
                      className="mezgeb-btn-secondary text-xs min-h-[34px] px-3"
                    >
                      {t("qLibBlankBtn")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </AccessibleDialog>

      {/* KEYBOARD SHORTCUTS DIALOG */}
      <AccessibleDialog
        open={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
        title={t("shortcutsTitle")}
        maxWidthClass="max-w-md"
      >
        <dl className="divide-y divide-[#E7E7E4] text-sm">
          {[
            { kbd: "Alt + ↑ / ↓", desc: t("shortcutAltArrows") },
            { kbd: "Ctrl / Cmd + D", desc: t("shortcutDuplicate") },
            { kbd: "Delete", desc: t("shortcutDelete") },
            { kbd: "Ctrl / Cmd + Z", desc: t("shortcutUndo") },
            { kbd: "Ctrl / Cmd + Shift + Z", desc: t("shortcutRedo") },
            { kbd: "Ctrl / Cmd + Enter", desc: t("shortcutCheck") },
            { kbd: "?", desc: t("shortcutHelp") },
          ].map((item) => (
            <div key={item.kbd} className="py-2.5 flex items-center justify-between gap-4">
              <dt className="text-[#111111]">{item.desc}</dt>
              <dd>
                <kbd className="px-2 py-1 rounded bg-[#F5F5F3] border border-[#E7E7E4] font-mono text-xs text-[#111111]">
                  {item.kbd}
                </kbd>
              </dd>
            </div>
          ))}
        </dl>
      </AccessibleDialog>
    </Layout>
  );
}
