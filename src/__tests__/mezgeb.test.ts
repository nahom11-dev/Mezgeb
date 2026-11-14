import { describe, expect, it } from "vitest";
import { translations } from "../i18n";
import {
  daysInEthiopianMonth,
  daysInGregorianMonth,
  ethiopianToGregorian,
  formatGregorianIso,
  gregorianToEthiopian,
  isValidEthiopianDate,
  isValidGregorianDate,
} from "../lib/ethiopianCalendar";
import {
  buildCompletedProfile,
  buildHelpScreenSummary,
  isQuestionVisible,
  validatePhone,
} from "../lib/validation";
import { LEARNING_PLATFORM_TEMPLATE, TEMPLATES } from "../templates";
import { parsePastedFormFields } from "../templates/library";
import { MezgebTemplate } from "../templates/types";
import {
  applyCheckerAutoFix,
  evaluateTemplateChecker,
  hexContrastAgainstWhite,
  validateTemplate,
} from "../templates/validate";

describe("Ethiopian calendar conversions & validation", () => {
  it("converts 1 Meskerem 2018 EC to 2025-09-11", () => {
    const greg = ethiopianToGregorian({ year: 2018, month: 1, day: 1 });
    expect(formatGregorianIso(greg)).toBe("2025-09-11");
  });

  it("converts 12 Meskerem 1990 EC to 1997-09-22", () => {
    const greg = ethiopianToGregorian({ year: 1990, month: 1, day: 12 });
    expect(formatGregorianIso(greg)).toBe("1997-09-22");
  });

  it("converts 2026-11-14 to 5 Hidar 2019 EC", () => {
    const eth = gregorianToEthiopian({ year: 2026, month: 11, day: 14 });
    expect(eth).toEqual({ year: 2019, month: 3, day: 5 });
  });

  it("computes Pagume days correctly for leap (2015) and non-leap (2016) years", () => {
    expect(daysInEthiopianMonth(2015, 13)).toBe(6);
    expect(daysInEthiopianMonth(2016, 13)).toBe(5);
  });

  it("round-trips every single day in Ethiopian year 2017 (365 days)", () => {
    let count = 0;
    for (let month = 1; month <= 13; month++) {
      const maxDay = daysInEthiopianMonth(2017, month);
      for (let day = 1; day <= maxDay; day++) {
        const greg = ethiopianToGregorian({ year: 2017, month, day });
        const back = gregorianToEthiopian(greg);
        expect(back).toEqual({ year: 2017, month, day });
        count++;
      }
    }
    expect(count).toBe(365);
  });

  it("enforces Gregorian leap years and dynamic age 14-100 year bounds", () => {
    const refNow = new Date("2026-11-14T00:00:00Z");
    expect(daysInGregorianMonth(2000, 2)).toBe(29);
    expect(daysInGregorianMonth(1997, 2)).toBe(28);
    expect(isValidGregorianDate(1996, 2, 29, refNow)).toBe(true);
    expect(isValidGregorianDate(1997, 2, 29, refNow)).toBe(false);
    expect(isValidGregorianDate(2020, 1, 1, refNow)).toBe(false); // too young (<14)
    expect(isValidEthiopianDate(1990, 1, 12, refNow)).toBe(true);
    expect(isValidEthiopianDate(1990, 13, 6, refNow)).toBe(false); // 1990 EC not Pagume 6
  });
});

describe("Phone number validation", () => {
  it("accepts 10-digit Ethiopian numbers starting with 09 or 07", () => {
    expect(validatePhone("0912345678")).toBe(true);
    expect(validatePhone("0712345678")).toBe(true);
    expect(validatePhone("091 234 5678")).toBe(true);
  });

  it("rejects short numbers, invalid prefixes, and letters", () => {
    expect(validatePhone("091234567")).toBe(false);
    expect(validatePhone("0812345678")).toBe(false);
    expect(validatePhone("091234abcd")).toBe(false);
    expect(validatePhone("")).toBe(false);
  });
});

describe("Smart Help payload privacy stripping", () => {
  it("never includes learner answers in ScreenSummaryForAi", () => {
    const secretName = "LEARNER_SECRET_NAME_XYZ";
    const summary = buildHelpScreenSummary({
      stepNumber: 2,
      currentQuestion: LEARNING_PLATFORM_TEMPLATE.questions[1],
      lang: "en",
      errors: [{ fieldId: "f-name", code: "REQUIRED", message: "Please answer this question." }],
      buttonNames: ["Back", "Continue"],
      reviewTitle: "Review",
    });
    const serialized = JSON.stringify(summary);
    expect(serialized).not.toContain(secretName);
    expect(summary.questionId).toBe("full_name");
    expect(summary.errors[0].code).toBe("REQUIRED");
  });
});

