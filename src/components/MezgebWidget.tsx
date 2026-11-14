import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  extractSkillsFromStory,
  getCapabilities,
  getSmartHelp,
  ScreenSummaryForAi,
  ServerCapabilities,
  simplifyQuestionLabel,
  transcribeVoiceAnswer,
} from "../ai";
import { Lang, TranslationKeys, translations, useI18n } from "../i18n";
import {
  daysInEthiopianMonth,
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
  subscribePartnerSync,
  upsertPartnerSession,
} from "../lib/partnerSync";
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
  CheckIcon,
  HelpCircleIcon,
  LockIcon,
  MicIcon,
  QuestionIcon,
  ShieldIcon,
  VolumeIcon,
} from "./Icons";
import { useLiveAnnouncer } from "./LiveAnnouncer";

export interface MezgebAnswers {
  [key: string]: unknown;
  id_route?: IdRoute;
  partner_org?: string;
  partner_consent?: boolean;
  support_needs?: string[];
  support_share_platform?: boolean;
  support_share_employers?: boolean;
  support_share_partner?: boolean;
  work_story?: string;
  skills?: string[];
  consent_accepted?: boolean;
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
  onAnswersChange?: (answers: MezgebAnswers) => void;
  onAiPayloadLogged?: (payload: ScreenSummaryForAi) => void;
  onComplete?: (result: {
    token: string;
    profile: Record<string, unknown>;
    supportShared: boolean;
    queuedOffline?: boolean;
  }) => void;
  onOutboxUpdated?: () => void;
  onReset?: () => void;
}

