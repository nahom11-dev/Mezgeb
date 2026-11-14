import { translations } from "../i18n";
import {
  MezgebTemplate,
  QuestionOption,
  TemplateQuestion,
  TemplateSection,
  TemplateSettings,
} from "./types";

const en = translations.en;
const am = translations.am;

export const DEFAULT_SECTIONS: TemplateSection[] = [
  { id: "about", title: { en: "About you", am: "ስለ እርስዎ" } },
  { id: "identity", title: { en: "Identity", am: "ማንነት" } },
  { id: "support", title: { en: "Support", am: "ድጋፍ" } },
  { id: "work", title: { en: "Work and learning", am: "ስራ እና ትምህርት" } },
  { id: "review", title: { en: "Review", am: "ክለሳ" } },
];

export const DEFAULT_TEMPLATE_SETTINGS: TemplateSettings = {
  voice: true,
  readAloud: true,
  smartHelp: true,
  partnerReferral: true,
  smsResume: false,
  offline: true,
  sayItSimply: true,
};

export const ACCENT_SWATCHES = [
  "#6A4FC4",
  "#1F5C46",
  "#111111",
  "#1D4ED8",
  "#9A3412",
  "#7C2D12",
];

export const DEFAULT_WIDGET_THEME = {
  accent: ACCENT_SWATCHES[0],
  platformName: "Learnhub",
  logoLetter: "L",
};

export const AREA_OPTIONS: QuestionOption[] = [
  { value: "addis_ketema", label: { am: am.optAreaAddisKetema, en: en.optAreaAddisKetema } },
  { value: "akaky_kaliti", label: { am: am.optAreaAkaky, en: en.optAreaAkaky } },
  { value: "arada", label: { am: am.optAreaArada, en: en.optAreaArada } },
  { value: "bole", label: { am: am.optAreaBole, en: en.optAreaBole } },
  { value: "gullele", label: { am: am.optAreaGullele, en: en.optAreaGullele } },
  { value: "kirkos", label: { am: am.optAreaKirkos, en: en.optAreaKirkos } },
  { value: "kolfe_keranio", label: { am: am.optAreaKolfe, en: en.optAreaKolfe } },
  { value: "lemi_kura", label: { am: am.optAreaLemiKura, en: en.optAreaLemiKura } },
  { value: "lideta", label: { am: am.optAreaLideta, en: en.optAreaLideta } },
  { value: "nifas_silk_lafto", label: { am: am.optAreaNifasSilk, en: en.optAreaNifasSilk } },
  { value: "yeka", label: { am: am.optAreaYeka, en: en.optAreaYeka } },
  { value: "other", label: { am: am.optAreaOther, en: en.optAreaOther } },
];

export const SUPPORT_OPTIONS: QuestionOption[] = [
  { value: "screen_reader", label: { am: am.optSupportScreenReader, en: en.optSupportScreenReader } },
  { value: "extra_time", label: { am: am.optSupportExtraTime, en: en.optSupportExtraTime } },
  { value: "step_free", label: { am: am.optSupportStepFree, en: en.optSupportStepFree } },
  { value: "sign_language", label: { am: am.optSupportSignLang, en: en.optSupportSignLang } },
  { value: "large_print", label: { am: am.optSupportLargePrint, en: en.optSupportLargePrint } },
  { value: "quiet_room", label: { am: am.optSupportQuietRoom, en: en.optSupportQuietRoom } },
];

export const EMPLOYER_ACCOM_OPTIONS: QuestionOption[] = [
  ...SUPPORT_OPTIONS,
  { value: "flexible_hours", label: { am: am.optSupportFlexibleHours, en: en.optSupportFlexibleHours } },
  { value: "remote_option", label: { am: am.optSupportRemote, en: en.optSupportRemote } },
];

