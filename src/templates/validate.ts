import {
  CheckerIssue,
  IdRoute,
  MezgebTemplate,
  QuestionType,
  TemplateQuestion,
} from "./types";

export const ALLOWED_QUESTION_TYPES: QuestionType[] = [
  "text",
  "phone",
  "date",
  "choice",
  "multichoice",
  "yes-no",
  "email",
  "number",
  "id-routes",
  "support",
  "work-story",
  "info",
  "consent",
];

const ALLOWED_TYPES: Set<QuestionType> = new Set(ALLOWED_QUESTION_TYPES);

export const AVAILABLE_ICONS = [
  { id: "user", label: "Person" },
  { id: "phone", label: "Phone" },
  { id: "mail", label: "Email" },
  { id: "calendar", label: "Calendar" },
  { id: "map-pin", label: "Location" },
  { id: "globe", label: "Language" },
  { id: "shield-check", label: "ID & Trust" },
  { id: "heart-handshake", label: "Support" },
  { id: "briefcase", label: "Work" },
  { id: "graduation-cap", label: "Education" },
  { id: "building", label: "Company" },
  { id: "hash", label: "Number" },
  { id: "toggle-left", label: "Yes / No" },
  { id: "info", label: "Info" },
  { id: "check-square", label: "Consent" },
  { id: "help-circle", label: "Help" },
] as const;

const ALLOWED_ICONS = new Set<string>(AVAILABLE_ICONS.map((i) => i.id));

const ALLOWED_ID_ROUTES: Set<IdRoute> = new Set([
  "fayda",
  "refugee_id",
  "other_document",
  "partner_refer",
]);

export function hexContrastAgainstWhite(hex: string): number {
  const clean = String(hex ?? "").replace("#", "").trim();
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return 1;
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const toLinear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const L = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  return Number(((1.0 + 0.05) / (L + 0.05)).toFixed(2));
}

export interface TemplateValidationResult {
  valid: boolean;
  errors: string[];
  template: MezgebTemplate;
}

export function validateTemplate(raw: MezgebTemplate): TemplateValidationResult {
  const errors: string[] = [];
  const seenIds = new Set<string>();
  const seenMapsTo = new Set<string>();
  let supportCount = 0;

  const cleanedQuestions: TemplateQuestion[] = [];

  for (let i = 0; i < (raw.questions?.length ?? 0); i++) {
    const q = raw.questions[i];
    if (!q || typeof q !== "object") {
      errors.push(`Question ${i + 1} is malformed.`);
      continue;
    }

    const qId = String(q.id ?? "").trim();
    if (!qId) {
      errors.push(`Question ${i + 1} is missing an id.`);
      continue;
    }
    if (seenIds.has(qId)) {
      errors.push(`Duplicate question id: "${qId}".`);
      continue;
    }
    seenIds.add(qId);

    if (!ALLOWED_TYPES.has(q.type)) {
      errors.push(`Question "${qId}" has unknown type "${String(q.type)}".`);
      continue;
    }

    if (q.type === "support") {
      supportCount += 1;
      if (supportCount > 1) {
        errors.push(
          `Template contains multiple "support" questions (at "${qId}"). Only one is allowed.`
        );
        continue;
      }
    }

    if (!q.label?.en?.trim() || !q.label?.am?.trim()) {
      errors.push(`Question "${qId}" must include both English and Amharic labels.`);
    }

    if (q.type === "choice" || q.type === "multichoice") {
      const opts = Array.isArray(q.options) ? q.options : [];
      if (opts.length < 2) {
        errors.push(`Question "${qId}" (${q.type}) must include at least 2 options.`);
      } else {
        const optVals = new Set<string>();
        for (const opt of opts) {
          const v = String(opt?.value ?? "").trim();
          if (!v || optVals.has(v)) {
            errors.push(`Question "${qId}" has duplicate or empty option value "${v}".`);
            break;
          }
          optVals.add(v);
          if (!opt.label?.en?.trim() || !opt.label?.am?.trim()) {
            errors.push(`Question "${qId}" has an option missing an English or Amharic label.`);
            break;
          }
        }
      }
    }

    if (q.skippable && q.required) {
      errors.push(`Question "${qId}" cannot be both required and skippable.`);
    }

    if (q.showIf) {
      const targetIdx = (raw.questions ?? []).findIndex((item) => item?.id === q.showIf?.questionId);
      if (targetIdx === -1 || targetIdx >= i) {
        errors.push(
          `Question "${qId}" has a showIf rule pointing to "${q.showIf.questionId}", which must be an earlier question.`
        );
      }
    }

    const mapsTo = String(q.maps_to ?? "").trim();
    if (q.type !== "info" && mapsTo && !mapsTo.startsWith("custom_")) {
      if (seenMapsTo.has(mapsTo)) {
        errors.push(`Duplicate maps_to field "${mapsTo}" on question "${qId}".`);
      }
      seenMapsTo.add(mapsTo);
    }

    const cleanIcon = ALLOWED_ICONS.has(q.icon) ? q.icon : "user";

    cleanedQuestions.push({
      ...q,
      id: qId,
      icon: cleanIcon,
      label: {
        en: q.label?.en?.trim() || qId,
        am: q.label?.am?.trim() || q.label?.en?.trim() || qId,
      },
    });
  }

  const rawRoutes = Array.isArray(raw.idRoutes)
    ? raw.idRoutes.filter((r): r is IdRoute => ALLOWED_ID_ROUTES.has(r))
    : [];
  if (Array.isArray(raw.idRoutes) && rawRoutes.length === 0) {
    errors.push("Select at least one ID route.");
  }

  if (raw.theme?.accent) {
    const ratio = hexContrastAgainstWhite(raw.theme.accent);
    if (ratio < 4.5) {
      errors.push(
        `Accent colour ${raw.theme.accent} contrast (${ratio}:1) is below WCAG AA 4.5:1 against white text.`
      );
    }
  }

  const cleanedTemplate: MezgebTemplate = {
    ...raw,
    idRoutes: rawRoutes.length > 0 ? rawRoutes : ["fayda", "refugee_id", "other_document", "partner_refer"],
    questions: cleanedQuestions,
  };

  return {
    valid: errors.length === 0,
    errors,
    template: cleanedTemplate,
  };
}

