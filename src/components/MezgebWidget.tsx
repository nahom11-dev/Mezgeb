import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  Camera,
  Check,
  FileUp,
  HelpCircle,
  Lock,
  MessageSquare,
  Mic,
  MoreHorizontal,
  Plus,
  Shield,
  Type,
  Users,
  X,
} from "lucide-react";
import {
  extractSkillsFromStory,
  fetchReadAloudAudio,
  getCapabilities,
  getSmartHelp,
  PROVIDER_NAMES,
  ScreenSummaryForAi,
  ServerCapabilities,
  simplifyQuestionLabel,
  transcribeVoiceAnswer,
} from "../ai";
import { blobToWav16k } from "../lib/wav";
import { Lang, TranslationKeys, translations, useI18n } from "../i18n";
import {
  daysInEthiopianMonth,
  daysInGregorianMonth,
  ETHIOPIAN_MONTHS,
  ethiopianToGregorian,
  formatEthiopianDate,
  formatGregorianDate,
  getAllowedYearBounds,
  GREGORIAN_MONTHS_EN,
  gregorianToEthiopian,
  isValidEthiopianDate,
  isValidGregorianDate,
} from "../lib/ethiopianCalendar";
import { addOutboxItem } from "../lib/outbox";
import {
  buildProgressSnapshot,
  parseSavedProgress,
  resolveResumeStep,
} from "../lib/resumeStep";
import { subscribePartnerSync, upsertPartnerSession } from "../lib/partnerSync";
import { createRegistration } from "../lib/registrations";
import { getRecordedAudioUrlFromManifest, loadAudioManifest, type AudioManifest } from "../lib/recordedAudio";
import { saveCompletedLearnerProfile } from "../lib/profileStore";
import { safeGetStorage, safeRemoveStorage, safeSetStorage } from "../lib/storage";
import {
  buildCompletedProfile,
  buildHelpScreenSummary,
  isQuestionVisible,
  normalizePhoneDigits,
  validatePhone,
} from "../lib/validation";
import { getEffectiveSettings } from "../templates";
import { IdRoute, MezgebTemplate, TemplateQuestion } from "../templates/types";
import { validateTemplate } from "../templates/validate";
import {
  Badge,
  Banner,
  Button,
  ChoiceList,
  Field,
  Progress,
  ReadAloudButton,
  useCanReadAloud,
  VoiceButton,
  VoiceState,
} from "../ui";
import { QuestionIcon } from "../ui/QuestionIcon";
import { useLiveAnnouncer } from "./LiveAnnouncer";

function resumeLinkFor(id: string): string {
  const url = new URL(window.location.href);
  url.searchParams.set("resume", id);
  url.hash = "";
  return url.toString();
}

export type AnswerMode = "speak" | "type" | "simple";

export type DemoWidgetTriggerType =
  | "field_error"
  | "voice_listening"
  | "voice_review"
  | "voice_failed"
  | "outbox_sending"
  | "help_open"
  | "sms_sent"
  | "restored";

export interface MezgebWidgetEvent {
  name: "step.completed" | "registration.completed";
  timestamp: string;
  payload: Record<string, unknown>;
}

export interface MezgebAnswers {
  [key: string]: unknown;
  id_route?: IdRoute;
  partner_org?: string;
  partner_consent?: boolean;
  other_doc_name?: string;
  support_needs?: string[];
  support_share_platform?: boolean;
  support_share_employers?: boolean;
  support_share_partner?: boolean;
  work_story?: string;
  skills?: string[];
  consent_accepted?: boolean;
}

export interface BuilderCanvasConfig {
  editingLang: Lang;
  rawQuestion: TemplateQuestion | null;
  questionPosition: number;
  questionTotal: number;
  focusLabelTrigger?: number;
  onUpdateLabel: (val: string) => void;
  onUpdateHint: (val: string) => void;
  onUpdateOptionLabel?: (optIndex: number, val: string) => void;
  onRemoveOption?: (optIndex: number) => void;
  onAddOption?: () => void;
  onOpenPasteOptions?: () => void;
  onAddOtherOption?: () => void;
  onAddPreferNotOption?: () => void;
  renderLabelActions?: React.ReactNode;
  renderHintActions?: React.ReactNode;
  renderAfterLabel?: React.ReactNode;
  renderAfterHint?: React.ReactNode;
  labels: {
    editQuestionLabelAria: string;
    editHintAria: string;
    addHintBtn: string;
    charsWarning: (count: number) => string;
    englishReference: (text: string) => string;
    addOptionBtn: string;
    removeOptionAria: (optText: string) => string;
    moreOptionsAria: string;
    pasteOptionsItem: string;
    addOtherItem: string;
    addPreferNotItem: string;
    disabledFooterTitle: string;
    backLabel: string;
    saveLabel: string;
    progressLabel: string;
    readAloudLabel: string;
    helpLabel: string;
  };
}

interface MezgebWidgetProps {
  template: MezgebTemplate;
  aiEnabled: boolean;
  offline: boolean;
  accentColor?: string;
  platformName?: string;
  readOnly?: boolean;
  ephemeralPreview?: boolean;
  storageKey?: string;
  resumeIdParam?: string | null;
  singleQuestionMode?: boolean;
  jumpToQuestionId?: string | null;
  initialAnswers?: MezgebAnswers;
  showWelcomeFlow?: boolean;
  initialAnswerMode?: AnswerMode;
  highContrast?: boolean;
  assistedMode?: boolean;
  assistedLearnerName?: string;
  outboxCount?: number;
  demoTrigger?: { type: DemoWidgetTriggerType; seq: number } | null;
  builderCanvas?: BuilderCanvasConfig;
  onAnswersChange?: (answers: MezgebAnswers) => void;
  onAiPayloadLogged?: (payload: ScreenSummaryForAi) => void;
  onEvent?: (event: MezgebWidgetEvent) => void;
  onComplete?: (result: {
    token: string;
    profile: Record<string, unknown>;
    supportShared: boolean;
    queuedOffline?: boolean;
  }) => void;
  onOutboxUpdated?: () => void;
  /** Set when embed flushes a queued registration (outbox id + token). */
  outboxFlushNotice?: { outboxId: string; token: string } | null;
  onReset?: () => void;
  /** "widget" (embeds): Alt+H only when focus is inside the widget. */
  shortcutScope?: "window" | "widget";
  /** Publishable key of the platform; the server ties the one-time token to it. */
  siteKey?: string;
  /** false (embeds): don't keep the completed profile on this device. */
  persistProfile?: boolean;
}

function formatPhoneGrouped(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
}

function isDigitType(type: string): boolean {
  return type === "phone" || type === "number";
}

/** "0911223344" -> "0 9 1 1 2 2 3 3 4 4" so it is read back one digit at a time. */
function spellDigits(raw: string): string {
  return raw.replace(/\D/g, "").split("").join(" ");
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      const comma = result.indexOf(",");
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(new Error("FileReader error"));
    reader.readAsDataURL(blob);
  });
}

function stripSupportFromAnswers(ans: MezgebAnswers): MezgebAnswers {
  const clean = { ...ans };
  delete clean.support_needs;
  delete clean.support_share_platform;
  delete clean.support_share_employers;
  delete clean.support_share_partner;
  return clean;
}

function createEmptyAnswers(defaultLang: Lang, partnerDefault?: boolean): MezgebAnswers {
  return {
    language: defaultLang,
    id_route: partnerDefault ? "partner_refer" : undefined,
    support_share_platform: false,
    support_share_employers: false,
    support_share_partner: false,
    support_needs: [],
    skills: [],
    dob_calendar: "eth",
  };
}

