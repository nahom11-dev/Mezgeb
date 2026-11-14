import React, { useCallback, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Layout } from "../components/Layout";
import { useI18n } from "../i18n";
import { getEffectiveSettings, TEMPLATES } from "../templates";
import { loadMyTemplates } from "../templates/storage";
import { TranslationKeys } from "../i18n";
import { IdRoute, MezgebTemplate, TemplateCategory } from "../templates/types";
import { Button } from "../ui";
import { FeatureSandbox } from "./templates/detail/FeatureSandbox";
import { HowToUseSection } from "./templates/detail/HowToUseSection";
import { OnboardingStepDemo, ResultPreviewPanel } from "./templates/detail/OnboardingStepDemo";
import { estimateMinutes, FactList, TemplateMark } from "./templates/kit";
import { useTs } from "./templates/strings";

const ID_ROUTE_KEYS: Record<IdRoute, TranslationKeys> = {
  fayda: "idRouteFayda",
  refugee_id: "idRouteRefugee",
  other_document: "idRouteOther",
  partner_refer: "idRoutePartner",
};

const CATEGORY_KEYS: Record<TemplateCategory, TranslationKeys> = {
  learning: "catLearning",
  jobs: "catJobs",
  employer: "catEmployer",
  ngo: "catNgo",
  custom: "catCustom",
};

function resolveEntry(id: string): { tpl: MezgebTemplate; isCustom: boolean } | null {
  const builtIn = TEMPLATES.find((t) => t.id === id);
  if (builtIn) return { tpl: builtIn, isCustom: false };
  const mine = loadMyTemplates().templates.find((t) => t.id === id);
  if (mine) return { tpl: mine, isCustom: true };
  return null;
}

export function TemplateDetailPage() {
  const { id } = useParams();
  const { lang, t } = useI18n();
  const s = useTs();
  const navigate = useNavigate();
  const [demoLang, setDemoLang] = useState(lang);

  const entry = useMemo(() => (id ? resolveEntry(decodeURIComponent(id)) : null), [id]);

  const copyToBuilder = (tpl: MezgebTemplate) => {
    const copy: MezgebTemplate = {
      ...structuredClone(tpl),
      id: `${tpl.id}-copy-${Date.now().toString(36).slice(-4)}`,
      category: tpl.category ?? "custom",
      tested: false,
      updatedAt: new Date().toISOString(),
    };
    navigate(`/templates/${encodeURIComponent(copy.id)}/edit`, { state: { template: copy } });
  };

  const editInBuilder = (tpl: MezgebTemplate) => {
    navigate(`/templates/${encodeURIComponent(tpl.id)}/edit`, { state: { template: structuredClone(tpl) } });
  };

  const useTemplate = () => {
    if (!entry) return;
    if (entry.isCustom) editInBuilder(entry.tpl);
    else copyToBuilder(entry.tpl);
  };

  return (
    <Layout showFaqInFooter showGiantWordmark mainClassName="mz-console-page">
      <DetailBody entry={entry} demoLang={demoLang} setDemoLang={setDemoLang} useTemplate={useTemplate} />
    </Layout>
  );
}

