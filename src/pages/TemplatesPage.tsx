import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AccessibleDialog } from "../components/AccessibleDialog";
import {
  ClockIcon,
  DownloadIcon,
  GlobeIcon,
  LockIcon,
  MoreHorizontalIcon,
  QuestionIcon,
  ShieldIcon,
} from "../components/Icons";
import { useLiveAnnouncer } from "../components/LiveAnnouncer";
import { MezgebWidget } from "../components/MezgebWidget";
import { Layout } from "../components/Layout";
import { Lang, useI18n } from "../i18n";
import { safeSetSession } from "../lib/storage";
import { getEffectiveSettings, TEMPLATES } from "../templates";
import {
  deleteFromMyTemplates,
  duplicateMyTemplate,
  loadMyTemplates,
  renameMyTemplate,
} from "../templates/storage";
import { IdRoute, MezgebTemplate, TemplateCategory } from "../templates/types";
import { validateTemplate } from "../templates/validate";

type FilterChip = "all" | "learning" | "jobs" | "employer" | "ngo" | "mine";

const FIELD_PLAIN_WORDS: Record<string, { en: string; am: string }> = {
  preferred_language: { en: "language", am: "ቋንቋ" },
  name: { en: "name", am: "ስም" },
  area: { en: "area", am: "አካባቢ" },
  region: { en: "region", am: "ክልል" },
  phone: { en: "phone", am: "ስልክ" },
  date_of_birth: { en: "date of birth", am: "የትውልድ ቀን" },
  id_route: { en: "ID option", am: "የመታወቂያ አማራጭ" },
  support_needs: { en: "support needs", am: "የድጋፍ ፍላጎት" },
  skills: { en: "work story & skills", am: "የስራ ታሪክና ክህሎት" },
  job_goal: { en: "job goal", am: "የሚፈልጉት ስራ" },
  job_title: { en: "job title", am: "የስራ መደብ" },
  company_name: { en: "company name", am: "የኩባንያ ስም" },
  job_location: { en: "job location", am: "የስራ ቦታ" },
  contact_person: { en: "hiring contact", am: "ተጠሪ ሰው" },
  offered_accommodations: { en: "workplace support", am: "የስራ ቦታ ድጋፍ" },
  email: { en: "email", am: "ኢሜይል" },
  education_level: { en: "education level", am: "የትምህርት ደረጃ" },
  training_centre: { en: "training centre", am: "የስልጠና ማዕከል" },
  emergency_phone: { en: "emergency phone", am: "የድንገተኛ ስልክ" },
  referral_source: { en: "how they heard", am: "መረጃ ምንጭ" },
};

function estimateMinutes(tpl: MezgebTemplate): number {
  const inputCount = tpl.questions.filter((q) => q.type !== "info").length;
  return Math.max(1, Math.ceil((inputCount * 20) / 60));
}

function getIdRouteLabel(route: IdRoute, t: (k: any) => string): string {
  switch (route) {
    case "fayda":
      return t("idRouteFayda");
    case "refugee_id":
      return t("idRouteRefugee");
    case "other_document":
      return t("idRouteOther");
    case "partner_refer":
      return t("idRoutePartner");
  }
}

function getCategoryLabel(cat: TemplateCategory | undefined, t: (k: any) => string): string {
  switch (cat) {
    case "learning":
      return t("catLearning");
    case "jobs":
      return t("catJobs");
    case "employer":
      return t("catEmployer");
    case "ngo":
      return t("catNgo");
    default:
      return t("catCustom");
  }
}

function formatCollectsList(tpl: MezgebTemplate, lang: Lang): string {
  const seen = new Set<string>();
  const words: string[] = [];
  for (const q of tpl.questions) {
    if (q.type === "info" || !q.maps_to || q.maps_to.startsWith("custom_")) continue;
    if (seen.has(q.maps_to)) continue;
    seen.add(q.maps_to);
    const entry = FIELD_PLAIN_WORDS[q.maps_to];
    const word = entry ? entry[lang] : q.maps_to.replace(/_/g, " ");
    words.push(words.length === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word);
  }
  return words.join(", ");
}

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