const JARGON_PATTERNS: RegExp[] = [
  /\bcredentials?\b/i,
  /\bverification\b/i,
  /\bresidence\b/i,
  /\bnationality status\b/i,
  /\bsubmit\b/i,
  /\bauthenticate\b/i,
  /\bbeneficiar(y|ies)\b/i,
];

const MEDICAL_PATTERNS: RegExp[] = [
  /\bdiagnosis\b/i,
  /\bdisability type\b/i,
  /\bmedical\b/i,
  /\bcondition\b/i,
  /\bimpairment\b/i,
];

export function evaluateTemplateChecker(template: MezgebTemplate): CheckerIssue[] {
  const issues: CheckerIssue[] = [];
  const questions = template.questions ?? [];

  // 1. No ID route
  if (!template.idRoutes || template.idRoutes.length === 0) {
    issues.push({
      id: "must-no-id-route",
      severity: "must",
      issue: "No ID route is enabled for learners.",
      suggestion: "Enable at least one ID route (Fayda, Refugee ID, Other document, or Partner referral).",
      autoFixId: "restore_id_routes",
    });
  } else if (template.idRoutes.length === 1 && template.idRoutes[0] === "fayda") {
    issues.push({
      id: "should-only-fayda",
      severity: "should",
      issue: "Learners without a Fayda ID will be blocked.",
      suggestion: "Add Refugee ID, Other document, or Partner referral so no learner is turned away.",
      autoFixId: "add_all_id_routes",
    });
  }

  // 2. Accent contrast
  const accent = template.theme?.accent ?? "#6A4FC4";
  const ratio = hexContrastAgainstWhite(accent);
  if (ratio < 4.5) {
    issues.push({
      id: "must-accent-contrast",
      severity: "must",
      issue: `Accent colour ${accent} is too light for white text (${ratio}:1, needs 4.5:1).`,
      suggestion: "Choose a darker colour in the Look tab.",
      autoFixId: "fix_accent",
    });
  }

  // 3. Support question count
  const supportQuestions = questions.filter((q) => q.type === "support");
  if (supportQuestions.length > 1) {
    for (const sq of supportQuestions.slice(1)) {
      issues.push({
        id: `must-extra-support-${sq.id}`,
        severity: "must",
        questionId: sq.id,
        issue: `"${sq.label.en || sq.id}" adds a second support question.`,
        suggestion: "Keep at most one support question per template.",
      });
    }
  }

  // 4. Required consent missing when sensitive questions exist
  const hasSensitive = questions.some((q) => Boolean(q.sensitive));
  const hasBottomConsent = Boolean(template.consent?.en?.trim() && template.consent?.am?.trim());
  if (hasSensitive && !hasBottomConsent) {
    issues.push({
      id: "must-missing-consent",
      severity: "must",
      issue: "Sensitive questions exist, but the consent text is incomplete.",
      suggestion: "Add clear consent text in both English and Amharic.",
      autoFixId: "add_recommended_consent",
    });
  }

  // 5. Question count > 12 input questions
  const inputQuestions = questions.filter((q) => q.type !== "info");
  if (inputQuestions.length > 12) {
    issues.push({
      id: "should-too-many-questions",
      severity: "should",
      issue: `Template has ${inputQuestions.length} input questions (recommended max is 12).`,
      suggestion: "Remove unnecessary questions or make optional steps conditional to avoid drop-off.",
    });
  }

  // 6. Tip: no info screen explaining why ID is asked
  const hasIdQuestion = questions.some((q) => q.type === "id-routes");
  const hasInfoScreen = questions.some((q) => q.type === "info");
  if (hasIdQuestion && !hasInfoScreen) {
    issues.push({
      id: "tip-no-id-info",
      severity: "tip",
      questionId: questions.find((q) => q.type === "id-routes")?.id,
      issue: "No information screen explains why identity is asked.",
      suggestion: "Consider adding an info screen before ID selection so learners know Fayda is optional.",
      autoFixId: "add_id_info_screen",
    });
  }

  // Per-question rules
  const mapsToSeen = new Map<string, string>();
  const missingAudioIds: string[] = [];

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const enLabel = q.label?.en?.trim() ?? "";
    const amLabel = q.label?.am?.trim() ?? "";
    const displayTitle = enLabel || amLabel || q.id;

    // Must: missing label in either language
    if (!enLabel || !amLabel) {
      issues.push({
        id: `must-missing-label-${q.id}`,
        severity: "must",
        questionId: q.id,
        issue: `"${displayTitle}" is missing a ${!enLabel ? "English" : "Amharic"} label.`,
        suggestion: "Fill in both English and Amharic labels so every learner can switch languages.",
      });
    }

    // Must: choice/multichoice < 2 options or incomplete options
    if (q.type === "choice" || q.type === "multichoice") {
      const opts = q.options ?? [];
      if (opts.length < 2) {
        issues.push({
          id: `must-few-options-${q.id}`,
          severity: "must",
          questionId: q.id,
          issue: `"${displayTitle}" needs at least 2 answer options.`,
          suggestion: "Add options in the Answer options panel.",
        });
      } else if (opts.some((o) => !o.label?.en?.trim() || !o.label?.am?.trim())) {
        issues.push({
          id: `must-option-lang-${q.id}`,
          severity: "must",
          questionId: q.id,
          issue: `"${displayTitle}" has an option missing English or Amharic text.`,
          suggestion: "Add both language labels for every option.",
        });
      }
    }

    // Must: duplicate maps_to
    const mKey = (q.maps_to ?? "").trim();
    if (q.type !== "info" && mKey && !mKey.startsWith("custom_")) {
      if (mapsToSeen.has(mKey)) {
        issues.push({
          id: `must-dup-maps-${q.id}`,
          severity: "must",
          questionId: q.id,
          issue: `"${displayTitle}" saves to "${mKey}", which is already used by another question.`,
          suggestion: "Rename \"Saves to field\" so answers do not overwrite each other.",
          autoFixId: `rename_maps_to:${q.id}`,
        });
      } else {
        mapsToSeen.set(mKey, q.id);
      }
    }

    // Must: showIf pointing to missing or later question
    if (q.showIf) {
      const targetIdx = questions.findIndex((item) => item.id === q.showIf?.questionId);
      if (targetIdx === -1 || targetIdx >= i) {
        issues.push({
          id: `must-bad-showif-${q.id}`,
          severity: "must",
          questionId: q.id,
          issue: `"${displayTitle}" depends on a question that is missing or comes later.`,
          suggestion: "Point \"Show only if\" to an earlier question or remove the condition.",
          autoFixId: `remove_show_if:${q.id}`,
        });
      }
    }

    // Must: skippable + required conflict
    if (q.skippable && q.required) {
      issues.push({
        id: `must-skip-req-${q.id}`,
        severity: "must",
        questionId: q.id,
        issue: `"${displayTitle}" is both required and marked skippable.`,
        suggestion: "Turn off Required or remove the Skip button.",
        autoFixId: `disable_skippable:${q.id}`,
      });
    }

    // Should: label longer than 14 words
    const enWords = enLabel.split(/\s+/).filter(Boolean);
    if (enWords.length > 14) {
      issues.push({
        id: `should-long-label-${q.id}`,
        severity: "should",
        questionId: q.id,
        issue: `"${displayTitle}" is ${enWords.length} words long (target: 14 words or fewer).`,
        suggestion: "Shorten the main question and move extra detail into the Hint field.",
      });
    }

    // Should: double-barrelled " and " or " or "
    const cleanedForDouble = enLabel
      .replace(/\b(company|organisation|organization)\s+or\s+(company|organisation|organization)\b/gi, "organisation")
      .replace(/\b(city|sub-city|area|town)\s+or\s+(city|sub-city|area|town|region)\b/gi, "area")
      .replace(/\b(learn)\s+or\s+(test)\b/gi, "learn");
    if (
      /\s+(and|or)\s+/i.test(cleanedForDouble) &&
      (cleanedForDouble.split("?").length > 2 ||
        enWords.length >= 6 ||
        /\b(name|phone|email|date|age|area|address|work|job)\s+(and|or)\s+(name|phone|email|date|age|area|address|work|job)\b/i.test(
          cleanedForDouble
        ))
    ) {
      issues.push({
        id: `should-double-q-${q.id}`,
        severity: "should",
        questionId: q.id,
        issue: `"${displayTitle}" may join two questions with "and" / "or".`,
        suggestion: "Keep one clear question per screen so learners do not miss part of the question.",
      });
    }

    // Should: jargon words
    const combinedNonSupport = `${enLabel} ${q.hint?.en ?? ""}`;
    for (const pat of JARGON_PATTERNS) {
      const m = combinedNonSupport.match(pat);
      if (m) {
        issues.push({
          id: `should-jargon-${q.id}-${m[0].toLowerCase()}`,
          severity: "should",
          questionId: q.id,
          issue: `"${displayTitle}" uses technical wording ("${m[0]}").`,
          suggestion: "Replace with everyday speech (e.g. \"check\" instead of \"verification\", \"send\" instead of \"submit\").",
        });
        break;
      }
    }

    // Should: medical words anywhere except support step's privacy note
    const textToScanForMedical = q.type === "support" ? enLabel : `${enLabel} ${q.hint?.en ?? ""}`;
    for (const pat of MEDICAL_PATTERNS) {
      const m = textToScanForMedical.match(pat);
      if (m) {
        issues.push({
          id: `should-medical-${q.id}`,
          severity: "should",
          questionId: q.id,
          issue: `"${displayTitle}" mentions medical wording ("${m[0]}").`,
          suggestion: "Ask what practical support helps the learner rather than asking for diagnoses or medical details.",
        });
        break;
      }
    }

    // Should: email required
    if (q.type === "email" && q.required) {
      issues.push({
        id: `should-email-req-${q.id}`,
        severity: "should",
        questionId: q.id,
        issue: `Email question "${displayTitle}" is marked required.`,
        suggestion: "Many learners do not have email. Make email optional.",
        autoFixId: `make_optional:${q.id}`,
      });
    }

    // Should: sensitive question required
    if (q.sensitive && q.required) {
      issues.push({
        id: `should-sensitive-req-${q.id}`,
        severity: "should",
        questionId: q.id,
        issue: `Sensitive question "${displayTitle}" is marked required.`,
        suggestion: "Make sensitive questions optional so learners are never forced to disclose personal details.",
        autoFixId: `make_optional:${q.id}`,
      });
    }

    // Should: no hint on date or phone
    if ((q.type === "date" || q.type === "phone") && (!q.hint?.en?.trim() || !q.hint?.am?.trim())) {
      issues.push({
        id: `should-missing-hint-${q.id}`,
        severity: "should",
        questionId: q.id,
        issue: `${q.type === "phone" ? "Phone" : "Date"} question "${displayTitle}" has no format hint.`,
        suggestion: "Add a clear hint in both languages (e.g. \"10 digits starting with 09 or 07\").",
        autoFixId: `add_hint:${q.id}`,
      });
    }

    // Tip: optional sensitive choice without "Prefer not to say"
    if (
      q.sensitive &&
      !q.required &&
      (q.type === "choice" || q.type === "multichoice") &&
      !(q.options ?? []).some((o) => o.value === "prefer_not_to_say")
    ) {
      issues.push({
        id: `tip-prefer-not-${q.id}`,
        severity: "tip",
        questionId: q.id,
        issue: `Optional sensitive choice "${displayTitle}" has no "Prefer not to say" option.`,
        suggestion: "Add a \"Prefer not to say\" option so learners can explicitly opt out.",
        autoFixId: `add_prefer_not:${q.id}`,
      });
    }

    if (q.type !== "info" && !q.audio?.am && !q.audio?.en) {
      missingAudioIds.push(q.id);
    }
  }

  if (missingAudioIds.length > 0) {
    issues.push({
      id: "tip-missing-audio",
      severity: "tip",
      questionId: missingAudioIds[0],
      issue: `${missingAudioIds.length} question(s) have no pre-recorded Amharic/English audio files yet.`,
      suggestion: "Add audio URLs in Accessibility and voice for devices without an Amharic speech voice.",
    });
  }

  return issues;
}