const COMMON_QUESTIONS: Record<string, TemplateQuestion> = {
  language: {
    id: "language",
    type: "choice",
    section: "about",
    label: { am: am.qLangLabel, en: en.qLangLabel },
    hint: { am: am.qLangHint, en: en.qLangHint },
    icon: "globe",
    required: true,
    allowVoice: true,
    options: [
      { value: "am", label: { am: am.optLangAm, en: en.optLangAm } },
      { value: "en", label: { am: am.optLangEn, en: en.optLangEn } },
    ],
    maps_to: "preferred_language",
  },
  fullName: {
    id: "full_name",
    type: "text",
    section: "about",
    label: { am: am.qFullNameLabel, en: en.qFullNameLabel },
    hint: { am: am.qFullNameHint, en: en.qFullNameHint },
    icon: "user",
    required: true,
    allowVoice: true,
    maps_to: "name",
  },
  area: {
    id: "area",
    type: "choice",
    section: "about",
    label: { am: am.qAreaLabel, en: en.qAreaLabel },
    hint: { am: am.qAreaHint, en: en.qAreaHint },
    icon: "map-pin",
    required: true,
    allowVoice: true,
    options: AREA_OPTIONS,
    maps_to: "area",
  },
  phone: {
    id: "phone",
    type: "phone",
    section: "about",
    label: { am: am.qPhoneLabel, en: en.qPhoneLabel },
    hint: { am: am.qPhoneHint, en: en.qPhoneHint },
    placeholder: { en: "091 234 5678", am: "091 234 5678" },
    validation: { preset: "ethiopian-phone" },
    icon: "phone",
    required: true,
    allowVoice: true,
    maps_to: "phone",
  },
  dob: {
    id: "dob",
    type: "date",
    section: "about",
    label: { am: am.qDobLabel, en: en.qDobLabel },
    hint: { am: am.qDobHint, en: en.qDobHint },
    icon: "calendar",
    required: true,
    maps_to: "date_of_birth",
  },
  idRoutes: {
    id: "id_route",
    type: "id-routes",
    section: "identity",
    label: { am: am.qIdRouteLabel, en: en.qIdRouteLabel },
    hint: { am: am.qIdRouteHint, en: en.qIdRouteHint },
    icon: "shield-check",
    required: true,
    maps_to: "id_route",
  },
  support: {
    id: "support_needs",
    type: "support",
    section: "support",
    label: { am: am.qSupportLabel, en: en.qSupportLabel },
    hint: { am: am.qSupportHint, en: en.qSupportHint },
    icon: "heart-handshake",
    required: false,
    sensitive: true,
    allowVoice: true,
    options: SUPPORT_OPTIONS,
    maps_to: "support_needs",
  },
  workStory: {
    id: "work_story",
    type: "work-story",
    section: "work",
    label: { am: am.qWorkStoryLabel, en: en.qWorkStoryLabel },
    hint: { am: am.qWorkStoryHint, en: en.qWorkStoryHint },
    icon: "briefcase",
    required: false,
    allowVoice: true,
    maps_to: "skills",
  },
};

export const LEARNING_PLATFORM_TEMPLATE: MezgebTemplate = {
  id: "learning-platform",
  category: "learning",
  tested: false,
  name: { am: am.tplLearningName, en: en.tplLearningName },
  description: { am: am.tplLearningDesc, en: en.tplLearningDesc },
  bestFor: {
    en: "Coding bootcamps, TVET colleges, and online courses.",
    am: "የኮዲንግ ቡትካምፖች፣ የቴክኒክና ሙያ ኮሌጆች እና የመስመር ላይ ኮርሶች።",
  },
  languages: ["am", "en"],
  idRoutes: ["fayda", "refugee_id", "other_document", "partner_refer"],
  supportNeeds: SUPPORT_OPTIONS.map((o) => o.value),
  sections: DEFAULT_SECTIONS,
  settings: {
    ...DEFAULT_TEMPLATE_SETTINGS,
    smsResume: true,
  },
  theme: {
    accent: "#6A4FC4",
    platformName: "Learnhub",
    logoLetter: "L",
  },
  questions: [
    COMMON_QUESTIONS.language,
    COMMON_QUESTIONS.fullName,
    COMMON_QUESTIONS.area,
    COMMON_QUESTIONS.phone,
    COMMON_QUESTIONS.dob,
    COMMON_QUESTIONS.idRoutes,
    COMMON_QUESTIONS.support,
    COMMON_QUESTIONS.workStory,
  ],
  consent: { am: am.qConsentLearning, en: en.qConsentLearning },
};

