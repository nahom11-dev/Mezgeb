export type QuestionType =
  | "text"
  | "phone"
  | "date"
  | "choice"
  | "multichoice"
  | "id-routes"
  | "support"
  | "work-story"
  | "yes-no"
  | "email"
  | "number"
  | "info"
  | "consent";

export type IdRoute = "fayda" | "refugee_id" | "other_document" | "partner_refer";

export type TemplateCategory = "learning" | "jobs" | "employer" | "ngo" | "custom";

export type ValidationPreset =
  | "none"
  | "ethiopian-phone"
  | "email"
  | "digits-only"
  | "letters-only";

export interface LocalizedText {
  am: string;
  en: string;
}

export interface QuestionOption {
  value: string;
  label: LocalizedText;
}

export interface QuestionValidation {
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  preset?: ValidationPreset;
}

export interface QuestionCondition {
  questionId: string;
  equals: string | string[];
}

export interface TemplateQuestion {
  id: string;
  type: QuestionType;
  label: LocalizedText;
  hint?: LocalizedText;
  placeholder?: LocalizedText;
  section?: string;
  validation?: QuestionValidation;
  allowVoice?: boolean;
  audio?: { am?: string; en?: string };
  icon: string;
  required: boolean;
  sensitive?: boolean;
  showIf?: QuestionCondition;
  errorHelp?: LocalizedText;
  skippable?: boolean;
  options?: QuestionOption[];
  maps_to: string;
}

export interface TemplateSection {
  id: string;
  title: LocalizedText;
}

export interface TemplateSettings {
  voice: boolean;
  readAloud: boolean;
  smartHelp: boolean;
  partnerReferral: boolean;
  smsResume: boolean;
  offline: boolean;
  sayItSimply: boolean;
}

export interface TemplateTheme {
  accent: string;
  platformName: string;
  logoLetter: string;
}

export interface MezgebTemplate {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  category?: TemplateCategory;
  bestFor?: LocalizedText;
  tested?: boolean;
  languages: ["am", "en"];
  idRoutes: IdRoute[];
  supportNeeds: string[];
  partnerDefault?: boolean;
  sections?: TemplateSection[];
  settings?: TemplateSettings;
  theme?: TemplateTheme;
  version?: number;
  updatedAt?: string;
  questions: TemplateQuestion[];
  consent: LocalizedText;
}

export interface TemplateWarning {
  questionId: string;
  issue: string;
  suggestion: string;
}

export type CheckerSeverity = "must" | "should" | "tip";

export interface CheckerIssue {
  id: string;
  severity: CheckerSeverity;
  questionId?: string;
  issue: string;
  suggestion: string;
  autoFixId?: string;
  fromAi?: boolean;
}
