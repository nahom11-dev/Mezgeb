import { AREA_OPTIONS, SUPPORT_OPTIONS } from "./index";
import { QuestionType, TemplateQuestion } from "./types";

export interface BlankTypeDescriptor {
  type: QuestionType;
  icon: string;
  name: { en: string; am: string };
  description: { en: string; am: string };
  example: { en: string; am: string };
}

export const BLANK_QUESTION_TYPES: BlankTypeDescriptor[] = [
  {
    type: "text",
    icon: "user",
    name: { en: "Short text", am: "አጭር ጽሑፍ" },
    description: {
      en: "Collect a name, city, or open short response by keyboard or voice.",
      am: "ስም፣ ከተማ ወይም አጭር መልስ በጽሑፍ ወይም በድምፅ ይሰበስባል።",
    },
    example: { en: "e.g. What is your full name?", am: "ለምሳሌ፦ ሙሉ ስምዎ ማን ነው?" },
  },
  {
    type: "phone",
    icon: "phone",
    name: { en: "Ethiopian phone", am: "የኢትዮጵያ ስልክ" },
    description: {
      en: "10-digit mobile number starting with 09 or 07 with automatic spacing.",
      am: "በ 09 ወይም 07 የሚጀምር ባለ 10 አሃዝ ስልክ ቁጥር።",
    },
    example: { en: "e.g. 091 234 5678", am: "ለምሳሌ፦ 091 234 5678" },
  },
  {
    type: "email",
    icon: "mail",
    name: { en: "Email (optional)", am: "ኢሜይል (አማራጭ)" },
    description: {
      en: "Email address field with format check; defaults to optional.",
      am: "የኢሜይል አድራሻ መስክ፤ በነባሪነት አማራጭ ነው።",
    },
    example: { en: "e.g. selam@example.com", am: "ለምሳሌ፦ selam@example.com" },
  },
  {
    type: "number",
    icon: "hash",
    name: { en: "Number", am: "ቁጥር" },
    description: {
      en: "Numeric keypad entry with optional minimum and maximum values.",
      am: "ዝቅተኛና ከፍተኛ ገደብ ያለው የቁጥር ማስገቢያ።",
    },
    example: { en: "e.g. Years of experience", am: "ለምሳሌ፦ የልምድ ዓመታት" },
  },
  {
    type: "date",
    icon: "calendar",
    name: { en: "Date (Ethiopian & Gregorian)", am: "ቀን (ኢትዮጵያዊና ግሪጎሪያን)" },
    description: {
      en: "Day, month, and year with live Ethiopian and Gregorian conversion.",
      am: "ቀን፣ ወር እና ዓመት ከቀጥታ የቀን መቁጠሪያ ልወጣ ጋር።",
    },
    example: { en: "e.g. 12 Meskerem 1990", am: "ለምሳሌ፦ መስከረም 12 1990" },
  },
  {
    type: "choice",
    icon: "globe",
    name: { en: "Single choice", am: "ነጠላ ምርጫ" },
    description: {
      en: "Pick one option from a list, by tap or by voice.",
      am: "ከዝርዝር አንድ አማራጭ በመንካት ወይም በድምፅ መምረጥ።",
    },
    example: { en: "e.g. Preferred language", am: "ለምሳሌ፦ የሚመርጡት ቋንቋ" },
  },
  {
    type: "multichoice",
    icon: "check-square",
    name: { en: "Multiple choice", am: "ብዙ ምርጫ" },
    description: {
      en: "Pick one or more options from toggle buttons.",
      am: "ከአንድ በላይ አማራጮችን መምረጥ።",
    },
    example: { en: "e.g. Days you can attend", am: "ለምሳሌ፦ መገኘት የሚችሉባቸው ቀናት" },
  },
  {
    type: "yes-no",
    icon: "toggle-left",
    name: { en: "Yes / No", am: "አዎ / አይ" },
    description: {
      en: "Two large, easy-to-tap buttons for quick binary questions.",
      am: "ለአዎ ወይም አይ ጥያቄዎች ሁለት ትላልቅ አዝራሮች።",
    },
    example: { en: "e.g. Do you have a Fayda ID?", am: "ለምሳሌ፦ የፋይዳ መታወቂያ አለዎት?" },
  },
  {
    type: "id-routes",
    icon: "shield-check",
    name: { en: "ID routes", am: "የመታወቂያ መንገዶች" },
    description: {
      en: "Flexible identity options including Fayda, Refugee ID, and Partner referral.",
      am: "ፋይዳ፣ የስደተኛ መታወቂያ፣ ሌላ ሰነድ እና የአጋር ማጣቀሻ።",
    },
    example: { en: "How will you show who you are?", am: "ማንነትዎን እንዴት ያሳያሉ?" },
  },
  {
    type: "support",
    icon: "heart-handshake",
    name: { en: "Support I need (private)", am: "የሚያስፈልገኝ ድጋፍ (ሚስጥራዊ)" },
    description: {
      en: "Practical learning or test support with default-off privacy toggles.",
      am: "በነባሪ ሚስጥራዊ የሆነ ተግባራዊ የድጋፍ ምርጫ።",
    },
    example: { en: "Screen reader, extra time, step-free access", am: "ስክሪን አንባቢ፣ ተጨማሪ ጊዜ" },
  },
  {
    type: "work-story",
    icon: "briefcase",
    name: { en: "Work story & skills", am: "የስራ ታሪክ እና ክህሎት" },
    description: {
      en: "Learners tell their work story by text or voice and choose skills.",
      am: "ተማሪዎች የስራ ልምዳቸውን በጽሑፍ ወይም በድምፅ ያጋራሉ።",
    },
    example: { en: "Tell us about work you have done", am: "ስለሰሩት ስራ ይንገሩን" },
  },
  {
    type: "info",
    icon: "info",
    name: { en: "Information screen", am: "የመረጃ ስክሪን" },
    description: {
      en: "A plain explanation screen with Read aloud and Continue, no input field.",
      am: "ያለ መጻፊያ ሳጥን ግልጽ ማብራሪያ የሚሰጥ ስክሪን።",
    },
    example: { en: "e.g. Why we ask for identity", am: "ለምሳሌ፦ ማንነት ለምን እንደምንጠይቅ" },
  },
  {
    type: "consent",
    icon: "check-square",
    name: { en: "Consent step", am: "የስምምነት ደረጃ" },
    description: {
      en: "Standalone agreement screen with a checkbox learners must tick if required.",
      am: "ተማሪው ምልክት የሚያደርግበት የስምምነት ሳጥን።",
    },
    example: { en: "I agree to share my application", am: "ማመልከቻዬን ለመላክ ተስማምቻለሁ" },
  },
];