export const JOB_SEEKER_TEMPLATE: MezgebTemplate = {
  id: "job-seeker",
  category: "jobs",
  tested: false,
  name: { am: am.tplJobSeekerName, en: en.tplJobSeekerName },
  description: { am: am.tplJobSeekerDesc, en: en.tplJobSeekerDesc },
  bestFor: {
    en: "Job boards, apprenticeship matching, and career centres.",
    am: "የስራ መድረኮች፣ የስራ ልምምድ ማገናኛዎች እና የሙያ ማዕከላት።",
  },
  languages: ["am", "en"],
  idRoutes: ["fayda", "refugee_id", "other_document", "partner_refer"],
  supportNeeds: SUPPORT_OPTIONS.map((o) => o.value),
  sections: DEFAULT_SECTIONS,
  settings: {
    ...DEFAULT_TEMPLATE_SETTINGS,
  },
  theme: {
    accent: "#1F5C46",
    platformName: "SiraHub",
    logoLetter: "S",
  },
  questions: [
    COMMON_QUESTIONS.language,
    COMMON_QUESTIONS.fullName,
    COMMON_QUESTIONS.phone,
    COMMON_QUESTIONS.area,
    {
      id: "job_goal",
      type: "text",
      section: "work",
      label: { am: am.qJobGoalLabel, en: en.qJobGoalLabel },
      hint: { am: am.qJobGoalHint, en: en.qJobGoalHint },
      icon: "briefcase",
      required: true,
      allowVoice: true,
      maps_to: "job_goal",
    },
    COMMON_QUESTIONS.workStory,
    {
      id: "interview_support",
      type: "support",
      section: "support",
      label: { am: am.qInterviewSupportLabel, en: en.qInterviewSupportLabel },
      hint: { am: am.qInterviewSupportHint, en: en.qInterviewSupportHint },
      icon: "heart-handshake",
      required: false,
      sensitive: true,
      allowVoice: true,
      options: SUPPORT_OPTIONS,
      maps_to: "support_needs",
    },
  ],
  consent: { am: am.qConsentJobSeeker, en: en.qConsentJobSeeker },
};

export const EMPLOYER_TEMPLATE: MezgebTemplate = {
  id: "employer-signup",
  category: "employer",
  tested: false,
  name: { am: am.tplEmployerName, en: en.tplEmployerName },
  description: { am: am.tplEmployerDesc, en: en.tplEmployerDesc },
  bestFor: {
    en: "Companies listing inclusive jobs and workplace adjustments.",
    am: "አካታች ስራዎችን እና የስራ ቦታ ድጋፎችን የሚያወጡ ኩባንያዎች።",
  },
  languages: ["am", "en"],
  idRoutes: ["other_document"],
  supportNeeds: EMPLOYER_ACCOM_OPTIONS.map((o) => o.value),
  sections: DEFAULT_SECTIONS,
  settings: {
    ...DEFAULT_TEMPLATE_SETTINGS,
    partnerReferral: false,
  },
  theme: {
    accent: "#2D4B73",
    platformName: "Employers",
    logoLetter: "E",
  },
  questions: [
    {
      id: "job_title",
      type: "text",
      section: "work",
      label: { am: am.qJobTitleLabel, en: en.qJobTitleLabel },
      hint: { am: am.qJobTitleHint, en: en.qJobTitleHint },
      icon: "briefcase",
      required: true,
      allowVoice: true,
      maps_to: "job_title",
    },
    {
      id: "company_name",
      type: "text",
      section: "about",
      label: { am: am.qCompanyNameLabel, en: en.qCompanyNameLabel },
      hint: { am: am.qCompanyNameHint, en: en.qCompanyNameHint },
      icon: "building",
      required: true,
      allowVoice: true,
      maps_to: "company_name",
    },
    {
      id: "job_location",
      type: "text",
      section: "work",
      label: { am: am.qJobLocationLabel, en: en.qJobLocationLabel },
      hint: { am: am.qJobLocationHint, en: en.qJobLocationHint },
      icon: "map-pin",
      required: true,
      allowVoice: true,
      maps_to: "job_location",
    },
    {
      id: "contact_role",
      type: "text",
      section: "about",
      label: { am: am.qContactRoleLabel, en: en.qContactRoleLabel },
      hint: { am: am.qContactRoleHint, en: en.qContactRoleHint },
      icon: "user",
      required: false,
      allowVoice: true,
      maps_to: "contact_person",
    },
    {
      id: "employer_accommodations",
      type: "multichoice",
      section: "support",
      label: { am: am.qEmployerAccomLabel, en: en.qEmployerAccomLabel },
      hint: { am: am.qEmployerAccomHint, en: en.qEmployerAccomHint },
      icon: "heart-handshake",
      required: false,
      allowVoice: true,
      options: EMPLOYER_ACCOM_OPTIONS,
      maps_to: "offered_accommodations",
    },
  ],
  consent: { am: am.qConsentEmployer, en: en.qConsentEmployer },
};