function formatPhoneGrouped(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
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
    support_share_platform: false, // B2: OFF by default
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
  onAnswersChange,
  onAiPayloadLogged,
  onComplete,
  onOutboxUpdated,
  onReset,
}: MezgebWidgetProps) {
  const { lang, setLang, t } = useI18n();
  const { announce } = useLiveAnnouncer();
  const widgetId = useId();

  const validation = validateTemplate(template);
  const safeTemplate = validation.template;
  const effectiveSettings = getEffectiveSettings(safeTemplate);
  const effectiveAccent = accentColorProp ?? safeTemplate.theme?.accent ?? "#6A4FC4";
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
  }, []);

  const effectiveAi = aiEnabled && !offline;
  const canVoice = effectiveAi && capabilities.voice && effectiveSettings.voice;
  const canSmartHelp = effectiveAi && capabilities.smartHelp && effectiveSettings.smartHelp;
  const canSkillsAi = effectiveAi && capabilities.skillsAi;
  const canSimplifyAi = effectiveAi && capabilities.simplifyAi && effectiveSettings.sayItSimply;

  const [stepIndex, setStepIndex] = useState<number>(0);
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

  // Two-stage completion: What happens next screen -> Success / Queued screen
  const [nextScreenState, setNextScreenState] = useState<{
    token: string;
    profile: Record<string, unknown>;
    supportShared: boolean;
    queuedOffline: boolean;
  } | null>(null);
  const [completedState, setCompletedState] = useState<{
    token: string;
    profile: Record<string, unknown>;
    supportShared: boolean;
    queuedOffline: boolean;
  } | null>(null);

  // Partner sync state
  const [partnerSessionId] = useState(() => `sess_${Math.random().toString(36).slice(2, 8)}`);
  const [partnerJoinedLive, setPartnerJoinedLive] = useState(false);

  // Errors
  const [errors, setErrors] = useState<{ fieldId: string; code: string; message: string; fieldLabel: string }[]>([]);
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  // Speech / pre-recorded audio
  const [speaking, setSpeaking] = useState(false);
  const [noAmharicVoiceNote, setNoAmharicVoiceNote] = useState(false);
  const audioElRef = useRef<HTMLAudioElement | null>(null);

  // Voice recording (MediaRecorder)
  const [recording, setRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [sendingVoice, setSendingVoice] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState<string | null>(null);
  const [pendingTranscript, setPendingTranscript] = useState<{
    fieldKey: string;
    transcript: string;
    value: string;
    confidence: string;
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

  // Smart Help (Alt+H) - always available
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
  const helpInputRef = useRef<HTMLInputElement>(null);
  const helpTakeMeRef = useRef<HTMLButtonElement>(null);
  const helpCloseRef = useRef<HTMLButtonElement>(null);

  // Simplify ("Say it more simply")
  const [simplifying, setSimplifying] = useState(false);
  const [simplifiedInfo, setSimplifiedInfo] = useState<{ usedAi: boolean; text: string } | null>(null);

  // Skills extraction
  const [extractingSkills, setExtractingSkills] = useState(false);
  const [pendingSuggestedSkills, setPendingSuggestedSkills] = useState<{ name: string; evidence: string }[]>([]);
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [showSkillsFallback, setShowSkillsFallback] = useState(false);

  // Finish later by SMS
  const [smsOpen, setSmsOpen] = useState(false);
  const [smsPhone, setSmsPhone] = useState("");
  const [smsPhoneError, setSmsPhoneError] = useState("");
  const [smsGeneratedLink, setSmsGeneratedLink] = useState<string | null>(null);

  // Load saved state or ?resume=<id> on mount
  useEffect(() => {
    if (readOnly || singleQuestionMode || ephemeralPreview || !effectiveSettings.offline) return;
    if (resumeIdParam) {
      const resumed = safeGetStorage(`mezgeb_resume_${resumeIdParam}`);
      if (resumed.value) {
        try {
          const parsed = JSON.parse(resumed.value);
          if (parsed && typeof parsed.stepIndex === "number" && parsed.answers) {
            setAnswers((prev) => ({ ...prev, ...parsed.answers }));
            setStepIndex(Math.min(parsed.stepIndex, totalSteps - 1));
            return;
          }
        } catch {
          // ignore
        }
      }
    }

    const saved = safeGetStorage(storageKey);
    if (saved.blocked) setStorageBlocked(true);
    if (saved.value) {
      try {
        const parsed = JSON.parse(saved.value);
        if (parsed && typeof parsed.stepIndex === "number" && parsed.answers) {
          if (parsed.stepIndex > 0 && parsed.stepIndex < totalSteps) {
            setResumePromptStep(parsed.stepIndex + 1);
          }
          setAnswers((prev) => ({ ...prev, ...parsed.answers }));
        }
      } catch {
        // ignore
      }
    }
  }, [readOnly, singleQuestionMode, ephemeralPreview, storageKey, resumeIdParam, totalSteps, effectiveSettings.offline]);

  // Autosave (EXCLUDING support_needs and support_share_* for privacy B2)
  useEffect(() => {
    onAnswersChange?.(answers);
    if (readOnly || singleQuestionMode || ephemeralPreview || completedState || nextScreenState || !effectiveSettings.offline) return;
    const sanitized = stripSupportFromAnswers(answers);
    const res = safeSetStorage(storageKey, JSON.stringify({ stepIndex, answers: sanitized }));
    if (res.blocked) setStorageBlocked(true);
  }, [answers, stepIndex, readOnly, singleQuestionMode, ephemeralPreview, storageKey, completedState, nextScreenState, onAnswersChange, effectiveSettings.offline]);

  // Jump to selected question from external preview / builder outline
  useEffect(() => {
    if (!jumpToQuestionId) {
      setHiddenRuleNotice(false);
      return;
    }
    const visIdx = visibleQuestions.findIndex((q) => q.id === jumpToQuestionId);
    if (visIdx >= 0) {
      setNextScreenState(null);
      setCompletedState(null);
      setStepIndex(visIdx);
      setHiddenRuleNotice(false);
    } else if (safeTemplate.questions.some((q) => q.id === jumpToQuestionId)) {
      setHiddenRuleNotice(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jumpToQuestionId, visibleQuestions.length]);

  // Keep stepIndex inside bounds if questions or showIf rules change
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
      } else if (msg.type === "partner_verified" && msg.sessionId === partnerSessionId && msg.verifiedAt) {
        setPartnerJoinedLive(true);
        setCompletedState((prev) =>
          prev
            ? {
                ...prev,
                profile: { ...prev.profile, id_route: "partner_verified", verified_at: msg.verifiedAt },
              }
            : prev
        );
      }
    });
    return unsub;
  }, [readOnly, singleQuestionMode, ephemeralPreview, partnerSessionId, announce, t]);

  const currentQuestion: TemplateQuestion | null =
    stepIndex < visibleQuestions.length ? visibleQuestions[stepIndex] : null;
  const isReviewStep = !singleQuestionMode && stepIndex === visibleQuestions.length;

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
          const hasValue = Array.isArray(val) ? val.length > 0 : Boolean(val && String(val).trim() !== "");
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

  // Cleanup media & speech on unmount
  useEffect(() => {
    return () => {
      if (recordTimerRef.current) window.clearInterval(recordTimerRef.current);
      mediaStreamRef.current?.getTracks().forEach((tr) => tr.stop());
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      audioElRef.current?.pause();
    };
  }, []);

  const getFieldDomId = (fieldKey: string) => `${widgetId}-field-${fieldKey}`;

  const updateAnswer = (key: string, val: unknown) => {
    setAnswers((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => prev.filter((e) => e.fieldId !== getFieldDomId(key)));
  };

  // Clear transient step UI on step change
  useEffect(() => {
    setErrors([]);
    setVoiceMessage(null);
    setPendingTranscript(null);
    setPendingChoiceMatch(null);
    setHelpAiAnswer(null);
    setPartnerHelpVisible(false);
    setNoAmharicVoiceNote(false);
    setSimplifiedInfo(null);
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
    audioElRef.current?.pause();
  }, [stepIndex]);

  // Help panel Escape & focus management (B4)
  useEffect(() => {
    if (!helpOpen) return;
    const focusTimer = window.setTimeout(() => {
      if (errors.length > 0 && helpTakeMeRef.current) {
        helpTakeMeRef.current.focus();
      } else if (canSmartHelp && helpInputRef.current) {
        helpInputRef.current.focus();
      } else {
        helpCloseRef.current?.focus();
      }
    }, 20);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setHelpOpen(false);
        helpBtnRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKey);
    };
  }, [helpOpen, errors.length, canSmartHelp]);

  // Alt+H keyboard shortcut ALWAYS works (A2)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === "h" || e.key === "H")) {
        e.preventDefault();
        setHelpOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Read aloud implementation (A5: never speak Amharic with an English voice)
  const speakText = (text: string, targetLang: Lang, audioUrl?: string) => {
    if (speaking) {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      audioElRef.current?.pause();
      setSpeaking(false);
      return;
    }

    // 1. Pre-recorded audio file if provided
    if (audioUrl) {
      try {
        const audio = new Audio(audioUrl);
        audioElRef.current = audio;
        audio.onended = () => setSpeaking(false);
        audio.onerror = () => setSpeaking(false);
        setSpeaking(true);
        audio.play().catch(() => setSpeaking(false));
        return;
      } catch {
        // fall through to speechSynthesis
      }
    }

    if (!("speechSynthesis" in window)) return;
    const voices = window.speechSynthesis.getVoices();
    const hasTargetVoice =
      targetLang === "am"
        ? voices.some((v) => v.lang.toLowerCase().startsWith("am"))
        : voices.length === 0 || voices.some((v) => v.lang.toLowerCase().startsWith("en"));

    if (targetLang === "am" && !hasTargetVoice) {
      // Never speak Amharic text with a non-Amharic voice!
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
  };

  const handleReadCurrentStep = () => {
    if (currentQuestion) {
      const text = `${currentQuestion.label[lang]}. ${currentQuestion.hint?.[lang] ?? ""}`;
      speakText(text, lang, currentQuestion.audio?.[lang]);
    } else {
      speakText(t("widgetReviewTitle"), lang);
    }
  };

  const handleReadEnglishFallback = () => {
    if (currentQuestion) {
      const text = `${currentQuestion.label.en}. ${currentQuestion.hint?.en ?? ""}`;
      speakText(text, "en", currentQuestion.audio?.en);
    } else {
      speakText(t("widgetReviewTitle"), "en");
    }
  };

  const stopVoiceRecording = useCallback(() => {
    if (recordTimerRef.current) {
      window.clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
  }, []);

  const startVoiceRecording = async (
    fieldKey: string,
    questionLabel: string,
    expectedType: string,
    options?: { value: string; label: string }[],
    isMulti?: boolean
  ) => {
    if (!canVoice || readOnly) return;
    setVoiceMessage(null);
    setPendingTranscript(null);
    setPendingChoiceMatch(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setVoiceMessage(t("widgetVoiceNoMic"));
      textInputRef.current?.focus();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const chunks: BlobPart[] = [];

      let recorder: MediaRecorder;
      const opusMime = "audio/webm;codecs=opus";
      if (typeof MediaRecorder.isTypeSupported === "function" && MediaRecorder.isTypeSupported(opusMime)) {
        recorder = new MediaRecorder(stream, { mimeType: opusMime, audioBitsPerSecond: 16000 });
      } else {
        recorder = new MediaRecorder(stream);
      }
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (ev) => {
        if (ev.data.size > 0) chunks.push(ev.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((tr) => tr.stop());
        const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
        if (blob.size > 1_000_000) {
          setVoiceMessage(t("widgetVoiceTooLarge"));
          return;
        }
        setSendingVoice(true);
        try {
          const base64 = await blobToBase64(blob);
          const result = await transcribeVoiceAnswer({
            audioBase64: base64,
            mimeType: blob.type || "audio/webm",
            questionLabel,
            expectedType,
            lang,
            options,
          });
          if (!result.ok || !result.transcript) {
            setVoiceMessage(t("widgetVoiceTimeout"));
            textInputRef.current?.focus();
          } else if (options && options.length > 0) {
            if (result.matchedValue) {
              const matchedOpt = options.find((o) => o.value === result.matchedValue);
              if (matchedOpt) {
                setPendingChoiceMatch({
                  fieldKey,
                  matchedValue: matchedOpt.value,
                  matchedLabel: matchedOpt.label,
                  isMulti,
                });
              } else {
                setVoiceMessage(t("widgetVoiceChoiceNoMatch"));
              }
            } else {
              setVoiceMessage(t("widgetVoiceChoiceNoMatch"));
            }
          } else {
            setPendingTranscript({
              fieldKey,
              transcript: result.transcript,
              value: result.value,
              confidence: result.confidence,
            });
          }
        } catch {
          setVoiceMessage(t("widgetVoiceTimeout"));
          textInputRef.current?.focus();
        } finally {
          setSendingVoice(false);
        }
      };

      recorder.start();
      setRecording(true);
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
      setVoiceMessage(t("widgetVoiceNoMic"));
      textInputRef.current?.focus();
    }
  };

  const validateCurrentStep = (): { fieldId: string; code: string; message: string; fieldLabel: string }[] => {
    if (readOnly) return [];
    const found: { fieldId: string; code: string; message: string; fieldLabel: string }[] = [];

    if (currentQuestion) {
      const fid = getFieldDomId(currentQuestion.id);
      const qLabel = currentQuestion.label[lang];
      const val = answers[currentQuestion.id];
      const strVal = String(val ?? "").trim();
      const rules = currentQuestion.validation;

      if (currentQuestion.type === "info") {
        return [];
      }

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

    if (stepIndex < totalSteps - 1) {
      setStepIndex((i) => i + 1);
      announce(t("widgetStepOf", { current: stepIndex + 2, total: totalSteps }));
    } else {
      await handleComplete();
    }
  };

  const handleSkipQuestion = async () => {
    if (!currentQuestion || currentQuestion.required) return;
    setErrors([]);
    if (stepIndex < totalSteps - 1) {
      setStepIndex((i) => i + 1);
      announce(t("widgetStepOf", { current: stepIndex + 2, total: totalSteps }));
    } else {
      await handleComplete();
    }
  };

  const handleComplete = async () => {
    const { profile, supportShared } = buildCompletedProfile({
      answers,
      template: safeTemplate,
    });
    const token = `mzg_tok_${Math.random().toString(16).slice(2, 10)}`;
    const isActuallyOffline = offline || (typeof navigator !== "undefined" && !navigator.onLine);

    if (!singleQuestionMode && !ephemeralPreview) {
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

    if (isActuallyOffline && !ephemeralPreview) {
      await addOutboxItem({
        id: `outbox_${Date.now()}`,
        createdAt: new Date().toISOString(),
        profile,
        supportShared,
      });
      onOutboxUpdated?.();
    }

    if (!ephemeralPreview) {
      safeRemoveStorage(storageKey);
    }

    const payload = { token, profile, supportShared, queuedOffline: isActuallyOffline };
    if (singleQuestionMode) {
      setCompletedState(payload);
      onComplete?.(payload);
    } else {
      setNextScreenState(payload);
      announce(t("widgetNextScreenTitle"));
    }
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
      buttonNames: [t("widgetBack"), isReviewStep ? t("widgetConfirm") : t("widgetContinue")],
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
      setSimplifiedInfo({ usedAi: false, text: currentQuestion.hint?.[lang] ?? currentQuestion.label[lang] });
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
    setCompletedState(null);
    setNextScreenState(null);
    setStepIndex(0);
    setResumePromptStep(null);
    setDeviceClearedNotice(false);
    setPendingSuggestedSkills([]);
    setShowSkillsFallback(false);
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
    const sanitized = stripSupportFromAnswers({ ...answers, phone: normalizePhoneDigits(candidatePhone) });
    if (!ephemeralPreview) {
      safeSetStorage(`mezgeb_resume_${resumeId}`, JSON.stringify({ stepIndex, answers: sanitized }));
    }
    setSmsGeneratedLink(`${window.location.origin}/demo?resume=${resumeId}`);
  };

  if (!validation.valid && safeTemplate.questions.length === 0) {
    return (
      <div role="alert" className="mezgeb-card p-6 border-red-300 bg-red-50 text-red-900 space-y-2">
        <p className="font-semibold">{t("templatesValidationErrorsTitle")}</p>
        <ul className="list-disc pl-5 text-sm">
          {validation.errors.map((err, i) => (
            <li key={i}>{err}</li>
          ))}
        </ul>
      </div>
    );
  }

  // C6: "What happens next" screen after confirm, before final token/success details
  if (nextScreenState) {
    return (
      <div className="mezgeb-card p-6 md:p-8 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-full bg-[#E4F2EC] text-[#1F5C46] flex items-center justify-center shrink-0">
              <CheckIcon size={22} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[#111111]">{t("widgetNextScreenTitle")}</h2>
              <p className="text-base text-[#6B6B6B] leading-relaxed">{t("widgetNextScreenBody")}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => speakText(`${t("widgetNextScreenTitle")} ${t("widgetNextScreenBody")}`, lang)}
            className="inline-flex items-center gap-1.5 px-3 min-h-[38px] rounded-lg border border-[#E7E7E4] bg-white text-xs font-medium text-[#111111]"
          >
            <VolumeIcon size={15} />
            <span>{speaking ? t("widgetStopReading") : t("widgetReadAloud")}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            const done = nextScreenState;
            setNextScreenState(null);
            setCompletedState(done);
            announce(done.queuedOffline ? t("widgetOfflineQueuedTitle") : t("widgetSuccessTitle"));
            onComplete?.(done);
          }}
          className="mezgeb-btn-primary"
        >
          {t("widgetNextScreenContinue")}
        </button>
      </div>
    );
  }

  if (completedState) {
    return (
      <div className="mezgeb-card p-6 md:p-8 space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-full bg-[#E4F2EC] text-[#1F5C46] flex items-center justify-center shrink-0">
            <CheckIcon size={22} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[#111111]">
              {completedState.queuedOffline ? t("widgetOfflineQueuedTitle") : t("widgetSuccessTitle")}
            </h2>
            <p className="text-[#6B6B6B] text-base leading-relaxed">{t("widgetSuccessBody")}</p>
          </div>
        </div>

        {!completedState.queuedOffline && (
          <div className="p-4 rounded-xl bg-[#F5F5F3] border border-[#E7E7E4] text-sm">
            <p className="text-[#6B6B6B] mb-1">{t("widgetSuccessTokenNote")}</p>
            <code className="font-mono text-[#111111] font-medium">{completedState.token}</code>
          </div>
        )}

        <button type="button" onClick={handleRestart} className="mezgeb-btn-secondary">
          {t("widgetSuccessRestart")}
        </button>
      </div>
    );
  }

  const progressPct = Math.round(((stepIndex + 1) / totalSteps) * 100);
  const currentErrorMap = new Map(errors.map((e) => [e.fieldId, e.message]));

  // Date validation & live equivalent display ONLY when valid complete date is entered (A3, B8)
  const ethBounds = getAllowedYearBounds("eth");
  const gregBounds = getAllowedYearBounds("greg");

  const ethDayNum = Number(String(answers.dob_eth_day ?? "").trim());
  const ethMonthNum = Number(String(answers.dob_eth_month ?? "").trim());
  const ethYearNum = Number(String(answers.dob_eth_year ?? "").trim());
  const gregConverted =
    String(answers.dob_eth_year ?? "").trim().length === 4 &&
    isValidEthiopianDate(ethYearNum, ethMonthNum, ethDayNum)
      ? ethiopianToGregorian({ year: ethYearNum, month: ethMonthNum, day: ethDayNum })
      : null;

  const gregDayNum = Number(String(answers.dob_greg_day ?? "").trim());
  const gregMonthNum = Number(String(answers.dob_greg_month ?? "").trim());
  const gregYearNum = Number(String(answers.dob_greg_year ?? "").trim());
  const ethConverted =
    String(answers.dob_greg_year ?? "").trim().length === 4 &&
    isValidGregorianDate(gregYearNum, gregMonthNum, gregDayNum)
      ? gregorianToEthiopian({ year: gregYearNum, month: gregMonthNum, day: gregDayNum })
      : null;

  const primaryLabel = currentQuestion ? currentQuestion.label[lang] : t("widgetReviewTitle");
  const secondaryLang: Lang = lang === "en" ? "am" : "en";
  const secondaryLabel = currentQuestion ? currentQuestion.label[secondaryLang] : undefined;

  const prewrittenHelp = errors[0]
    ? getPrewrittenHelpForCode(errors[0].code)
    : getPrewrittenHelpForCurrentType();
  const helpTarget = getDefaultTargetField();

  const renderSpeakChoiceButton = (q: TemplateQuestion, isMulti?: boolean) => {
    if (!canVoice || q.allowVoice === false || readOnly || !q.options) return null;
    const opts = q.options.map((o) => ({ value: o.value, label: o.label[lang] }));
    return (
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {!recording ? (
            <button
              type="button"
              disabled={sendingVoice}
              onClick={() => startVoiceRecording(q.id, q.label[lang], q.type, opts, isMulti)}
              className="inline-flex items-center gap-2 px-3.5 min-h-[40px] rounded-lg bg-[#111111] text-white text-xs font-medium"
            >
              <MicIcon size={14} />
              <span>{sendingVoice ? t("widgetSendingVoice") : t("widgetSpeakChoiceBtn")}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={stopVoiceRecording}
              className="inline-flex items-center gap-2 px-3.5 min-h-[40px] rounded-lg bg-[#6A4FC4] text-white text-xs font-medium"
            >
              <span>{t("widgetStopRecording")}</span>
              <span className="font-mono">{t("widgetRecordingStatus", { seconds: recordSeconds })}</span>
            </button>
          )}
          <span className="text-xs text-[#6B6B6B]">{t("cloudAiNotice")}</span>
        </div>

        {pendingChoiceMatch && pendingChoiceMatch.fieldKey === q.id && (
          <div className="p-3 rounded-xl bg-[#EEEBF8] border border-[#8F6FE0] flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-[#111111]">
              {t("widgetVoiceChoiceConfirm", { option: pendingChoiceMatch.matchedLabel })}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (pendingChoiceMatch.isMulti) {
                    const prev = Array.isArray(answers[q.id]) ? (answers[q.id] as string[]) : [];
                    if (!prev.includes(pendingChoiceMatch.matchedValue)) {
                      updateAnswer(q.id, [...prev, pendingChoiceMatch.matchedValue]);
                    }
                  } else {
                    updateAnswer(q.id, pendingChoiceMatch.matchedValue);
                    if (q.id === "language" && (pendingChoiceMatch.matchedValue === "am" || pendingChoiceMatch.matchedValue === "en")) {
                      setLang(pendingChoiceMatch.matchedValue);
                    }
                  }
                  setPendingChoiceMatch(null);
                }}
                className="px-3 min-h-[36px] rounded-lg bg-[#111111] text-white text-xs font-semibold"
              >
                {t("yesButton")}
              </button>
              <button
                type="button"
                onClick={() => setPendingChoiceMatch(null)}
                className="px-3 min-h-[36px] rounded-lg bg-white border border-[#E7E7E4] text-xs font-semibold"
              >
                {t("noButton")}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mezgeb-card p-5 sm:p-7 md:p-8 space-y-6">
      {/* Offline banner */}
      {offline && (
        <div role="status" className="p-3.5 rounded-xl bg-[#F9F3EA] border border-[#E7E7E4] text-sm text-[#111111]">
          {t("widgetOfflineNotice")}
        </div>
      )}

      {/* Partner joined live banner */}
      {partnerJoinedLive && (
        <div role="status" className="p-3.5 rounded-xl bg-[#E4F2EC] text-[#1F5C46] text-sm font-medium">
          {t("widgetPartnerJoinedBanner")}
        </div>
      )}

      {storageBlocked && !offline && (
        <div role="status" className="text-xs text-[#6B6B6B]">
          {t("demoStorageBlockedNote")}
        </div>
      )}

      {/* Resume prompt */}
      {resumePromptStep !== null && !readOnly && !singleQuestionMode && (
        <div className="p-4 rounded-xl bg-[#E4F2EC] text-[#1F5C46] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-sm font-medium">{t("widgetResumeBanner", { step: resumePromptStep })}</p>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setResumePromptStep(null)}
              className="px-3 min-h-[38px] rounded-lg bg-[#1F5C46] text-white text-xs font-semibold"
            >
              {t("widgetResumeBtn", { step: resumePromptStep })}
            </button>
            <button
              type="button"
              onClick={handleRestart}
              className="px-3 min-h-[38px] rounded-lg bg-white text-[#111111] border border-[#E7E7E4] text-xs font-semibold"
            >
              {t("widgetStartFreshBtn")}
            </button>
          </div>
        </div>
      )}

      {/* Conditional rule notice when previewing a hidden question */}
      {hiddenRuleNotice && (
        <div role="status" className="p-3 rounded-xl bg-[#F9F3EA] border border-[#E7E7E4] text-xs font-medium text-[#111111]">
          {t("widgetHiddenByRule")}
        </div>
      )}

      {/* Top progress header — Help button ALWAYS visible (A2) */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-medium text-[#6B6B6B]">
            <span>{effectivePlatformName}</span>
            {!singleQuestionMode && (
              <>
                <span aria-hidden="true">·</span>
                <span>{t("widgetStepOf", { current: stepIndex + 1, total: totalSteps })}</span>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {effectiveSettings.readAloud && (
              <button
                type="button"
                onClick={handleReadCurrentStep}
                className="inline-flex items-center gap-1.5 px-3 min-h-[38px] rounded-lg border border-[#E7E7E4] bg-white text-xs font-medium text-[#111111] hover:bg-[#F5F5F3]"
              >
                <VolumeIcon size={15} />
                <span>{speaking ? t("widgetStopReading") : t("widgetReadAloud")}</span>
              </button>
            )}

            <button
              ref={helpBtnRef}
              type="button"
              onClick={() => setHelpOpen((prev) => !prev)}
              aria-expanded={helpOpen}
              className="inline-flex items-center gap-1.5 px-3 min-h-[38px] rounded-lg border border-[#E7E7E4] bg-white text-xs font-medium text-[#111111] hover:bg-[#F5F5F3]"
            >
              <HelpCircleIcon size={15} />
              <span>{t("widgetHelpBtn")}</span>
            </button>
          </div>
        </div>

        {!singleQuestionMode && (
          <div
            className="w-full h-1.5 bg-[#E7E7E4] rounded-full overflow-hidden"
            role="progressbar"
            aria-label={t("widgetStepOf", { current: stepIndex + 1, total: totalSteps })}
            aria-valuetext={t("widgetStepOf", { current: stepIndex + 1, total: totalSteps })}
            aria-valuenow={stepIndex + 1}
            aria-valuemin={1}
            aria-valuemax={totalSteps}
          >
            <div
              className="h-full transition-all duration-200"
              style={{ width: `${progressPct}%`, backgroundColor: effectiveAccent }}
            />
          </div>
        )}

        {noAmharicVoiceNote && (
          <div className="p-3 rounded-lg bg-[#F5F5F3] flex flex-wrap items-center justify-between gap-2 text-xs text-[#6B6B6B]">
            <span>{t("widgetNoAmharicVoice")}</span>
            <button
              type="button"
              onClick={handleReadEnglishFallback}
              className="px-2.5 min-h-[32px] rounded-md border border-[#E7E7E4] bg-white text-[#111111] font-medium"
            >
              {t("widgetReadEnglishBtn")}
            </button>
          </div>
        )}
      </div>

      {/* Error Summary */}
      {errors.length > 0 && (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          role="alert"
          className="p-4 rounded-xl border border-red-300 bg-red-50 text-red-900 space-y-2 outline-none"
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold">{t("widgetErrorSummaryTitle")}</p>
            <button
              type="button"
              onClick={() => speakText(errors.map((e) => e.message).join(". "), lang)}
              className="inline-flex items-center gap-1 px-2.5 min-h-[32px] rounded-md border border-red-300 bg-white text-xs font-medium text-red-900"
            >
              <VolumeIcon size={13} />
              <span>{t("widgetReadAloud")}</span>
            </button>
          </div>
          <ul className="list-disc pl-5 text-sm space-y-1">
            {errors.map((err, i) => (
              <li key={i}>
                <a
                  href={`#${err.fieldId}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(err.fieldId)?.focus();
                  }}
                  className="underline font-medium"
                >
                  {err.message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Help Drawer — works offline & with AI off (A2, B4) */}
      {helpOpen && (
        <div
          role="region"
          aria-label={t("widgetHelpTitle")}
          className="p-4 rounded-xl bg-[#EEEBF8] border border-[#D8CFF2] space-y-3"
        >
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-[#111111]">{t("widgetHelpTitle")}</h3>
            <button
              ref={helpCloseRef}
              type="button"
              onClick={() => {
                setHelpOpen(false);
                helpBtnRef.current?.focus();
              }}
              className="text-xs font-medium text-[#6A4FC4] underline min-h-[36px] px-2"
            >
              {t("closeButton")}
            </button>
          </div>

          {/* Pre-written offline-safe guidance (always shown immediately) */}
          <div className="p-3.5 rounded-lg bg-white border border-[#E7E7E4] space-y-2.5 text-sm">
            <p className="text-xs font-semibold text-[#6B6B6B]">{t("widgetHelpNoAiFallbackLabel")}</p>
            <p className="text-[#111111] leading-relaxed">{prewrittenHelp}</p>

            <div className="flex flex-wrap items-center gap-2">
              <button
                ref={helpTakeMeRef}
                type="button"
                onClick={() => {
                  const el = document.getElementById(helpTarget.id);
                  if (el) {
                    el.focus();
                    announce(t("widgetHelpMovedAnnouncement", { label: helpTarget.label }));
                  }
                }}
                className="px-3 min-h-[36px] rounded-lg bg-[#111111] text-white text-xs font-medium"
              >
                {t("widgetHelpTakeMeThere")}
              </button>
              <button
                type="button"
                onClick={() => speakText(prewrittenHelp, lang)}
                className="inline-flex items-center gap-1 px-2.5 min-h-[36px] rounded-lg border border-[#E7E7E4] bg-white text-xs font-medium text-[#111111]"
              >
                <VolumeIcon size={13} />
                <span>{t("widgetReadAloud")}</span>
              </button>
              <button
                type="button"
                onClick={() => setPartnerHelpVisible((v) => !v)}
                className="px-3 min-h-[36px] rounded-lg border border-[#E7E7E4] bg-white text-[#111111] text-xs font-medium"
              >
                {t("widgetHelpAskPerson")}
              </button>
            </div>

            {partnerHelpVisible && (
              <p className="text-xs text-[#1F5C46] bg-[#E4F2EC] p-2.5 rounded-lg">
                {t("widgetHelpPartnerMessage")}
              </p>
            )}
          </div>

          {/* Free-form AI question ONLY when AI is on & online */}
          {canSmartHelp ? (
            <div className="space-y-2.5 pt-1">
              <p className="text-xs text-[#6B6B6B]">{t("cloudAiNotice")}</p>
              <form onSubmit={handleSmartHelpSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                  ref={helpInputRef}
                  type="text"
                  value={helpProblem}
                  onChange={(e) => setHelpProblem(e.target.value)}
                  placeholder={t("widgetHelpPlaceholder")}
                  aria-label={t("widgetHelpPlaceholder")}
                  className="flex-1 min-h-[42px] px-3 rounded-lg bg-white border border-[#E7E7E4] text-sm text-[#111111]"
                />
                <button
                  type="submit"
                  disabled={helpLoading}
                  className="mezgeb-btn-primary text-sm whitespace-nowrap"
                >
                  {helpLoading ? t("loadingText") : t("widgetHelpAskBtn")}
                </button>
              </form>

              {helpAiAnswer && (
                <div className="p-3.5 rounded-lg bg-white border border-[#8F6FE0] space-y-2 text-sm">
                  <p className="text-[#111111] leading-relaxed">{helpAiAnswer.explanation}</p>
                  {helpAiAnswer.targetFieldId && (
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById(helpAiAnswer.targetFieldId!);
                        if (el) {
                          el.focus();
                          announce(
                            t("widgetHelpMovedAnnouncement", {
                              label: helpAiAnswer.targetFieldLabel,
                            })
                          );
                        }
                      }}
                      className="px-3 min-h-[34px] rounded-lg bg-[#111111] text-white text-xs font-medium"
                    >
                      {t("widgetHelpTakeMeThere")}
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-[#6B6B6B]">{t("widgetHelpOfflineNote")}</p>
          )}
        </div>
      )}

      {/* Main Step Body */}
      {currentQuestion ? (
        <div className="space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#F5F5F3] text-[#111111] flex items-center justify-center shrink-0 mt-0.5">
                <QuestionIcon name={currentQuestion.icon} size={20} />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl md:text-2xl font-semibold text-[#111111] tracking-tight">
                  {primaryLabel}
                </h2>
                {secondaryLabel && secondaryLabel !== primaryLabel && (
                  <p className="text-sm text-[#6B6B6B]">{secondaryLabel}</p>
                )}
                {currentQuestion.hint?.[lang] && (
                  <p className="text-sm text-[#6B6B6B] pt-1">{currentQuestion.hint[lang]}</p>
                )}
              </div>
            </div>

            {!readOnly && effectiveSettings.sayItSimply && currentQuestion.type !== "info" && (
              <button
                type="button"
                onClick={handleSimplifyQuestion}
                disabled={simplifying}
                className="shrink-0 px-3 min-h-[36px] rounded-lg border border-[#E7E7E4] bg-white text-xs font-medium text-[#6A4FC4] hover:bg-[#EEEBF8]"
              >
                {simplifying ? t("widgetSimplifying") : t("widgetSimplifyBtn")}
              </button>
            )}
          </div>

          {simplifiedInfo && (
            <div className="p-3 rounded-xl bg-[#EEEBF8] border border-[#D8CFF2] text-sm space-y-1">
              <div className="flex items-center justify-between gap-2 text-xs text-[#6A4FC4] font-semibold">
                <span>{t("widgetSimplifiedLabel")}</span>
                {simplifiedInfo.usedAi && <span className="font-normal text-[#6B6B6B]">{t("cloudAiNotice")}</span>}
              </div>
              <p className="text-[#111111] font-medium">{simplifiedInfo.text}</p>
            </div>
          )}

          {/* Voice message for choice or general voice feedback */}
          {voiceMessage && (
            <p
              role="status"
              className="text-xs text-[#111111] bg-[#F5F5F3] px-3 py-2 rounded-lg border border-[#E7E7E4]"
            >
              {voiceMessage}
            </p>
          )}

          {/* VOICE INPUT CONTROLS for text/phone/number/work-story */}
          {canVoice &&
            currentQuestion.allowVoice !== false &&
            !readOnly &&
            (currentQuestion.type === "text" ||
              currentQuestion.type === "phone" ||
              currentQuestion.type === "number" ||
              currentQuestion.type === "work-story") && (
              <div className="p-3.5 rounded-xl bg-[#F5F5F3] border border-[#E7E7E4] space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {!recording ? (
                      <button
                        type="button"
                        onClick={() =>
                          startVoiceRecording(
                            currentQuestion.id,
                            currentQuestion.label[lang],
                            currentQuestion.type
                          )
                        }
                        disabled={sendingVoice}
                        className="inline-flex items-center gap-2 px-3.5 min-h-[40px] rounded-lg bg-[#111111] text-white text-sm font-medium hover:bg-[#2A2A2A] disabled:opacity-50"
                      >
                        <MicIcon size={16} />
                        <span>{sendingVoice ? t("widgetSendingVoice") : t("widgetSpeakBtn")}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={stopVoiceRecording}
                        className="inline-flex items-center gap-2 px-3.5 min-h-[40px] rounded-lg bg-[#6A4FC4] text-white text-sm font-medium"
                      >
                        <span>{t("widgetStopRecording")}</span>
                        <span className="font-mono text-xs">
                          {t("widgetRecordingStatus", { seconds: recordSeconds })}
                        </span>
                      </button>
                    )}
                  </div>
                  <span className="text-xs text-[#6B6B6B]">{t("cloudAiNotice")}</span>
                </div>

                {pendingTranscript && pendingTranscript.fieldKey === currentQuestion.id && (
                  <div className="p-3 rounded-lg bg-white border border-[#8F6FE0] space-y-2.5">
                    <label
                      htmlFor={`${widgetId}-transcript-edit`}
                      className="block text-xs font-semibold text-[#111111]"
                    >
                      {t("widgetTranscriptConfirmTitle")}
                    </label>
                    <input
                      id={`${widgetId}-transcript-edit`}
                      type="text"
                      value={pendingTranscript.value}
                      onChange={(e) =>
                        setPendingTranscript({ ...pendingTranscript, value: e.target.value })
                      }
                      className="w-full min-h-[40px] px-3 rounded-lg border border-[#E7E7E4] text-sm"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          updateAnswer(currentQuestion.id, pendingTranscript.value);
                          setPendingTranscript(null);
                        }}
                        className="px-3 min-h-[36px] rounded-lg bg-[#111111] text-white text-xs font-medium"
                      >
                        {t("widgetTranscriptUse")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setPendingTranscript(null)}
                        className="px-3 min-h-[36px] rounded-lg border border-[#E7E7E4] text-xs font-medium"
                      >
                        {t("widgetTranscriptDiscard")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          {/* TEXT INPUT */}
          {currentQuestion.type === "text" && (
            <div>
              <label htmlFor={getFieldDomId(currentQuestion.id)} className="sr-only">
                {primaryLabel}
              </label>
              <input
                ref={(el) => {
                  textInputRef.current = el;
                }}
                id={getFieldDomId(currentQuestion.id)}
                type="text"
                disabled={readOnly}
                placeholder={currentQuestion.placeholder?.[lang] || ""}
                value={String(answers[currentQuestion.id] ?? "")}
                onChange={(e) => updateAnswer(currentQuestion.id, e.target.value)}
                aria-invalid={currentErrorMap.has(getFieldDomId(currentQuestion.id))}
                aria-describedby={
                  currentErrorMap.has(getFieldDomId(currentQuestion.id))
                    ? `${getFieldDomId(currentQuestion.id)}-err`
                    : undefined
                }
                className="w-full min-h-[46px] px-4 rounded-xl border border-[#E7E7E4] text-base text-[#111111] bg-white"
              />
              {currentErrorMap.has(getFieldDomId(currentQuestion.id)) && (
                <p id={`${getFieldDomId(currentQuestion.id)}-err`} className="mt-2 text-sm text-red-700 font-medium">
                  {currentErrorMap.get(getFieldDomId(currentQuestion.id))}
                </p>
              )}
            </div>
          )}

          {/* EMAIL INPUT */}
          {currentQuestion.type === "email" && (
            <div>
              <label htmlFor={getFieldDomId(currentQuestion.id)} className="sr-only">
                {primaryLabel}
              </label>
              <input
                ref={(el) => {
                  textInputRef.current = el;
                }}
                id={getFieldDomId(currentQuestion.id)}
                type="email"
                disabled={readOnly}
                placeholder={currentQuestion.placeholder?.[lang] || "name@example.com"}
                value={String(answers[currentQuestion.id] ?? "")}
                onChange={(e) => updateAnswer(currentQuestion.id, e.target.value)}
                aria-invalid={currentErrorMap.has(getFieldDomId(currentQuestion.id))}
                aria-describedby={
                  currentErrorMap.has(getFieldDomId(currentQuestion.id))
                    ? `${getFieldDomId(currentQuestion.id)}-err`
                    : undefined
                }
                className="w-full min-h-[46px] px-4 rounded-xl border border-[#E7E7E4] text-base text-[#111111] bg-white"
              />
              {currentErrorMap.has(getFieldDomId(currentQuestion.id)) && (
                <p id={`${getFieldDomId(currentQuestion.id)}-err`} className="mt-2 text-sm text-red-700 font-medium">
                  {currentErrorMap.get(getFieldDomId(currentQuestion.id))}
                </p>
              )}
            </div>
          )}

          {/* NUMBER INPUT */}
          {currentQuestion.type === "number" && (
            <div>
              <label htmlFor={getFieldDomId(currentQuestion.id)} className="sr-only">
                {primaryLabel}
              </label>
              <input
                ref={(el) => {
                  textInputRef.current = el;
                }}
                id={getFieldDomId(currentQuestion.id)}
                type="text"
                inputMode="numeric"
                disabled={readOnly}
                placeholder={currentQuestion.placeholder?.[lang] || ""}
                value={String(answers[currentQuestion.id] ?? "")}
                onChange={(e) => updateAnswer(currentQuestion.id, e.target.value.replace(/[^\d.-]/g, ""))}
                aria-invalid={currentErrorMap.has(getFieldDomId(currentQuestion.id))}
                aria-describedby={
                  currentErrorMap.has(getFieldDomId(currentQuestion.id))
                    ? `${getFieldDomId(currentQuestion.id)}-err`
                    : undefined
                }
                className="w-full min-h-[46px] px-4 rounded-xl border border-[#E7E7E4] text-base font-mono text-[#111111] bg-white"
              />
              {currentErrorMap.has(getFieldDomId(currentQuestion.id)) && (
                <p id={`${getFieldDomId(currentQuestion.id)}-err`} className="mt-2 text-sm text-red-700 font-medium">
                  {currentErrorMap.get(getFieldDomId(currentQuestion.id))}
                </p>
              )}
            </div>
          )}

          {/* YES / NO INPUT */}
          {currentQuestion.type === "yes-no" && (
            <div className="space-y-3">
              {renderSpeakChoiceButton(
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
              <div id={getFieldDomId(currentQuestion.id)} className="grid grid-cols-2 gap-3">
                {[
                  {
                    value: "yes",
                    label: currentQuestion.options?.[0]?.label[lang] || t("yesButton"),
                  },
                  {
                    value: "no",
                    label: currentQuestion.options?.[1]?.label[lang] || t("noButton"),
                  },
                ].map((opt) => {
                  const selected = answers[currentQuestion.id] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      disabled={readOnly}
                      aria-pressed={selected}
                      onClick={() => updateAnswer(currentQuestion.id, opt.value)}
                      style={selected ? { borderColor: effectiveAccent } : undefined}
                      className={`min-h-[54px] px-4 rounded-xl border text-base font-semibold flex items-center justify-center gap-2 transition-colors ${
                        selected
                          ? "bg-[#EEEBF8] text-[#111111]"
                          : "bg-white border-[#E7E7E4] text-[#111111] hover:bg-[#F5F5F3]"
                      }`}
                    >
                      {selected && <CheckIcon size={16} />}
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
              {currentErrorMap.has(getFieldDomId(currentQuestion.id)) && (
                <p className="mt-2 text-sm text-red-700 font-medium">
                  {currentErrorMap.get(getFieldDomId(currentQuestion.id))}
                </p>
              )}
            </div>
          )}

          {/* INFO SCREEN */}
          {currentQuestion.type === "info" && (
            <div className="p-4 rounded-xl bg-[#F5F5F3] border border-[#E7E7E4] text-sm text-[#111111] leading-relaxed">
              {currentQuestion.hint?.[lang] || currentQuestion.label[lang]}
            </div>
          )}

          {/* CONSENT STEP */}
          {currentQuestion.type === "consent" && (
            <div>
              <label className="flex items-start gap-3 p-4 rounded-xl bg-[#F5F5F3] border border-[#E7E7E4] cursor-pointer">
                <input
                  id={getFieldDomId(currentQuestion.id)}
                  type="checkbox"
                  disabled={readOnly}
                  checked={Boolean(answers[currentQuestion.id])}
                  onChange={(e) => updateAnswer(currentQuestion.id, e.target.checked)}
                  style={{ accentColor: effectiveAccent }}
                  className="mt-1 w-5 h-5"
                />
                <span className="text-sm text-[#111111] font-medium">
                  {currentQuestion.label[lang]}
                </span>
              </label>
              {currentErrorMap.has(getFieldDomId(currentQuestion.id)) && (
                <p className="mt-2 text-sm text-red-700 font-medium">
                  {currentErrorMap.get(getFieldDomId(currentQuestion.id))}
                </p>
              )}
            </div>
          )}

          {/* PHONE INPUT */}
          {currentQuestion.type === "phone" && (
            <div>
              <label htmlFor={getFieldDomId(currentQuestion.id)} className="sr-only">
                {primaryLabel}
              </label>
              <input
                ref={(el) => {
                  textInputRef.current = el;
                }}
                id={getFieldDomId(currentQuestion.id)}
                type="tel"
                inputMode="numeric"
                disabled={readOnly}
                placeholder={currentQuestion.placeholder?.[lang] || "091 234 5678"}
                value={formatPhoneGrouped(String(answers[currentQuestion.id] ?? ""))}
                onChange={(e) => updateAnswer(currentQuestion.id, normalizePhoneDigits(e.target.value))}
                aria-invalid={currentErrorMap.has(getFieldDomId(currentQuestion.id))}
                aria-describedby={
                  currentErrorMap.has(getFieldDomId(currentQuestion.id))
                    ? `${getFieldDomId(currentQuestion.id)}-err`
                    : undefined
                }
                className="w-full min-h-[46px] px-4 rounded-xl border border-[#E7E7E4] text-base font-mono tracking-wide text-[#111111] bg-white"
              />
              {currentErrorMap.has(getFieldDomId(currentQuestion.id)) && (
                <p id={`${getFieldDomId(currentQuestion.id)}-err`} className="mt-2 text-sm text-red-700 font-medium">
                  {currentErrorMap.get(getFieldDomId(currentQuestion.id))}
                </p>
              )}
            </div>
          )}

          {/* DATE OF BIRTH (ETHIOPIAN / GREGORIAN — A3 empty defaults, B8 text+numeric & real month lengths) */}
          {currentQuestion.type === "date" && (
            <div className="space-y-4">
              <div
                className="inline-flex rounded-lg border border-[#E7E7E4] bg-[#F5F5F3] p-0.5"
                role="group"
                aria-label={t("widgetCalGroupLabel")}
              >
                <button
                  type="button"
                  onClick={() => updateAnswer("dob_calendar", "eth")}
                  aria-pressed={answers.dob_calendar !== "greg"}
                  className={`px-3.5 min-h-[38px] rounded-md text-xs font-semibold ${
                    answers.dob_calendar !== "greg" ? "bg-white text-[#111111] shadow-xs" : "text-[#6B6B6B]"
                  }`}
                >
                  {t("widgetCalEth")}
                </button>
                <button
                  type="button"
                  onClick={() => updateAnswer("dob_calendar", "greg")}
                  aria-pressed={answers.dob_calendar === "greg"}
                  className={`px-3.5 min-h-[38px] rounded-md text-xs font-semibold ${
                    answers.dob_calendar === "greg" ? "bg-white text-[#111111] shadow-xs" : "text-[#6B6B6B]"
                  }`}
                >
                  {t("widgetCalGreg")}
                </button>
              </div>

              {answers.dob_calendar !== "greg" ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label htmlFor={getFieldDomId("dob_eth_day")} className="block text-xs font-medium text-[#6B6B6B] mb-1">
                        {t("widgetCalDay")}
                      </label>
                      <input
                        id={getFieldDomId("dob_eth_day")}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={2}
                        disabled={readOnly}
                        placeholder="DD"
                        value={String(answers.dob_eth_day ?? "")}
                        onChange={(e) => updateAnswer("dob_eth_day", e.target.value.replace(/\D/g, "").slice(0, 2))}
                        className="w-full min-h-[44px] px-3 rounded-xl border border-[#E7E7E4] text-base"
                      />
                    </div>
                    <div>
                      <label htmlFor={getFieldDomId("dob_eth_month")} className="block text-xs font-medium text-[#6B6B6B] mb-1">
                        {t("widgetCalMonth")}
                      </label>
                      <select
                        id={getFieldDomId("dob_eth_month")}
                        disabled={readOnly}
                        value={String(answers.dob_eth_month ?? "")}
                        onChange={(e) => updateAnswer("dob_eth_month", e.target.value)}
                        className="w-full min-h-[44px] px-3 rounded-xl border border-[#E7E7E4] bg-white text-base"
                      >
                        <option value="">{t("widgetCalChooseMonth")}</option>
                        {ETHIOPIAN_MONTHS.map((m) => (
                          <option key={m.num} value={String(m.num)}>
                            {lang === "am" ? m.am : m.en}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor={getFieldDomId("dob_eth_year")} className="block text-xs font-medium text-[#6B6B6B] mb-1">
                        {t("widgetCalYear")}
                      </label>
                      <input
                        id={getFieldDomId("dob_eth_year")}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={4}
                        disabled={readOnly}
                        placeholder={`${ethBounds.min}–${ethBounds.max}`}
                        value={String(answers.dob_eth_year ?? "")}
                        onChange={(e) => updateAnswer("dob_eth_year", e.target.value.replace(/\D/g, "").slice(0, 4))}
                        aria-invalid={currentErrorMap.has(getFieldDomId("dob_eth_year"))}
                        className="w-full min-h-[44px] px-3 rounded-xl border border-[#E7E7E4] text-base"
                      />
                    </div>
                  </div>
                  {gregConverted && (
                    <p className="text-sm text-[#6B6B6B]">
                      {t("widgetCalConvertedGreg")}{" "}
                      <span className="font-medium text-[#111111]">
                        {formatGregorianDate(gregConverted)}
                      </span>
                    </p>
                  )}
                  {currentErrorMap.has(getFieldDomId("dob_eth_year")) && (
                    <p className="text-sm text-red-700 font-medium">
                      {currentErrorMap.get(getFieldDomId("dob_eth_year"))}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label htmlFor={getFieldDomId("dob_greg_day")} className="block text-xs font-medium text-[#6B6B6B] mb-1">
                        {t("widgetCalDay")}
                      </label>
                      <input
                        id={getFieldDomId("dob_greg_day")}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={2}
                        disabled={readOnly}
                        placeholder="DD"
                        value={String(answers.dob_greg_day ?? "")}
                        onChange={(e) => updateAnswer("dob_greg_day", e.target.value.replace(/\D/g, "").slice(0, 2))}
                        className="w-full min-h-[44px] px-3 rounded-xl border border-[#E7E7E4] text-base"
                      />
                    </div>
                    <div>
                      <label htmlFor={getFieldDomId("dob_greg_month")} className="block text-xs font-medium text-[#6B6B6B] mb-1">
                        {t("widgetCalMonth")}
                      </label>
                      <select
                        id={getFieldDomId("dob_greg_month")}
                        disabled={readOnly}
                        value={String(answers.dob_greg_month ?? "")}
                        onChange={(e) => updateAnswer("dob_greg_month", e.target.value)}
                        className="w-full min-h-[44px] px-3 rounded-xl border border-[#E7E7E4] bg-white text-base"
                      >
                        <option value="">{t("widgetCalChooseMonth")}</option>
                        {GREGORIAN_MONTHS_EN.map((m, idx) => (
                          <option key={m} value={String(idx + 1)}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor={getFieldDomId("dob_greg_year")} className="block text-xs font-medium text-[#6B6B6B] mb-1">
                        {t("widgetCalYear")}
                      </label>
                      <input
                        id={getFieldDomId("dob_greg_year")}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={4}
                        disabled={readOnly}
                        placeholder={`${gregBounds.min}–${gregBounds.max}`}
                        value={String(answers.dob_greg_year ?? "")}
                        onChange={(e) => updateAnswer("dob_greg_year", e.target.value.replace(/\D/g, "").slice(0, 4))}
                        aria-invalid={currentErrorMap.has(getFieldDomId("dob_greg_year"))}
                        className="w-full min-h-[44px] px-3 rounded-xl border border-[#E7E7E4] text-base"
                      />
                    </div>
                  </div>
                  {ethConverted && (
                    <p className="text-sm text-[#6B6B6B]">
                      {t("widgetCalConvertedEth")}{" "}
                      <span className="font-medium text-[#111111]">
                        {formatEthiopianDate(ethConverted, lang)}
                      </span>
                    </p>
                  )}
                  {currentErrorMap.has(getFieldDomId("dob_greg_year")) && (
                    <p className="text-sm text-red-700 font-medium">
                      {currentErrorMap.get(getFieldDomId("dob_greg_year"))}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* SINGLE CHOICE (with voice option matching B5) */}
          {currentQuestion.type === "choice" && currentQuestion.options && (
            <div className="space-y-3">
              {renderSpeakChoiceButton(currentQuestion, false)}
              <fieldset>
                <legend className="sr-only">{primaryLabel}</legend>
                <div
                  id={getFieldDomId(currentQuestion.id)}
                  className={`grid gap-2.5 ${
                    currentQuestion.options.length > 4 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
                  }`}
                >
                  {currentQuestion.options.map((opt) => {
                    const selected = answers[currentQuestion.id] === opt.value;
                    return (
                      <label
                        key={opt.value}
                        style={selected ? { borderColor: effectiveAccent } : undefined}
                        className={`flex items-center justify-between gap-3 p-3.5 rounded-xl border cursor-pointer min-h-[48px] transition-colors ${
                          selected
                            ? "bg-[#EEEBF8] text-[#111111]"
                            : "border-[#E7E7E4] bg-white hover:bg-[#F5F5F3]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name={`${widgetId}-${currentQuestion.id}`}
                            value={opt.value}
                            checked={selected}
                            disabled={readOnly}
                            onChange={() => {
                              updateAnswer(currentQuestion.id, opt.value);
                              if (currentQuestion.id === "language" && (opt.value === "am" || opt.value === "en")) {
                                setLang(opt.value);
                              }
                            }}
                            style={{ accentColor: effectiveAccent }}
                            className="w-4 h-4"
                          />
                          <span className="text-base font-medium">{opt.label[lang]}</span>
                        </div>
                        {selected && <CheckIcon size={16} className="shrink-0" />}
                      </label>
                    );
                  })}
                </div>
                {currentErrorMap.has(getFieldDomId(currentQuestion.id)) && (
                  <p className="mt-2 text-sm text-red-700 font-medium">
                    {currentErrorMap.get(getFieldDomId(currentQuestion.id))}
                  </p>
                )}
              </fieldset>
            </div>
          )}

          {/* MULTICHOICE (with voice option matching B5) */}
          {currentQuestion.type === "multichoice" && currentQuestion.options && (
            <div className="space-y-3">
              {renderSpeakChoiceButton(currentQuestion, true)}
              <fieldset>
                <legend className="sr-only">{primaryLabel}</legend>
                <div className="flex flex-wrap gap-2.5" id={getFieldDomId(currentQuestion.id)}>
                  {currentQuestion.options.map((opt) => {
                    const list = Array.isArray(answers[currentQuestion.id])
                      ? (answers[currentQuestion.id] as string[])
                      : [];
                    const selected = list.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        disabled={readOnly}
                        aria-pressed={selected}
                        onClick={() => {
                          const next = selected
                            ? list.filter((x) => x !== opt.value)
                            : [...list, opt.value];
                          updateAnswer(currentQuestion.id, next);
                        }}
                        style={selected ? { borderColor: effectiveAccent } : undefined}
                        className={`px-4 min-h-[44px] rounded-xl border text-sm font-medium inline-flex items-center gap-2 transition-colors ${
                          selected
                            ? "bg-[#EEEBF8] text-[#111111]"
                            : "bg-white border-[#E7E7E4] text-[#111111] hover:bg-[#F5F5F3]"
                        }`}
                      >
                        {selected && <CheckIcon size={15} />}
                        <span>{opt.label[lang]}</span>
                      </button>
                    );
                  })}
                </div>
                {currentErrorMap.has(getFieldDomId(currentQuestion.id)) && (
                  <p className="mt-2 text-sm text-red-700 font-medium">
                    {currentErrorMap.get(getFieldDomId(currentQuestion.id))}
                  </p>
                )}
              </fieldset>
            </div>
          )}

          {/* ID ROUTES (respects safeTemplate.idRoutes B3 and effectiveSettings.partnerReferral, voice option matching B5) */}
          {currentQuestion.type === "id-routes" && (() => {
            const allowedRoutes = safeTemplate.idRoutes.filter(
              (r) => effectiveSettings.partnerReferral || r !== "partner_refer"
            );
            return (
            <div className="space-y-4">
              {renderSpeakChoiceButton(
                {
                  ...currentQuestion,
                  options: (
                    [
                      { value: "fayda", label: { en: translations.en.heroOptFayda, am: translations.am.heroOptFayda } },
                      { value: "refugee_id", label: { en: translations.en.heroOptRefugee, am: translations.am.heroOptRefugee } },
                      { value: "other_document", label: { en: translations.en.heroOptOther, am: translations.am.heroOptOther } },
                      { value: "partner_refer", label: { en: translations.en.heroOptPartner, am: translations.am.heroOptPartner } },
                    ] as { value: IdRoute; label: { en: string; am: string } }[]
                  ).filter((o) => allowedRoutes.includes(o.value)),
                },
                false
              )}

              <fieldset>
                <legend className="sr-only">{primaryLabel}</legend>
                <div id={getFieldDomId(currentQuestion.id)} className="grid grid-cols-1 gap-2.5">
                  {(
                    [
                      { value: "fayda", label: t("heroOptFayda") },
                      { value: "refugee_id", label: t("heroOptRefugee") },
                      { value: "other_document", label: t("heroOptOther") },
                      { value: "partner_refer", label: t("heroOptPartner") },
                    ] as { value: IdRoute; label: string }[]
                  )
                    .filter((opt) => allowedRoutes.includes(opt.value))
                    .map((opt) => {
                      const selected = answers.id_route === opt.value;
                      return (
                        <label
                          key={opt.value}
                          style={selected ? { borderColor: effectiveAccent } : undefined}
                          className={`flex items-center justify-between gap-3 p-3.5 rounded-xl border cursor-pointer min-h-[48px] ${
                            selected
                              ? "bg-[#EEEBF8]"
                              : "border-[#E7E7E4] bg-white hover:bg-[#F5F5F3]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name={`${widgetId}-id_route`}
                              value={opt.value}
                              checked={selected}
                              disabled={readOnly}
                              onChange={() => updateAnswer("id_route", opt.value)}
                              style={{ accentColor: effectiveAccent }}
                              className="w-4 h-4"
                            />
                            <span className="text-base font-medium">{opt.label}</span>
                          </div>
                        </label>
                      );
                    })}
                </div>
              </fieldset>

              {answers.id_route === "partner_refer" && (
                <div className="p-4 rounded-xl bg-[#F5F5F3] border border-[#E7E7E4] space-y-4">
                  <div>
                    <label
                      htmlFor={getFieldDomId("partner_org")}
                      className="block text-sm font-medium text-[#111111] mb-1.5"
                    >
                      {t("widgetPartnerSelectLabel")}
                    </label>
                    <select
                      id={getFieldDomId("partner_org")}
                      disabled={readOnly}
                      value={String(answers.partner_org ?? "")}
                      onChange={(e) => updateAnswer("partner_org", e.target.value)}
                      className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#E7E7E4] bg-white text-sm"
                    >
                      <option value="">—</option>
                      <option value="addis_accessibility">{t("widgetPartner1")}</option>
                      <option value="refugee_support_desk">{t("widgetPartner2")}</option>
                      <option value="community_tvet">{t("widgetPartner3")}</option>
                    </select>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      id={getFieldDomId("partner_consent")}
                      type="checkbox"
                      disabled={readOnly}
                      checked={Boolean(answers.partner_consent)}
                      onChange={(e) => updateAnswer("partner_consent", e.target.checked)}
                      className="mt-1 w-4 h-4 accent-[#6A4FC4]"
                    />
                    <span className="text-sm text-[#111111]">{t("widgetPartnerConsent")}</span>
                  </label>

                  <div className="p-3 rounded-lg bg-[#E4F2EC] text-[#1F5C46] text-sm font-medium">
                    {t("widgetPartnerNotice")}
                  </div>
                </div>
              )}

              {currentErrorMap.has(getFieldDomId(currentQuestion.id)) && (
                <p className="text-sm text-red-700 font-medium">
                  {currentErrorMap.get(getFieldDomId(currentQuestion.id))}
                </p>
              )}
              {currentErrorMap.has(getFieldDomId("partner_consent")) && (
                <p className="text-sm text-red-700 font-medium">
                  {currentErrorMap.get(getFieldDomId("partner_consent"))}
                </p>
              )}
            </div>
            );
          })()}

          {/* SUPPORT NEEDS (PRIVATE BY DEFAULT — B2 default OFF, never in localStorage) */}
          {currentQuestion.type === "support" && (
            <div className="space-y-5">
              {renderSpeakChoiceButton(
                { ...currentQuestion, id: "support_needs" },
                true
              )}

              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#1F5C46] bg-[#E4F2EC] px-3 py-2 rounded-lg w-fit">
                <LockIcon size={14} />
                <span>{t("widgetSupportNoDiagnosis")}</span>
              </div>

              <div className="flex flex-wrap gap-2.5" id={getFieldDomId(currentQuestion.id)}>
                {(currentQuestion.options ?? []).map((opt) => {
                  const list = Array.isArray(answers.support_needs) ? answers.support_needs : [];
                  const selected = list.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      disabled={readOnly}
                      aria-pressed={selected}
                      onClick={() => {
                        const next = selected
                          ? list.filter((x) => x !== opt.value)
                          : [...list, opt.value];
                        updateAnswer("support_needs", next);
                      }}
                      className={`px-4 min-h-[44px] rounded-xl border text-sm font-medium inline-flex items-center gap-2 transition-colors ${
                        selected
                          ? "bg-[#EEEBF8] border-[#8F6FE0] text-[#111111]"
                          : "bg-white border-[#E7E7E4] text-[#111111] hover:bg-[#F5F5F3]"
                      }`}
                    >
                      {selected && <CheckIcon size={15} className="text-[#6A4FC4]" />}
                      <span>{opt.label[lang]}</span>
                    </button>
                  );
                })}
              </div>

              <div className="p-4 rounded-xl bg-[#F5F5F3] border border-[#E7E7E4] space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#111111]">
                  <ShieldIcon size={16} />
                  <span>{t("widgetSupportPrivacyTitle")}</span>
                </div>
                <p className="text-xs text-[#6B6B6B]">{t("widgetSupportNothingShared")}</p>

                <label className="flex items-center justify-between gap-3 py-1.5 cursor-pointer">
                  <span className="text-sm text-[#111111]">{t("widgetSupportSharePlatform")}</span>
                  <input
                    type="checkbox"
                    disabled={readOnly}
                    checked={Boolean(answers.support_share_platform)}
                    onChange={(e) => updateAnswer("support_share_platform", e.target.checked)}
                    className="w-5 h-5 accent-[#6A4FC4]"
                  />
                </label>

                <label className="flex items-center justify-between gap-3 py-1.5 cursor-pointer">
                  <span className="text-sm text-[#111111]">{t("widgetSupportShareEmployers")}</span>
                  <input
                    type="checkbox"
                    disabled={readOnly}
                    checked={Boolean(answers.support_share_employers)}
                    onChange={(e) => updateAnswer("support_share_employers", e.target.checked)}
                    className="w-5 h-5 accent-[#6A4FC4]"
                  />
                </label>

                <label className="flex items-center justify-between gap-3 py-1.5 cursor-pointer">
                  <span className="text-sm text-[#111111]">{t("widgetSupportSharePartner")}</span>
                  <input
                    type="checkbox"
                    disabled={readOnly}
                    checked={Boolean(answers.support_share_partner)}
                    onChange={(e) => updateAnswer("support_share_partner", e.target.checked)}
                    className="w-5 h-5 accent-[#6A4FC4]"
                  />
                </label>

                <p className="text-xs text-[#6B6B6B] pt-1 border-t border-[#E7E7E4]">
                  {t("widgetSupportSessionNote")}
                </p>
              </div>
            </div>
          )}

          {/* WORK STORY & SKILLS (A6: fallback never invents skills; AI suggestions require Keep) */}
          {currentQuestion.type === "work-story" && (
            <div className="space-y-4">
              <div>
                <label htmlFor={getFieldDomId(currentQuestion.id)} className="sr-only">
                  {primaryLabel}
                </label>
                <textarea
                  ref={(el) => {
                    textInputRef.current = el;
                  }}
                  id={getFieldDomId(currentQuestion.id)}
                  rows={4}
                  disabled={readOnly}
                  value={String(answers.work_story ?? "")}
                  onChange={(e) => updateAnswer("work_story", e.target.value)}
                  className="w-full p-4 rounded-xl border border-[#E7E7E4] text-base text-[#111111] bg-white"
                />
              </div>

              {canSkillsAi && !readOnly && (
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={handleExtractSkills}
                    disabled={extractingSkills || !String(answers.work_story ?? "").trim()}
                    className="mezgeb-btn-secondary text-sm"
                  >
                    {extractingSkills ? t("widgetSkillsExtracting") : t("widgetSkillsExtractBtn")}
                  </button>
                  <span className="text-xs text-[#6B6B6B]">{t("cloudAiNotice")}</span>
                </div>
              )}

              {/* Pending AI suggestions requiring explicit Keep */}
              {pendingSuggestedSkills.length > 0 && (
                <div className="p-4 rounded-xl bg-[#EEEBF8] border border-[#D8CFF2] space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-[#111111]">{t("widgetSkillsSuggestedTitle")}</p>
                    <button
                      type="button"
                      onClick={() => {
                        const current = Array.isArray(answers.skills) ? answers.skills : [];
                        const merged = Array.from(
                          new Set([...current, ...pendingSuggestedSkills.map((s) => s.name)])
                        );
                        updateAnswer("skills", merged);
                        setPendingSuggestedSkills([]);
                      }}
                      className="px-3 min-h-[32px] rounded-lg bg-[#111111] text-white text-xs font-semibold"
                    >
                      {t("widgetSkillsKeepAllBtn")}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {pendingSuggestedSkills.map((s, idx) => (
                      <div
                        key={idx}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#8F6FE0] text-xs"
                      >
                        <span className="font-medium text-[#111111]">{s.name}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const current = Array.isArray(answers.skills) ? answers.skills : [];
                            if (!current.includes(s.name)) {
                              updateAnswer("skills", [...current, s.name]);
                            }
                            setPendingSuggestedSkills((prev) => prev.filter((_, i) => i !== idx));
                          }}
                          className="px-2 py-0.5 rounded bg-[#1F5C46] text-white font-semibold"
                        >
                          {t("widgetSkillsKeepBtn")}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Unselected checklist when AI is off, offline, or failed */}
              {(!canSkillsAi || showSkillsFallback) && (
                <div className="p-4 rounded-xl bg-[#F5F5F3] border border-[#E7E7E4] space-y-2.5">
                  <p className="text-xs font-semibold text-[#6B6B6B]">{t("widgetSkillsFallbackTitle")}</p>
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
                            const next = active ? list.filter((s) => s !== skill) : [...list, skill];
                            updateAnswer("skills", next);
                          }}
                          className={`px-3 min-h-[38px] rounded-full border text-xs font-medium ${
                            active
                              ? "bg-[#EEEBF8] border-[#8F6FE0] text-[#111111]"
                              : "bg-white border-[#E7E7E4] text-[#111111]"
                          }`}
                        >
                          {active ? `✓ ${skill}` : `+ ${skill}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Saved skills on profile */}
              {Array.isArray(answers.skills) && answers.skills.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-[#6B6B6B]">{t("widgetSkillsSavedTitle")}</p>
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
                        className="px-3 min-h-[36px] rounded-full bg-[#EEEBF8] border border-[#8F6FE0] text-xs font-medium text-[#111111] inline-flex items-center gap-1.5"
                        aria-label={t("widgetSkillsRemoveLabel", { skill })}
                      >
                        <span>{skill}</span>
                        <span aria-hidden="true">×</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!readOnly && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customSkillInput}
                    onChange={(e) => setCustomSkillInput(e.target.value)}
                    placeholder={t("widgetSkillsAddPlaceholder")}
                    aria-label={t("widgetSkillsAddPlaceholder")}
                    className="flex-1 min-h-[42px] px-3.5 rounded-lg border border-[#E7E7E4] text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const trimmed = customSkillInput.trim();
                      if (!trimmed) return;
                      const list = Array.isArray(answers.skills) ? answers.skills : [];
                      if (!list.includes(trimmed)) {
                        updateAnswer("skills", [...list, trimmed]);
                      }
                      setCustomSkillInput("");
                    }}
                    className="mezgeb-btn-secondary text-sm"
                  >
                    {t("widgetSkillsAddBtn")}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* REVIEW AND CONFIRM STEP */
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl md:text-2xl font-semibold text-[#111111]">{t("widgetReviewTitle")}</h2>
            {!readOnly && !ephemeralPreview && (
              <button
                type="button"
                onClick={() => {
                  safeRemoveStorage(storageKey);
                  setDeviceClearedNotice(true);
                  announce(t("widgetDeviceClearedNotice"));
                }}
                className="text-xs font-medium text-red-700 underline min-h-[36px] px-2"
              >
                {t("widgetClearDeviceBtn")}
              </button>
            )}
          </div>

          {deviceClearedNotice && (
            <p role="status" className="text-xs text-[#1F5C46] bg-[#E4F2EC] p-2.5 rounded-lg">
              {t("widgetDeviceClearedNotice")}
            </p>
          )}

          <dl className="divide-y divide-[#E7E7E4] border-t border-b border-[#E7E7E4]">
            {visibleQuestions
              .filter((q) => q.type !== "info")
              .map((q) => {
                const idx = visibleQuestions.findIndex((vq) => vq.id === q.id);
                let displayVal = "—";
                if (q.type === "date") {
                  if (answers.dob_calendar === "greg" && ethConverted) {
                    displayVal = formatGregorianDate({
                      year: gregYearNum,
                      month: gregMonthNum,
                      day: gregDayNum,
                    });
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
                  if (answers[q.id] === "yes") displayVal = q.options?.[0]?.label[lang] || t("yesButton");
                  else if (answers[q.id] === "no") displayVal = q.options?.[1]?.label[lang] || t("noButton");
                } else if (q.type === "consent") {
                  displayVal = answers[q.id] ? t("yesButton") : t("noButton");
                } else if (q.type === "phone") {
                  displayVal = answers[q.id] ? formatPhoneGrouped(String(answers[q.id])) : "—";
                } else if (q.type === "id-routes") {
                  displayVal = answers.id_route
                    ? answers.id_route === "partner_refer"
                      ? `${t("heroOptPartner")} (partner_pending)`
                      : String(answers.id_route)
                    : "—";
                } else if (q.type === "support") {
                  const list = Array.isArray(answers.support_needs) ? answers.support_needs : [];
                  displayVal = list.length > 0 ? list.join(", ") : "—";
                } else if (q.type === "work-story") {
                  const list = Array.isArray(answers.skills) ? answers.skills : [];
                  displayVal = list.length > 0 ? list.join(", ") : String(answers.work_story || "—");
                } else if (Array.isArray(answers[q.id])) {
                  displayVal = (answers[q.id] as string[]).join(", ") || "—";
                } else if (answers[q.id]) {
                  displayVal = String(answers[q.id]);
                }

                return (
                  <div key={q.id} className="py-3.5 grid grid-cols-[1fr_auto] gap-x-4 items-start">
                    <dt className="col-start-1 text-xs font-medium text-[#6B6B6B]">{q.label[lang]}</dt>
                    <dd className="col-start-1 text-sm font-medium text-[#111111] mt-0.5">{displayVal}</dd>
                    <dd className="col-start-2 row-start-1 row-span-2 self-start">
                      <button
                        type="button"
                        onClick={() => setStepIndex(idx)}
                        className="text-xs font-semibold text-[#6A4FC4] underline min-h-[36px] px-2"
                      >
                        {t("widgetChange")}
                      </button>
                    </dd>
                  </div>
                );
              })}
          </dl>

          <label className="flex items-start gap-3 p-4 rounded-xl bg-[#F5F5F3] border border-[#E7E7E4] cursor-pointer">
            <input
              id={getFieldDomId("consent_accepted")}
              type="checkbox"
              disabled={readOnly}
              checked={Boolean(answers.consent_accepted)}
              onChange={(e) => updateAnswer("consent_accepted", e.target.checked)}
              style={{ accentColor: effectiveAccent }}
              className="mt-1 w-4 h-4"
            />
            <span className="text-sm text-[#111111] font-medium">{safeTemplate.consent[lang]}</span>
          </label>

          {currentErrorMap.has(getFieldDomId("consent_accepted")) && (
            <p className="text-sm text-red-700 font-medium">
              {currentErrorMap.get(getFieldDomId("consent_accepted"))}
            </p>
          )}
        </div>
      )}

      {/* Navigation Footer */}
      <div className="pt-4 border-t border-[#E7E7E4] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {!singleQuestionMode && stepIndex > 0 && (
            <button
              type="button"
              onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
              className="mezgeb-btn-secondary"
            >
              {t("widgetBack")}
            </button>
          )}

          {!readOnly && !singleQuestionMode && effectiveSettings.smsResume && (
            <button
              type="button"
              onClick={() => {
                setSmsPhone(String(answers.phone ?? ""));
                setSmsPhoneError("");
                setSmsGeneratedLink(null);
                setSmsOpen((v) => !v);
              }}
              className="text-xs font-medium text-[#6B6B6B] hover:text-[#111111] underline min-h-[40px] px-2"
            >
              {t("widgetFinishLaterSms")}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5 ml-auto">
          {currentQuestion && !currentQuestion.required && currentQuestion.skippable && currentQuestion.type !== "info" && (
            <button
              type="button"
              onClick={handleSkipQuestion}
              className="mezgeb-btn-secondary"
            >
              {t("widgetSkipQuestion")}
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            className="mezgeb-btn-primary"
            style={{ backgroundColor: effectiveAccent }}
          >
            {singleQuestionMode ? t("saveButton") : isReviewStep ? t("widgetConfirm") : t("widgetContinue")}
          </button>
        </div>
      </div>

      {/* Finish later by SMS panel (B11) */}
      {smsOpen && (
        <div className="p-4 rounded-xl bg-[#F5F5F3] border border-[#E7E7E4] space-y-3">
          <p className="text-sm font-semibold text-[#111111]">{t("widgetSmsModalTitle")}</p>
          <form onSubmit={handleSendSmsLink} className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <label htmlFor={`${widgetId}-sms-phone`} className="block text-xs text-[#6B6B6B] mb-1">
                {t("widgetSmsPhoneLabel")}
              </label>
              <input
                id={`${widgetId}-sms-phone`}
                type="tel"
                inputMode="numeric"
                placeholder="091 234 5678"
                value={formatPhoneGrouped(smsPhone)}
                onChange={(e) => setSmsPhone(normalizePhoneDigits(e.target.value))}
                className="w-full min-h-[42px] px-3 rounded-lg border border-[#E7E7E4] bg-white font-mono text-sm"
              />
            </div>
            <button type="submit" className="mezgeb-btn-primary self-end text-sm">
              {t("widgetSmsSendBtn")}
            </button>
          </form>
          {smsPhoneError && <p className="text-xs text-red-700 font-medium">{smsPhoneError}</p>}
          {smsGeneratedLink && (
            <div role="status" className="p-3 rounded-lg bg-[#E4F2EC] text-[#1F5C46] text-xs space-y-1">
              <p className="font-medium">{t("widgetSmsBody")}</p>
              <a href={smsGeneratedLink} className="font-mono underline break-all font-semibold">
                {smsGeneratedLink}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