export const COMMON_FIELD_SUGGESTIONS = [
  "name",
  "phone",
  "email",
  "area",
  "region",
  "date_of_birth",
  "preferred_language",
  "id_route",
  "support_needs",
  "skills",
  "education_level",
  "training_centre",
  "emergency_phone",
  "referral_source",
  "job_goal",
  "consent_extra",
];

export interface LibraryPresetItem {
  presetId: string;
  question: Omit<TemplateQuestion, "id">;
}

export const READY_MADE_QUESTIONS: LibraryPresetItem[] = [
  {
    presetId: "full_name",
    question: {
      type: "text",
      section: "about",
      label: { en: "What is your full name?", am: "ሙሉ ስምዎ ማን ነው?" },
      hint: { en: "Use the name people know you by.", am: "ሰዎች የሚያውቁበትን ስም ይጠቀሙ።" },
      icon: "user",
      required: true,
      allowVoice: true,
      maps_to: "name",
    },
  },
  {
    presetId: "phone",
    question: {
      type: "phone",
      section: "about",
      label: { en: "What is your phone number?", am: "ስልክ ቁጥርዎ ስንት ነው?" },
      hint: { en: "10 digits starting with 09 or 07.", am: "በ 09 ወይም 07 የሚጀምር ባለ 10 አሃዝ ቁጥር።" },
      placeholder: { en: "091 234 5678", am: "091 234 5678" },
      validation: { preset: "ethiopian-phone" },
      icon: "phone",
      required: true,
      allowVoice: true,
      maps_to: "phone",
    },
  },
  {
    presetId: "area",
    question: {
      type: "choice",
      section: "about",
      label: { en: "Which area do you live in?", am: "የት አካባቢ ነው የሚኖሩት?" },
      hint: { en: "Sub-city in Addis Ababa, or choose Other.", am: "አዲስ አበባ ክፍለ ከተማ ወይም ሌላ ይምረጡ።" },
      icon: "map-pin",
      required: true,
      allowVoice: true,
      options: AREA_OPTIONS,
      maps_to: "area",
    },
  },
  {
    presetId: "region",
    question: {
      type: "choice",
      section: "about",
      label: { en: "Which region do you live in?", am: "የትኛው ክልል ነው የሚኖሩት?" },
      hint: { en: "Choose your region or chartered city.", am: "ክልልዎን ወይም የከተማ አስተዳደርዎን ይምረጡ።" },
      icon: "map-pin",
      required: true,
      allowVoice: true,
      options: [
        { value: "addis_ababa", label: { en: "Addis Ababa", am: "አዲስ አበባ" } },
        { value: "oromia", label: { en: "Oromia", am: "ኦሮሚያ" } },
        { value: "amhara", label: { en: "Amhara", am: "አማራ" } },
        { value: "tigray", label: { en: "Tigray", am: "ትግራይ" } },
        { value: "sidama", label: { en: "Sidama", am: "ሲዳማ" } },
        { value: "somali", label: { en: "Somali", am: "ሶማሌ" } },
        { value: "afar", label: { en: "Afar", am: "አፋር" } },
        { value: "dire_dawa", label: { en: "Dire Dawa", am: "ድሬዳዋ" } },
        { value: "other_region", label: { en: "Other region", am: "ሌላ ክልል" } },
      ],
      maps_to: "region",
    },
  },
  {
    presetId: "dob",
    question: {
      type: "date",
      section: "about",
      label: { en: "When were you born?", am: "የተወለዱበት ቀን መቼ ነው?" },
      hint: { en: "Ethiopian calendar is selected by default.", am: "በነባሪነት የኢትዮጵያ ቀን መቁጠሪያ ተመርጧል።" },
      icon: "calendar",
      required: true,
      maps_to: "date_of_birth",
    },
  },
  {
    presetId: "id_route",
    question: {
      type: "id-routes",
      section: "identity",
      label: { en: "How will you show who you are?", am: "ማንነትዎን እንዴት ያሳያሉ?" },
      hint: { en: "Choose any option. You do not need a Fayda ID to start.", am: "ማንኛውንም አማራጭ ይምረጡ። ለመጀመር ፋይዳ አያስፈልግም።" },
      icon: "shield-check",
      required: true,
      maps_to: "id_route",
    },
  },
  {
    presetId: "support_needs",
    question: {
      type: "support",
      section: "support",
      label: { en: "Is there any support that helps you learn or test?", am: "ለመማር ወይም ለመፈተን የሚረዳዎት ድጋፍ አለ?" },
      hint: { en: "Private by default. No diagnosis or medical documents asked.", am: "በነባሪ ሚስጥራዊ ነው። ምንም የህክምና ማረጋገጫ አይጠየቅም።" },
      icon: "heart-handshake",
      required: false,
      sensitive: true,
      allowVoice: true,
      options: SUPPORT_OPTIONS,
      maps_to: "support_needs",
    },
  },
  {
    presetId: "work_story",
    question: {
      type: "work-story",
      section: "work",
      label: { en: "Tell us about work you have done", am: "ስለሰሩት ስራ ይንገሩን" },
      hint: { en: "Paid or unpaid work, helping family, or community tasks all count.", am: "ክፍያ ያለው ወይም የሌለው ስራ ሁሉ ይቆጠራል።" },
      icon: "briefcase",
      required: false,
      allowVoice: true,
      maps_to: "skills",
    },
  },
  {
    presetId: "education_level",
    question: {
      type: "choice",
      section: "work",
      label: { en: "What is your highest level of schooling?", am: "ከፍተኛ የትምህርት ደረጃዎ ምንድን ነው?" },
      hint: { en: "This helps place you in the right class.", am: "ተገቢው ክፍል ውስጥ እንዲመደቡ ይረዳል።" },
      icon: "graduation-cap",
      required: false,
      skippable: true,
      allowVoice: true,
      options: [
        { value: "primary", label: { en: "Primary school (Grades 1–8)", am: "አንደኛ ደረጃ (1–8)" } },
        { value: "secondary", label: { en: "Secondary school (Grades 9–12)", am: "ሁለተኛ ደረጃ (9–12)" } },
        { value: "tvet", label: { en: "TVET / Certificate", am: "ቴክኒክና ሙያ / ሰርተፊኬት" } },
        { value: "degree", label: { en: "Diploma or degree", am: "ዲፕሎማ ወይም ዲግሪ" } },
        { value: "prefer_not_to_say", label: { en: "Prefer not to say", am: "መናገር አልፈልግም" } },
      ],
      maps_to: "education_level",
    },
  },
  {
    presetId: "training_centre",
    question: {
      type: "choice",
      section: "work",
      label: { en: "Which training centre works best for you?", am: "የትኛው የስልጠና ማዕከል ይመችዎታል?" },
      hint: { en: "Pick the location easiest to reach.", am: "በቀላሉ የሚደርሱበትን ቦታ ይምረጡ።" },
      icon: "building",
      required: true,
      allowVoice: true,
      options: [
        { value: "bole_centre", label: { en: "Bole Campus", am: "ቦሌ ካምፓስ" } },
        { value: "mexico_centre", label: { en: "Lideta / Mexico Campus", am: "ልደታ / ሜክሲኮ ካምፓስ" } },
        { value: "piassa_centre", label: { en: "Arada / Piassa Campus", am: "አራዳ / ፒያሳ ካምፓስ" } },
        { value: "online", label: { en: "Online from home", am: "በመስመር ላይ (ከቤት)" } },
      ],
      maps_to: "training_centre",
    },
  },
  {
    presetId: "preferred_language",
    question: {
      type: "choice",
      section: "about",
      label: { en: "Which language do you prefer?", am: "የትኛውን ቋንቋ ይመርጣሉ?" },
      hint: { en: "You can change this at any time.", am: "በማንኛውም ጊዜ መቀየር ይችላሉ።" },
      icon: "globe",
      required: true,
      allowVoice: true,
      options: [
        { value: "am", label: { en: "Amharic (አማርኛ)", am: "አማርኛ (Amharic)" } },
        { value: "en", label: { en: "English", am: "English (እንግሊዝኛ)" } },
      ],
      maps_to: "preferred_language",
    },
  },
  {
    presetId: "email_optional",
    question: {
      type: "email",
      section: "about",
      label: { en: "What is your email address? (Optional)", am: "የኢሜይል አድራሻዎ ምንድን ነው? (አማራጭ)" },
      hint: { en: "Leave blank or skip if you do not use email.", am: "ኢሜይል የማይጠቀሙ ከሆነ ባዶ ይተዉት ወይም ይለፉት።" },
      placeholder: { en: "name@example.com", am: "name@example.com" },
      validation: { preset: "email" },
      icon: "mail",
      required: false,
      skippable: true,
      maps_to: "email",
    },
  },
  {
    presetId: "emergency_phone",
    question: {
      type: "phone",
      section: "about",
      label: { en: "Who can we call in an emergency?", am: "በድንገተኛ ጊዜ ማንን ማግኘት እንችላለን?" },
      hint: { en: "Optional 10-digit phone number for a trusted contact.", am: "አማራጭ የሆነ የታማኝ ሰው ባለ 10 አሃዝ ስልክ ቁጥር።" },
      placeholder: { en: "091 234 5678", am: "091 234 5678" },
      validation: { preset: "ethiopian-phone" },
      icon: "phone",
      required: false,
      sensitive: true,
      skippable: true,
      allowVoice: true,
      maps_to: "emergency_phone",
    },
  },
  {
    presetId: "hear_about",
    question: {
      type: "choice",
      section: "work",
      label: { en: "How did you hear about us?", am: "ስለ እኛ እንዴት ሰሙ?" },
      hint: { en: "Optional feedback.", am: "አማራጭ መረጃ።" },
      icon: "help-circle",
      required: false,
      skippable: true,
      allowVoice: true,
      options: [
        { value: "partner_org", label: { en: "Community or partner desk", am: "ከአጋር ድርጅት" } },
        { value: "friend_family", label: { en: "Friend or family", am: "ከጓደኛ ወይም ቤተሰብ" } },
        { value: "radio_tv", label: { en: "Radio, TV, or poster", am: "ከሬዲዮ፣ ቲቪ ወይም ማስታወቂያ" } },
        { value: "social_online", label: { en: "Telegram or website", am: "ከቴሌግራም ወይም ድረ-ገጽ" } },
      ],
      maps_to: "referral_source",
    },
  },
  {
    presetId: "consent_step",
    question: {
      type: "consent",
      section: "review",
      label: {
        en: "I agree to share this registration with the programme team.",
        am: "ይህን ምዝገባ ለፕሮግራሙ ቡድን ለማጋራት ተስማምቻለሁ።",
      },
      hint: {
        en: "Private support needs stay separate unless you switch sharing on.",
        am: "ማጋራትን ካላበሩ በስተቀር የግል ድጋፍ ምርጫዎችዎ ተለይተው ይቆያሉ።",
      },
      icon: "check-square",
      required: true,
      maps_to: "consent_extra",
    },
  },
  {
    presetId: "info_screen",
    question: {
      type: "info",
      section: "identity",
      label: { en: "Why we ask for identity", am: "ማንነት ለምን እንደምንጠይቅ" },
      hint: {
        en: "Any of the four ID options works. If you do not have an ID with you today, pick a partner desk to vouch for you.",
        am: "ከአራቱ የመታወቂያ አማራጮች ማንኛውም ይሰራል። ዛሬ መታወቂያ ከሌለዎት አጋር ድርጅት ይምረጡ።",
      },
      icon: "info",
      required: false,
      maps_to: "custom_info",
    },
  },
];

