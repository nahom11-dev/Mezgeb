import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FileJson, MoreHorizontal, Plus, Search } from "lucide-react";
import { Layout } from "../components/Layout";
import { TranslationKeys, useI18n } from "../i18n";
import { TEMPLATES } from "../templates";
import {
  deleteFromMyTemplates,
  duplicateMyTemplate,
  loadMyTemplates,
  renameMyTemplate,
} from "../templates/storage";
import { MezgebTemplate, TemplateCategory } from "../templates/types";
import { getEffectiveSettings } from "../templates";
import { validateTemplate } from "../templates/validate";
import { Button, Dialog, Field } from "../ui";
import { ImportTemplateDialog } from "./templates/ImportTemplateDialog";
import {
  estimateMinutes,
  menuItemClass,
  menuItemDangerClass,
  menuSurfaceClass,
  TemplateMark,
} from "./templates/kit";
import { useTs } from "./templates/strings";

type Filter = "all" | "learning" | "jobs" | "employer" | "ngo" | "mine";
type SortKey = "updated" | "steps" | "az";

const CATEGORY_KEYS: Record<TemplateCategory, TranslationKeys> = {
  learning: "catLearning",
  jobs: "catJobs",
  employer: "catEmployer",
  ngo: "catNgo",
  custom: "catCustom",
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

interface Entry {
  tpl: MezgebTemplate;
  isCustom: boolean;
}

export function TemplatesPage() {
  const { lang, t } = useI18n();
  const s = useTs();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [myTemplates, setMyTemplates] = useState<MezgebTemplate[]>(() => loadMyTemplates().templates);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<SortKey>("updated");

  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState<string | null>(null);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [renameTarget, setRenameTarget] = useState<MezgebTemplate | null>(null);
  const [renameEn, setRenameEn] = useState("");
  const [renameAm, setRenameAm] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<MezgebTemplate | null>(null);

  // Deep link: /templates?preview=<id>
  useEffect(() => {
    const id = searchParams.get("preview");
    if (!id) return;
    const builtIn = TEMPLATES.find((x) => x.id === id);
    const mine = myTemplates.find((x) => x.id === id);
    const tpl = builtIn ?? mine;
    if (tpl) {
      navigate(`/templates/${encodeURIComponent(id)}`, { replace: true });
      setSearchParams({}, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Close card menus on outside click / Escape
  useEffect(() => {
    if (!openMenuId) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenMenuId(null);
    const onClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("[data-card-menu]")) setOpenMenuId(null);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [openMenuId]);

  const entries: Entry[] = useMemo(
    () => [
      ...myTemplates.map((tpl) => ({ tpl, isCustom: true })),
      ...TEMPLATES.map((tpl) => ({ tpl, isCustom: false })),
    ],
    [myTemplates]
  );

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: entries.length, learning: 0, jobs: 0, employer: 0, ngo: 0, mine: myTemplates.length };
    for (const { tpl } of entries) {
      if (tpl.category && tpl.category in c) c[tpl.category as Filter] += 1;
    }
    return c;
  }, [entries, myTemplates.length]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = entries.filter(({ tpl, isCustom }) => {
      if (filter === "mine" && !isCustom) return false;
      if (filter !== "all" && filter !== "mine" && tpl.category !== filter) return false;
      if (!q) return true;
      return [
        tpl.name.en,
        tpl.name.am,
        tpl.bestFor?.en,
        tpl.bestFor?.am,
        tpl.description.en,
        tpl.description.am,
        ...tpl.questions.map((x) => `${x.label.en} ${x.label.am}`),
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
    const sorted = [...filtered];
    sorted.sort((a, b) => {
      if (sort === "steps") {
        const sa = a.tpl.questions.filter((x) => x.type !== "info").length;
        const sb = b.tpl.questions.filter((x) => x.type !== "info").length;
        return sa - sb;
      }
      if (sort === "az") {
        return a.tpl.name.en.localeCompare(b.tpl.name.en);
      }
      const da = a.tpl.updatedAt ?? "";
      const db = b.tpl.updatedAt ?? "";
      return db.localeCompare(da);
    });
    return sorted;
  }, [entries, filter, query, sort]);

  /* ───── actions ───── */

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

  const primaryAction = (entry: Entry) => (entry.isCustom ? editInBuilder(entry.tpl) : copyToBuilder(entry.tpl));

  const openPreview = (entry: Entry) => {
    navigate(`/templates/${encodeURIComponent(entry.tpl.id)}`);
  };

  const submitImport = () => {
    setImportError(null);
    try {
      const parsed = JSON.parse(importText) as MezgebTemplate;
      if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.questions)) {
        setImportError(t("builderImportJsonBadFormat"));
        return;
      }
      const checked = validateTemplate(parsed);
      setImportOpen(false);
      navigate(`/templates/${encodeURIComponent(checked.template.id)}/edit`, {
        state: { template: checked.template },
      });
    } catch {
      setImportError(t("builderImportJsonBadFormat"));
    }
  };

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: t("templatesFilterAll") },
    { id: "learning", label: t("templatesFilterLearning") },
    { id: "jobs", label: t("templatesFilterJobs") },
    { id: "employer", label: t("templatesFilterEmployer") },
    { id: "ngo", label: t("templatesFilterNgo") },
    { id: "mine", label: t("templatesFilterMine") },
  ];

  return (
    <Layout showFaqInFooter showGiantWordmark mainClassName="mz-console-page">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-10 text-left">
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[var(--console-line)]">
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-[var(--accent)] font-semibold mb-1.5">
              {s.consoleEyebrow}
            </p>
            <h1 className="text-3xl sm:text-[2rem] font-semibold text-[var(--ink)] tracking-tight">{s.galleryTitle}</h1>
            <p className="text-[var(--muted)] text-[15px] mt-1.5">{s.galleryLead}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/docs"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-[var(--muted)] hover:text-[var(--ink)] px-3 py-2.5 rounded-lg border border-[var(--console-line)] bg-white transition-colors"
            >
              {s.galleryFlowGuidelines}
            </Link>
            <details className="relative group">
              <summary className="list-none cursor-pointer inline-flex items-center justify-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-5 py-3 rounded-lg font-medium text-sm transition-all shadow-sm min-h-[44px]">
                <Plus size={16} strokeWidth={2.25} aria-hidden="true" />
                {s.galleryCreateTemplate}
              </summary>
              <div className="absolute right-0 mt-1.5 w-64 bg-white border border-[var(--console-line)] rounded-xl shadow-lg p-1.5 z-30">
                <Link
                  to="/templates/builder"
                  className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-[var(--console-paper)] text-left transition-colors"
                >
                  <div>
                    <div className="text-xs font-semibold text-[var(--ink)]">{s.galleryStartScratch}</div>
                    <div className="text-[11px] text-[var(--muted)] mt-0.5 leading-snug">{s.galleryStartScratchBody}</div>
                  </div>
                </Link>
                <Link
                  to="/templates/builder"
                  className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-[var(--console-paper)] text-left transition-colors"
                >
                  <div>
                    <div className="text-xs font-semibold text-[var(--accent)]">{s.galleryCreateAi}</div>
                    <div className="text-[11px] text-[var(--muted)] mt-0.5 leading-snug">{s.galleryCreateAiBody}</div>
                  </div>
                </Link>
              </div>
            </details>
          </div>
        </section>

        <section className="mt-8 space-y-4">
          <div className="relative w-full">
            <label htmlFor="tpl-search" className="sr-only">
              {s.gallerySearch}
            </label>
            <Search
              size={20}
              strokeWidth={1.75}
              aria-hidden="true"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none"
            />
            <input
              id="tpl-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={s.gallerySearchPlaceholder}
              className="w-full h-12 pl-12 pr-16 bg-white border border-[var(--console-line)] rounded-lg text-sm text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--lilac)]"
            />
            <kbd className="hidden sm:inline font-mono text-[11px] font-semibold text-[var(--muted)] bg-[var(--console-paper)] border border-[var(--console-line)] px-2 py-1 rounded absolute right-3.5 top-1/2 -translate-y-1/2">
              ⌘K
            </kbd>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <div
              role="group"
              aria-label={s.galleryFilterLabel}
              className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 mz-scroll"
            >
              {filters.map((f) => {
                const on = filter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setFilter(f.id)}
                    className={`min-h-[36px] px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                      on
                        ? "bg-[var(--lilac)] text-[var(--accent)] border border-transparent"
                        : "bg-transparent text-[var(--muted)] hover:text-[var(--ink)] hover:bg-white border border-transparent hover:border-[var(--console-line)]"
                    }`}
                  >
                    {f.label}
                    <span className="ml-1 tabular-nums opacity-70">{counts[f.id]}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-3">
              <label htmlFor="tpl-sort" className="text-xs text-[var(--muted)]">
                {s.gallerySortLabel}
              </label>
              <select
                id="tpl-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="appearance-none bg-white border border-[var(--console-line)] rounded-md text-xs font-medium text-[var(--ink)] py-1.5 pl-2.5 pr-7 cursor-pointer focus:border-[var(--accent)] focus:outline-none"
              >
                <option value="updated">{s.gallerySortUpdated}</option>
                <option value="steps">{s.gallerySortSteps}</option>
                <option value="az">{s.gallerySortAz}</option>
              </select>
              <p
                aria-live="polite"
                className="font-mono text-[11px] uppercase tracking-wider font-semibold text-[var(--muted)] bg-white border border-[var(--console-line)] px-2.5 py-1 rounded-md"
              >
                {s.n("galleryResults", visible.length)}
              </p>
            </div>
          </div>
        </section>

        <section aria-label={s.galleryTitle} className="mt-8 pb-16">
          {visible.length === 0 ? (
            <div className="rounded-[16px] border border-dashed border-[var(--line-strong)] p-10 md:p-14 max-w-2xl">
              <h2 className="text-xl font-semibold text-[var(--ink)]">
                {filter === "mine" && !query
                  ? s.galleryEmptyMineTitle
                  : s.f("galleryEmptySearchTitle", { q: query })}
              </h2>
              <p className="mt-2 text-[var(--ink-2)] leading-relaxed">
                {filter === "mine" && !query ? s.galleryEmptyMineBody : s.galleryEmptySearchBody}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {query && (
                  <Button variant="secondary" onClick={() => setQuery("")}>
                    {s.galleryClearSearch}
                  </Button>
                )}
                {filter !== "all" && (
                  <Button variant="secondary" onClick={() => setFilter("all")}>
                    {t("templatesFilterAll")}
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filter === "all" && !query.trim() && (
                <li>
                  <Link
                    to="/templates/builder"
                    className="group border-2 border-dashed border-[#D2D2CF] hover:border-[var(--accent)] rounded-2xl p-6 bg-[var(--console-paper)] hover:bg-white transition-all flex flex-col justify-between min-h-[460px] text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                  >
                    <span className="w-full flex justify-end font-mono text-[10px] text-[var(--muted)] uppercase border border-[var(--console-line)] px-2 py-0.5 rounded-full bg-white self-end">
                      {s.galleryCustomSchema}
                    </span>
                    <div className="my-auto flex flex-col items-center">
                      <div className="w-14 h-14 rounded-full bg-white border border-[var(--console-line)] group-hover:border-[var(--accent)] group-hover:bg-[var(--lilac)] flex items-center justify-center text-[var(--muted)] group-hover:text-[var(--accent)] transition-all mb-4 shadow-sm">
                        <Plus size={28} strokeWidth={1.5} aria-hidden="true" />
                      </div>
                      <h2 className="text-lg font-semibold text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
                        {s.galleryStartScratch}
                      </h2>
                      <p className="text-xs text-[var(--muted)] max-w-[240px] mt-2 leading-relaxed">{s.galleryStartScratchBody}</p>
                    </div>
                    <div className="pt-4 border-t border-dashed border-[var(--console-line)]">
                      <span className="block w-full py-2.5 px-4 bg-white hover:bg-[var(--accent)] hover:text-white border border-[var(--console-line)] hover:border-[var(--accent)] rounded-lg text-xs font-semibold text-[var(--ink)] transition-all text-center">
                        {s.galleryOpenCanvas}
                      </span>
                    </div>
                  </Link>
                </li>
              )}
              {visible.map((entry) => (
                <li key={`${entry.isCustom ? "mine" : "builtin"}-${entry.tpl.id}`}>
                  <TemplateCard
                    entry={entry}
                    menuOpen={openMenuId === entry.tpl.id}
                    onToggleMenu={() => setOpenMenuId((p) => (p === entry.tpl.id ? null : entry.tpl.id))}
                    onUse={() => primaryAction(entry)}
                    onPreview={() => openPreview(entry)}
                    onDuplicate={() => {
                      setMyTemplates(duplicateMyTemplate(entry.tpl).templates);
                      setOpenMenuId(null);
                    }}
                    onRename={() => {
                      setRenameTarget(entry.tpl);
                      setRenameEn(entry.tpl.name.en);
                      setRenameAm(entry.tpl.name.am);
                      setOpenMenuId(null);
                    }}
                    onExport={() => {
                      downloadJsonFile(entry.tpl);
                      setOpenMenuId(null);
                    }}
                    onDelete={() => {
                      setDeleteTarget(entry.tpl);
                      setOpenMenuId(null);
                    }}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>

      </div>

      <ImportTemplateDialog
        open={importOpen}
        onClose={() => setImportOpen(false)}
        text={importText}
        onTextChange={(v) => {
          setImportText(v);
          setImportError(null);
        }}
        error={importError}
        onSubmit={submitImport}
      />

      {/* Rename */}
      <Dialog
        open={Boolean(renameTarget)}
        onClose={() => setRenameTarget(null)}
        title={t("templatesRenameTitle")}
        maxWidthClass="max-w-md"
        closeLabel={t("closeButton")}
      >
        {renameTarget && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setMyTemplates(renameMyTemplate(renameTarget.id, { en: renameEn, am: renameAm }).templates);
              setRenameTarget(null);
            }}
            className="space-y-4"
          >
            <Field
              id="rename-en"
              label={t("templatesRenameLabelEn")}
              inputProps={{ required: true, value: renameEn, onChange: (e) => setRenameEn(e.target.value) }}
            />
            <Field
              id="rename-am"
              label={t("templatesRenameLabelAm")}
              labelLang="am"
              inputProps={{ required: true, lang: "am", value: renameAm, onChange: (e) => setRenameAm(e.target.value) }}
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setRenameTarget(null)}>
                {t("cancelButton")}
              </Button>
              <Button type="submit" variant="primary">
                {t("saveButton")}
              </Button>
            </div>
          </form>
        )}
      </Dialog>

      {/* Delete */}
      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title={t("templatesDeleteTitle")}
        maxWidthClass="max-w-md"
        closeLabel={t("closeButton")}
      >
        {deleteTarget && (
          <div className="space-y-5">
            <p className="text-base text-[var(--ink-2)]">
              {t("templatesDeleteConfirm", { name: deleteTarget.name[lang] })}
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
                {t("cancelButton")}
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  setMyTemplates(deleteFromMyTemplates(deleteTarget.id).templates);
                  setDeleteTarget(null);
                }}
              >
                {t("templatesDeleteBtn")}
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </Layout>
  );
}

/* ───────────────────────── Card ───────────────────────── */

function TemplateCard({
  entry,
  menuOpen,
  onToggleMenu,
  onUse,
  onPreview,
  onDuplicate,
  onRename,
  onExport,
  onDelete,
}: {
  entry: Entry;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onUse: () => void;
  onPreview: () => void;
  onDuplicate: () => void;
  onRename: () => void;
  onExport: () => void;
  onDelete: () => void;
}) {
  const { lang, t } = useI18n();
  const s = useTs();
  const { tpl, isCustom } = entry;
  const name = tpl.name[lang] || tpl.name.en;
  const headingId = `tpl-${tpl.id}-name`;
  const accent = tpl.theme?.accent ?? "#6A4FC4";
  const menuBtn = useRef<HTMLButtonElement>(null);
  const firstQ = tpl.questions.find((q) => q.type !== "info");
  const steps = tpl.questions.filter((q) => q.type !== "info").length;
  const mins = estimateMinutes(tpl);
  const settings = getEffectiveSettings(tpl);
  const pills = buildTemplatePills(tpl, settings, s);

  return (
    <article
      aria-labelledby={headingId}
      className="template-card-stitch h-full flex flex-col overflow-hidden relative"
    >
      <div>
        <div
          className="h-[180px] bg-[var(--stone)] p-4 relative flex items-center justify-center border-b border-[var(--console-line)] overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${accentSoft(accent)} 0%, var(--stone) 55%, var(--mint) 100%)`,
          }}
        >
          <TemplateCardMock tpl={tpl} firstQ={firstQ} lang={lang} steps={steps} s={s} />
          <div className="card-hover-actions absolute inset-0 bg-[var(--ink)]/40 backdrop-blur-[2px] flex items-center justify-center gap-2.5 p-4 z-20">
            <button
              type="button"
              onClick={onPreview}
              className="px-3.5 py-2 bg-white hover:bg-[var(--console-paper)] text-[var(--ink)] text-xs font-semibold rounded-lg border border-white transition-all shadow-sm"
            >
              {s.galleryCardPreview}
            </button>
            <button
              type="button"
              onClick={onUse}
              className="px-3.5 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold rounded-lg transition-all shadow-sm"
            >
              {s.galleryCardUse}
            </button>
          </div>
        </div>

        <div className="p-5 relative">
          <div className="flex items-start justify-between gap-2 pr-8">
            <div className="min-w-0 flex-1">
              <h2 id={headingId} className="text-lg font-semibold text-[var(--ink)] tracking-tight">
                {name}
              </h2>
              <p className="text-xs text-[var(--muted)] mt-1.5 leading-relaxed line-clamp-2">
                {tpl.bestFor?.[lang] || tpl.description[lang]}
              </p>
            </div>
          </div>
          {isCustom && (
            <div className="absolute top-4 right-4" data-card-menu>
              <button
                ref={menuBtn}
                type="button"
                aria-label={`${t("templatesMoreActions")}: ${name}`}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                onClick={onToggleMenu}
                className="w-9 h-9 rounded-lg text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--stone)] inline-flex items-center justify-center cursor-pointer"
              >
                <MoreHorizontal size={18} strokeWidth={1.75} aria-hidden="true" />
              </button>
              {menuOpen && (
                <div role="menu" className={menuSurfaceClass}>
                  <button type="button" role="menuitem" onClick={onDuplicate} className={menuItemClass}>
                    {t("templatesActionDuplicate")}
                  </button>
                  <button type="button" role="menuitem" onClick={onRename} className={menuItemClass}>
                    {t("templatesActionRename")}
                  </button>
                  <button type="button" role="menuitem" onClick={onExport} className={menuItemClass}>
                    {t("templatesActionExport")}
                  </button>
                  <div className="my-1 border-t border-[var(--line)]" />
                  <button type="button" role="menuitem" onClick={onDelete} className={menuItemDangerClass}>
                    {t("templatesActionDelete")}
                  </button>
                </div>
              )}
            </div>
          )}
          <ul className="flex flex-wrap gap-1.5 mt-4">
            {pills.map((p) => (
              <li
                key={p}
                className={`font-mono text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full border ${
                  p === s.galleryPillTested
                    ? "bg-[var(--mint)] text-[var(--mint-ink)] border-[var(--mint-ink)]/20"
                    : "bg-[var(--console-paper)] border-[var(--console-line)] text-[var(--ink)]"
                }`}
              >
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="px-5 py-3.5 border-t border-[var(--console-line)] flex items-center justify-between text-[11px] font-mono text-[var(--muted)] bg-white mt-auto">
        <span className="tracking-tight">
          {s.f("galleryStepsMeta", { steps, min: mins })}
        </span>
        <TemplateMark tpl={tpl} size={22} />
      </div>
    </article>
  );
}

function accentSoft(accent: string): string {
  if (accent.startsWith("#") && accent.length === 7) return `${accent}33`;
  return "var(--lilac)";
}

function buildTemplatePills(
  tpl: MezgebTemplate,
  settings: ReturnType<typeof getEffectiveSettings>,
  s: ReturnType<typeof useTs>
): string[] {
  const pills: string[] = [];
  if (settings.voice) pills.push(s.galleryPillVoice);
  pills.push(s.galleryPillBilingual);
  if (tpl.tested) pills.push(s.galleryPillTested);
  const noFaydaOnly =
    tpl.idRoutes.length === 0 ||
    (tpl.idRoutes.length === 1 && tpl.idRoutes[0] === "partner_refer") ||
    !tpl.idRoutes.includes("fayda");
  if (noFaydaOnly) pills.push(s.galleryPillNoId);
  return pills;
}

function TemplateCardMock({
  tpl,
  firstQ,
  lang: _lang,
  steps,
  s,
}: {
  tpl: MezgebTemplate;
  firstQ: MezgebTemplate["questions"][number] | undefined;
  lang: "en" | "am";
  steps: number;
  s: ReturnType<typeof useTs>;
}) {
  const labelAm = firstQ?.label.am || firstQ?.label.en || "…";
  const labelEn = firstQ?.label.en || "";
  return (
    <div className="w-[280px] bg-white rounded-xl border border-[var(--console-line)] p-3 shadow-sm" aria-hidden="true">
      <div className="flex items-center justify-between text-[10px] text-[var(--muted)] mb-1.5 font-mono">
        <span>{s.f("galleryStepOf", { n: 1, total: Math.max(steps, 1) })}</span>
        <span className="text-[var(--mint-ink)]">● {s.galleryMicActive}</span>
      </div>
      <p className="text-xs font-semibold text-[var(--ink)] mb-2" lang="am">
        {labelAm}{" "}
        {labelEn && (
          <span className="text-[10px] font-normal text-[var(--muted)]" lang="en">
            ({labelEn})
          </span>
        )}
      </p>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-7 bg-[var(--console-paper)] border border-[var(--console-line)] rounded px-2 flex items-center text-[11px] text-[var(--muted)] truncate">
          {tpl.name.en}
        </div>
        <span className="w-7 h-7 rounded bg-[var(--accent)] text-white flex items-center justify-center shrink-0">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        </span>
      </div>
    </div>
  );
}