export const PROGRAMME_INTAKE_TEMPLATE: MezgebTemplate = {
  id: "programme-intake",
  category: "ngo",
  tested: false,
  name: { am: am.tplProgrammeName, en: en.tplProgrammeName },
  description: { am: am.tplProgrammeDesc, en: en.tplProgrammeDesc },
  bestFor: {
    en: "NGOs, community outreach teams, and refugee support desks.",
    am: "መንግስታዊ ያልሆኑ ድርጅቶች፣ የማህበረሰብ ቡድኖች እና የስደተኞች ድጋፍ ማዕከላት።",
  },
  languages: ["am", "en"],
  idRoutes: ["fayda", "refugee_id", "other_document", "partner_refer"],
  supportNeeds: SUPPORT_OPTIONS.map((o) => o.value),
  partnerDefault: true,
  sections: DEFAULT_SECTIONS,
  settings: {
    ...DEFAULT_TEMPLATE_SETTINGS,
    smsResume: true,
  },
  theme: {
    accent: "#7A3E18",
    platformName: "Intake",
    logoLetter: "I",
  },
  questions: [
    COMMON_QUESTIONS.language,
    COMMON_QUESTIONS.fullName,
    COMMON_QUESTIONS.phone,
    COMMON_QUESTIONS.idRoutes,
    COMMON_QUESTIONS.support,
  ],
  consent: { am: am.qConsentProgramme, en: en.qConsentProgramme },
};

export const JOB_APPLICATION_TEMPLATE: MezgebTemplate = {
  id: "job-application",
  category: "jobs",
  tested: false,
  name: { am: am.tplJobAppName, en: en.tplJobAppName },
  description: { am: am.tplJobAppDesc, en: en.tplJobAppDesc },
  bestFor: {
    en: "Quick voice-ready job applications.",
    am: "በድምፅ የሚሞላ ፈጣን የስራ ማመልከቻ።",
  },
  languages: ["am", "en"],
  idRoutes: ["fayda", "refugee_id", "other_document", "partner_refer"],
  supportNeeds: SUPPORT_OPTIONS.map((o) => o.value),
  sections: DEFAULT_SECTIONS,
  settings: {
    ...DEFAULT_TEMPLATE_SETTINGS,
  },
  theme: {
    accent: "#1F5C46",
    platformName: "Jobs",
    logoLetter: "J",
  },
  questions: [
    {
      id: "why_want_job",
      type: "text",
      section: "work",
      label: { am: am.qWhyWantJobLabel, en: en.qWhyWantJobLabel },
      hint: { am: am.qWhyWantJobHint, en: en.qWhyWantJobHint },
      icon: "briefcase",
      required: true,
      allowVoice: true,
      maps_to: "motivation",
    },
    {
      id: "when_start",
      type: "choice",
      section: "work",
      label: { am: am.qStartWhenLabel, en: en.qStartWhenLabel },
      hint: { am: am.qStartWhenHint, en: en.qStartWhenHint },
      icon: "calendar",
      required: true,
      allowVoice: true,
      options: [
        { value: "immediate", label: { am: am.optStartImmediate, en: en.optStartImmediate } },
        { value: "two_weeks", label: { am: am.optStartTwoWeeks, en: en.optStartTwoWeeks } },
        { value: "one_month", label: { am: am.optStartOneMonth, en: en.optStartOneMonth } },
      ],
      maps_to: "availability",
    },
    {
      id: "interview_support",
      type: "support",
      section: "support",
      label: { am: am.qInterviewSupportLabel, en: en.qInterviewSupportLabel },
      hint: { am: am.qInterviewSupportHint, en: en.qInterviewSupportHint },
      icon: "heart-handshake",
      required: false,
      sensitive: true,
      allowVoice: true,
      options: SUPPORT_OPTIONS,
      maps_to: "interview_support",
    },
  ],
  consent: { am: am.qConsentJobApp, en: en.qConsentJobApp },
};

export const TEMPLATES: MezgebTemplate[] = [
  LEARNING_PLATFORM_TEMPLATE,
  JOB_SEEKER_TEMPLATE,
  EMPLOYER_TEMPLATE,
  PROGRAMME_INTAKE_TEMPLATE,
];

export function getTemplateById(id: string): MezgebTemplate {
  return TEMPLATES.find((t) => t.id === id) ?? LEARNING_PLATFORM_TEMPLATE;
}

export function getEffectiveSettings(template: MezgebTemplate): TemplateSettings {
  return {
    ...DEFAULT_TEMPLATE_SETTINGS,
    ...(template.settings ?? {}),
  };
}