function MiniPhonePreview({ tpl, lang }: { tpl: MezgebTemplate; lang: Lang }) {
  const firstQ =
    tpl.questions.find((q) => q.id !== "language" && q.type !== "info") ?? tpl.questions[0];
  const platformName = tpl.theme?.platformName || "Learnhub";
  const accent = tpl.theme?.accent || "#6A4FC4";
  const firstOpts = firstQ?.options?.slice(0, 2) ?? [];

  return (
    <div
      aria-hidden="true"
      className="w-[146px] shrink-0 rounded-[16px] border-2 border-[#161616] bg-white p-2.5 shadow-xs select-none"
    >
      <div className="flex items-center justify-between text-[9px] text-[#6B6B6B] mb-1.5">
        <span className="font-semibold text-[#111111] truncate max-w-[74px]">{platformName}</span>
        <span>1 / {tpl.questions.length}</span>
      </div>
      <div className="w-full h-1 bg-[#E7E7E4] rounded-full overflow-hidden mb-2">
        <div className="h-full w-1/3" style={{ backgroundColor: accent }} />
      </div>
      <p className="text-[10px] font-semibold text-[#111111] leading-snug line-clamp-2 mb-2">
        {firstQ ? firstQ.label[lang] : tpl.name[lang]}
      </p>
      {firstOpts.length > 0 ? (
        <div className="space-y-1">
          {firstOpts.map((opt) => (
            <div
              key={opt.value}
              className="px-1.5 py-1 rounded border border-[#E7E7E4] bg-[#F5F5F3] text-[9px] text-[#111111] truncate"
            >
              {opt.label[lang]}
            </div>
          ))}
        </div>
      ) : (
        <div className="h-6 rounded border border-[#E7E7E4] bg-[#FAF9F6] px-1.5 flex items-center text-[9px] text-[#6B6B6B]">
          {firstQ?.type === "phone" ? "091 234 5678" : "…"}
        </div>
      )}
    </div>
  );
}