function DetailBody({
  entry,
  demoLang,
  setDemoLang,
  useTemplate,
}: {
  entry: ReturnType<typeof resolveEntry>;
  demoLang: "en" | "am";
  setDemoLang: (l: "en" | "am") => void;
  useTemplate: () => void;
}) {
  const { lang, t } = useI18n();
  const s = useTs();
  const navigate = useNavigate();
  const [payload, setPayload] = useState<object>({ event: "onboarding.step_sync" });
  const onPayload = useCallback((p: object) => setPayload(p), []);
  const [demoReset, setDemoReset] = useState(0);

  if (!entry) {
    return (
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8 py-20 text-center">
        <button
          type="button"
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--lilac)] text-[var(--accent)] flex items-center justify-center text-2xl font-bold font-mono"
          aria-hidden="true"
        >
          ?
        </button>
        <h1 className="text-3xl font-semibold text-[var(--ink)] mb-2">{s.detailNotFoundTitle}</h1>
        <p className="text-[var(--muted)] mb-6 max-w-md mx-auto">{s.detailNotFoundBody}</p>
        <Link
          to="/templates"
          className="inline-flex items-center justify-center min-h-[44px] px-5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium text-sm transition-colors"
        >
          {s.detailBackGallery}
        </Link>
      </div>
    );
  }

  const { tpl } = entry;
  const name = tpl.name[lang] || tpl.name.en;
  const firstQ = tpl.questions.find((q) => q.type !== "info");
  const settings = getEffectiveSettings(tpl);
  const includesLine = tpl.questions
    .filter((q) => q.type !== "info" && q.type !== "consent")
    .slice(0, 6)
    .map((q) => q.label[lang] || q.label.en)
    .join(" · ");
  const featurePills = buildDetailPills(tpl, settings, s);

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-8 py-6 md:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <nav aria-label={s.detailBreadcrumbTemplates} className="flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
          <Link to="/templates" className="hover:text-[var(--ink)] underline-offset-4 hover:underline">
            {s.detailBreadcrumbTemplates}
          </Link>
          <span>/</span>
          <span className="text-[var(--ink)] font-medium">{name}</span>
        </nav>
        <TemplateSwitcher currentId={tpl.id} onSelect={(id) => navigate(`/templates/${encodeURIComponent(id)}`)} />
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pb-16 border-b border-[var(--console-line)]">
        <div className="lg:col-span-7 space-y-5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-mono text-[11px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full bg-[var(--lilac)] text-[var(--accent)] border border-[var(--accent)]/20">
              {t(CATEGORY_KEYS[tpl.category ?? "custom"])}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[var(--ink)] leading-tight">
            {name}
          </h1>

          <p className="text-base sm:text-lg text-[var(--muted)] leading-relaxed max-w-xl">
            {tpl.bestFor?.[lang] || tpl.description[lang]}
          </p>

          <p className="text-xs sm:text-sm font-mono text-[var(--muted)] bg-white border border-[var(--console-line)] p-3 rounded-lg">
            <span className="font-semibold text-[var(--ink)]">{s.detailIncludes}: </span>
            {includesLine || tpl.description[lang]}
          </p>

          <DetailFeaturePills pills={featurePills} />

          <DetailActions useTemplate={useTemplate} />
        </div>

        <DetailPreviewCard tpl={tpl} firstQ={firstQ} name={name} s={s} />
      </section>

      <section id="demo-section" className="py-16 border-b border-[var(--console-line)] scroll-mt-20">
        <div className="max-w-2xl mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--ink)] tracking-tight">{s.detailDemoTitle}</h2>
          <p className="text-sm text-[var(--muted)] mt-1">{s.detailDemoLead}</p>
        </div>

        <DetailDemoControls demoLang={demoLang} setDemoLang={setDemoLang} />

        <div key={demoReset} className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <OnboardingStepDemo tpl={tpl} demoLang={demoLang} onPayload={onPayload} />
          </div>
          <div className="lg:col-span-5">
            <ResultPreviewPanel payload={payload} />
          </div>
        </div>
      </section>

      <FeatureSandbox tpl={tpl} webhookPayload={payload} onReset={() => setDemoReset((n) => n + 1)} />

      <HowToUseSection tpl={tpl} onOpenBuilder={useTemplate} />

      <section className="py-12">
        <h2 className="text-xl font-semibold text-[var(--ink)] mb-4">{s.previewIds}</h2>
        <ul className="flex flex-wrap gap-2">
          {tpl.idRoutes.map((r) => (
            <li
              key={r}
              className="font-mono text-[11px] uppercase px-2.5 py-1 rounded-full bg-white border border-[var(--console-line)]"
            >
              {t(ID_ROUTE_KEYS[r])}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function DetailFeaturePills({ pills }: { pills: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5 pt-1">
      {pills.map((p) => (
        <li
          key={p}
          className="font-mono text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-[var(--console-paper)] border border-[var(--console-line)] text-[var(--ink)]"
        >
          {p}
        </li>
      ))}
    </ul>
  );
}

function DetailActions({ useTemplate }: { useTemplate: () => void }) {
  const s = useTs();
  return (
    <div className="pt-2 flex flex-wrap items-center gap-4">
      <Button variant="primary" size="lg" onClick={useTemplate} className="!bg-[var(--accent)] hover:!bg-[var(--accent-hover)]">
        {s.detailUseTemplate}
      </Button>
      <a
        href="#demo-section"
        className="text-sm font-medium text-[var(--ink)] hover:text-[var(--accent)] underline underline-offset-4 transition-colors"
      >
        {s.detailTryDemo} ↓
      </a>
    </div>
  );
}

function DetailPreviewCard({
  tpl,
  firstQ,
  name,
  s,
}: {
  tpl: MezgebTemplate;
  firstQ: MezgebTemplate["questions"][number] | undefined;
  name: string;
  s: ReturnType<typeof useTs>;
}) {
  return (
    <div className="lg:col-span-5">
      <div className="bg-white border border-[var(--console-line)] rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="mt-1 bg-[var(--stone)] border border-[var(--console-line)] rounded-xl p-5 space-y-4">
          <DetailPreviewHeader tpl={tpl} name={name} />
          {firstQ && (
            <div className="space-y-1">
              <div className="text-[11px] font-mono text-[var(--accent)]">
                {s.f("galleryStepOf", {
                  n: 1,
                  total: tpl.questions.filter((q) => q.type !== "info").length,
                })}
              </div>
              <div lang="am" className="text-base font-semibold text-[var(--ink)]">
                {firstQ.label.am || firstQ.label.en}
              </div>
              <div lang="en" className="text-xs text-[var(--muted)]">
                {firstQ.label.en}
              </div>
            </div>
          )}
          <FactList
            facts={[
              { label: s.galleryFactQuestions, value: tpl.questions.length },
              { label: s.galleryFactMinutes, value: estimateMinutes(tpl) },
              { label: s.galleryFactIds, value: tpl.idRoutes.length },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

function DetailPreviewHeader({ tpl, name }: { tpl: MezgebTemplate; name: string }) {
  return (
    <div className="flex items-center justify-between">
      <p className="flex items-center gap-2 min-w-0">
        <TemplateMark tpl={tpl} size={24} />
        <span className="text-xs font-semibold text-[var(--ink)] truncate">{name}</span>
      </p>
    </div>
  );
}

function DetailDemoControls({
  demoLang,
  setDemoLang,
}: {
  demoLang: "en" | "am";
  setDemoLang: (l: "en" | "am") => void;
}) {
  const s = useTs();
  return (
    <div role="group" aria-label={s.previewLanguage} className="inline-flex rounded-lg border border-[var(--console-line)] bg-white p-1">
      {(["en", "am"] as const).map((l) => (
        <button
          key={l}
          type="button"
          aria-pressed={demoLang === l}
          onClick={() => setDemoLang(l)}
          className={`min-h-[36px] px-4 rounded-md text-sm font-medium transition-colors ${
            demoLang === l ? "bg-[var(--lilac)] text-[var(--accent)]" : "text-[var(--muted)] hover:text-[var(--ink)]"
          }`}
        >
          {l === "en" ? "English" : "አማርኛ"}
        </button>
      ))}
    </div>
  );
}

function buildDetailPills(
  tpl: MezgebTemplate,
  settings: ReturnType<typeof getEffectiveSettings>,
  s: ReturnType<typeof useTs>
): string[] {
  const pills: string[] = [];
  if (settings.voice) pills.push(s.galleryPillVoice);
  pills.push(s.galleryPillBilingual);
  if (tpl.tested) pills.push(s.galleryPillTested);
  if (!tpl.idRoutes.includes("fayda") || tpl.idRoutes.length <= 1) pills.push(s.galleryPillNoId);
  return pills;
}

function TemplateSwitcher({ currentId, onSelect }: { currentId: string; onSelect: (id: string) => void }) {
  const s = useTs();
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-[var(--muted)] sr-only">{s.detailBreadcrumbTemplates}</span>
      <select
        className="h-9 rounded-lg border border-[var(--console-line)] bg-white px-3 text-sm font-medium"
        value={currentId}
        onChange={(e) => onSelect(e.target.value)}
      >
        {TEMPLATES.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name.en}
          </option>
        ))}
      </select>
    </label>
  );
}