export function MezgebWidget({
  template,
  aiEnabled,
  offline,
  accentColor: accentColorProp,
  platformName: platformNameProp,
  readOnly = false,
  ephemeralPreview = false,
  storageKey = "mezgeb_demo_state_v1",
  resumeIdParam = null,
  singleQuestionMode = false,
  jumpToQuestionId = null,
  initialAnswers,
  showWelcomeFlow = false,
  initialAnswerMode = "type",
  highContrast = false,
  assistedMode = false,
  assistedLearnerName = "Learner",
  outboxCount = 0,
  demoTrigger = null,
  builderCanvas,
  onAnswersChange,
  onAiPayloadLogged,
  onEvent,
  onComplete,
  onOutboxUpdated,
  outboxFlushNotice = null,
  onReset,
  shortcutScope = "window",
  siteKey = "",
  persistProfile = true,
}: MezgebWidgetProps) {
  const { lang: siteLang, setLang, t } = useI18n();
  const lang: Lang = builderCanvas ? builderCanvas.editingLang : siteLang;
  const { announce } = useLiveAnnouncer();
  const widgetId = useId();

  // Inline builder canvas editing state
  const [editingCanvasField, setEditingCanvasField] = useState<"label" | "hint" | null>(null);
  const [canvasDraftValue, setCanvasDraftValue] = useState("");
  const [canvasOptMenuOpen, setCanvasOptMenuOpen] = useState(false);
  const canvasLabelBtnRef = useRef<HTMLButtonElement>(null);
  const canvasHintBtnRef = useRef<HTMLButtonElement>(null);
  const canvasLabelInputRef = useRef<HTMLTextAreaElement>(null);
  const canvasHintInputRef = useRef<HTMLTextAreaElement>(null);
  const canvasOptMenuRef = useRef<HTMLDivElement>(null);

  const validation = validateTemplate(template);
  const safeTemplate = validation.template;
  const effectiveSettings = getEffectiveSettings(safeTemplate);
  const effectiveAccent = accentColorProp ?? safeTemplate.theme?.accent ?? "var(--accent)";
  const effectivePlatformName = platformNameProp ?? safeTemplate.theme?.platformName ?? "Learnhub";

  const [capabilities, setCapabilities] = useState<ServerCapabilities>({
    voice: true,
    smartHelp: true,
    skillsAi: true,
    simplifyAi: true,
  });

  useEffect(() => {
    let mounted = true;
    getCapabilities().then((caps) => {
      if (mounted) setCapabilities(caps);
    });
    return () => {
      mounted = false;
    };
  }, [aiEnabled, offline]);

  const effectiveAi = aiEnabled && !offline;
  const voiceProviderForLang = capabilities.voiceProviders
    ? capabilities.voiceProviders[lang]
    : capabilities.voiceProvider;
  const canVoice =
    effectiveAi &&
    capabilities.voice &&
    effectiveSettings.voice &&
    (!capabilities.voiceProviders || Boolean(voiceProviderForLang));
  const voiceNotice = voiceProviderForLang
    ? t("voiceProviderNotice", { provider: PROVIDER_NAMES[voiceProviderForLang] })
    : t("cloudAiNotice");
  const canSmartHelp = effectiveAi && capabilities.smartHelp && effectiveSettings.smartHelp;
  const canSkillsAi = effectiveAi && capabilities.skillsAi;
  const canSimplifyAi = effectiveAi && capabilities.simplifyAi && effectiveSettings.sayItSimply;

  // Screen stages: welcome -> mode -> questions (stepIndex)
  const useIntroScreens = showWelcomeFlow && !singleQuestionMode && !jumpToQuestionId;
  const [stage, setStage] = useState<"welcome" | "mode" | "questions">(() =>
    useIntroScreens && !resumeIdParam ? "welcome" : "questions"
  );
  const [answerMode, setAnswerMode] = useState<AnswerMode>(initialAnswerMode);
  const [autoReadSimple, setAutoReadSimple] = useState(true);
  const [resumeLinkInputOpen, setResumeLinkInputOpen] = useState(false);
  const [resumeLinkValue, setResumeLinkValue] = useState("");
  const [resumeError, setResumeError] = useState("");

  useEffect(() => {
    setAnswerMode(initialAnswerMode);
  }, [initialAnswerMode]);

  const [stepIndex, setStepIndex] = useState<number>(0);
  const [returnToReviewAfterEdit, setReturnToReviewAfterEdit] = useState(false);
  const [answers, setAnswers] = useState<MezgebAnswers>(() => ({
    ...createEmptyAnswers(lang, safeTemplate.partnerDefault),
    ...(initialAnswers ?? {}),
  }));

  const visibleQuestions = safeTemplate.questions.filter((q) =>
    isQuestionVisible(q, answers, safeTemplate.questions)
  );
  const totalSteps = Math.max(
    1,
    singleQuestionMode ? visibleQuestions.length : visibleQuestions.length + 1
  );

  const [hiddenRuleNotice, setHiddenRuleNotice] = useState(false);
  const [resumePromptStep, setResumePromptStep] = useState<number | null>(null);
  const [storageBlocked, setStorageBlocked] = useState(false);
  const [deviceClearedNotice, setDeviceClearedNotice] = useState(false);
  const [outboxBannerState, setOutboxBannerState] = useState<"idle" | "sending" | "sent">("idle");

  // Completion state
  const [completedState, setCompletedState] = useState<{
    token: string;
    profile: Record<string, unknown>;
    supportShared: boolean;
    queuedOffline: boolean;
    outboxId?: string;
  } | null>(null);

  // Partner sync state
  const [partnerSessionId] = useState(() => `sess_${Math.random().toString(36).slice(2, 8)}`);
  const [partnerJoinedLive, setPartnerJoinedLive] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<
    { fieldId: string; code: string; message: string; fieldLabel: string }[]
  >([]);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const questionHeadingRef = useRef<HTMLHeadingElement>(null);
  const storageHydratedRef = useRef(false);
  const pendingResumeIndexRef = useRef<number | null>(null);

  // Read aloud
  const [speaking, setSpeaking] = useState(false);
  const [noAmharicVoiceNote, setNoAmharicVoiceNote] = useState(false);
  const [audioManifest, setAudioManifest] = useState<AudioManifest | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const ttsAbortRef = useRef<AbortController | null>(null);
  const ttsUrlCacheRef = useRef(new Map<string, string>());
  const rootRef = useRef<HTMLDivElement>(null);
  const byId = (id: string): HTMLElement | null => {
    const node = rootRef.current?.getRootNode() as Document | ShadowRoot | undefined;
    return (node && "getElementById" in node ? node : document).getElementById(id);
  };

  // Voice recording & simulated demo states
  const [voiceUiState, setVoiceUiState] = useState<VoiceState>("idle");
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [pendingTranscript, setPendingTranscript] = useState<{
    fieldKey: string;
    transcript: string;
    value: string;
  } | null>(null);
  const [pendingChoiceMatch, setPendingChoiceMatch] = useState<{
    fieldKey: string;
    matchedValue: string;
    matchedLabel: string;
    isMulti?: boolean;
  } | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recordTimerRef = useRef<number | null>(null);
  const textInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  // Help panel
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpProblem, setHelpProblem] = useState("");
  const [helpLoading, setHelpLoading] = useState(false);
  const [helpAiAnswer, setHelpAiAnswer] = useState<{
    explanation: string;
    targetFieldId: string | null;
    targetFieldLabel: string;
  } | null>(null);
  const [partnerHelpVisible, setPartnerHelpVisible] = useState(false);
  const helpBtnRef = useRef<HTMLButtonElement>(null);
  const helpHeadingRef = useRef<HTMLHeadingElement>(null);

  // Simplify wording
  const [simplifying, setSimplifying] = useState(false);
  const [simplifiedInfo, setSimplifiedInfo] = useState<{ usedAi: boolean; text: string } | null>(null);

  // Skills extraction
  const [extractingSkills, setExtractingSkills] = useState(false);
  const [pendingSuggestedSkills, setPendingSuggestedSkills] = useState<
    { name: string; evidence: string }[]
  >([]);
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [showSkillsFallback, setShowSkillsFallback] = useState(false);

  // Save-and-resume SMS link
  const [smsOpen, setSmsOpen] = useState(false);
  const [smsPhone, setSmsPhone] = useState("");
  const [smsPhoneError, setSmsPhoneError] = useState("");
  const [smsGeneratedLink, setSmsGeneratedLink] = useState<string | null>(null);

  const applySavedProgress = useCallback(
    (parsed: ReturnType<typeof parseSavedProgress> extends infer T ? NonNullable<T> : never) => {
      const merged: MezgebAnswers = {
        ...createEmptyAnswers(lang, safeTemplate.partnerDefault),
        ...(parsed.answers as MezgebAnswers),
      };
      const vis = safeTemplate.questions.filter((q) =>
        isQuestionVisible(q, merged, safeTemplate.questions)
      );
      const idx = resolveResumeStep(parsed, vis, safeTemplate.questions);
      setAnswers((prev) => ({ ...prev, ...(parsed.answers as MezgebAnswers) }));
      pendingResumeIndexRef.current = idx;
      if (idx > 0) {
        setResumePromptStep(idx + 1);
      }
    },
    [lang, safeTemplate.questions, safeTemplate.partnerDefault]
  );

  const handleResumeContinue = useCallback(() => {
    const idx = pendingResumeIndexRef.current ?? 0;
    setStepIndex(idx);
    setStage("questions");
    setResumePromptStep(null);
    pendingResumeIndexRef.current = null;
    const stepNum = idx + 1;
    announce(t("widgetResumeContinued", { step: stepNum }));
    window.setTimeout(() => {
      questionHeadingRef.current?.focus();
    }, 20);
  }, [announce, t]);

  // Load saved state or ?resume=<id> on mount
  useEffect(() => {
    if (readOnly || singleQuestionMode || ephemeralPreview || !effectiveSettings.offline) {
      storageHydratedRef.current = true;
      return;
    }
    if (resumeIdParam) {
      const resumed = safeGetStorage(`mezgeb_resume_${resumeIdParam}`);
      const parsed = resumed.value ? parseSavedProgress(resumed.value) : null;
      if (parsed) applySavedProgress(parsed);
      storageHydratedRef.current = true;
      return;
    }

    const saved = safeGetStorage(storageKey);
    if (saved.blocked) setStorageBlocked(true);
    const parsed = saved.value ? parseSavedProgress(saved.value) : null;
    if (parsed) applySavedProgress(parsed);
    storageHydratedRef.current = true;
  }, [
    readOnly,
    singleQuestionMode,
    ephemeralPreview,
    storageKey,
    resumeIdParam,
    effectiveSettings.offline,
    applySavedProgress,
  ]);

  // Autosave (excluding private support fields)
  useEffect(() => {
    onAnswersChange?.(answers);
    if (
      readOnly ||
      singleQuestionMode ||
      ephemeralPreview ||
      completedState ||
      !effectiveSettings.offline ||
      !storageHydratedRef.current
    ) {
      return;
    }
    const sanitized = stripSupportFromAnswers(answers);
    const vis = safeTemplate.questions.filter((q) => isQuestionVisible(q, answers, safeTemplate.questions));
    const snap = buildProgressSnapshot(stepIndex, vis, sanitized);
    const res = safeSetStorage(storageKey, JSON.stringify(snap));
    if (res.blocked) setStorageBlocked(true);
  }, [
    answers,
    stepIndex,
    readOnly,
    singleQuestionMode,
    ephemeralPreview,
    storageKey,
    completedState,
    onAnswersChange,
    effectiveSettings.offline,
  ]);

  // Jump to selected question from builder / preview
  useEffect(() => {
    if (!jumpToQuestionId) {
      setHiddenRuleNotice(false);
      return;
    }
    const visIdx = visibleQuestions.findIndex((q) => q.id === jumpToQuestionId);
    if (visIdx >= 0) {
      setCompletedState(null);
      setStage("questions");
      setStepIndex(visIdx);
      setHiddenRuleNotice(false);
    } else if (safeTemplate.questions.some((q) => q.id === jumpToQuestionId)) {
      setHiddenRuleNotice(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jumpToQuestionId, visibleQuestions.length]);

  useEffect(() => {
    if (stepIndex >= totalSteps) {
      setStepIndex(Math.max(0, totalSteps - 1));
    }
  }, [stepIndex, totalSteps]);

  // Partner BroadcastChannel sync
  useEffect(() => {
    if (readOnly || singleQuestionMode || ephemeralPreview) return;
    const unsub = subscribePartnerSync((msg) => {
      if (msg.type === "partner_joined" && msg.sessionId === partnerSessionId) {
        setPartnerJoinedLive(true);
        announce(t("widgetPartnerJoinedBanner"));
      } else if (
        msg.type === "partner_verified" &&
        msg.sessionId === partnerSessionId &&
        msg.verifiedAt
      ) {
        setPartnerJoinedLive(true);
        setCompletedState((prev) =>
          prev
            ? {
                ...prev,
                profile: {
                  ...prev.profile,
                  id_route: "partner_verified",
                  verified_at: msg.verifiedAt,
                },
              }
            : prev
        );
      }
    });
    return unsub;
  }, [readOnly, singleQuestionMode, ephemeralPreview, partnerSessionId, announce, t]);

  useEffect(() => {
    if (!outboxFlushNotice) return;
    setCompletedState((prev) => {
      if (!prev?.queuedOffline) return prev;
      if (prev.outboxId && outboxFlushNotice.outboxId !== prev.outboxId) return prev;
      queueMicrotask(() => announce(t("widgetQueuedRegistrationSent")));
      return { ...prev, token: outboxFlushNotice.token, queuedOffline: false };
    });
  }, [outboxFlushNotice, announce, t]);

  const currentQuestion: TemplateQuestion | null = builderCanvas
    ? builderCanvas.rawQuestion
    : stepIndex < visibleQuestions.length
      ? visibleQuestions[stepIndex]
      : null;
  const isReviewStep = !singleQuestionMode && !builderCanvas && stepIndex === visibleQuestions.length;

  useEffect(() => {
    setEditingCanvasField(null);
    setCanvasOptMenuOpen(false);
  }, [builderCanvas?.rawQuestion?.id, builderCanvas?.editingLang]);

  useEffect(() => {
    if (!builderCanvas?.focusLabelTrigger || !builderCanvas.rawQuestion) return;
    setEditingCanvasField("label");
    setCanvasDraftValue(builderCanvas.rawQuestion.label[builderCanvas.editingLang] ?? "");
    const timer = window.setTimeout(() => {
      canvasLabelInputRef.current?.focus();
    }, 30);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [builderCanvas?.focusLabelTrigger]);

  useEffect(() => {
    if (!canvasOptMenuOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (!canvasOptMenuRef.current?.contains(e.target as Node)) {
        setCanvasOptMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [canvasOptMenuOpen]);

  useEffect(() => {
    if (readOnly || singleQuestionMode || ephemeralPreview) return;
    if (answers.id_route === "partner_refer" && answers.partner_org) {
      upsertPartnerSession({
        sessionId: partnerSessionId,
        partnerOrg: String(answers.partner_org),
        stepNumber: stepIndex + 1,
        totalSteps,
        questionLabel: currentQuestion ? currentQuestion.label[lang] : t("widgetReviewTitle"),
        maskedFields: visibleQuestions.map((q) => {
          const val = answers[q.id];
          const hasValue = Array.isArray(val)
            ? val.length > 0
            : Boolean(val && String(val).trim() !== "");
          return { id: q.id, label: q.label[lang], hasValue };
        }),
        partnerJoined: partnerJoinedLive,
        verified: false,
        updatedAt: new Date().toISOString(),
      });
    }
  }, [
    answers,
    stepIndex,
    totalSteps,
    currentQuestion,
    lang,
    partnerSessionId,
    partnerJoinedLive,
    readOnly,
    singleQuestionMode,
    ephemeralPreview,
    visibleQuestions,
    t,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recordTimerRef.current) window.clearInterval(recordTimerRef.current);
      mediaStreamRef.current?.getTracks().forEach((tr) => tr.stop());
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      audioElRef.current?.pause();
      ttsAbortRef.current?.abort();
      for (const url of ttsUrlCacheRef.current.values()) {
        URL.revokeObjectURL(url);
      }
      ttsUrlCacheRef.current.clear();
    };
  }, []);

  const getFieldDomId = (fieldKey: string) => `${widgetId}-field-${fieldKey}`;

  const updateAnswer = (key: string, val: unknown) => {
    setAnswers((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => prev.filter((e) => e.fieldId !== getFieldDomId(key)));
  };

  // Clear transient step state on step change
  useEffect(() => {
    setErrors([]);
    setVoiceUiState("idle");
    setPendingTranscript(null);
    setPendingChoiceMatch(null);
    setHelpAiAnswer(null);
    setPartnerHelpVisible(false);
    setSimplifiedInfo(null);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
    audioElRef.current?.pause();
    ttsAbortRef.current?.abort();
    ttsAbortRef.current = null;
    setNoAmharicVoiceNote(false);
  }, [stepIndex, stage]);

  const serverReadAloudForLang = Boolean(effectiveAi && capabilities.readAloudProviders?.[lang]);

  useEffect(() => {
    let active = true;
    loadAudioManifest().then((m) => {
      if (active && m) setAudioManifest(m);
    });
    return () => {
      active = false;
    };
  }, []);

  const currentReadAloudText = currentQuestion
    ? `${currentQuestion.label[lang]}${currentQuestion.hint?.[lang] ? `. ${currentQuestion.hint[lang]}` : ""}`
    : t("widgetReviewTitle");

  const recordedUrlForCurrent = getRecordedAudioUrlFromManifest(audioManifest, currentReadAloudText, lang);

  // Read aloud availability check
  const canReadCurrent = useCanReadAloud(
    lang,
    currentQuestion?.audio?.[lang],
    serverReadAloudForLang,
    recordedUrlForCurrent
  );

  const playAudio = useCallback((url: string): Promise<void> => {
    const audio = new Audio(url);
    audioElRef.current = audio;
    audio.onended = () => setSpeaking(false);
    audio.onerror = () => setSpeaking(false);
    setSpeaking(true);
    return audio.play();
  }, []);

  const speakWithBrowserVoice = useCallback((text: string, targetLang: Lang) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const voices = window.speechSynthesis.getVoices();
    const hasTargetVoice =
      targetLang === "am"
        ? voices.some((v) => v.lang.toLowerCase().startsWith("am"))
        : voices.length === 0 || voices.some((v) => v.lang.toLowerCase().startsWith("en"));

    if (targetLang === "am" && !hasTargetVoice) {
      setNoAmharicVoiceNote(true);
      setSpeaking(false);
      return;
    }

    setNoAmharicVoiceNote(false);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetLang === "am" ? "am-ET" : "en-US";
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, []);

  const speakText = useCallback(
    (text: string, targetLang: Lang, audioUrl?: string) => {
      if (speaking) {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          window.speechSynthesis.cancel();
        }
        audioElRef.current?.pause();
        ttsAbortRef.current?.abort();
        ttsAbortRef.current = null;
        setSpeaking(false);
        return;
      }

      const recorded = getRecordedAudioUrlFromManifest(audioManifest, text, targetLang);
      if (recorded) {
        setNoAmharicVoiceNote(false);
        playAudio(recorded).catch(() => setSpeaking(false));
        return;
      }

      if (audioUrl) {
        playAudio(audioUrl).catch(() => setSpeaking(false));
        return;
      }

      if (effectiveAi && capabilities.readAloudProviders?.[targetLang]) {
        setNoAmharicVoiceNote(false);
        const key = `${targetLang}|${text}`;
        const fallBack = () => {
          setSpeaking(false);
          speakWithBrowserVoice(text, targetLang);
        };
        const cached = ttsUrlCacheRef.current.get(key);
        if (cached) {
          playAudio(cached).catch(fallBack);
          return;
        }
        const controller = new AbortController();
        ttsAbortRef.current = controller;
        setSpeaking(true);
        fetchReadAloudAudio(text, targetLang, controller.signal).then((blob) => {
          if (controller.signal.aborted) return;
          ttsAbortRef.current = null;
          if (!blob) return fallBack();
          const url = URL.createObjectURL(blob);
          ttsUrlCacheRef.current.set(key, url);
          playAudio(url).catch(fallBack);
        });
        return;
      }

      speakWithBrowserVoice(text, targetLang);
    },
    [speaking, effectiveAi, capabilities.readAloudProviders, playAudio, speakWithBrowserVoice, audioManifest]
  );

  const handleReadEnglishFallback = () => {
    if (currentQuestion) {
      const text = `${currentQuestion.label.en}. ${currentQuestion.hint?.en ?? ""}`;
      speakText(text, "en", currentQuestion.audio?.en);
    } else {
      speakText(t("widgetReviewTitle"), "en");
    }
  };

  // Auto-read once per question in Simple words with pictures mode
  const lastAutoReadKeyRef = useRef<string>("");
  useEffect(() => {
    if (
      stage !== "questions" ||
      answerMode !== "simple" ||
      !autoReadSimple ||
      !effectiveSettings.readAloud ||
      !canReadCurrent ||
      readOnly
    ) {
      return;
    }
    const key = `${stepIndex}-${currentQuestion?.id ?? "review"}-${lang}`;
    if (lastAutoReadKeyRef.current === key) return;
    lastAutoReadKeyRef.current = key;
    const textToRead = currentQuestion
      ? currentQuestion.hint?.[lang] || currentQuestion.label[lang]
      : t("widgetReviewTitle");
    if (textToRead && !speaking) {
      speakText(textToRead, lang, currentQuestion?.audio?.[lang]);
    }
  }, [
    stage,
    answerMode,
    autoReadSimple,
    effectiveSettings.readAloud,
    canReadCurrent,
    readOnly,
    stepIndex,
    currentQuestion,
    lang,
    t,
    speaking,
    speakText,
  ]);

  // Help panel Escape & focus management
  useEffect(() => {
    if (!helpOpen) return;
    const timer = window.setTimeout(() => {
      helpHeadingRef.current?.focus();
    }, 20);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setHelpOpen(false);
        (textInputRef.current ?? helpBtnRef.current)?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
    };
  }, [helpOpen]);

  // Alt+H keyboard shortcut always works
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === "h" || e.key === "H")) {
        if (
          shortcutScope === "widget" &&
          !(rootRef.current && e.composedPath().includes(rootRef.current))
        ) {
          return;
        }
        e.preventDefault();
        setHelpOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [shortcutScope]);

  // Demo state trigger handler (Section 6.2 & 9.3)
  useEffect(() => {
    if (!demoTrigger) return;
    const { type } = demoTrigger;
    setCompletedState(null);
    setStage("questions");

    if (type === "field_error") {
      const phoneIdx = visibleQuestions.findIndex((q) => q.type === "phone");
      const targetIdx = phoneIdx >= 0 ? phoneIdx : Math.min(1, visibleQuestions.length - 1);
      setStepIndex(targetIdx);
      const q = visibleQuestions[targetIdx];
      if (q) {
        setErrors([
          {
            fieldId: getFieldDomId(q.id),
            code: q.type === "phone" ? "PHONE_INVALID" : "REQUIRED",
            message: q.type === "phone" ? t("errPhoneFormat") : t("errRequired"),
            fieldLabel: q.label[lang],
          },
        ]);
      }
    } else if (type === "voice_listening") {
      const nameIdx = visibleQuestions.findIndex((q) => q.type === "text");
      if (nameIdx >= 0) setStepIndex(nameIdx);
      setVoiceUiState("listening");
      setRecordSeconds(3);
    } else if (type === "voice_review") {
      const nameIdx = visibleQuestions.findIndex((q) => q.type === "text");
      const targetQ = nameIdx >= 0 ? visibleQuestions[nameIdx] : visibleQuestions[0];
      if (nameIdx >= 0) setStepIndex(nameIdx);
      if (targetQ) {
        const sample = lang === "am" ? "ሐና ተስፋዬ" : t("demoSimulatedVoiceSample");
        setPendingTranscript({
          fieldKey: targetQ.id,
          transcript: sample,
          value: sample,
        });
        setVoiceUiState("review");
      }
    } else if (type === "voice_failed") {
      const nameIdx = visibleQuestions.findIndex((q) => q.type === "text");
      if (nameIdx >= 0) setStepIndex(nameIdx);
      setVoiceUiState("failed");
    } else if (type === "outbox_sending") {
      setOutboxBannerState("sending");
    } else if (type === "help_open") {
      setHelpOpen(true);
    } else if (type === "sms_sent") {
      setSmsOpen(true);
      setSmsPhone("0911234567");
      setSmsGeneratedLink(resumeLinkFor("mzg_demo_5"));
    } else if (type === "restored") {
      const targetStep = Math.min(4, Math.max(0, visibleQuestions.length - 1));
      setStepIndex(targetStep);
      setResumePromptStep(targetStep + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demoTrigger?.seq]);

  const stopVoiceRecording = useCallback(() => {
    if (recordTimerRef.current) {
      window.clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    } else {
      setVoiceUiState("idle");
    }
  }, []);

  const startVoiceRecording = async (
    fieldKey: string,
    questionLabel: string,
    expectedType: string,
    options?: { value: string; label: string }[],
    isMulti?: boolean
  ) => {
    if (!canVoice || readOnly) return;
    setPendingTranscript(null);
    setPendingChoiceMatch(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setVoiceUiState("failed");
      textInputRef.current?.focus();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const chunks: BlobPart[] = [];
      const opusMime = "audio/webm;codecs=opus";
      const recorder =
        typeof MediaRecorder.isTypeSupported === "function" &&
        MediaRecorder.isTypeSupported(opusMime)
          ? new MediaRecorder(stream, { mimeType: opusMime, audioBitsPerSecond: 16000 })
          : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (ev) => {
        if (ev.data.size > 0) chunks.push(ev.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((tr) => tr.stop());
        const recorded = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
        setVoiceUiState("processing");
        try {
          const blob = await blobToWav16k(recorded);
          if (blob.size > 1_000_000) {
            setVoiceUiState("failed");
            return;
          }
          const base64 = await blobToBase64(blob);
          const sendMime =
            blob.type && blob.type.toLowerCase().includes("wav") ? "audio/wav" : blob.type || "audio/webm";
          const result = await transcribeVoiceAnswer({
            audioBase64: base64,
            mimeType: sendMime,
            questionLabel,
            expectedType,
            lang,
            options,
          });
          if (!result.ok || !result.transcript) {
            setVoiceUiState("failed");
            textInputRef.current?.focus();
          } else if (options && options.length > 0) {
            const matchedOpt = result.matchedValue
              ? options.find((o) => o.value === result.matchedValue)
              : undefined;
            if (matchedOpt) {
              setPendingChoiceMatch({
                fieldKey,
                matchedValue: matchedOpt.value,
                matchedLabel: matchedOpt.label,
                isMulti,
              });
              setVoiceUiState("idle");
            } else {
              setVoiceUiState("failed");
            }
          } else {
            setPendingTranscript({
              fieldKey,
              transcript: result.transcript,
              value: result.value,
            });
            setVoiceUiState("review");
            const heard = isDigitType(expectedType)
              ? spellDigits(result.value)
              : result.value || result.transcript;
            announce(`${t("widgetTranscriptConfirmTitle")} ${heard}`);
          }
        } catch {
          setVoiceUiState("failed");
          textInputRef.current?.focus();
        }
      };

      recorder.start();
      setVoiceUiState("listening");
      setRecordSeconds(0);

      recordTimerRef.current = window.setInterval(() => {
        setRecordSeconds((sec) => {
          if (sec + 1 >= 20) {
            stopVoiceRecording();
            return 20;
          }
          return sec + 1;
        });
      }, 1000);
    } catch {
      setVoiceUiState("failed");
      textInputRef.current?.focus();
    }
  };

  const validateCurrentStep = (): {
    fieldId: string;
    code: string;
    message: string;
    fieldLabel: string;
  }[] => {
    if (readOnly) return [];
    const found: { fieldId: string; code: string; message: string; fieldLabel: string }[] = [];

    if (currentQuestion) {
      const fid = getFieldDomId(currentQuestion.id);
      const qLabel = currentQuestion.label[lang];
      const val = answers[currentQuestion.id];
      const strVal = String(val ?? "").trim();
      const rules = currentQuestion.validation;

      if (currentQuestion.type === "info") return [];

      if (currentQuestion.type === "text") {
        if (currentQuestion.required && !strVal) {
          found.push({ fieldId: fid, code: "REQUIRED", message: t("errRequired"), fieldLabel: qLabel });
        } else if (strVal) {
          if (rules?.preset === "ethiopian-phone" && !validatePhone(strVal)) {
            found.push({ fieldId: fid, code: "PHONE_INVALID", message: t("errPhoneFormat"), fieldLabel: qLabel });
          } else if (rules?.preset === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(strVal)) {
            found.push({ fieldId: fid, code: "EMAIL_INVALID", message: t("errEmailFormat"), fieldLabel: qLabel });
          } else if (rules?.preset === "digits-only" && !/^\d+$/.test(strVal)) {
            found.push({ fieldId: fid, code: "DIGITS_ONLY", message: t("errDigitsOnly"), fieldLabel: qLabel });
          } else if (rules?.preset === "letters-only" && /\d/.test(strVal)) {
            found.push({ fieldId: fid, code: "LETTERS_ONLY", message: t("errLettersOnly"), fieldLabel: qLabel });
          }
          if (typeof rules?.minLength === "number" && strVal.length < rules.minLength) {
            found.push({
              fieldId: fid,
              code: "MIN_LENGTH",
              message: t("errMinLength", { min: rules.minLength }),
              fieldLabel: qLabel,
            });
          }
          if (typeof rules?.maxLength === "number" && strVal.length > rules.maxLength) {
            found.push({
              fieldId: fid,
              code: "MAX_LENGTH",
              message: t("errMaxLength", { max: rules.maxLength }),
              fieldLabel: qLabel,
            });
          }
        }
      } else if (currentQuestion.type === "email") {
        if (currentQuestion.required && !strVal) {
          found.push({ fieldId: fid, code: "REQUIRED", message: t("errRequired"), fieldLabel: qLabel });
        } else if (strVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(strVal)) {
          found.push({ fieldId: fid, code: "EMAIL_INVALID", message: t("errEmailFormat"), fieldLabel: qLabel });
        }
      } else if (currentQuestion.type === "number") {
        if (currentQuestion.required && !strVal) {
          found.push({ fieldId: fid, code: "REQUIRED", message: t("errRequired"), fieldLabel: qLabel });
        } else if (strVal) {
          const num = Number(strVal);
          if (!Number.isFinite(num)) {
            found.push({ fieldId: fid, code: "NUMBER_INVALID", message: t("errNumberFormat"), fieldLabel: qLabel });
          } else {
            if (typeof rules?.min === "number" && num < rules.min) {
              found.push({
                fieldId: fid,
                code: "NUMBER_RANGE",
                message: t("errMinNumber", { min: rules.min }),
                fieldLabel: qLabel,
              });
            }
            if (typeof rules?.max === "number" && num > rules.max) {
              found.push({
                fieldId: fid,
                code: "NUMBER_RANGE",
                message: t("errMaxNumber", { max: rules.max }),
                fieldLabel: qLabel,
              });
            }
          }
        }
      } else if (currentQuestion.type === "choice" || currentQuestion.type === "yes-no") {
        if (currentQuestion.required && !strVal) {
          found.push({ fieldId: fid, code: "REQUIRED", message: t("errRequired"), fieldLabel: qLabel });
        }
      } else if (currentQuestion.type === "multichoice") {
        const list = Array.isArray(val) ? val : [];
        if (currentQuestion.required && list.length === 0) {
          found.push({ fieldId: fid, code: "REQUIRED", message: t("errRequired"), fieldLabel: qLabel });
        }
      } else if (currentQuestion.type === "consent") {
        if (currentQuestion.required && !val) {
          found.push({ fieldId: fid, code: "CONSENT_REQUIRED", message: t("errRequired"), fieldLabel: qLabel });
        }
      } else if (currentQuestion.type === "phone") {
        if ((currentQuestion.required || strVal !== "") && !validatePhone(strVal)) {
          found.push({ fieldId: fid, code: "PHONE_INVALID", message: t("errPhoneFormat"), fieldLabel: qLabel });
        }
      } else if (currentQuestion.type === "date") {
        const cal = answers.dob_calendar === "greg" ? "greg" : "eth";
        if (cal === "eth") {
          const d = Number(String(answers.dob_eth_day ?? "").trim());
          const m = Number(String(answers.dob_eth_month ?? "").trim());
          const y = Number(String(answers.dob_eth_year ?? "").trim());
          if (!isValidEthiopianDate(y, m, d)) {
            found.push({
              fieldId: getFieldDomId("dob_eth_year"),
              code: "DATE_INVALID",
              message: t("errDateInvalid"),
              fieldLabel: t("widgetCalYear"),
            });
          }
        } else {
          const d = Number(String(answers.dob_greg_day ?? "").trim());
          const m = Number(String(answers.dob_greg_month ?? "").trim());
          const y = Number(String(answers.dob_greg_year ?? "").trim());
          if (!isValidGregorianDate(y, m, d)) {
            found.push({
              fieldId: getFieldDomId("dob_greg_year"),
              code: "DATE_INVALID",
              message: t("errDateInvalid"),
              fieldLabel: t("widgetCalYear"),
            });
          }
        }
      } else if (currentQuestion.type === "id-routes") {
        const route = answers.id_route;
        if (!route) {
          found.push({
            fieldId: fid,
            code: "ID_ROUTE_REQUIRED",
            message: t("errRequired"),
            fieldLabel: qLabel,
          });
        } else if (route === "partner_refer" && (!answers.partner_org || !answers.partner_consent)) {
          found.push({
            fieldId: getFieldDomId("partner_consent"),
            code: "PARTNER_CONSENT_REQUIRED",
            message: t("errPartnerRequired"),
            fieldLabel: t("widgetPartnerConsent"),
          });
        }
      }
    } else if (isReviewStep) {
      if (!answers.consent_accepted) {
        found.push({
          fieldId: getFieldDomId("consent_accepted"),
          code: "CONSENT_REQUIRED",
          message: t("errRequired"),
          fieldLabel: safeTemplate.consent[lang],
        });
      }
    }

    return found;
  };

  const focusNewQuestionHeading = (nextStepNum: number) => {
    announce(t("widgetStepOf", { current: nextStepNum, total: totalSteps }));
    window.setTimeout(() => {
      questionHeadingRef.current?.focus();
    }, 20);
  };

  const handleNext = async () => {
    const stepErrors = validateCurrentStep();
    if (stepErrors.length > 0) {
      setErrors(stepErrors);
      announce(stepErrors.map((e) => e.message).join(" "));
      window.setTimeout(() => {
        errorSummaryRef.current?.focus();
      }, 20);
      return;
    }

    if (currentQuestion) {
      onEvent?.({
        name: "step.completed",
        timestamp: new Date().toLocaleTimeString(),
        payload: {
          questionId: currentQuestion.id,
          maps_to: currentQuestion.maps_to,
          mode: answerMode,
        },
      });
    }

    if (returnToReviewAfterEdit && !singleQuestionMode) {
      setReturnToReviewAfterEdit(false);
      setStepIndex(visibleQuestions.length);
      focusNewQuestionHeading(visibleQuestions.length + 1);
      return;
    }

    if (stepIndex < totalSteps - 1) {
      const nextIdx = stepIndex + 1;
      setStepIndex(nextIdx);
      focusNewQuestionHeading(nextIdx + 1);
    } else {
      await handleComplete();
    }
  };

  const handleSkipQuestion = async () => {
    if (!currentQuestion || currentQuestion.required) return;
    setErrors([]);
    if (stepIndex < totalSteps - 1) {
      const nextIdx = stepIndex + 1;
      setStepIndex(nextIdx);
      focusNewQuestionHeading(nextIdx + 1);
    } else {
      await handleComplete();
    }
  };

  const handleComplete = async () => {
    const { profile, supportShared } = buildCompletedProfile({
      answers,
      template: safeTemplate,
    });
    let isActuallyOffline = offline || (typeof navigator !== "undefined" && !navigator.onLine);
    let token = "";
    if (singleQuestionMode || ephemeralPreview) {
      token = "mzg_tok_preview";
    } else if (!isActuallyOffline) {
      try {
        token = siteKey
          ? await createRegistration(siteKey, profile)
          : `mzg_tok_${Math.random().toString(16).slice(2, 10)}`;
      } catch {
        isActuallyOffline = true;
      }
    }

    if (!singleQuestionMode && !ephemeralPreview && persistProfile) {
      saveCompletedLearnerProfile({
        profile,
        rawAnswers: answers,
        supportNeeds: Array.isArray(answers.support_needs) ? answers.support_needs : [],
        sharing: {
          platform: Boolean(answers.support_share_platform),
          employers: Boolean(answers.support_share_employers),
          partner: Boolean(answers.support_share_partner),
        },
      });
    }

    let queuedOutboxId: string | undefined;
    if (isActuallyOffline && !ephemeralPreview) {
      queuedOutboxId = `outbox_${Date.now()}`;
      await addOutboxItem({
        id: queuedOutboxId,
        createdAt: new Date().toISOString(),
        profile,
        supportShared,
        ...(siteKey ? { siteKey } : {}),
      });
      onOutboxUpdated?.();
    }

    if (!ephemeralPreview) {
      safeRemoveStorage(storageKey);
    }

    const payload = {
      token,
      profile,
      supportShared,
      queuedOffline: isActuallyOffline,
      ...(queuedOutboxId ? { outboxId: queuedOutboxId } : {}),
    };
    onEvent?.({
      name: "registration.completed",
      timestamp: new Date().toLocaleTimeString(),
      payload: {
        token,
        id_route: profile.id_route ?? null,
        support_shared: supportShared,
        queued_offline: isActuallyOffline,
      },
    });
    setCompletedState({
      token: payload.token,
      profile: payload.profile,
      supportShared: payload.supportShared,
      queuedOffline: payload.queuedOffline,
      ...(payload.outboxId ? { outboxId: payload.outboxId } : {}),
    });
    announce(isActuallyOffline ? t("widgetOfflineQueuedTitle") : t("widgetSuccessTitle"));
    onComplete?.(payload);
  };

  const getPrewrittenHelpForCode = (code: string): string => {
    if (currentQuestion?.errorHelp?.[lang]?.trim()) {
      return currentQuestion.errorHelp[lang];
    }
    const map: Record<string, TranslationKeys> = {
      REQUIRED: "helpErrREQUIRED",
      PHONE_INVALID: "helpErrPHONE_INVALID",
      DATE_INVALID: "helpErrDATE_INVALID",
      ID_ROUTE_REQUIRED: "helpErrID_ROUTE_REQUIRED",
      PARTNER_CONSENT_REQUIRED: "helpErrPARTNER_CONSENT_REQUIRED",
      CONSENT_REQUIRED: "helpErrCONSENT_REQUIRED",
      EMAIL_INVALID: "helpErrEMAIL_INVALID",
      NUMBER_INVALID: "helpErrNUMBER_INVALID",
      MIN_LENGTH: "helpErrMIN_LENGTH",
      MAX_LENGTH: "helpErrMAX_LENGTH",
      DIGITS_ONLY: "helpErrDIGITS_ONLY",
      LETTERS_ONLY: "helpErrLETTERS_ONLY",
      NUMBER_RANGE: "helpErrNUMBER_RANGE",
    };
    return t(map[code] ?? "helpErrREQUIRED");
  };

  const getPrewrittenHelpForCurrentType = (): string => {
    if (!currentQuestion) return t("helpTypeReview");
    if (currentQuestion.errorHelp?.[lang]?.trim()) {
      return currentQuestion.errorHelp[lang];
    }
    const map: Record<string, TranslationKeys> = {
      text: "helpTypeText",
      phone: "helpTypePhone",
      date: "helpTypeDate",
      choice: "helpTypeChoice",
      multichoice: "helpTypeMultichoice",
      "id-routes": "helpTypeIdRoutes",
      support: "helpTypeSupport",
      "work-story": "helpTypeWorkStory",
      "yes-no": "helpTypeYesNo",
      email: "helpTypeEmail",
      number: "helpTypeNumber",
      info: "helpTypeInfo",
      consent: "helpTypeConsent",
    };
    return t(map[currentQuestion.type] ?? "helpTypeText");
  };

  const getDefaultTargetField = (): { id: string; label: string } => {
    if (errors[0]) return { id: errors[0].fieldId, label: errors[0].fieldLabel };
    if (!currentQuestion) {
      return { id: getFieldDomId("consent_accepted"), label: safeTemplate.consent[lang] };
    }
    if (currentQuestion.type === "date") {
      return {
        id: getFieldDomId(answers.dob_calendar === "greg" ? "dob_greg_year" : "dob_eth_year"),
        label: t("widgetCalYear"),
      };
    }
    return { id: getFieldDomId(currentQuestion.id), label: currentQuestion.label[lang] };
  };

  const handleSmartHelpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSmartHelp) return;

    const target = getDefaultTargetField();
    const screenSummary = buildHelpScreenSummary({
      stepNumber: stepIndex + 1,
      currentQuestion,
      lang,
      errors: errors.map((err) => ({ fieldId: err.fieldId, code: err.code, message: err.message })),
      buttonNames: [t("widgetBack"), isReviewStep ? t("widgetConfirm") : t("widgetSaveContinue")],
      reviewTitle: t("widgetReviewTitle"),
    });

    onAiPayloadLogged?.(screenSummary);
    setHelpLoading(true);

    const fallbackText = errors[0]
      ? getPrewrittenHelpForCode(errors[0].code)
      : getPrewrittenHelpForCurrentType();

    const res = await getSmartHelp({
      screenSummary,
      userProblem: helpProblem.trim() || t("widgetHelpDefaultQuestion"),
      lang,
      fallbackExplanation: fallbackText,
      fallbackTargetFieldId: target.id,
    });

    setHelpLoading(false);
    setHelpAiAnswer({
      explanation: res.explanation,
      targetFieldId: res.targetFieldId,
      targetFieldLabel: target.label,
    });
    announce(res.explanation);
  };

  const handleSimplifyQuestion = async () => {
    if (!currentQuestion) return;
    if (!canSimplifyAi) {
      setSimplifiedInfo({
        usedAi: false,
        text: currentQuestion.hint?.[lang] ?? currentQuestion.label[lang],
      });
      return;
    }
    setSimplifying(true);
    const res = await simplifyQuestionLabel({
      label: currentQuestion.label[lang],
      lang,
      fallbackHint: currentQuestion.hint?.[lang] ?? currentQuestion.label[lang],
    });
    setSimplifying(false);
    setSimplifiedInfo(res);
  };

  const handleExtractSkills = async () => {
    const story = String(answers.work_story ?? "").trim();
    if (!story) return;
    setExtractingSkills(true);
    setShowSkillsFallback(false);

    const res = await extractSkillsFromStory({ story, lang });
    setExtractingSkills(false);
    if (!res.usedAi || res.skills.length === 0) {
      setShowSkillsFallback(true);
      setPendingSuggestedSkills([]);
    } else {
      setPendingSuggestedSkills(res.skills);
    }
  };

  const handleRestart = () => {
    if (!ephemeralPreview) {
      safeRemoveStorage(storageKey);
    }
    pendingResumeIndexRef.current = null;
    setCompletedState(null);
    setStepIndex(0);
    setStage(useIntroScreens ? "welcome" : "questions");
    setResumePromptStep(null);
    setOutboxBannerState("idle");
    setDeviceClearedNotice(false);
    setPendingSuggestedSkills([]);
    setShowSkillsFallback(false);
    setSmsGeneratedLink(null);
    setAnswers(createEmptyAnswers(lang, safeTemplate.partnerDefault));
    onReset?.();
  };

  const handleSendSmsLink = (e: React.FormEvent) => {
    e.preventDefault();
    const candidatePhone = smsPhone.trim() || String(answers.phone ?? "");
    if (!validatePhone(candidatePhone)) {
      setSmsPhoneError(t("errPhoneFormat"));
      return;
    }
    setSmsPhoneError("");
    const resumeId = Math.random().toString(36).slice(2, 10);
    const sanitized = stripSupportFromAnswers({
      ...answers,
      phone: normalizePhoneDigits(candidatePhone),
    });
    if (!ephemeralPreview) {
      const vis = safeTemplate.questions.filter((q) =>
        isQuestionVisible(q, answers, safeTemplate.questions)
      );
      const snap = buildProgressSnapshot(stepIndex, vis, sanitized);
      safeSetStorage(`mezgeb_resume_${resumeId}`, JSON.stringify(snap));
    }
    setSmsGeneratedLink(resumeLinkFor(resumeId));
  };

  const handleOpenSavedLink = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = resumeLinkValue.trim();
    const match = raw.match(/resume=([a-zA-Z0-9_-]+)/);
    const id = match ? match[1] : raw;
    if (!id) {
      setResumeError(t("errRequired"));
      return;
    }
    const stored = safeGetStorage(`mezgeb_resume_${id}`).value;
    const parsed = stored ? parseSavedProgress(stored) : null;
    if (parsed) {
      applySavedProgress(parsed);
      setResumeError("");
      setResumeLinkInputOpen(false);
      return;
    }
    setResumeError("");
    setResumeLinkInputOpen(false);
    setStage("questions");
  };

  const rootClasses = `mezgeb-surface rounded-[16px] border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] text-[1.125rem] leading-[1.6] ${
    highContrast ? "mezgeb-hc" : ""
  }`;
  const rootStyle = {
    "--widget-accent": highContrast ? "#000000" : effectiveAccent,
  } as React.CSSProperties;

  if (!validation.valid && safeTemplate.questions.length === 0) {
    return (
      <div className={rootClasses} style={rootStyle}>
        <div className="p-6">
          <Banner variant="error" role="alert">
            <p className="font-semibold">{t("templatesValidationErrorsTitle")}</p>
            <ul className="list-disc pl-5 mt-1 text-sm">
              {validation.errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </Banner>
        </div>
      </div>
    );
  }

  // ============================================================================
  // DONE SCREEN
  // ============================================================================
  if (completedState) {
    const learnerName = String(completedState.profile.name ?? "");
    return (
      <div className={rootClasses} style={rootStyle}>
        <div className="p-5 sm:p-6 space-y-5 text-left">
          <Banner variant="success">
            <div className="space-y-1">
              <p className="font-semibold text-base">
                {completedState.queuedOffline
                  ? t("widgetOfflineQueuedTitle")
                  : t("widgetSuccessTitle")}
              </p>
              {learnerName && (
                <p className="text-sm font-medium text-[var(--ink)]">{learnerName}</p>
              )}
            </div>
          </Banner>

          <p className="text-base text-[var(--ink)] leading-relaxed">{t("widgetSuccessBody")}</p>

          {!completedState.queuedOffline && (
            <div className="p-4 rounded-[10px] bg-[var(--stone)] border border-[var(--line)] text-sm space-y-1">
              <p className="text-[var(--muted)]">{t("widgetSuccessTokenNote")}</p>
              <code
                className="text-[var(--ink)] font-medium block break-all"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {completedState.token}
              </code>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {effectiveSettings.smsResume && (
              <Button
                variant="secondary"
                size="lg"
                onClick={() => {
                  setSmsPhone(String(answers.phone ?? ""));
                  setSmsOpen((v) => !v);
                }}
              >
                {t("widgetDoneGetLink")}
              </Button>
            )}
            <Button variant="primary" size="lg" onClick={handleRestart}>
              {t("widgetSuccessRestart")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // STAGE 1: WELCOME SCREEN
  // ============================================================================
  if (stage === "welcome") {
    return (
      <div className={rootClasses} style={rootStyle}>
        <div className="p-5 sm:p-6 space-y-6 text-left">
          <div className="space-y-2">
            <p className="text-sm font-medium text-[var(--muted)]">{effectivePlatformName}</p>
            <h2
              ref={questionHeadingRef}
              tabIndex={-1}
              className="text-[1.5rem] font-semibold text-[var(--ink)] outline-none"
            >
              {t("widgetWelcomeTitle")}
            </h2>
            <ul className="space-y-2 text-base text-[var(--ink-2)] pt-1">
              <li>{t("widgetWelcomeLine1")}</li>
              <li>{t("widgetWelcomeLine2")}</li>
              <li>{t("widgetWelcomeLine3")}</li>
            </ul>
          </div>

          <ChoiceList
            name={`${widgetId}-welcome-lang`}
            legend={t("widgetWelcomeLangHeading")}
            hideLegend={false}
            mode="single"
            value={lang}
            onChange={(val) => {
              const nextLang = val === "am" ? "am" : "en";
              setLang(nextLang);
              updateAnswer("language", nextLang);
            }}
            options={[
              { value: "am", title: "አማርኛ", lang: "am" },
              { value: "en", title: "English", lang: "en" },
            ]}
          />

          <div className="space-y-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => {
                setStage("mode");
                window.setTimeout(() => questionHeadingRef.current?.focus(), 20);
              }}
            >
              {t("widgetWelcomeStart")}
            </Button>

            <Button
              variant="quiet"
              size="md"
              onClick={() => setResumeLinkInputOpen((v) => !v)}
            >
              {t("widgetWelcomeHaveLink")}
            </Button>
          </div>

          {resumeLinkInputOpen && (
            <form
              onSubmit={handleOpenSavedLink}
              className="p-4 rounded-[10px] border border-[var(--line)] bg-[var(--stone)] space-y-3"
            >
              <Field
                label={t("widgetWelcomeResumePrompt")}
                error={resumeError}
                inputProps={{
                  type: "text",
                  value: resumeLinkValue,
                  onChange: (e) => setResumeLinkValue(e.target.value),
                }}
              />
              <Button type="submit" variant="secondary" size="md">
                {t("widgetWelcomeResumeOpen")}
              </Button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // ============================================================================
  // STAGE 2: ANSWER MODE SELECTOR
  // ============================================================================
  if (stage === "mode") {
    return (
      <div className={rootClasses} style={rootStyle}>
        <div className="p-5 sm:p-6 space-y-6 text-left">
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-[var(--muted)]">{effectivePlatformName}</p>
            <h2
              ref={questionHeadingRef}
              tabIndex={-1}
              className="text-[1.5rem] font-semibold text-[var(--ink)] outline-none"
            >
              {t("widgetModeHeading")}
            </h2>
            <p className="text-sm text-[var(--muted)]">{t("widgetModeHint")}</p>
          </div>

          <ChoiceList
            name={`${widgetId}-answer-mode`}
            legend={t("widgetModeHeading")}
            mode="single"
            value={answerMode}
            onChange={(val) => setAnswerMode(val as AnswerMode)}
            options={[
              {
                value: "speak",
                title: t("widgetModeSpeakTitle"),
                description: t("widgetModeSpeakDesc"),
                icon: <Mic size={24} strokeWidth={1.75} />,
              },
              {
                value: "type",
                title: t("widgetModeTypeTitle"),
                description: t("widgetModeTypeDesc"),
                icon: <Type size={24} strokeWidth={1.75} />,
              },
              {
                value: "simple",
                title: t("widgetModeSimpleTitle"),
                description: t("widgetModeSimpleDesc"),
                icon: <Users size={24} strokeWidth={1.75} />,
              },
            ]}
          />

          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-[var(--line)]">
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onClick={() => setStage("welcome")}
            >
              {t("widgetBack")}
            </Button>
            <div className="col-span-2">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => {
                  setStage("questions");
                  focusNewQuestionHeading(stepIndex + 1);
                }}
              >
                {t("widgetSaveContinue")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // STAGE 3: QUESTION / REVIEW SCREENS
  // ============================================================================
  const currentErrorMap = new Map(errors.map((e) => [e.fieldId, e.message]));

  const ethBounds = getAllowedYearBounds("eth");
  const gregBounds = getAllowedYearBounds("greg");
  const ethYearOptions = Array.from(
    { length: ethBounds.max - ethBounds.min + 1 },
    (_, i) => ethBounds.max - i
  );
  const gregYearOptions = Array.from(
    { length: gregBounds.max - gregBounds.min + 1 },
    (_, i) => gregBounds.max - i
  );

  const ethDayNum = Number(String(answers.dob_eth_day ?? "").trim());
  const ethMonthNum = Number(String(answers.dob_eth_month ?? "").trim());
  const ethYearNum = Number(String(answers.dob_eth_year ?? "").trim());
  const maxEthDays =
    ethYearNum && ethMonthNum ? daysInEthiopianMonth(ethYearNum, ethMonthNum) : 30;
  const gregConverted =
    ethYearNum > 0 && ethMonthNum > 0 && ethDayNum > 0 && isValidEthiopianDate(ethYearNum, ethMonthNum, ethDayNum)
      ? ethiopianToGregorian({ year: ethYearNum, month: ethMonthNum, day: ethDayNum })
      : null;

  const gregDayNum = Number(String(answers.dob_greg_day ?? "").trim());
  const gregMonthNum = Number(String(answers.dob_greg_month ?? "").trim());
  const gregYearNum = Number(String(answers.dob_greg_year ?? "").trim());
  const maxGregDays =
    gregYearNum && gregMonthNum ? daysInGregorianMonth(gregYearNum, gregMonthNum) : 31;
  const ethConverted =
    gregYearNum > 0 && gregMonthNum > 0 && gregDayNum > 0 && isValidGregorianDate(gregYearNum, gregMonthNum, gregDayNum)
      ? gregorianToEthiopian({ year: gregYearNum, month: gregMonthNum, day: gregDayNum })
      : null;

  const isSimpleMode = answerMode === "simple";
  const primaryLabel = currentQuestion
    ? isSimpleMode
      ? currentQuestion.hint?.[lang] || currentQuestion.label[lang]
      : currentQuestion.label[lang]
    : t("widgetReviewTitle");

  const prewrittenHelp = errors[0]
    ? getPrewrittenHelpForCode(errors[0].code)
    : getPrewrittenHelpForCurrentType();
  const helpTarget = getDefaultTargetField();

  const exampleAnswer =
    currentQuestion?.type === "phone"
      ? "091 234 5678"
      : currentQuestion?.type === "date"
        ? lang === "am"
          ? "12 መስከረም 1990"
          : "22 September 1997"
        : lang === "am"
          ? "ሐና ተስፋዬ"
          : "Hana Tesfaye";

  const renderVoiceControlForQuestion = (q: TemplateQuestion, isMulti?: boolean) => {
    if (!canVoice || q.allowVoice === false || readOnly) return null;
    const opts = q.options?.map((o) => ({ value: o.value, label: o.label[lang] }));
    const isThisTranscript = pendingTranscript && pendingTranscript.fieldKey === q.id;

    return (
      <div className="space-y-2">
        <VoiceButton
          widgetSize
          state={isThisTranscript ? "review" : voiceUiState}
          seconds={recordSeconds}
          transcript={pendingTranscript?.value ?? ""}
          onTranscriptChange={(val) =>
            pendingTranscript && setPendingTranscript({ ...pendingTranscript, value: val })
          }
          onStart={() =>
            startVoiceRecording(q.id, q.label[lang], q.type, opts, isMulti)
          }
          onStop={stopVoiceRecording}
          onKeep={() => {
            if (pendingTranscript) {
              updateAnswer(q.id, pendingTranscript.value);
              setPendingTranscript(null);
              setVoiceUiState("idle");
            }
          }}
          onRetry={() => {
            setPendingTranscript(null);
            setVoiceUiState("idle");
            startVoiceRecording(q.id, q.label[lang], q.type, opts, isMulti);
          }}
          labels={{
            speakLabel: t("widgetSpeakAnswerLabel"),
            listeningLabel: t("widgetVoiceListeningLabel"),
            processingLabel: t("widgetVoiceProcessingLabel"),
            keepLabel: t("widgetVoiceKeepBtn"),
            tryAgainLabel: t("widgetVoiceTryAgainBtn"),
            failedMessage: t("widgetVoiceFailedMsg"),
            transcriptLabel: t("widgetTranscriptConfirmTitle"),
          }}
        />

        {pendingChoiceMatch && pendingChoiceMatch.fieldKey === q.id && (
          <div className="p-3.5 rounded-[10px] border-2 border-[var(--accent)] bg-[var(--lilac)] flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-[var(--ink)]">
              {t("widgetVoiceChoiceConfirm", { option: pendingChoiceMatch.matchedLabel })}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  if (pendingChoiceMatch.isMulti) {
                    const prev = Array.isArray(answers[q.id]) ? (answers[q.id] as string[]) : [];
                    if (!prev.includes(pendingChoiceMatch.matchedValue)) {
                      updateAnswer(q.id, [...prev, pendingChoiceMatch.matchedValue]);
                    }
                  } else {
                    updateAnswer(q.id, pendingChoiceMatch.matchedValue);
                    if (
                      q.id === "language" &&
                      (pendingChoiceMatch.matchedValue === "am" ||
                        pendingChoiceMatch.matchedValue === "en")
                    ) {
                      setLang(pendingChoiceMatch.matchedValue);
                    }
                  }
                  setPendingChoiceMatch(null);
                }}
              >
                {t("widgetVoiceKeepBtn")}
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => setPendingChoiceMatch(null)}
              >
                {t("widgetVoiceTryAgainBtn")}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div ref={rootRef} className={rootClasses} style={rootStyle}>
      <div className="p-5 sm:p-6 space-y-5 text-left">
        {/* Assisted partner mode banner */}
        {assistedMode && (
          <Banner variant="info">
            {t("widgetAssistedBanner", { name: assistedLearnerName })}
          </Banner>
        )}

        {/* Offline / Outbox / Restored banners */}
        {offline && (
          <Banner variant="warning">
            <div className="flex flex-wrap items-center gap-2">
              <span>{t("widgetOfflineBanner")}</span>
              {outboxCount > 0 && (
                <Badge variant="warning">
                  {t("outboxPendingCount", { count: outboxCount })}
                </Badge>
              )}
            </div>
          </Banner>
        )}

        {outboxBannerState === "sending" && (
          <Banner variant="info">
            {t("widgetOutboxSendingBanner", { count: Math.max(1, outboxCount || 3) })}
          </Banner>
        )}

        {partnerJoinedLive && (
          <Banner variant="success">{t("widgetPartnerJoinedBanner")}</Banner>
        )}

        {storageBlocked && !offline && (
          <p role="status" className="text-xs text-[var(--muted)]">
            {t("demoStorageBlockedNote")}
          </p>
        )}

        {resumePromptStep !== null && !readOnly && !singleQuestionMode && (
          <Banner
            variant="info"
            action={
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="md" onClick={handleResumeContinue}>
                  {t("widgetResumeBtn", { step: resumePromptStep })}
                </Button>
                <Button variant="quiet" size="md" onClick={handleRestart}>
                  {t("widgetStartFreshBtn")}
                </Button>
              </div>
            }
          >
            {t("widgetSessionRestored", { step: resumePromptStep })}
          </Banner>
        )}

        {hiddenRuleNotice && (
          <Banner variant="info">{t("widgetHiddenByRule")}</Banner>
        )}

        {/* Top bar: platform + Answer Mode switcher + Progress */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-medium text-[var(--ink)]">{effectivePlatformName}</span>

            {!singleQuestionMode && (
              <div className="flex items-center gap-2">
                <label htmlFor={`${widgetId}-mode-select`} className="sr-only">
                  {t("widgetModeSwitchLabel")}
                </label>
                <select
                  id={`${widgetId}-mode-select`}
                  value={answerMode}
                  onChange={(e) => setAnswerMode(e.target.value as AnswerMode)}
                  className="min-h-[36px] px-2.5 rounded-[6px] border border-[var(--line-strong)] bg-[var(--paper)] text-xs font-medium text-[var(--ink)]"
                >
                  <option value="speak">{t("widgetModeSpeakTitle")}</option>
                  <option value="type">{t("widgetModeTypeTitle")}</option>
                  <option value="simple">{t("widgetModeSimpleTitle")}</option>
                </select>
              </div>
            )}
          </div>

          {builderCanvas ? (
            <Progress
              current={builderCanvas.questionPosition}
              total={builderCanvas.questionTotal}
              label={builderCanvas.labels.progressLabel}
            />
          ) : (
            !singleQuestionMode && (
              <Progress
                current={stepIndex + 1}
                total={totalSteps}
                label={t("widgetStepOf", { current: stepIndex + 1, total: totalSteps })}
              />
            )
          )}
        </div>

        {noAmharicVoiceNote && (
          <div className="p-3 rounded-[10px] border border-[var(--line)] bg-[var(--stone)] flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--muted)]">
            <span>{t("widgetNoAmharicVoice")}</span>
            <Button type="button" variant="secondary" size="md" onClick={handleReadEnglishFallback}>
              {t("widgetReadEnglishBtn")}
            </Button>
          </div>
        )}

        {/* Error Summary */}
        {errors.length > 0 && (
          <div
            ref={errorSummaryRef}
            tabIndex={-1}
            role="alert"
            className="p-4 rounded-[10px] border-2 border-[var(--error)] bg-[var(--error-bg)] text-[var(--error)] space-y-2 outline-none"
          >
            <p className="text-sm font-semibold">{t("widgetErrorSummaryTitle")}</p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              {errors.map((err, i) => (
                <li key={i}>
                  <a
                    href={`#${err.fieldId}`}
                    onClick={(e) => {
                      e.preventDefault();
                      byId(err.fieldId)?.focus();
                    }}
                    className="underline font-medium text-[var(--error)]"
                  >
                    {err.message}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Question Heading + Read Aloud + Help (consistent placement on every screen) */}
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            {currentQuestion && isSimpleMode && (
              <div
                className="w-20 h-20 rounded-[10px] border border-[var(--line)] bg-[var(--stone)] flex items-center justify-center shrink-0 text-[var(--ink)]"
                aria-hidden="true"
              >
                <QuestionIcon name={currentQuestion.icon} size={64} />
              </div>
            )}

            <div className="space-y-2 flex-1 min-w-0">
              {builderCanvas && currentQuestion ? (
                <>
                  {/* Question text inline editor */}
                  <div className="space-y-1">
                    {lang === "am" &&
                      !currentQuestion.label.am.trim() &&
                      currentQuestion.label.en.trim() && (
                        <p className="text-xs text-[var(--muted)]">
                          {builderCanvas.labels.englishReference(currentQuestion.label.en)}
                        </p>
                      )}
                    <div className="flex items-start gap-1.5">
                      <div className="flex-1 min-w-0">
                        {editingCanvasField === "label" ? (
                          <textarea
                            ref={canvasLabelInputRef}
                            rows={2}
                            aria-label={builderCanvas.labels.editQuestionLabelAria}
                            value={currentQuestion.label[lang] ?? ""}
                            onChange={(e) => builderCanvas.onUpdateLabel(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                setEditingCanvasField(null);
                                window.setTimeout(() => canvasLabelBtnRef.current?.focus(), 0);
                              } else if (e.key === "Escape") {
                                e.preventDefault();
                                builderCanvas.onUpdateLabel(canvasDraftValue);
                                setEditingCanvasField(null);
                                window.setTimeout(() => canvasLabelBtnRef.current?.focus(), 0);
                              }
                            }}
                            onBlur={() => setEditingCanvasField(null)}
                            className="w-full rounded-[6px] px-1.5 py-1 -mx-1.5 bg-[var(--paper)] text-[1.375rem] sm:text-[1.75rem] font-semibold text-[var(--ink)] leading-[1.2] outline-2 outline-[var(--accent)] border-0 resize-none"
                          />
                        ) : (
                          <button
                            ref={canvasLabelBtnRef}
                            type="button"
                            aria-label={builderCanvas.labels.editQuestionLabelAria}
                            onClick={() => {
                              setCanvasDraftValue(currentQuestion.label[lang] ?? "");
                              setEditingCanvasField("label");
                              window.setTimeout(() => canvasLabelInputRef.current?.focus(), 0);
                            }}
                            className="w-full text-left rounded-[6px] px-1.5 py-0.5 -mx-1.5 border border-transparent hover:border-dashed hover:border-[var(--line-strong)] cursor-text text-[1.375rem] sm:text-[1.75rem] font-semibold text-[var(--ink)] leading-[1.2]"
                          >
                            {currentQuestion.label[lang]?.trim() ? (
                              currentQuestion.label[lang]
                            ) : (
                              <span className="text-[var(--muted)] font-normal">
                                {currentQuestion.label.en || builderCanvas.labels.editQuestionLabelAria}
                              </span>
                            )}
                          </button>
                        )}
                      </div>
                      {builderCanvas.renderLabelActions && (
                        <div className="shrink-0 pt-0.5">{builderCanvas.renderLabelActions}</div>
                      )}
                    </div>

                    {editingCanvasField === "label" &&
                      (currentQuestion.label[lang]?.length ?? 0) > 60 && (
                        <p role="status" className="text-xs text-[var(--warn)]">
                          {builderCanvas.labels.charsWarning(currentQuestion.label[lang].length)}
                        </p>
                      )}
                    {builderCanvas.renderAfterLabel}
                  </div>

                  {/* Hint inline editor */}
                  {!isSimpleMode && (
                    <div className="space-y-1">
                      {lang === "am" &&
                        !currentQuestion.hint?.am?.trim() &&
                        currentQuestion.hint?.en?.trim() && (
                          <p className="text-xs text-[var(--muted)]">
                            {builderCanvas.labels.englishReference(currentQuestion.hint.en)}
                          </p>
                        )}
                      <div className="flex items-start gap-1.5">
                        <div className="flex-1 min-w-0">
                          {editingCanvasField === "hint" ? (
                            <textarea
                              ref={canvasHintInputRef}
                              rows={2}
                              aria-label={builderCanvas.labels.editHintAria}
                              value={currentQuestion.hint?.[lang] ?? ""}
                              onChange={(e) => builderCanvas.onUpdateHint(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  setEditingCanvasField(null);
                                  window.setTimeout(() => canvasHintBtnRef.current?.focus(), 0);
                                } else if (e.key === "Escape") {
                                  e.preventDefault();
                                  builderCanvas.onUpdateHint(canvasDraftValue);
                                  setEditingCanvasField(null);
                                  window.setTimeout(() => canvasHintBtnRef.current?.focus(), 0);
                                }
                              }}
                              onBlur={() => setEditingCanvasField(null)}
                              className="w-full rounded-[6px] px-1.5 py-1 -mx-1.5 bg-[var(--paper)] text-sm text-[var(--ink)] leading-relaxed outline-2 outline-[var(--accent)] border-0 resize-none"
                            />
                          ) : (
                            <button
                              ref={canvasHintBtnRef}
                              type="button"
                              aria-label={
                                currentQuestion.hint?.[lang]?.trim()
                                  ? builderCanvas.labels.editHintAria
                                  : builderCanvas.labels.addHintBtn
                              }
                              onClick={() => {
                                setCanvasDraftValue(currentQuestion.hint?.[lang] ?? "");
                                setEditingCanvasField("hint");
                                window.setTimeout(() => canvasHintInputRef.current?.focus(), 0);
                              }}
                              className="w-full text-left rounded-[6px] px-1.5 py-0.5 -mx-1.5 border border-transparent hover:border-dashed hover:border-[var(--line-strong)] cursor-text text-sm text-[var(--muted)] leading-relaxed"
                            >
                              {currentQuestion.hint?.[lang]?.trim()
                                ? currentQuestion.hint[lang]
                                : builderCanvas.labels.addHintBtn}
                            </button>
                          )}
                        </div>
                        {builderCanvas.renderHintActions && (
                          <div className="shrink-0">{builderCanvas.renderHintActions}</div>
                        )}
                      </div>
                      {builderCanvas.renderAfterHint}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <h2
                    ref={questionHeadingRef}
                    tabIndex={-1}
                    className="text-[1.375rem] sm:text-[1.75rem] font-semibold text-[var(--ink)] leading-[1.2] outline-none"
                  >
                    {primaryLabel}
                  </h2>
                  {currentQuestion?.hint?.[lang] && !isSimpleMode && (
                    <p className="text-sm text-[var(--muted)] leading-relaxed">
                      {currentQuestion.hint[lang]}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {effectiveSettings.readAloud && (
              <ReadAloudButton
                widgetSize
                text={primaryLabel}
                lang={lang}
                audioUrl={currentQuestion?.audio?.[lang]}
                recordedUrl={recordedUrlForCurrent}
                serverReadAloud={serverReadAloudForLang}
                speaking={speaking}
                label={builderCanvas ? builderCanvas.labels.readAloudLabel : t("widgetReadAloud")}
                stopLabel={t("widgetStopReading")}
                onToggle={() =>
                  speakText(
                    `${primaryLabel}. ${currentQuestion?.hint?.[lang] ?? ""}`,
                    lang,
                    currentQuestion?.audio?.[lang]
                  )
                }
              />
            )}

            <button
              ref={helpBtnRef}
              type="button"
              onClick={() => setHelpOpen((prev) => !prev)}
              aria-expanded={helpOpen}
              className="mezgeb-transition inline-flex items-center gap-2 min-h-[44px] px-3.5 rounded-[10px] border border-[var(--line-strong)] bg-[var(--paper)] text-sm font-medium text-[var(--ink)] hover:bg-[var(--stone)] cursor-pointer"
            >
              <HelpCircle size={20} strokeWidth={1.75} aria-hidden="true" />
              <span>{builderCanvas ? builderCanvas.labels.helpLabel : t("widgetHelpBtn")}</span>
            </button>

            {isSimpleMode && effectiveSettings.readAloud && canReadCurrent && (
              <label className="inline-flex items-center gap-2 text-xs text-[var(--muted)] cursor-pointer ml-auto">
                <input
                  type="checkbox"
                  checked={autoReadSimple}
                  onChange={(e) => setAutoReadSimple(e.target.checked)}
                  className="w-4 h-4 accent-[var(--accent)]"
                />
                <span>{t("widgetModeAutoReadLabel")}</span>
              </label>
            )}

            {!readOnly &&
              effectiveSettings.sayItSimply &&
              currentQuestion &&
              currentQuestion.type !== "info" &&
              !isSimpleMode && (
                <Button
                  variant="quiet"
                  size="md"
                  loading={simplifying}
                  loadingLabel={t("widgetSimplifying")}
                  onClick={handleSimplifyQuestion}
                >
                  {t("widgetSimplifyBtn")}
                </Button>
              )}
          </div>

          {simplifiedInfo && (
            <Banner variant="info">
              <p className="font-medium text-[var(--ink)]">{simplifiedInfo.text}</p>
            </Banner>
          )}
        </div>

        {/* Help Panel: bottom sheet on phone, inline panel on desktop */}
        {helpOpen && (
          <div
            role="region"
            aria-label={t("widgetHelpTitle")}
            style={{ boxShadow: "var(--shadow-float)" }}
            className="fixed inset-x-0 bottom-0 z-50 md:static rounded-t-[16px] md:rounded-[10px] border border-[var(--line-strong)] bg-[var(--sand)] p-5 space-y-4 text-left max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between gap-3">
              <h3
                ref={helpHeadingRef}
                tabIndex={-1}
                className="text-base font-semibold text-[var(--ink)] outline-none"
              >
                {t("widgetHelpTitle")}
              </h3>
              <Button
                variant="secondary"
                size="md"
                onClick={() => {
                  setHelpOpen(false);
                  (textInputRef.current ?? helpBtnRef.current)?.focus();
                }}
              >
                <X size={16} strokeWidth={1.75} aria-hidden="true" />
                <span>{t("widgetHelpCloseBtn")}</span>
              </Button>
            </div>

            <div className="p-4 rounded-[10px] border border-[var(--line)] bg-[var(--paper)] space-y-2.5 text-sm">
              <p className="text-[var(--ink)] leading-relaxed">{prewrittenHelp}</p>
              <p className="text-xs text-[var(--muted)]">
                <strong className="text-[var(--ink)]">{t("widgetHelpExampleLabel")}:</strong>{" "}
                {exampleAnswer}
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <ReadAloudButton
                  text={prewrittenHelp}
                  lang={lang}
                  recordedUrl={getRecordedAudioUrlFromManifest(audioManifest, prewrittenHelp, lang)}
                  serverReadAloud={serverReadAloudForLang}
                  speaking={speaking}
                  label={t("widgetReadAloud")}
                  stopLabel={t("widgetStopReading")}
                  onToggle={() => speakText(prewrittenHelp, lang)}
                />
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setPartnerHelpVisible((v) => !v)}
                >
                  {t("widgetHelpAskPerson")}
                </Button>
              </div>
              {partnerHelpVisible && (
                <Banner variant="success">{t("widgetHelpPartnerMessage")}</Banner>
              )}
            </div>

            {canSmartHelp && (
              <form onSubmit={handleSmartHelpSubmit} className="space-y-3">
                <Field
                  label={t("widgetHelpAskFieldLabel")}
                  hint={t("cloudAiNotice")}
                  inputProps={{
                    type: "text",
                    value: helpProblem,
                    onChange: (e) => setHelpProblem(e.target.value),
                    placeholder: t("widgetHelpPlaceholder"),
                  }}
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={helpLoading}
                  loadingLabel={t("loadingText")}
                >
                  {t("widgetHelpAskBtn")}
                </Button>
                {helpAiAnswer && (
                  <div className="p-3.5 rounded-[10px] border border-[var(--line)] bg-[var(--paper)] space-y-2 text-sm">
                    <p className="text-[var(--ink)] leading-relaxed">{helpAiAnswer.explanation}</p>
                    {helpAiAnswer.targetFieldId && (
                      <Button
                        variant="secondary"
                        size="md"
                        onClick={() => {
                          const el = byId(helpAiAnswer.targetFieldId!);
                          if (el) {
                            el.focus();
                            announce(
                              t("widgetHelpMovedAnnouncement", {
                                label: helpAiAnswer.targetFieldLabel,
                              })
                            );
                          }
                        }}
                      >
                        {t("widgetHelpTakeMeThere")}
                      </Button>
                    )}
                  </div>
                )}
              </form>
            )}
          </div>
        )}

        {/* MAIN STEP ANSWER BODY */}
        {currentQuestion ? (
          <div className="space-y-4">
            {/* TEXT / EMAIL / NUMBER / PHONE with VoiceButton at the right */}
            {(currentQuestion.type === "text" ||
              currentQuestion.type === "email" ||
              currentQuestion.type === "number" ||
              currentQuestion.type === "phone") && (
              <Field
                id={getFieldDomId(currentQuestion.id)}
                label={primaryLabel}
                labelLang={lang}
                required={currentQuestion.required}
                hint={
                  canVoice && currentQuestion.allowVoice !== false && !readOnly
                    ? `${t("widgetRecordingLimit")} ${voiceNotice}`
                    : undefined
                }
                error={currentErrorMap.get(getFieldDomId(currentQuestion.id))}
                rightSlot={
                  canVoice && currentQuestion.allowVoice !== false && !readOnly ? (
                    <VoiceButton
                      widgetSize
                      state={
                        pendingTranscript?.fieldKey === currentQuestion.id
                          ? "review"
                          : voiceUiState === "listening" || voiceUiState === "processing"
                            ? voiceUiState
                            : "idle"
                      }
                      seconds={recordSeconds}
                      onStart={() =>
                        startVoiceRecording(
                          currentQuestion.id,
                          currentQuestion.label[lang],
                          currentQuestion.type
                        )
                      }
                      onStop={stopVoiceRecording}
                      labels={{
                        speakLabel: t("widgetSpeakAnswerLabel"),
                        listeningLabel: t("widgetVoiceListeningLabel"),
                        processingLabel: t("widgetVoiceProcessingLabel"),
                      }}
                    />
                  ) : undefined
                }
                inputRef={(el: HTMLInputElement | null) => {
                  textInputRef.current = el;
                }}
                inputProps={{
                  type:
                    currentQuestion.type === "email"
                      ? "email"
                      : currentQuestion.type === "phone"
                        ? "tel"
                        : "text",
                  inputMode:
                    currentQuestion.type === "phone" || currentQuestion.type === "number"
                      ? "numeric"
                      : undefined,
                  disabled: readOnly,
                  value:
                    currentQuestion.type === "phone"
                      ? formatPhoneGrouped(String(answers[currentQuestion.id] ?? ""))
                      : String(answers[currentQuestion.id] ?? ""),
                  onChange: (e) => {
                    const raw = e.target.value;
                    if (currentQuestion.type === "phone") {
                      updateAnswer(currentQuestion.id, normalizePhoneDigits(raw));
                    } else if (currentQuestion.type === "number") {
                      updateAnswer(currentQuestion.id, raw.replace(/[^\d.-]/g, ""));
                    } else {
                      updateAnswer(currentQuestion.id, raw);
                    }
                  },
                }}
              />
            )}

            {/* Inline Voice review/failed box below text/phone/email/number inputs */}
            {(currentQuestion.type === "text" ||
              currentQuestion.type === "email" ||
              currentQuestion.type === "number" ||
              currentQuestion.type === "phone") &&
              (voiceUiState === "review" || voiceUiState === "failed") && (
                <VoiceButton
                  widgetSize
                  state={voiceUiState}
                  transcript={pendingTranscript?.value ?? ""}
                  onTranscriptChange={(val) =>
                    pendingTranscript && setPendingTranscript({ ...pendingTranscript, value: val })
                  }
                  onStart={() =>
                    startVoiceRecording(
                      currentQuestion.id,
                      currentQuestion.label[lang],
                      currentQuestion.type
                    )
                  }
                  onStop={stopVoiceRecording}
                  onKeep={() => {
                    if (pendingTranscript) {
                      updateAnswer(currentQuestion.id, pendingTranscript.value);
                      setPendingTranscript(null);
                      setVoiceUiState("idle");
                    }
                  }}
                  onRetry={() => {
                    setPendingTranscript(null);
                    setVoiceUiState("idle");
                    startVoiceRecording(
                      currentQuestion.id,
                      currentQuestion.label[lang],
                      currentQuestion.type
                    );
                  }}
                  labels={{
                    keepLabel: t("widgetVoiceKeepBtn"),
                    tryAgainLabel: t("widgetVoiceTryAgainBtn"),
                    failedMessage: t("widgetVoiceFailedMsg"),
                    transcriptLabel: t("widgetTranscriptConfirmTitle"),
                  }}
                />
              )}

            {/* YES / NO */}
            {currentQuestion.type === "yes-no" && (
              <div className="space-y-3">
                {builderCanvas ? (
                  <div className="space-y-2.5">
                    {(
                      [
                        {
                          idx: 0,
                          defEn: translations.en.yesButton,
                          defAm: translations.am.yesButton,
                        },
                        {
                          idx: 1,
                          defEn: translations.en.noButton,
                          defAm: translations.am.noButton,
                        },
                      ] as const
                    ).map(({ idx, defEn, defAm }) => {
                      const opt = currentQuestion.options?.[idx];
                      const val = opt?.label?.[lang] ?? (lang === "am" ? defAm : defEn);
                      const enRef = opt?.label?.en || defEn;
                      return (
                        <div
                          key={idx}
                          className="min-h-[48px] px-3.5 py-2 rounded-[10px] border border-[var(--line-strong)] bg-[var(--paper)] flex items-center gap-3"
                        >
                          <span
                            className="w-4 h-4 rounded-full border-2 border-[var(--line-strong)] shrink-0"
                            aria-hidden="true"
                          />
                          <div className="flex-1 min-w-0 space-y-0.5">
                            {lang === "am" && !opt?.label?.am?.trim() && enRef.trim() && (
                              <p className="text-xs text-[var(--muted)]">
                                {builderCanvas.labels.englishReference(enRef)}
                              </p>
                            )}
                            <input
                              type="text"
                              aria-label={t("builderCanvasOptionAria", {
                                num: idx + 1,
                                lang: lang === "en" ? "English" : "አማርኛ",
                              })}
                              value={val}
                              onChange={(e) =>
                                builderCanvas.onUpdateOptionLabel?.(idx, e.target.value)
                              }
                              className="w-full bg-transparent text-base font-medium text-[var(--ink)] focus:outline-2 focus:outline-[var(--accent)] rounded-[4px] px-1 -mx-1"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <>
                    {renderVoiceControlForQuestion(
                      {
                        ...currentQuestion,
                        options: [
                          {
                            value: "yes",
                            label: currentQuestion.options?.[0]?.label ?? {
                              en: translations.en.yesButton,
                              am: translations.am.yesButton,
                            },
                          },
                          {
                            value: "no",
                            label: currentQuestion.options?.[1]?.label ?? {
                              en: translations.en.noButton,
                              am: translations.am.noButton,
                            },
                          },
                        ],
                      },
                      false
                    )}
                    <ChoiceList
                      name={`${widgetId}-${currentQuestion.id}`}
                      legend={primaryLabel}
                      mode="single"
                      disabled={readOnly}
                      value={String(answers[currentQuestion.id] ?? "")}
                      onChange={(v) => updateAnswer(currentQuestion.id, v)}
                      options={[
                        {
                          value: "yes",
                          title: currentQuestion.options?.[0]?.label[lang] || t("yesButton"),
                        },
                        {
                          value: "no",
                          title: currentQuestion.options?.[1]?.label[lang] || t("noButton"),
                        },
                      ]}
                    />
                  </>
                )}
                {currentErrorMap.has(getFieldDomId(currentQuestion.id)) && (
                  <p role="alert" className="text-sm font-medium text-[var(--error)]">
                    {currentErrorMap.get(getFieldDomId(currentQuestion.id))}
                  </p>
                )}
              </div>
            )}

            {/* INFO SCREEN */}
            {currentQuestion.type === "info" && (
              <div className="p-4 rounded-[10px] bg-[var(--stone)] border border-[var(--line)] text-base text-[var(--ink)]">
                {currentQuestion.hint?.[lang] || currentQuestion.label[lang]}
              </div>
            )}

            {/* CONSENT STEP */}
            {currentQuestion.type === "consent" && (
              <div className="space-y-2">
                <label className="flex items-start gap-3 p-4 rounded-[10px] bg-[var(--stone)] border border-[var(--line-strong)] cursor-pointer min-h-[56px]">
                  <input
                    id={getFieldDomId(currentQuestion.id)}
                    type="checkbox"
                    disabled={readOnly}
                    checked={Boolean(answers[currentQuestion.id])}
                    onChange={(e) => updateAnswer(currentQuestion.id, e.target.checked)}
                    className="mt-1 w-5 h-5 accent-[var(--accent)]"
                  />
                  <span className="text-base text-[var(--ink)] font-medium">
                    {currentQuestion.label[lang]}
                  </span>
                </label>
                {currentErrorMap.has(getFieldDomId(currentQuestion.id)) && (
                  <p role="alert" className="text-sm font-medium text-[var(--error)]">
                    {currentErrorMap.get(getFieldDomId(currentQuestion.id))}
                  </p>
                )}
              </div>
            )}

            {/* DATE OF BIRTH (Three plain selects: Day, Month, Year — empty defaults) */}
            {currentQuestion.type === "date" && (
              <div className="space-y-4">
                <div
                  className="inline-flex rounded-[6px] border border-[var(--line-strong)] bg-[var(--stone)] p-0.5"
                  role="group"
                  aria-label={t("widgetCalGroupLabel")}
                >
                  <button
                    type="button"
                    onClick={() => updateAnswer("dob_calendar", "eth")}
                    aria-pressed={answers.dob_calendar !== "greg"}
                    className={`px-3.5 min-h-[38px] rounded-[4px] text-xs font-semibold cursor-pointer ${
                      answers.dob_calendar !== "greg"
                        ? "bg-[var(--paper)] text-[var(--ink)]"
                        : "text-[var(--muted)]"
                    }`}
                  >
                    {t("widgetCalEth")}
                  </button>
                  <button
                    type="button"
                    onClick={() => updateAnswer("dob_calendar", "greg")}
                    aria-pressed={answers.dob_calendar === "greg"}
                    className={`px-3.5 min-h-[38px] rounded-[4px] text-xs font-semibold cursor-pointer ${
                      answers.dob_calendar === "greg"
                        ? "bg-[var(--paper)] text-[var(--ink)]"
                        : "text-[var(--muted)]"
                    }`}
                  >
                    {t("widgetCalGreg")}
                  </button>
                </div>

                {answers.dob_calendar !== "greg" ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label
                          htmlFor={getFieldDomId("dob_eth_day")}
                          className="block text-sm font-medium text-[var(--ink)]"
                        >
                          {t("widgetCalDay")}
                        </label>
                        <select
                          id={getFieldDomId("dob_eth_day")}
                          disabled={readOnly}
                          value={String(answers.dob_eth_day ?? "")}
                          onChange={(e) => updateAnswer("dob_eth_day", e.target.value)}
                          className="w-full min-h-[48px] px-3 rounded-[6px] border border-[var(--line-strong)] bg-[var(--paper)] text-base"
                        >
                          <option value="">—</option>
                          {Array.from({ length: maxEthDays }, (_, i) => i + 1).map((d) => (
                            <option key={d} value={String(d)}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor={getFieldDomId("dob_eth_month")}
                          className="block text-sm font-medium text-[var(--ink)]"
                        >
                          {t("widgetCalMonth")}
                        </label>
                        <select
                          id={getFieldDomId("dob_eth_month")}
                          disabled={readOnly}
                          value={String(answers.dob_eth_month ?? "")}
                          onChange={(e) => updateAnswer("dob_eth_month", e.target.value)}
                          className="w-full min-h-[48px] px-3 rounded-[6px] border border-[var(--line-strong)] bg-[var(--paper)] text-base"
                        >
                          <option value="">{t("widgetCalChooseMonth")}</option>
                          {ETHIOPIAN_MONTHS.map((m) => (
                            <option key={m.num} value={String(m.num)}>
                              {lang === "am" ? m.am : m.en}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor={getFieldDomId("dob_eth_year")}
                          className="block text-sm font-medium text-[var(--ink)]"
                        >
                          {t("widgetCalYear")}
                        </label>
                        <select
                          id={getFieldDomId("dob_eth_year")}
                          disabled={readOnly}
                          value={String(answers.dob_eth_year ?? "")}
                          onChange={(e) => updateAnswer("dob_eth_year", e.target.value)}
                          aria-invalid={currentErrorMap.has(getFieldDomId("dob_eth_year"))}
                          className="w-full min-h-[48px] px-3 rounded-[6px] border border-[var(--line-strong)] bg-[var(--paper)] text-base"
                        >
                          <option value="">—</option>
                          {ethYearOptions.map((y) => (
                            <option key={y} value={String(y)}>
                              {y}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {gregConverted && (
                      <p className="text-sm text-[var(--muted)]">
                        {t("widgetDobThatIs", { date: formatGregorianDate(gregConverted) })}
                      </p>
                    )}
                    {currentErrorMap.has(getFieldDomId("dob_eth_year")) && (
                      <p role="alert" className="text-sm font-medium text-[var(--error)]">
                        {currentErrorMap.get(getFieldDomId("dob_eth_year"))}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label
                          htmlFor={getFieldDomId("dob_greg_day")}
                          className="block text-sm font-medium text-[var(--ink)]"
                        >
                          {t("widgetCalDay")}
                        </label>
                        <select
                          id={getFieldDomId("dob_greg_day")}
                          disabled={readOnly}
                          value={String(answers.dob_greg_day ?? "")}
                          onChange={(e) => updateAnswer("dob_greg_day", e.target.value)}
                          className="w-full min-h-[48px] px-3 rounded-[6px] border border-[var(--line-strong)] bg-[var(--paper)] text-base"
                        >
                          <option value="">—</option>
                          {Array.from({ length: maxGregDays }, (_, i) => i + 1).map((d) => (
                            <option key={d} value={String(d)}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor={getFieldDomId("dob_greg_month")}
                          className="block text-sm font-medium text-[var(--ink)]"
                        >
                          {t("widgetCalMonth")}
                        </label>
                        <select
                          id={getFieldDomId("dob_greg_month")}
                          disabled={readOnly}
                          value={String(answers.dob_greg_month ?? "")}
                          onChange={(e) => updateAnswer("dob_greg_month", e.target.value)}
                          className="w-full min-h-[48px] px-3 rounded-[6px] border border-[var(--line-strong)] bg-[var(--paper)] text-base"
                        >
                          <option value="">{t("widgetCalChooseMonth")}</option>
                          {GREGORIAN_MONTHS_EN.map((m, idx) => (
                            <option key={m} value={String(idx + 1)}>
                              {m}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor={getFieldDomId("dob_greg_year")}
                          className="block text-sm font-medium text-[var(--ink)]"
                        >
                          {t("widgetCalYear")}
                        </label>
                        <select
                          id={getFieldDomId("dob_greg_year")}
                          disabled={readOnly}
                          value={String(answers.dob_greg_year ?? "")}
                          onChange={(e) => updateAnswer("dob_greg_year", e.target.value)}
                          aria-invalid={currentErrorMap.has(getFieldDomId("dob_greg_year"))}
                          className="w-full min-h-[48px] px-3 rounded-[6px] border border-[var(--line-strong)] bg-[var(--paper)] text-base"
                        >
                          <option value="">—</option>
                          {gregYearOptions.map((y) => (
                            <option key={y} value={String(y)}>
                              {y}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {ethConverted && (
                      <p className="text-sm text-[var(--muted)]">
                        {t("widgetDobThatIs", { date: formatEthiopianDate(ethConverted, lang) })}
                      </p>
                    )}
                    {currentErrorMap.has(getFieldDomId("dob_greg_year")) && (
                      <p role="alert" className="text-sm font-medium text-[var(--error)]">
                        {currentErrorMap.get(getFieldDomId("dob_greg_year"))}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* SINGLE CHOICE / MULTICHOICE */}
            {(currentQuestion.type === "choice" || currentQuestion.type === "multichoice") && (
              <div className="space-y-3" id={getFieldDomId(currentQuestion.id)}>
                {builderCanvas ? (
                  <div className="space-y-2.5">
                    {(currentQuestion.options ?? []).map((opt, optIdx) => {
                      const optVal = opt.label?.[lang] ?? "";
                      const optEn = opt.label?.en ?? "";
                      return (
                        <div
                          key={`${opt.value}-${optIdx}`}
                          className="group min-h-[48px] px-3.5 py-2 rounded-[10px] border border-[var(--line-strong)] bg-[var(--paper)] flex items-center gap-3"
                        >
                          <span
                            className={`w-4 h-4 border-2 border-[var(--line-strong)] shrink-0 ${
                              currentQuestion.type === "choice" ? "rounded-full" : "rounded-[4px]"
                            }`}
                            aria-hidden="true"
                          />
                          <div className="flex-1 min-w-0 space-y-0.5">
                            {lang === "am" && !opt.label?.am?.trim() && optEn.trim() && (
                              <p className="text-xs text-[var(--muted)]">
                                {builderCanvas.labels.englishReference(optEn)}
                              </p>
                            )}
                            <input
                              type="text"
                              aria-label={t("builderCanvasOptionAria", {
                                num: optIdx + 1,
                                lang: lang === "en" ? "English" : "አማርኛ",
                              })}
                              value={optVal}
                              onChange={(e) =>
                                builderCanvas.onUpdateOptionLabel?.(optIdx, e.target.value)
                              }
                              className="w-full bg-transparent text-base font-medium text-[var(--ink)] focus:outline-2 focus:outline-[var(--accent)] rounded-[4px] px-1 -mx-1"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => builderCanvas.onRemoveOption?.(optIdx)}
                            aria-label={builderCanvas.labels.removeOptionAria(
                              optVal || optEn || String(optIdx + 1)
                            )}
                            className="min-w-[36px] min-h-[36px] rounded-[6px] inline-flex items-center justify-center text-[var(--muted)] hover:text-[var(--error)] opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100 cursor-pointer shrink-0"
                          >
                            <X size={20} strokeWidth={1.75} aria-hidden="true" />
                          </button>
                        </div>
                      );
                    })}

                    <div className="flex items-center gap-2 pt-1 relative" ref={canvasOptMenuRef}>
                      <button
                        type="button"
                        onClick={() => builderCanvas.onAddOption?.()}
                        className="flex-1 min-h-[44px] px-3.5 rounded-[10px] border border-dashed border-[var(--line-strong)] text-sm font-medium text-[var(--ink)] hover:bg-[var(--stone)] inline-flex items-center gap-2 cursor-pointer"
                      >
                        <Plus size={20} strokeWidth={1.75} aria-hidden="true" />
                        <span>{builderCanvas.labels.addOptionBtn}</span>
                      </button>

                      <button
                        type="button"
                        aria-label={builderCanvas.labels.moreOptionsAria}
                        aria-expanded={canvasOptMenuOpen}
                        onClick={() => setCanvasOptMenuOpen((v) => !v)}
                        className="min-w-[44px] min-h-[44px] rounded-[10px] border border-[var(--line-strong)] bg-[var(--paper)] hover:bg-[var(--stone)] inline-flex items-center justify-center text-[var(--ink)] cursor-pointer shrink-0"
                      >
                        <MoreHorizontal size={20} strokeWidth={1.75} aria-hidden="true" />
                      </button>

                      {canvasOptMenuOpen && (
                        <div
                          role="menu"
                          style={{ boxShadow: "var(--shadow-float)" }}
                          className="absolute right-0 bottom-full mb-1.5 z-30 min-w-[200px] rounded-[10px] border border-[var(--line-strong)] bg-[var(--paper)] p-1.5 space-y-0.5"
                        >
                          <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                              setCanvasOptMenuOpen(false);
                              builderCanvas.onOpenPasteOptions?.();
                            }}
                            className="w-full text-left px-3 min-h-[40px] rounded-[6px] text-sm text-[var(--ink)] hover:bg-[var(--stone)] cursor-pointer"
                          >
                            {builderCanvas.labels.pasteOptionsItem}
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                              setCanvasOptMenuOpen(false);
                              builderCanvas.onAddOtherOption?.();
                            }}
                            className="w-full text-left px-3 min-h-[40px] rounded-[6px] text-sm text-[var(--ink)] hover:bg-[var(--stone)] cursor-pointer"
                          >
                            {builderCanvas.labels.addOtherItem}
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                              setCanvasOptMenuOpen(false);
                              builderCanvas.onAddPreferNotOption?.();
                            }}
                            className="w-full text-left px-3 min-h-[40px] rounded-[6px] text-sm text-[var(--ink)] hover:bg-[var(--stone)] cursor-pointer"
                          >
                            {builderCanvas.labels.addPreferNotItem}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  currentQuestion.options && (
                    <>
                      {renderVoiceControlForQuestion(
                        currentQuestion,
                        currentQuestion.type === "multichoice"
                      )}
                      <ChoiceList
                        name={`${widgetId}-${currentQuestion.id}`}
                        legend={primaryLabel}
                        mode={currentQuestion.type === "choice" ? "single" : "multi"}
                        disabled={readOnly}
                        value={
                          currentQuestion.type === "choice"
                            ? String(answers[currentQuestion.id] ?? "")
                            : Array.isArray(answers[currentQuestion.id])
                              ? (answers[currentQuestion.id] as string[])
                              : []
                        }
                        onChange={(v) => {
                          updateAnswer(currentQuestion.id, v);
                          if (
                            currentQuestion.type === "choice" &&
                            currentQuestion.id === "language" &&
                            (v === "am" || v === "en")
                          ) {
                            setLang(v);
                          }
                        }}
                        options={currentQuestion.options.map((opt) => ({
                          value: opt.value,
                          title: opt.label[lang],
                        }))}
                      />
                    </>
                  )
                )}
                {currentErrorMap.has(getFieldDomId(currentQuestion.id)) && (
                  <p role="alert" className="text-sm font-medium text-[var(--error)]">
                    {currentErrorMap.get(getFieldDomId(currentQuestion.id))}
                  </p>
                )}
              </div>
            )}

            {/* ID ROUTES */}
            {currentQuestion.type === "id-routes" &&
              (() => {
                const allowedRoutes = safeTemplate.idRoutes.filter(
                  (r) => effectiveSettings.partnerReferral || r !== "partner_refer"
                );
                const routeOptions = (
                  [
                    {
                      value: "fayda",
                      label: {
                        en: translations.en.heroOptFayda,
                        am: translations.am.heroOptFayda,
                      },
                    },
                    {
                      value: "refugee_id",
                      label: {
                        en: translations.en.heroOptRefugee,
                        am: translations.am.heroOptRefugee,
                      },
                    },
                    {
                      value: "other_document",
                      label: {
                        en: translations.en.heroOptOther,
                        am: translations.am.heroOptOther,
                      },
                    },
                    {
                      value: "partner_refer",
                      label: {
                        en: translations.en.heroOptPartner,
                        am: translations.am.heroOptPartner,
                      },
                    },
                  ] as { value: IdRoute; label: { en: string; am: string } }[]
                ).filter((o) => allowedRoutes.includes(o.value));

                return (
                  <div className="space-y-4" id={getFieldDomId(currentQuestion.id)}>
                    {renderVoiceControlForQuestion(
                      { ...currentQuestion, options: routeOptions },
                      false
                    )}

                    <ChoiceList
                      name={`${widgetId}-id_route`}
                      legend={primaryLabel}
                      mode="single"
                      disabled={readOnly}
                      value={String(answers.id_route ?? "")}
                      onChange={(v) => updateAnswer("id_route", v as IdRoute)}
                      options={routeOptions.map((o) => ({
                        value: o.value,
                        title: o.label[lang],
                      }))}
                    />

                    {/* Another document upload + camera option */}
                    {answers.id_route === "other_document" && (
                      <div className="p-4 rounded-[10px] border border-[var(--line)] bg-[var(--stone)] space-y-3">
                        <p className="text-sm font-medium text-[var(--ink)]">
                          {t("widgetOtherDocUploadLabel")}
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                          <label className="min-h-[48px] px-4 rounded-[10px] border border-[var(--ink)] bg-[var(--paper)] text-sm font-medium text-[var(--ink)] inline-flex items-center gap-2 cursor-pointer">
                            <FileUp size={20} strokeWidth={1.75} aria-hidden="true" />
                            <span>{t("widgetOtherDocUploadLabel")}</span>
                            <input
                              type="file"
                              accept="image/*,.pdf"
                              disabled={readOnly}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) updateAnswer("other_doc_name", file.name);
                              }}
                              className="sr-only"
                            />
                          </label>

                          <label className="min-h-[48px] px-4 rounded-[10px] border border-[var(--line-strong)] bg-[var(--paper)] text-sm font-medium text-[var(--ink)] inline-flex items-center gap-2 cursor-pointer">
                            <Camera size={20} strokeWidth={1.75} aria-hidden="true" />
                            <span>{t("widgetOtherDocCameraLabel")}</span>
                            <input
                              type="file"
                              accept="image/*"
                              capture="environment"
                              disabled={readOnly}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) updateAnswer("other_doc_name", file.name);
                              }}
                              className="sr-only"
                            />
                          </label>
                        </div>
                        {answers.other_doc_name && (
                          <p className="text-sm text-[var(--mint-ink)] font-medium">
                            {t("widgetOtherDocSelected", { name: String(answers.other_doc_name) })}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Partner vouching option */}
                    {answers.id_route === "partner_refer" && (
                      <div className="p-4 rounded-[10px] bg-[var(--stone)] border border-[var(--line)] space-y-4">
                        <div className="space-y-1.5">
                          <label
                            htmlFor={getFieldDomId("partner_org")}
                            className="block text-sm font-medium text-[var(--ink)]"
                          >
                            {t("widgetPartnerSelectLabel")}
                          </label>
                          <select
                            id={getFieldDomId("partner_org")}
                            disabled={readOnly}
                            value={String(answers.partner_org ?? "")}
                            onChange={(e) => updateAnswer("partner_org", e.target.value)}
                            className="w-full min-h-[48px] px-3.5 rounded-[6px] border border-[var(--line-strong)] bg-[var(--paper)] text-base"
                          >
                            <option value="">—</option>
                            <option value="addis_accessibility">{t("widgetPartner1")}</option>
                            <option value="refugee_support_desk">{t("widgetPartner2")}</option>
                            <option value="community_tvet">{t("widgetPartner3")}</option>
                          </select>
                        </div>

                        <label className="flex items-start gap-3 cursor-pointer min-h-[48px]">
                          <input
                            id={getFieldDomId("partner_consent")}
                            type="checkbox"
                            disabled={readOnly}
                            checked={Boolean(answers.partner_consent)}
                            onChange={(e) => updateAnswer("partner_consent", e.target.checked)}
                            className="mt-1 w-5 h-5 accent-[var(--accent)]"
                          />
                          <span className="text-sm text-[var(--ink)]">
                            {t("widgetPartnerConsent")}
                          </span>
                        </label>

                        <Banner variant="info">{t("widgetPartnerNotice")}</Banner>
                      </div>
                    )}

                    {currentErrorMap.has(getFieldDomId(currentQuestion.id)) && (
                      <p role="alert" className="text-sm font-medium text-[var(--error)]">
                        {currentErrorMap.get(getFieldDomId(currentQuestion.id))}
                      </p>
                    )}
                    {currentErrorMap.has(getFieldDomId("partner_consent")) && (
                      <p role="alert" className="text-sm font-medium text-[var(--error)]">
                        {currentErrorMap.get(getFieldDomId("partner_consent"))}
                      </p>
                    )}
                  </div>
                );
              })()}

            {/* SUPPORT NEEDS (PRIVATE BY DEFAULT — OFF) */}
            {currentQuestion.type === "support" && (
              <div className="space-y-4" id={getFieldDomId(currentQuestion.id)}>
                {renderVoiceControlForQuestion(
                  { ...currentQuestion, id: "support_needs" },
                  true
                )}

                <Banner variant="info">
                  <span className="inline-flex items-center gap-2">
                    <Lock size={16} strokeWidth={1.75} aria-hidden="true" />
                    <span>{t("widgetSupportNoDiagnosis")}</span>
                  </span>
                </Banner>

                <ChoiceList
                  name={`${widgetId}-support_needs`}
                  legend={primaryLabel}
                  mode="multi"
                  disabled={readOnly}
                  value={Array.isArray(answers.support_needs) ? answers.support_needs : []}
                  onChange={(v) => updateAnswer("support_needs", v)}
                  options={(currentQuestion.options ?? []).map((opt) => ({
                    value: opt.value,
                    title: opt.label[lang],
                  }))}
                />

                <div className="p-4 rounded-[10px] bg-[var(--stone)] border border-[var(--line)] space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-[var(--ink)] flex items-center gap-2">
                        <Shield size={18} strokeWidth={1.75} aria-hidden="true" />
                        <span>{t("widgetSupportShareToggle")}</span>
                      </p>
                      <p className="text-sm text-[var(--muted)] mt-0.5">
                        {answers.support_share_platform
                          ? t("widgetSupportShareExplainOn")
                          : t("widgetSupportShareExplainOff")}
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={Boolean(answers.support_share_platform)}
                      aria-label={t("widgetSupportShareToggle")}
                      disabled={readOnly}
                      onClick={() =>
                        updateAnswer("support_share_platform", !answers.support_share_platform)
                      }
                      className={`w-12 h-7 rounded-full p-0.5 border shrink-0 cursor-pointer mezgeb-transition ${
                        answers.support_share_platform
                          ? "bg-[var(--accent)] border-[var(--accent)]"
                          : "bg-[var(--paper)] border-[var(--line-strong)]"
                      }`}
                    >
                      <span
                        className={`block w-5 h-5 rounded-full mezgeb-transition ${
                          answers.support_share_platform
                            ? "translate-x-5 bg-[var(--paper)]"
                            : "translate-x-0 bg-[var(--ink)]"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* WORK STORY & SKILLS */}
            {currentQuestion.type === "work-story" && (
              <div className="space-y-4">
                <Field
                  id={getFieldDomId(currentQuestion.id)}
                  as="textarea"
                  label={primaryLabel}
                  labelLang={lang}
                  required={currentQuestion.required}
                  rightSlot={
                    canVoice && currentQuestion.allowVoice !== false && !readOnly ? (
                      <VoiceButton
                        widgetSize
                        state={voiceUiState === "listening" || voiceUiState === "processing" ? voiceUiState : "idle"}
                        seconds={recordSeconds}
                        onStart={() =>
                          startVoiceRecording(
                            currentQuestion.id,
                            currentQuestion.label[lang],
                            currentQuestion.type
                          )
                        }
                        onStop={stopVoiceRecording}
                        labels={{
                          speakLabel: t("widgetSpeakAnswerLabel"),
                          listeningLabel: t("widgetVoiceListeningLabel"),
                          processingLabel: t("widgetVoiceProcessingLabel"),
                        }}
                      />
                    ) : undefined
                  }
                  textareaRef={(el: HTMLTextAreaElement | null) => {
                    textInputRef.current = el;
                  }}
                  textareaProps={{
                    rows: 4,
                    disabled: readOnly,
                    value: String(answers.work_story ?? ""),
                    onChange: (e) => updateAnswer("work_story", e.target.value),
                  }}
                />

                {canSkillsAi && !readOnly && (
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Button
                      variant="secondary"
                      size="md"
                      loading={extractingSkills}
                      loadingLabel={t("widgetSkillsExtracting")}
                      disabled={!String(answers.work_story ?? "").trim()}
                      disabledReason={
                        !String(answers.work_story ?? "").trim()
                          ? t("qWorkStoryHint")
                          : undefined
                      }
                      onClick={handleExtractSkills}
                    >
                      {t("widgetSkillsExtractBtn")}
                    </Button>
                    <span className="text-xs text-[var(--muted)]">{t("cloudAiNotice")}</span>
                  </div>
                )}

                {pendingSuggestedSkills.length > 0 && (
                  <div className="p-4 rounded-[10px] bg-[var(--lilac)] border border-[var(--accent)] space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-[var(--ink)]">
                        {t("widgetSkillsSuggestedTitle")}
                      </p>
                      <Button
                        variant="primary"
                        size="md"
                        onClick={() => {
                          const current = Array.isArray(answers.skills) ? answers.skills : [];
                          const merged = Array.from(
                            new Set([...current, ...pendingSuggestedSkills.map((s) => s.name)])
                          );
                          updateAnswer("skills", merged);
                          setPendingSuggestedSkills([]);
                        }}
                      >
                        {t("widgetSkillsKeepAllBtn")}
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {pendingSuggestedSkills.map((s, idx) => (
                        <div
                          key={idx}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[6px] bg-[var(--paper)] border border-[var(--line-strong)] text-sm"
                        >
                          <span className="font-medium text-[var(--ink)]">{s.name}</span>
                          <Button
                            variant="secondary"
                            size="md"
                            onClick={() => {
                              const current = Array.isArray(answers.skills) ? answers.skills : [];
                              if (!current.includes(s.name)) {
                                updateAnswer("skills", [...current, s.name]);
                              }
                              setPendingSuggestedSkills((prev) => prev.filter((_, i) => i !== idx));
                            }}
                          >
                            {t("widgetSkillsKeepBtn")}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(!canSkillsAi || showSkillsFallback) && (
                  <div className="p-4 rounded-[10px] bg-[var(--stone)] border border-[var(--line)] space-y-2.5">
                    <p className="text-sm font-medium text-[var(--ink)]">
                      {t("widgetSkillsFallbackTitle")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        t("optCommonSkillSales"),
                        t("optCommonSkillBookkeeping"),
                        t("optCommonSkillCustomer"),
                        t("optCommonSkillTailoring"),
                        t("optCommonSkillDigital"),
                        t("optCommonSkillTeaching"),
                      ].map((skill) => {
                        const list = Array.isArray(answers.skills) ? answers.skills : [];
                        const active = list.includes(skill);
                        return (
                          <button
                            key={skill}
                            type="button"
                            disabled={readOnly}
                            aria-pressed={active}
                            onClick={() => {
                              const next = active
                                ? list.filter((s) => s !== skill)
                                : [...list, skill];
                              updateAnswer("skills", next);
                            }}
                            className={`px-3.5 min-h-[44px] rounded-[6px] border text-sm font-medium cursor-pointer ${
                              active
                                ? "bg-[var(--lilac)] border-2 border-[var(--accent)] text-[var(--ink)]"
                                : "bg-[var(--paper)] border-[var(--line-strong)] text-[var(--ink)]"
                            }`}
                          >
                            {active ? `✓ ${skill}` : `+ ${skill}`}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {Array.isArray(answers.skills) && answers.skills.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-[var(--muted)]">
                      {t("widgetSkillsSavedTitle")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {answers.skills.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          disabled={readOnly}
                          onClick={() =>
                            updateAnswer(
                              "skills",
                              (answers.skills ?? []).filter((s) => s !== skill)
                            )
                          }
                          aria-label={t("widgetSkillsRemoveLabel", { skill })}
                          className="px-3 min-h-[40px] rounded-[6px] bg-[var(--lilac)] border border-[var(--accent)] text-sm font-medium text-[var(--ink)] inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>{skill}</span>
                          <X size={14} strokeWidth={1.75} aria-hidden="true" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {!readOnly && (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={customSkillInput}
                      onChange={(e) => setCustomSkillInput(e.target.value)}
                      placeholder={t("widgetSkillsAddPlaceholder")}
                      aria-label={t("widgetSkillsAddPlaceholder")}
                      className="flex-1 min-h-[48px] px-3.5 rounded-[6px] border border-[var(--line-strong)] bg-[var(--paper)] text-base"
                    />
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={() => {
                        const trimmed = customSkillInput.trim();
                        if (!trimmed) return;
                        const list = Array.isArray(answers.skills) ? answers.skills : [];
                        if (!list.includes(trimmed)) {
                          updateAnswer("skills", [...list, trimmed]);
                        }
                        setCustomSkillInput("");
                      }}
                    >
                      {t("widgetSkillsAddBtn")}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* REVIEW AND CONFIRM STEP */
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-[var(--muted)]">{t("widgetReviewTitle")}</p>
              {!readOnly && !ephemeralPreview && (
                <Button
                  variant="quiet"
                  size="md"
                  onClick={() => {
                    safeRemoveStorage(storageKey);
                    setDeviceClearedNotice(true);
                    announce(t("widgetDeviceClearedNotice"));
                  }}
                >
                  {t("widgetClearDeviceBtn")}
                </Button>
              )}
            </div>

            {deviceClearedNotice && (
              <Banner variant="success">{t("widgetDeviceClearedNotice")}</Banner>
            )}

            <dl className="divide-y divide-[var(--line)] border-t border-b border-[var(--line)]">
              {visibleQuestions
                .filter((q) => q.type !== "info")
                .map((q) => {
                  const idx = visibleQuestions.findIndex((vq) => vq.id === q.id);
                  let displayVal = "—";
                  if (q.type === "date") {
                    if (answers.dob_calendar === "greg" && ethConverted) {
                      const gregStr = formatGregorianDate({
                        year: gregYearNum,
                        month: gregMonthNum,
                        day: gregDayNum,
                      });
                      const ethStr = formatEthiopianDate(ethConverted, lang);
                      displayVal = lang === "am" ? `${ethStr} (${gregStr})` : gregStr;
                    } else if (answers.dob_calendar !== "greg" && gregConverted) {
                      displayVal = `${formatEthiopianDate(
                        { year: ethYearNum, month: ethMonthNum, day: ethDayNum },
                        lang
                      )} (${formatGregorianDate(gregConverted)})`;
                    }
                  } else if (q.type === "choice") {
                    const opt = q.options?.find((o) => o.value === answers[q.id]);
                    displayVal = opt ? opt.label[lang] : String(answers[q.id] ?? "—");
                  } else if (q.type === "yes-no") {
                    if (answers[q.id] === "yes")
                      displayVal = q.options?.[0]?.label[lang] || t("yesButton");
                    else if (answers[q.id] === "no")
                      displayVal = q.options?.[1]?.label[lang] || t("noButton");
                  } else if (q.type === "consent") {
                    displayVal = answers[q.id] ? t("yesButton") : t("noButton");
                  } else if (q.type === "phone") {
                    displayVal = answers[q.id]
                      ? formatPhoneGrouped(String(answers[q.id]))
                      : "—";
                  } else if (q.type === "id-routes") {
                    displayVal = answers.id_route
                      ? answers.id_route === "partner_refer"
                        ? t("widgetPartnerNotice")
                        : String(answers.id_route)
                      : "—";
                  } else if (q.type === "support") {
                    const list = Array.isArray(answers.support_needs)
                      ? answers.support_needs
                      : [];
                    displayVal = list.length > 0 ? list.join(", ") : "—";
                  } else if (q.type === "work-story") {
                    const list = Array.isArray(answers.skills) ? answers.skills : [];
                    displayVal =
                      list.length > 0 ? list.join(", ") : String(answers.work_story || "—");
                  } else if (Array.isArray(answers[q.id])) {
                    displayVal = (answers[q.id] as string[]).join(", ") || "—";
                  } else if (answers[q.id]) {
                    displayVal = String(answers[q.id]);
                  }

                  return (
                    <div key={q.id} className="py-3.5 flex items-start justify-between gap-4">
                      <div className="min-w-0 space-y-1">
                        <dt className="text-sm font-medium text-[var(--muted)]">
                          {q.label[lang]}
                        </dt>
                        <dd className="text-base font-medium text-[var(--ink)] flex flex-wrap items-center gap-2">
                          <span>{displayVal}</span>
                          {q.type === "support" && !answers.support_share_platform && (
                            <Badge variant="neutral">{t("widgetSupportPrivateBadge")}</Badge>
                          )}
                        </dd>
                      </div>
                      <Button
                        variant="quiet"
                        size="md"
                        onClick={() => {
                          setReturnToReviewAfterEdit(true);
                          setStepIndex(idx);
                          focusNewQuestionHeading(idx + 1);
                        }}
                      >
                        {t("widgetChange")}
                      </Button>
                    </div>
                  );
                })}
            </dl>

            {assistedMode && (
              <Banner variant="warning">
                <p className="font-semibold">{t("widgetAssistedSelfConsentTitle")}</p>
                <p className="text-sm mt-0.5">{t("widgetAssistedSelfConsentBody")}</p>
              </Banner>
            )}

            <div className="space-y-2">
              <label className="flex items-start gap-3 p-4 rounded-[10px] bg-[var(--stone)] border border-[var(--line-strong)] cursor-pointer min-h-[56px]">
                <input
                  id={getFieldDomId("consent_accepted")}
                  type="checkbox"
                  disabled={readOnly}
                  checked={Boolean(answers.consent_accepted)}
                  onChange={(e) => updateAnswer("consent_accepted", e.target.checked)}
                  className="mt-1 w-5 h-5 accent-[var(--accent)]"
                />
                <span className="text-base text-[var(--ink)] font-medium">
                  {safeTemplate.consent[lang]}
                </span>
              </label>

              {currentErrorMap.has(getFieldDomId("consent_accepted")) && (
                <p role="alert" className="text-sm font-medium text-[var(--error)]">
                  {currentErrorMap.get(getFieldDomId("consent_accepted"))}
                </p>
              )}
            </div>
          </div>
        )}

        {/* FIXED BOTTOM ACTION BAR: Back (1) + Save and continue (2), both 48px */}
        <div className="pt-4 border-t border-[var(--line)] space-y-3">
          {currentQuestion &&
            !currentQuestion.required &&
            currentQuestion.skippable &&
            currentQuestion.type !== "info" && (
              <div className="flex justify-end">
                <Button variant="quiet" size="md" onClick={handleSkipQuestion}>
                  {t("widgetSkipQuestion")}
                </Button>
              </div>
            )}

          {builderCanvas ? (
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                aria-disabled="true"
                title={builderCanvas.labels.disabledFooterTitle}
                onClick={(e) => e.preventDefault()}
                className="min-h-[48px] px-4 rounded-[10px] border border-[var(--line-strong)] bg-[var(--paper)] text-sm font-medium text-[var(--muted)] cursor-not-allowed"
              >
                {builderCanvas.labels.backLabel}
              </button>
              <button
                type="button"
                aria-disabled="true"
                title={builderCanvas.labels.disabledFooterTitle}
                onClick={(e) => e.preventDefault()}
                className="col-span-2 min-h-[48px] px-4 rounded-[10px] border border-[var(--line-strong)] bg-[var(--stone)] text-sm font-semibold text-[var(--muted)] cursor-not-allowed"
              >
                {builderCanvas.labels.saveLabel}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {!singleQuestionMode && (stepIndex > 0 || useIntroScreens) && (
                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  onClick={() => {
                    setReturnToReviewAfterEdit(false);
                    if (stepIndex > 0) {
                      const prevIdx = stepIndex - 1;
                      setStepIndex(prevIdx);
                      focusNewQuestionHeading(prevIdx + 1);
                    } else if (useIntroScreens) {
                      setStage("mode");
                    }
                  }}
                >
                  {t("widgetBack")}
                </Button>
              )}

              <div
                className={
                  !singleQuestionMode && (stepIndex > 0 || useIntroScreens)
                    ? "col-span-2"
                    : "col-span-3"
                }
              >
                <Button variant="primary" size="lg" fullWidth onClick={handleNext}>
                  {singleQuestionMode
                    ? t("saveButton")
                    : isReviewStep
                      ? t("widgetConfirm")
                      : t("widgetSaveContinue")}
                </Button>
              </div>
            </div>
          )}

          {!readOnly && !singleQuestionMode && effectiveSettings.smsResume && (
            <div className="pt-1">
              <Button
                variant="quiet"
                size="md"
                onClick={() => {
                  setSmsPhone(String(answers.phone ?? ""));
                  setSmsPhoneError("");
                  setSmsGeneratedLink(null);
                  setSmsOpen((v) => !v);
                }}
              >
                <MessageSquare size={16} strokeWidth={1.75} aria-hidden="true" />
                <span>{t("widgetFinishLaterSms")}</span>
              </Button>
            </div>
          )}
        </div>

        {/* Finish later by SMS panel */}
        {smsOpen && (
          <div className="p-4 rounded-[10px] bg-[var(--stone)] border border-[var(--line)] space-y-3">
            <p className="text-sm font-semibold text-[var(--ink)]">{t("widgetSmsModalTitle")}</p>
            <form onSubmit={handleSendSmsLink} className="space-y-3">
              <Field
                id={`${widgetId}-sms-phone`}
                label={t("widgetSmsPhoneLabel")}
                error={smsPhoneError}
                inputProps={{
                  type: "tel",
                  inputMode: "numeric",
                  placeholder: "091 234 5678",
                  value: formatPhoneGrouped(smsPhone),
                  onChange: (e) => setSmsPhone(normalizePhoneDigits(e.target.value)),
                }}
              />
              <Button type="submit" variant="primary" size="md">
                {t("widgetSmsSendBtn")}
              </Button>
            </form>

            {smsGeneratedLink && (
              <Banner variant="success">
                <div className="space-y-1">
                  <p>{t("widgetSmsBody")}</p>
                  <a
                    href={smsGeneratedLink}
                    className="underline break-all font-medium text-[var(--mint-ink)]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {smsGeneratedLink}
                  </a>
                </div>
              </Banner>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