export function createBlankQuestion(type: QuestionType): TemplateQuestion {
  const uid = `${type.replace(/-/g, "_")}_${Date.now().toString(36).slice(-5)}`;
  const descriptor = BLANK_QUESTION_TYPES.find((d) => d.type === type);
  const defaultIcon = descriptor?.icon ?? "user";

  const base: TemplateQuestion = {
    id: uid,
    type,
    section: type === "support" ? "support" : type === "id-routes" ? "identity" : type === "consent" ? "review" : "about",
    label: {
      en: descriptor ? descriptor.name.en : "New question",
      am: descriptor ? descriptor.name.am : "አዲስ ጥያቄ",
    },
    hint: { en: "", am: "" },
    icon: defaultIcon,
    required: type === "info" || type === "email" || type === "support" ? false : true,
    allowVoice: ["text", "phone", "choice", "multichoice", "number", "yes-no", "work-story"].includes(type),
    maps_to: type === "info" ? `custom_${uid}` : uid,
  };

  if (type === "choice" || type === "multichoice") {
    base.options = [
      { value: "option_1", label: { en: "Option 1", am: "አማራጭ 1" } },
      { value: "option_2", label: { en: "Option 2", am: "አማራጭ 2" } },
    ];
  } else if (type === "yes-no") {
    base.options = [
      { value: "yes", label: { en: "Yes", am: "አዎ" } },
      { value: "no", label: { en: "No", am: "አይ" } },
    ];
  } else if (type === "phone") {
    base.validation = { preset: "ethiopian-phone" };
    base.hint = { en: "10 digits starting with 09 or 07.", am: "በ 09 ወይም 07 የሚጀምር ባለ 10 አሃዝ ቁጥር።" };
  } else if (type === "email") {
    base.validation = { preset: "email" };
    base.skippable = true;
  } else if (type === "date") {
    base.hint = { en: "Ethiopian calendar is selected by default.", am: "በነባሪነት የኢትዮጵያ ቀን መቁጠሪያ ተመርጧል።" };
  } else if (type === "support") {
    base.sensitive = true;
    base.options = SUPPORT_OPTIONS;
    base.maps_to = "support_needs";
  } else if (type === "id-routes") {
    base.maps_to = "id_route";
  } else if (type === "work-story") {
    base.maps_to = "skills";
  }

  return base;
}