export function TemplatesPage() {
  const { lang, setLang, t } = useI18n();
  const { announce } = useLiveAnnouncer();
  const navigate = useNavigate();

  const [myTemplates, setMyTemplates] = useState<MezgebTemplate[]>(() => loadMyTemplates().templates);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterChip>("all");
  const [compareOpen, setCompareOpen] = useState(false);

  // Card action menu + dialogs
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [renameTarget, setRenameTarget] = useState<MezgebTemplate | null>(null);
  const [renameEn, setRenameEn] = useState("");
  const [renameAm, setRenameAm] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<MezgebTemplate | null>(null);

  // Upgraded Preview dialog
  const [previewTemplate, setPreviewTemplate] = useState<MezgebTemplate | null>(null);
  const [previewTab, setPreviewTab] = useState<"preview" | "questions" | "json">("preview");
  const [previewDevice, setPreviewDevice] = useState<"phone" | "desktop">("phone");
  const [previewJumpId, setPreviewJumpId] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string[]>([]);

  useEffect(() => {
    if (!openMenuId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenuId(null);
    };
    const onClick = () => setOpenMenuId(null);
    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("click", onClick);
    };
  }, [openMenuId]);

  const combinedTemplates = useMemo(() => {
    const builtIn = TEMPLATES.map((tpl) => ({ tpl, isCustom: false }));
    const custom = myTemplates.map((tpl) => ({ tpl, isCustom: true }));
    return [...custom, ...builtIn];
  }, [myTemplates]);

  const filteredTemplates = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return combinedTemplates.filter(({ tpl, isCustom }) => {
      if (activeFilter === "mine" && !isCustom) return false;
      if (
        activeFilter !== "all" &&
        activeFilter !== "mine" &&
        tpl.category !== activeFilter
      ) {
        return false;
      }
      if (!q) return true;
      const haystack = [
        tpl.name.en,
        tpl.name.am,
        tpl.description.en,
        tpl.description.am,
        tpl.bestFor?.en ?? "",
        tpl.bestFor?.am ?? "",
        ...tpl.questions.map((item) => `${item.label.en} ${item.label.am}`),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [combinedTemplates, activeFilter, searchQuery]);

  const handleUseInPlayground = (tpl: MezgebTemplate) => {
    const validated = validateTemplate(tpl);
    if (!validated.valid) {
      setPreviewError(validated.errors);
      setPreviewTemplate(tpl);
      setPreviewTab("questions");
      return;
    }
    setPreviewError([]);
    safeSetSession("mezgeb_custom_template", JSON.stringify(validated.template));
    navigate("/playground", { state: { template: validated.template } });
  };

  const handleCustomize = (tpl: MezgebTemplate) => {
    navigate(`/templates/builder?id=${encodeURIComponent(tpl.id)}`, {
      state: { template: structuredClone(tpl) },
    });
  };

  const openPreview = (tpl: MezgebTemplate) => {
    setPreviewError([]);
    setPreviewTab("preview");
    setPreviewDevice("phone");
    setPreviewJumpId(tpl.questions[0]?.id ?? null);
    setPreviewTemplate(tpl);
  };

  const filterChips: { id: FilterChip; label: string }[] = [
    { id: "all", label: t("templatesFilterAll") },
    { id: "learning", label: t("templatesFilterLearning") },
    { id: "jobs", label: t("templatesFilterJobs") },
    { id: "employer", label: t("templatesFilterEmployer") },
    { id: "ngo", label: t("templatesFilterNgo") },
    { id: "mine", label: t("templatesFilterMine") },
  ];

  return (
    <Layout>
      <section aria-labelledby="templates-heading" className="py-12 md:py-16 bg-[#FAF9F6] min-h-[75vh]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 space-y-10">
          {/* Header & Controls */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="max-w-2xl space-y-2.5">
                <h1
                  id="templates-heading"
                  className="text-3xl md:text-4xl font-bold tracking-tight text-[#111111]"
                >
                  {t("templatesTitle")}
                </h1>
                <p className="text-base text-[#6B6B6B]">{t("templatesSubtitle")}</p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Link to="/templates/builder?mode=describe" className="mezgeb-btn-secondary text-sm">
                  {t("templatesBuildAiLink")}
                </Link>
                <Link to="/templates/builder" className="mezgeb-btn-primary text-sm">
                  {t("templatesOpenBuilderBtn")}
                </Link>
              </div>
            </div>

            {/* Search + Filter chips + Result count */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2">
              <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t("templatesTitle")}>
                {filterChips.map((chip) => {
                  const pressed = activeFilter === chip.id;
                  return (
                    <button
                      key={chip.id}
                      type="button"
                      aria-pressed={pressed}
                      onClick={() => setActiveFilter(chip.id)}
                      className={`px-3.5 min-h-[40px] rounded-lg border text-sm font-medium transition-colors ${
                        pressed
                          ? "bg-[#111111] border-[#111111] text-white"
                          : "bg-white border-[#E7E7E4] text-[#111111] hover:bg-[#F5F5F3]"
                      }`}
                    >
                      {chip.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-4">
                <div className="w-full sm:w-64">
                  <label htmlFor="templates-search" className="sr-only">
                    {t("templatesSearchLabel")}
                  </label>
                  <input
                    id="templates-search"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t("templatesSearchPlaceholder")}
                    className="w-full min-h-[42px] px-3.5 rounded-xl border border-[#E7E7E4] bg-white text-sm text-[#111111]"
                  />
                </div>
                <span
                  aria-live="polite"
                  className="text-sm font-medium text-[#6B6B6B] whitespace-nowrap"
                >
                  {filteredTemplates.length === 1
                    ? t("templatesResultCountOne")
                    : t("templatesResultCount", { count: filteredTemplates.length })}
                </span>
              </div>
            </div>
          </div>

          {/* Template Cards Grid */}
          {filteredTemplates.length === 0 ? (
            <div className="mezgeb-card p-8 text-center space-y-4">
              <p className="text-base text-[#6B6B6B]">
                {activeFilter === "mine" ? t("templatesEmptyMine") : t("templatesEmptySearch")}
              </p>
              <Link to="/templates/builder" className="mezgeb-btn-primary text-sm inline-flex">
                {t("templatesOpenBuilderBtn")}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTemplates.map(({ tpl, isCustom }) => {
                const settings = getEffectiveSettings(tpl);
                const hasSensitive = tpl.questions.some((q) => Boolean(q.sensitive));
                const mins = estimateMinutes(tpl);
                const collects = formatCollectsList(tpl, lang);

                const enabledFeatures: string[] = [];
                if (settings.voice) enabledFeatures.push(t("featVoice"));
                if (settings.readAloud) enabledFeatures.push(t("featReadAloud"));
                if (settings.smartHelp) enabledFeatures.push(t("featHelp"));
                if (settings.partnerReferral) enabledFeatures.push(t("featPartner"));
                if (settings.offline) enabledFeatures.push(t("featOffline"));

                return (
                  <article
                    key={`${isCustom ? "custom" : "builtin"}-${tpl.id}`}
                    className="mezgeb-card p-6 flex flex-col justify-between gap-5 relative"
                  >
                    <div className="space-y-4">
                      {/* Top row: Mini Phone Preview + Meta Header */}
                      <div className="flex flex-col sm:flex-row items-start gap-4">
                        <MiniPhonePreview tpl={tpl} lang={lang} />

                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                              <span className="px-2 py-0.5 rounded bg-[#F5F5F3] text-[#111111] border border-[#E7E7E4]">
                                {getCategoryLabel(tpl.category, t)}
                              </span>
                              {tpl.tested === true && (
                                <span className="px-2 py-0.5 rounded bg-[#E4F2EC] text-[#1F5C46]">
                                  {t("templatesTestedBadge")}
                                </span>
                              )}
                              {hasSensitive && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F9F3EA] text-[#111111] border border-[#E7E7E4]">
                                  <LockIcon size={11} />
                                  <span>{t("templatesSensitiveBadge")}</span>
                                </span>
                              )}
                            </div>

                            {isCustom && (
                              <div className="relative" onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  aria-label={t("templatesMoreActions")}
                                  aria-haspopup="menu"
                                  aria-expanded={openMenuId === tpl.id}
                                  onClick={() =>
                                    setOpenMenuId((prev) => (prev === tpl.id ? null : tpl.id))
                                  }
                                  className="w-9 h-9 rounded-lg border border-[#E7E7E4] bg-white hover:bg-[#F5F5F3] flex items-center justify-center text-[#111111]"
                                >
                                  <MoreHorizontalIcon size={16} />
                                </button>

                                {openMenuId === tpl.id && (
                                  <div
                                    role="menu"
                                    className="absolute right-0 mt-1 w-44 rounded-xl bg-white border border-[#E7E7E4] shadow-lg py-1 z-20"
                                  >
                                    <button
                                      type="button"
                                      role="menuitem"
                                      onClick={() => {
                                        const res = duplicateMyTemplate(tpl);
                                        setMyTemplates(res.templates);
                                        setOpenMenuId(null);
                                      }}
                                      className="w-full text-left px-3.5 py-2 text-sm text-[#111111] hover:bg-[#F5F5F3]"
                                    >
                                      {t("templatesActionDuplicate")}
                                    </button>
                                    <button
                                      type="button"
                                      role="menuitem"
                                      onClick={() => {
                                        setRenameTarget(tpl);
                                        setRenameEn(tpl.name.en);
                                        setRenameAm(tpl.name.am);
                                        setOpenMenuId(null);
                                      }}
                                      className="w-full text-left px-3.5 py-2 text-sm text-[#111111] hover:bg-[#F5F5F3]"
                                    >
                                      {t("templatesActionRename")}
                                    </button>
                                    <button
                                      type="button"
                                      role="menuitem"
                                      onClick={() => {
                                        downloadJsonFile(tpl);
                                        setOpenMenuId(null);
                                      }}
                                      className="w-full text-left px-3.5 py-2 text-sm text-[#111111] hover:bg-[#F5F5F3]"
                                    >
                                      {t("templatesActionExport")}
                                    </button>
                                    <button
                                      type="button"
                                      role="menuitem"
                                      onClick={() => {
                                        setDeleteTarget(tpl);
                                        setOpenMenuId(null);
                                      }}
                                      className="w-full text-left px-3.5 py-2 text-sm text-red-700 hover:bg-red-50"
                                    >
                                      {t("templatesActionDelete")}
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          <h2 className="text-[20px] font-semibold text-[#111111] leading-snug">
                            {tpl.name[lang]}
                          </h2>

                          <p className="text-sm text-[#6B6B6B] leading-relaxed">
                            {tpl.description[lang]}
                          </p>

                          {tpl.bestFor?.[lang] && (
                            <p className="text-xs text-[#111111]">
                              <span className="font-semibold">{t("templatesBestForLabel")}</span>{" "}
                              <span className="text-[#6B6B6B]">{tpl.bestFor[lang]}</span>
                            </p>
                          )}

                          {isCustom && tpl.updatedAt && (
                            <p className="text-xs text-[#6B6B6B]">
                              {t("templatesEditedOn", {
                                date: new Date(tpl.updatedAt).toLocaleDateString(),
                              })}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Facts Row */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#6B6B6B] pt-1">
                        <span className="inline-flex items-center gap-1.5 text-[#111111] font-medium">
                          <QuestionIcon name="check-square" size={14} />
                          <span>{t("templatesQuestionsCount", { count: tpl.questions.length })}</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[#111111] font-medium">
                          <ClockIcon size={14} />
                          <span>{t("templatesEstimateTime", { min: mins })}</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[#111111] font-medium">
                          <GlobeIcon size={14} />
                          <span>{t("templatesBothLangs")}</span>
                        </span>
                      </div>

                      {/* ID Routes, Features, Collects */}
                      <div className="space-y-1.5 text-xs border-t border-[#E7E7E4] pt-3">
                        <p className="text-[#6B6B6B]">
                          <span className="font-semibold text-[#111111]">{t("templatesIdRoutesLabel")}</span>{" "}
                          {tpl.idRoutes.map((r) => getIdRouteLabel(r, t)).join(" · ")}
                        </p>
                        {enabledFeatures.length > 0 && (
                          <p className="text-[#6B6B6B]">
                            <span className="font-semibold text-[#111111]">{t("setFeaturesTitle")}:</span>{" "}
                            {enabledFeatures.join(" · ")}
                          </p>
                        )}
                        {collects && (
                          <p className="text-[#6B6B6B]">
                            <span className="font-semibold text-[#111111]">{t("templatesCollectsLabel")}</span>{" "}
                            {collects}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-[#E7E7E4]">
                      <button
                        type="button"
                        onClick={() => openPreview(tpl)}
                        className="mezgeb-btn-secondary text-sm"
                      >
                        {t("templatesPreviewBtn")}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCustomize(tpl)}
                        className="mezgeb-btn-secondary text-sm"
                      >
                        {t("templatesCustomizeBtn")}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUseInPlayground(tpl)}
                        className="mezgeb-btn-primary text-sm ml-auto"
                      >
                        {t("templatesUseBtn")}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Compare Templates Disclosure */}
          <div className="pt-4 border-t border-[#E7E7E4] space-y-4">
            <button
              type="button"
              aria-expanded={compareOpen}
              onClick={() => setCompareOpen((v) => !v)}
              className="mezgeb-btn-secondary text-sm"
            >
              {t("templatesCompareBtn")}
            </button>

            {compareOpen && (
              <div className="mezgeb-card overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[#E7E7E4] bg-[#F5F5F3] text-xs font-semibold text-[#111111]">
                      <th className="py-3 px-4">{t("templatesCompareColTemplate")}</th>
                      <th className="py-3 px-4">{t("templatesCompareColQuestions")}</th>
                      <th className="py-3 px-4">{t("templatesCompareColTime")}</th>
                      <th className="py-3 px-4">{t("templatesCompareColRoutes")}</th>
                      <th className="py-3 px-4">{t("templatesCompareColVoice")}</th>
                      <th className="py-3 px-4">{t("templatesCompareColPartner")}</th>
                      <th className="py-3 px-4">{t("templatesCompareColSensitive")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E7E4]">
                    {TEMPLATES.map((tpl) => {
                      const settings = getEffectiveSettings(tpl);
                      const hasSensitive = tpl.questions.some((q) => Boolean(q.sensitive));
                      return (
                        <tr key={tpl.id} className="bg-white">
                          <th scope="row" className="py-3 px-4 font-semibold text-[#111111]">
                            {tpl.name[lang]}
                          </th>
                          <td className="py-3 px-4 text-[#6B6B6B]">{tpl.questions.length}</td>
                          <td className="py-3 px-4 text-[#6B6B6B]">
                            {t("templatesEstimateTime", { min: estimateMinutes(tpl) })}
                          </td>
                          <td className="py-3 px-4 text-[#6B6B6B]">
                            {tpl.idRoutes.map((r) => getIdRouteLabel(r, t)).join(", ")}
                          </td>
                          <td className="py-3 px-4 text-[#111111]">
                            {settings.voice ? t("yesButton") : t("noButton")}
                          </td>
                          <td className="py-3 px-4 text-[#111111]">
                            {settings.partnerReferral ? t("yesButton") : t("noButton")}
                          </td>
                          <td className="py-3 px-4 text-[#111111]">
                            {hasSensitive ? t("yesButton") : t("noButton")}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Upgraded Preview Dialog (Two panes + 3 tabs + Phone/Desktop + EN/አማ) */}
      <AccessibleDialog
        open={Boolean(previewTemplate)}
        onClose={() => setPreviewTemplate(null)}
        title={previewTemplate ? previewTemplate.name[lang] : ""}
        maxWidthClass="max-w-5xl"
      >
        {previewTemplate && (
          <div className="space-y-5">
            {previewError.length > 0 && (
              <div role="alert" className="p-3.5 rounded-xl bg-red-50 border border-red-300 text-sm text-red-900">
                <p className="font-semibold mb-1">{t("templatesValidationErrorsTitle")}</p>
                <ul className="list-disc pl-5 space-y-0.5">
                  {previewError.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Dialog Top Controls: Tabs + Lang + Phone/Desktop */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E7E7E4] pb-3">
              <div role="tablist" aria-label={t("templatesPreviewBtn")} className="flex items-center gap-1.5">
                {(
                  [
                    ["preview", t("templatesPreviewTabPreview")],
                    ["questions", t("templatesPreviewTabQuestions")],
                    ["json", t("templatesPreviewTabJson")],
                  ] as const
                ).map(([tabId, tabLabel]) => (
                  <button
                    key={tabId}
                    type="button"
                    role="tab"
                    aria-selected={previewTab === tabId}
                    onClick={() => setPreviewTab(tabId)}
                    className={`px-3.5 min-h-[38px] rounded-lg text-xs font-semibold transition-colors ${
                      previewTab === tabId
                        ? "bg-[#111111] text-white"
                        : "bg-[#F5F5F3] text-[#111111] hover:bg-[#E7E7E4]"
                    }`}
                  >
                    {tabLabel}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex rounded-lg border border-[#E7E7E4] bg-[#F5F5F3] p-0.5">
                  <button
                    type="button"
                    aria-pressed={lang === "en"}
                    onClick={() => setLang("en")}
                    className={`px-2.5 min-h-[32px] rounded-md text-xs font-semibold ${
                      lang === "en" ? "bg-white text-[#111111]" : "text-[#6B6B6B]"
                    }`}
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    aria-pressed={lang === "am"}
                    onClick={() => setLang("am")}
                    className={`px-2.5 min-h-[32px] rounded-md text-xs font-semibold ${
                      lang === "am" ? "bg-white text-[#111111]" : "text-[#6B6B6B]"
                    }`}
                  >
                    አማ
                  </button>
                </div>

                {previewTab === "preview" && (
                  <div className="inline-flex rounded-lg border border-[#E7E7E4] bg-[#F5F5F3] p-0.5">
                    <button
                      type="button"
                      aria-pressed={previewDevice === "phone"}
                      onClick={() => setPreviewDevice("phone")}
                      className={`px-2.5 min-h-[32px] rounded-md text-xs font-semibold ${
                        previewDevice === "phone" ? "bg-white text-[#111111]" : "text-[#6B6B6B]"
                      }`}
                    >
                      {t("templatesPreviewPhone")}
                    </button>
                    <button
                      type="button"
                      aria-pressed={previewDevice === "desktop"}
                      onClick={() => setPreviewDevice("desktop")}
                      className={`px-2.5 min-h-[32px] rounded-md text-xs font-semibold ${
                        previewDevice === "desktop" ? "bg-white text-[#111111]" : "text-[#6B6B6B]"
                      }`}
                    >
                      {t("templatesPreviewDesktop")}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {previewTab === "preview" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-4 space-y-2">
                  <p className="text-xs font-semibold text-[#6B6B6B]">
                    {t("templatesPreviewQuestionsHeading")}
                  </p>
                  <ol className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
                    {previewTemplate.questions.map((q, idx) => {
                      const active = previewJumpId === q.id;
                      return (
                        <li key={q.id}>
                          <button
                            type="button"
                            onClick={() => setPreviewJumpId(q.id)}
                            className={`w-full text-left px-3 py-2 rounded-lg border text-xs flex items-center gap-2 transition-colors ${
                              active
                                ? "bg-[#EEEBF8] border-[#6A4FC4] text-[#111111] font-semibold"
                                : "bg-white border-[#E7E7E4] text-[#111111] hover:bg-[#F5F5F3]"
                            }`}
                          >
                            <span className="font-mono text-[#6B6B6B] w-5 shrink-0">{idx + 1}.</span>
                            <QuestionIcon name={q.icon} size={14} />
                            <span className="truncate flex-1">{q.label[lang] || q.label.en}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                </div>

                <div className="lg:col-span-8">
                  <div
                    className={
                      previewDevice === "phone"
                        ? "w-full max-w-[390px] mx-auto border-[6px] border-[#161616] rounded-[28px] overflow-hidden shadow-md bg-[#FAF9F6]"
                        : "w-full"
                    }
                  >
                    <MezgebWidget
                      key={`pv-${previewTemplate.id}`}
                      template={previewTemplate}
                      aiEnabled={false}
                      offline={false}
                      readOnly={false}
                      ephemeralPreview
                      jumpToQuestionId={previewJumpId}
                      storageKey={`mezgeb_gallery_preview_${previewTemplate.id}`}
                    />
                  </div>
                </div>
              </div>
            )}

            {previewTab === "questions" && (
              <ol className="divide-y divide-[#E7E7E4] border border-[#E7E7E4] rounded-xl bg-white">
                {previewTemplate.questions.map((q, idx) => (
                  <li key={q.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#6B6B6B]">
                        <span className="font-mono font-semibold text-[#111111]">#{idx + 1}</span>
                        <span>{q.type}</span>
                        <span>·</span>
                        <span className="font-mono">{q.maps_to}</span>
                        {q.required && (
                          <span className="px-1.5 py-0.5 rounded bg-[#F5F5F3] text-[#111111] font-medium">
                            {t("builderRequiredBadge")}
                          </span>
                        )}
                        {q.sensitive && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#F9F3EA] text-[#111111] font-medium">
                            <ShieldIcon size={11} />
                            <span>{t("templatesSensitiveBadge")}</span>
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-[#111111]">{q.label[lang]}</p>
                      {q.hint?.[lang] && <p className="text-xs text-[#6B6B6B]">{q.hint[lang]}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewJumpId(q.id);
                        setPreviewTab("preview");
                      }}
                      className="mezgeb-btn-secondary text-xs min-h-[36px] shrink-0"
                    >
                      {t("templatesPreviewBtn")}
                    </button>
                  </li>
                ))}
              </ol>
            )}

            {previewTab === "json" && (
              <div className="space-y-3">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(JSON.stringify(previewTemplate, null, 2));
                        announce(t("copiedAnnouncement"));
                      } catch {
                        // ignore
                      }
                    }}
                    className="mezgeb-btn-secondary text-xs min-h-[36px]"
                  >
                    {t("exportCopyJson")}
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadJsonFile(previewTemplate)}
                    className="mezgeb-btn-secondary text-xs min-h-[36px] inline-flex items-center gap-1.5"
                  >
                    <DownloadIcon size={14} />
                    <span>{t("exportDownloadJson")}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-[#161616] text-[#E4F2EC] text-xs font-mono overflow-x-auto max-h-96">
                  <code>{JSON.stringify(previewTemplate, null, 2)}</code>
                </pre>
              </div>
            )}

            {/* Preview Footer */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-[#E7E7E4]">
              <button
                type="button"
                onClick={() => {
                  const target = previewTemplate;
                  setPreviewTemplate(null);
                  handleCustomize(target);
                }}
                className="mezgeb-btn-secondary text-sm"
              >
                {t("templatesCustomizeBtn")}
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = previewTemplate;
                  setPreviewTemplate(null);
                  handleUseInPlayground(target);
                }}
                className="mezgeb-btn-primary text-sm"
              >
                {t("templatesUseBtn")}
              </button>
            </div>
          </div>
        )}
      </AccessibleDialog>

      {/* Rename Saved Template Dialog */}
      <AccessibleDialog
        open={Boolean(renameTarget)}
        onClose={() => setRenameTarget(null)}
        title={t("templatesRenameTitle")}
        maxWidthClass="max-w-md"
      >
        {renameTarget && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const res = renameMyTemplate(renameTarget.id, { en: renameEn, am: renameAm });
              setMyTemplates(res.templates);
              setRenameTarget(null);
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="rename-en" className="block text-sm font-medium text-[#111111] mb-1">
                {t("templatesRenameLabelEn")}
              </label>
              <input
                id="rename-en"
                type="text"
                required
                value={renameEn}
                onChange={(e) => setRenameEn(e.target.value)}
                className="w-full min-h-[42px] px-3 rounded-xl border border-[#E7E7E4] text-sm"
              />
            </div>
            <div>
              <label htmlFor="rename-am" className="block text-sm font-medium text-[#111111] mb-1">
                {t("templatesRenameLabelAm")}
              </label>
              <input
                id="rename-am"
                type="text"
                required
                value={renameAm}
                onChange={(e) => setRenameAm(e.target.value)}
                className="w-full min-h-[42px] px-3 rounded-xl border border-[#E7E7E4] text-sm"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setRenameTarget(null)} className="mezgeb-btn-secondary text-sm">
                {t("cancelButton")}
              </button>
              <button type="submit" className="mezgeb-btn-primary text-sm">
                {t("saveButton")}
              </button>
            </div>
          </form>
        )}
      </AccessibleDialog>

      {/* Delete Saved Template Confirmation Dialog */}
      <AccessibleDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title={t("templatesDeleteTitle")}
        maxWidthClass="max-w-md"
      >
        {deleteTarget && (
          <div className="space-y-5">
            <p className="text-sm text-[#6B6B6B]">
              {t("templatesDeleteConfirm", { name: deleteTarget.name[lang] })}
            </p>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setDeleteTarget(null)} className="mezgeb-btn-secondary text-sm">
                {t("cancelButton")}
              </button>
              <button
                type="button"
                onClick={() => {
                  const res = deleteFromMyTemplates(deleteTarget.id);
                  setMyTemplates(res.templates);
                  setDeleteTarget(null);
                }}
                className="px-4 min-h-[42px] rounded-xl bg-red-700 text-white text-sm font-semibold hover:bg-red-800"
              >
                {t("templatesDeleteBtn")}
              </button>
            </div>
          </div>
        )}
      </AccessibleDialog>
    </Layout>
  );
}