export function applyCheckerAutoFix(template: MezgebTemplate, autoFixId: string): MezgebTemplate {
  const next = structuredClone(template);
  const [action, targetId] = autoFixId.split(":");

  if (action === "restore_id_routes" || action === "add_all_id_routes") {
    next.idRoutes = ["fayda", "refugee_id", "other_document", "partner_refer"];
    return next;
  }

  if (action === "fix_accent") {
    next.theme = {
      platformName: next.theme?.platformName || "Learnhub",
      logoLetter: next.theme?.logoLetter || "L",
      accent: "#6A4FC4",
    };
    return next;
  }

  if (action === "add_recommended_consent") {
    next.consent = {
      en: "I agree to create a profile. My support preferences stay private unless I choose to share them.",
      am: "መገለጫ ለመፍጠር ተስማምቻለሁ። ለማጋራት ካልመረጥኩ በስተቀር የድጋፍ ምርጫዎቼ ሚስጥራዊ ሆነው ይቆያሉ።",
    };
    return next;
  }

  if (action === "add_id_info_screen") {
    const idIdx = next.questions.findIndex((q) => q.type === "id-routes");
    const infoQ: TemplateQuestion = {
      id: `why_id_${Date.now().toString(36)}`,
      type: "info",
      section: idIdx >= 0 ? next.questions[idIdx].section ?? "identity" : "identity",
      label: {
        en: "Why we ask for identity",
        am: "ማንነት ለምን እንደምንጠይቅ",
      },
      hint: {
        en: "We accept Fayda, a refugee ID, another document, or a partner referral. You will never be blocked for not having a Fayda ID.",
        am: "ፋይዳ፣ የስደተኛ መታወቂያ፣ ሌላ ሰነድ ወይም የአጋር ማጣቀሻ እንቀበላለን። ፋይዳ ስለሌለዎት በፍጹም አይታገዱም።",
      },
      icon: "info",
      required: false,
      maps_to: "custom_info_id",
    };
    if (idIdx >= 0) {
      next.questions.splice(idIdx, 0, infoQ);
    } else {
      next.questions.push(infoQ);
    }
    return next;
  }

  if (!targetId) return next;

  next.questions = next.questions.map((q) => {
    if (q.id !== targetId) return q;
    if (action === "rename_maps_to") {
      return { ...q, maps_to: `${q.maps_to || "field"}_${q.id.slice(-4)}` };
    }
    if (action === "remove_show_if") {
      const copy = { ...q };
      delete copy.showIf;
      return copy;
    }
    if (action === "disable_skippable") {
      return { ...q, skippable: false };
    }
    if (action === "make_optional") {
      return { ...q, required: false };
    }
    if (action === "add_hint") {
      if (q.type === "phone") {
        return {
          ...q,
          hint: {
            en: "10 digits starting with 09 or 07.",
            am: "በ 09 ወይም 07 የሚጀምር ባለ 10 አሃዝ ቁጥር።",
          },
        };
      }
      return {
        ...q,
        hint: {
          en: "Ethiopian calendar is selected by default.",
          am: "በነባሪነት የኢትዮጵያ ቀን መቁጠሪያ ተመርጧል።",
        },
      };
    }
    if (action === "add_prefer_not") {
      const opts = [...(q.options ?? [])];
      if (!opts.some((o) => o.value === "prefer_not_to_say")) {
        opts.push({
          value: "prefer_not_to_say",
          label: { en: "Prefer not to say", am: "መናገር አልፈልግም" },
        });
      }
      return { ...q, options: opts };
    }
    return q;
  });

  return next;
}