export function slugifyFieldKey(raw: string): string {
  const cleaned = raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return cleaned || `custom_${Math.random().toString(36).slice(2, 6)}`;
}

/**
 * Offline rule-based form field parser ("Paste your current form")
 */
export function parsePastedFormFields(rawText: string): TemplateQuestion[] {
  const lines = rawText
    .split(/\r?\n|,/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 25);

  const usedIds = new Set<string>();
  const usedMaps = new Set<string>();

  return lines.map((line, index) => {
    const lower = line.toLowerCase();
    let type: QuestionType = "text";
    let icon = "user";
    let required = true;
    let skippable = false;
    let sensitive = false;
    let options: TemplateQuestion["options"] | undefined;
    let hintEn = "";
    let hintAm = "";
    let validation: TemplateQuestion["validation"] | undefined;

    if (/(phone|mobile|tel|ስልክ)/i.test(lower)) {
      type = "phone";
      icon = "phone";
      hintEn = "10 digits starting with 09 or 07.";
      hintAm = "በ 09 ወይም 07 የሚጀምር ባለ 10 አሃዝ ቁጥር።";
      validation = { preset: "ethiopian-phone" };
    } else if (/(email|e-mail|ኢሜይል)/i.test(lower)) {
      type = "email";
      icon = "mail";
      required = false;
      skippable = true;
      hintEn = "Optional email address.";
      hintAm = "አማራጭ የኢሜይል አድራሻ።";
      validation = { preset: "email" };
    } else if (/(date|birth|dob|ትውልድ|ቀን)/i.test(lower)) {
      type = "date";
      icon = "calendar";
      hintEn = "Ethiopian calendar is selected by default.";
      hintAm = "በነባሪነት የኢትዮጵያ ቀን መቁጠሪያ ተመርጧል።";
    } else if (/(gender|sex|region|level|education|city|area|sub-city|centre|center|ክልል|ጾታ|ትምህርት)/i.test(lower)) {
      type = "choice";
      icon = /(region|city|area|sub-city|ክልል)/i.test(lower) ? "map-pin" : "graduation-cap";
      options = []; // Deliberately empty so Checker flags options to fill in
    } else if (/(id|fayda|refugee|document|መታወቂያ)/i.test(lower)) {
      type = "id-routes";
      icon = "shield-check";
    } else if (/(support|accommodation|disability|ድጋፍ)/i.test(lower)) {
      type = "support";
      icon = "heart-handshake";
      required = false;
      sensitive = true;
      options = SUPPORT_OPTIONS;
    } else if (/(age|year|experience|count|number|ብዛት|ዕድሜ)/i.test(lower)) {
      type = "number";
      icon = "hash";
    } else if (/(consent|agree|ስምምነት)/i.test(lower)) {
      type = "consent";
      icon = "check-square";
    }

    let baseId = slugifyFieldKey(line);
    if (usedIds.has(baseId)) {
      baseId = `${baseId}_${index + 1}`;
    }
    usedIds.add(baseId);

    let mapsTo =
      type === "id-routes"
        ? "id_route"
        : type === "support"
          ? "support_needs"
          : baseId;
    if (usedMaps.has(mapsTo)) {
      mapsTo = `${mapsTo}_${index + 1}`;
    }
    usedMaps.add(mapsTo);

    return {
      id: baseId,
      type,
      section: type === "id-routes" ? "identity" : type === "support" ? "support" : "about",
      label: { en: line, am: "" }, // Empty Amharic intentionally lets Checker prompt translation
      hint: { en: hintEn, am: hintAm },
      icon,
      required,
      skippable,
      sensitive,
      allowVoice: ["text", "phone", "choice", "multichoice", "number", "yes-no", "work-story"].includes(type),
      validation,
      options,
      maps_to: mapsTo,
    };
  });
}