describe("Template validator", () => {
  it("validates all built-in templates cleanly with zero must/should checker issues", () => {
    for (const tpl of TEMPLATES) {
      const res = validateTemplate(tpl);
      expect(res.valid).toBe(true);
      const issues = evaluateTemplateChecker(tpl);
      expect(issues.filter((i) => i.severity === "must")).toHaveLength(0);
      expect(issues.filter((i) => i.severity === "should")).toHaveLength(0);
    }
  });

  it("rejects unknown types, duplicate ids, and multiple support questions, and fixes bad icons", () => {
    const badTemplate: MezgebTemplate = {
      ...structuredClone(LEARNING_PLATFORM_TEMPLATE),
      questions: [
        {
          id: "q1",
          type: "text",
          label: { en: "Name", am: "ስም" },
          icon: "nonexistent-icon",
          required: true,
          maps_to: "name",
        },
        {
          id: "q1",
          type: "text",
          label: { en: "Dup", am: "ድግግሞሽ" },
          icon: "user",
          required: false,
          maps_to: "dup",
        },
        {
          id: "q_bad_type",
          type: "mystery" as never,
          label: { en: "Bad", am: "መጥፎ" },
          icon: "user",
          required: false,
          maps_to: "bad",
        },
        {
          id: "sup1",
          type: "support",
          label: { en: "Support 1", am: "ድጋፍ 1" },
          icon: "heart-handshake",
          required: false,
          maps_to: "support_needs",
        },
        {
          id: "sup2",
          type: "support",
          label: { en: "Support 2", am: "ድጋፍ 2" },
          icon: "heart-handshake",
          required: false,
          maps_to: "support_needs_2",
        },
      ],
    };

    const result = validateTemplate(badTemplate);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("Duplicate question id"))).toBe(true);
    expect(result.errors.some((e) => e.includes("unknown type"))).toBe(true);
    expect(result.errors.some((e) => e.includes("multiple \"support\""))).toBe(true);
    expect(result.template.questions[0].icon).toBe("user");
  });

  it("rejects forward showIf, <2 choice options, skippable+required, duplicate maps_to, and low contrast accent", () => {
    const badTpl: MezgebTemplate = {
      ...structuredClone(LEARNING_PLATFORM_TEMPLATE),
      theme: { accent: "#DDDDDD", platformName: "Test", logoLetter: "T" },
      questions: [
        {
          id: "q1",
          type: "text",
          label: { en: "First", am: "መጀመሪያ" },
          icon: "user",
          required: true,
          skippable: true,
          showIf: { questionId: "q2", equals: "a" },
          maps_to: "shared_key",
        },
        {
          id: "q2",
          type: "choice",
          label: { en: "Second", am: "ሁለተኛ" },
          icon: "globe",
          required: true,
          options: [{ value: "a", label: { en: "Only one", am: "አንድ" } }],
          maps_to: "shared_key",
        },
      ],
    };

    expect(hexContrastAgainstWhite("#DDDDDD")).toBeLessThan(4.5);
    const res = validateTemplate(badTpl);
    expect(res.valid).toBe(false);
    expect(res.errors.some((e) => e.includes("earlier"))).toBe(true);
    expect(res.errors.some((e) => e.includes("at least 2"))).toBe(true);
    expect(res.errors.some((e) => e.includes("skippable"))).toBe(true);
    expect(res.errors.some((e) => e.includes("Duplicate maps_to"))).toBe(true);
    expect(res.errors.some((e) => e.includes("contrast"))).toBe(true);
  });
});

describe("Template Checker & Auto-Fix", () => {
  it("flags long labels, medical words, duplicate maps_to, and fixes auto-fixable issues", () => {
    const tpl: MezgebTemplate = {
      ...structuredClone(LEARNING_PLATFORM_TEMPLATE),
      idRoutes: ["fayda"],
      theme: { accent: "#FACC15", platformName: "Bright", logoLetter: "B" },
      questions: [
        {
          id: "q_long",
          type: "text",
          label: {
            en: "Please tell us all about your full residential history and previous schools over the past ten years",
            am: "ታሪክዎን ይንገሩን",
          },
          icon: "user",
          required: true,
          maps_to: "name",
        },
        {
          id: "q_med",
          type: "text",
          label: { en: "What is your medical diagnosis?", am: "የህክምና ሁኔታዎ ምንድን ነው?" },
          icon: "user",
          required: false,
          maps_to: "name",
        },
      ],
    };

    const issues = evaluateTemplateChecker(tpl);
    expect(issues.some((i) => i.id.includes("should-long-label"))).toBe(true);
    expect(issues.some((i) => i.id.includes("should-medical"))).toBe(true);
    expect(issues.some((i) => i.id.includes("must-dup-maps"))).toBe(true);
    expect(issues.some((i) => i.id === "must-accent-contrast")).toBe(true);
    expect(issues.some((i) => i.id === "should-only-fayda")).toBe(true);

    let fixed = applyCheckerAutoFix(tpl, "fix_accent");
    fixed = applyCheckerAutoFix(fixed, "rename_maps_to:q_med");
    fixed = applyCheckerAutoFix(fixed, "restore_id_routes");
    const afterIssues = evaluateTemplateChecker(fixed);
    expect(afterIssues.some((i) => i.id === "must-accent-contrast")).toBe(false);
    expect(afterIssues.some((i) => i.id.includes("must-dup-maps"))).toBe(false);
    expect(afterIssues.some((i) => i.id === "should-only-fayda")).toBe(false);
  });
});

describe("Offline pasted form parser", () => {
  it("guesses phone, email, date, and choice questions with empty options", () => {
    const qs = parsePastedFormFields("Full name\nMobile phone\nEmail\nDate of birth\nRegion");
    expect(qs).toHaveLength(5);
    expect(qs[0].type).toBe("text");
    expect(qs[1].type).toBe("phone");
    expect(qs[2].type).toBe("email");
    expect(qs[2].required).toBe(false);
    expect(qs[3].type).toBe("date");
    expect(qs[4].type).toBe("choice");
    expect(qs[4].options).toEqual([]);
  });
});

describe("Completed profile builder & showIf rules", () => {
  it("omits unanswered optional fields and outputs partner_pending for partner_refer", () => {
    const { profile, supportShared } = buildCompletedProfile({
      answers: {
        language: "am",
        full_name: "Abebe Bikila",
        area: "bole",
        phone: "0911223344",
        dob_calendar: "eth",
        dob_eth_day: "12",
        dob_eth_month: "1",
        dob_eth_year: "1990",
        id_route: "partner_refer",
        partner_org: "Addis Accessibility Centre (sample)",
        support_needs: ["screen_reader"],
        support_share_platform: false,
      },
      template: LEARNING_PLATFORM_TEMPLATE,
    });

    expect(supportShared).toBe(false);
    expect(profile.id_route).toBe("partner_pending");
    expect(profile.partner_org).toBe("Addis Accessibility Centre (sample)");
    expect(profile.support_needs).toBeUndefined();
    expect(profile.skills).toBeUndefined();
    expect(profile.work_story).toBeUndefined();
    expect(profile.date_of_birth).toBe("1997-09-22");
  });

  it("includes support_needs only when support_share_platform is true", () => {
    const { profile, supportShared } = buildCompletedProfile({
      answers: {
        language: "en",
        full_name: "Tigist",
        id_route: "fayda",
        support_needs: ["extra_time"],
        support_share_platform: true,
      },
      template: LEARNING_PLATFORM_TEMPLATE,
    });

    expect(supportShared).toBe(true);
    expect(profile.support_needs).toEqual(["extra_time"]);
    expect(profile.id_route).toBe("fayda");
  });

  it("skips hidden showIf questions and info screens, and outputs yes-no/number/consent", () => {
    const tpl: MezgebTemplate = {
      ...structuredClone(LEARNING_PLATFORM_TEMPLATE),
      questions: [
        {
          id: "intro",
          type: "info",
          label: { en: "Welcome", am: "እንኳን ደህና መጡ" },
          icon: "info",
          required: false,
          maps_to: "custom_intro",
        },
        {
          id: "has_exp",
          type: "yes-no",
          label: { en: "Do you have work experience?", am: "የስራ ልምድ አለዎት?" },
          icon: "toggle-left",
          required: true,
          options: [
            { value: "yes", label: { en: "Yes", am: "አዎ" } },
            { value: "no", label: { en: "No", am: "አይ" } },
          ],
          maps_to: "has_experience",
        },
        {
          id: "years",
          type: "number",
          label: { en: "How many years?", am: "ስንት ዓመት?" },
          icon: "hash",
          required: true,
          showIf: { questionId: "has_exp", equals: "yes" },
          maps_to: "years_experience",
        },
        {
          id: "terms",
          type: "consent",
          label: { en: "I accept", am: "እቀበላለሁ" },
          icon: "check-square",
          required: true,
          maps_to: "terms_ok",
        },
      ],
    };

    expect(isQuestionVisible(tpl.questions[2], { has_exp: "no" }, tpl.questions)).toBe(false);
    expect(isQuestionVisible(tpl.questions[2], { has_exp: "yes" }, tpl.questions)).toBe(true);

    const hiddenOut = buildCompletedProfile({
      answers: { has_exp: "no", years: "5", terms: true },
      template: tpl,
    });
    expect(hiddenOut.profile.has_experience).toBe("no");
    expect(hiddenOut.profile.years_experience).toBeUndefined();
    expect(hiddenOut.profile.custom_intro).toBeUndefined();
    expect(hiddenOut.profile.terms_ok).toBe(true);

    const shownOut = buildCompletedProfile({
      answers: { has_exp: "yes", years: "5", terms: true },
      template: tpl,
    });
    expect(shownOut.profile.years_experience).toBe(5);
  });
});

describe("i18n dictionary parity", () => {
  it("has identical non-empty keys in en and am", () => {
    const enKeys = Object.keys(translations.en).sort();
    const amKeys = Object.keys(translations.am).sort();
    expect(amKeys).toEqual(enKeys);
    for (const key of enKeys) {
      expect(String(translations.en[key as keyof typeof translations.en]).length).toBeGreaterThan(0);
      expect(String(translations.am[key as keyof typeof translations.am]).length).toBeGreaterThan(0);
    }
  });
});
