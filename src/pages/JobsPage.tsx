import React, { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Check, ChevronDown, Lock } from "lucide-react";
import { Layout } from "../components/Layout";
import { AnswerMode, MezgebAnswers, MezgebWidget } from "../components/MezgebWidget";
import { SAMPLE_JOBS, SampleJob } from "../data/jobs";
import { TranslationKeys, useI18n } from "../i18n";
import { loadCompletedLearnerProfile } from "../lib/profileStore";
import { JOB_APPLICATION_TEMPLATE, SUPPORT_OPTIONS } from "../templates";
import {
  Badge,
  Banner,
  Button,
  ChoiceList,
  Dialog,
  EmptyState,
  Field,
  VoiceButton,
  VoiceState,
} from "../ui";

function getPlainAccomKey(code: string): TranslationKeys | null {
  switch (code) {
    case "screen_reader":
      return "jobsAccomScreenReader";
    case "extra_time":
      return "jobsAccomExtraTime";
    case "step_free":
      return "jobsAccomStepFree";
    case "sign_language":
      return "jobsAccomSignLanguage";
    case "large_print":
      return "jobsAccomLargePrint";
    case "quiet_room":
      return "jobsAccomQuietRoom";
    case "flexible_hours":
      return "jobsAccomFlexibleHours";
    case "remote_option":
      return "jobsAccomRemote";
    default:
      return null;
  }
}

export function JobsPage() {
  const { lang, t } = useI18n();
  const savedProfile = useMemo(() => loadCompletedLearnerProfile(), []);

  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "remote" | "onsite">("all");
  const [selectedSupport, setSelectedSupport] = useState<string[]>(
    () => savedProfile?.supportNeedsInSession ?? []
  );

  // Voice search state
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const recRef = useRef<any>(null);

  // Selected job & apply modal
  const [selectedJobId, setSelectedJobId] = useState<string>(SAMPLE_JOBS[0].id);
  const [applyingJob, setApplyingJob] = useState<SampleJob | null>(null);
  const [applyMode, setApplyMode] = useState<AnswerMode>("speak");
  const [applicationResult, setApplicationResult] = useState<Record<string, unknown> | null>(null);

  const getAccomPlainLabel = (code: string) => {
    const key = getPlainAccomKey(code);
    if (key) return t(key);
    const opt = SUPPORT_OPTIONS.find((o) => o.value === code);
    return opt ? opt.label[lang] : code;
  };

  const handleStartVoiceSearch = () => {
    const SpeechRec =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec) {
      try {
        const rec = new SpeechRec();
        rec.lang = lang === "am" ? "am-ET" : "en-US";
        rec.interimResults = false;
        rec.maxAlternatives = 1;
        rec.onresult = (ev: any) => {
          const text = ev?.results?.[0]?.[0]?.transcript ?? "";
          if (text) {
            setVoiceTranscript(text);
            setVoiceState("review");
          } else {
            setVoiceState("failed");
          }
        };
        rec.onerror = () => {
          setVoiceState("failed");
        };
        recRef.current = rec;
        rec.start();
        setVoiceState("listening");
        return;
      } catch {
        setVoiceState("failed");
        return;
      }
    }
    setVoiceState("listening");
  };

  const handleStopVoiceSearch = () => {
    if (recRef.current) {
      try {
        recRef.current.stop();
      } catch {
        // ignore
      }
      setVoiceState("processing");
      return;
    }
    setVoiceState("processing");
    window.setTimeout(() => {
      setVoiceTranscript(lang === "am" ? "ዳታ" : "data");
      setVoiceState("review");
    }, 350);
  };

  const filteredJobs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return SAMPLE_JOBS.filter((job) => {
      if (typeFilter === "remote" && !job.remote) return false;
      if (typeFilter === "onsite" && job.remote) return false;
      if (locationFilter === "addis" && !job.city.en.toLowerCase().includes("addis")) return false;
      if (locationFilter === "adama" && !job.city.en.toLowerCase().includes("adama")) return false;
      if (locationFilter === "remote" && !job.remote) return false;

      if (q) {
        const hay = `${job.title.en} ${job.title.am} ${job.employerType.en} ${job.employerType.am} ${job.city.en} ${job.city.am} ${job.summary.en} ${job.summary.am}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    })
      .map((job) => {
        const metCount = selectedSupport.filter((f) =>
          job.offeredAccommodations.includes(f)
        ).length;
        return { job, metCount };
      })
      .sort((a, b) => b.metCount - a.metCount);
  }, [searchQuery, typeFilter, locationFilter, selectedSupport]);

  const activeJob =
    filteredJobs.find((item) => item.job.id === selectedJobId)?.job ??
    filteredJobs[0]?.job ??
    null;

  return (
    <Layout>
      <section aria-labelledby="jobs-heading" className="py-12 md:py-16 bg-[var(--paper)] min-h-[75vh]">
        <div className="mezgeb-container space-y-8 text-left">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[var(--line)]">
            <div className="space-y-2 max-w-[64ch]">
              <Badge variant="neutral">{t("templatesSampleBadge")}</Badge>
              <h1
                id="jobs-heading"
                className="mezgeb-display-heading text-[1.75rem] md:text-[2.25rem] font-semibold text-[var(--ink)]"
              >
                {t("jobsTitle")}
              </h1>
              <p className="text-base text-[var(--muted)] leading-relaxed">{t("jobsSubtitle")}</p>
            </div>

            <Link
              to="/employers/accommodations"
              className="inline-flex items-center justify-center min-h-[44px] px-4 rounded-[10px] border border-[var(--ink)] bg-[var(--paper)] text-[var(--ink)] text-sm font-medium hover:bg-[var(--stone)] mezgeb-transition shrink-0"
            >
              {t("employerAccomTitle")}
            </Link>
          </header>

          {/* Search with VoiceButton + Collapsible Filters */}
          <div className="space-y-4">
            <Field
              id="jobs-search-input"
              label={t("feat4SearchPlaceholder")}
              labelLang={lang}
              inputProps={{
                type: "search",
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
              }}
              rightSlot={
                <VoiceButton
                  state={voiceState}
                  transcript={voiceTranscript}
                  onTranscriptChange={setVoiceTranscript}
                  onStart={handleStartVoiceSearch}
                  onStop={handleStopVoiceSearch}
                  onKeep={() => {
                    setSearchQuery(voiceTranscript);
                    setVoiceState("idle");
                  }}
                  onRetry={() => {
                    setVoiceTranscript("");
                    setVoiceState("idle");
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
              }
            />

            <details className="rounded-[10px] border border-[var(--line)] bg-[var(--paper)] group">
              <summary className="px-4 py-3 flex items-center justify-between gap-3 cursor-pointer list-none min-h-[48px] font-medium text-base text-[var(--ink)]">
                <span>
                  {t("jobsPrivateFilterTitle")}
                  {selectedSupport.length > 0 ? ` (${selectedSupport.length})` : ""}
                </span>
                <ChevronDown
                  size={20}
                  strokeWidth={1.75}
                  className="text-[var(--muted)] group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>

              <div className="p-4 sm:p-5 border-t border-[var(--line)] space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="jobs-filter-location"
                      className="block text-sm font-medium text-[var(--ink)] mb-1.5"
                    >
                      {t("qJobLocationLabel")}
                    </label>
                    <select
                      id="jobs-filter-location"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="w-full min-h-[44px] px-3 rounded-[6px] border border-[var(--line-strong)] bg-[var(--paper)] text-sm text-[var(--ink)]"
                    >
                      <option value="all">{t("templatesFilterAll")}</option>
                      <option value="addis">Addis Ababa</option>
                      <option value="adama">Adama</option>
                      <option value="remote">{t("jobsRemoteLabel")}</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="jobs-filter-type"
                      className="block text-sm font-medium text-[var(--ink)] mb-1.5"
                    >
                      {t("qStartWhenLabel")}
                    </label>
                    <select
                      id="jobs-filter-type"
                      value={typeFilter}
                      onChange={(e) =>
                        setTypeFilter(e.target.value as "all" | "remote" | "onsite")
                      }
                      className="w-full min-h-[44px] px-3 rounded-[6px] border border-[var(--line-strong)] bg-[var(--paper)] text-sm text-[var(--ink)]"
                    >
                      <option value="all">{t("templatesFilterAll")}</option>
                      <option value="remote">{t("jobsRemoteLabel")}</option>
                      <option value="onsite">Addis Ababa / Adama</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-[var(--line)]">
                  <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-[var(--ink)]">
                    <Lock size={16} strokeWidth={1.75} aria-hidden="true" />
                    <span>{t("jobsPrivateFilterHint")}</span>
                  </div>

                  <ChoiceList
                    name="jobs-private-support"
                    legend={t("jobsPrivateFilterTitle")}
                    mode="multi"
                    value={selectedSupport}
                    onChange={(next) => setSelectedSupport(Array.isArray(next) ? next : [next])}
                    options={SUPPORT_OPTIONS.map((opt) => ({
                      value: opt.value,
                      title: getAccomPlainLabel(opt.value),
                      lang,
                    }))}
                  />
                </div>
              </div>
            </details>
          </div>

          {/* Job Rows (not cards) + Job Detail Panel */}
          {filteredJobs.length === 0 ? (
            <EmptyState
              title={t("templatesEmptySearch")}
              description={t("jobsPrivateFilterHint")}
              action={
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSearchQuery("");
                    setLocationFilter("all");
                    setTypeFilter("all");
                  }}
                >
                  {t("templatesFilterAll")}
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Job rows */}
              <div className="lg:col-span-7 border-t border-b border-[var(--line)] divide-y divide-[var(--line)]">
                {filteredJobs.map(({ job, metCount }) => {
                  const selected = activeJob?.id === job.id;
                  const totalSelected = selectedSupport.length;
                  return (
                    <article
                      key={job.id}
                      className={`py-5 px-4 transition-colors ${
                        selected ? "bg-[var(--stone)]" : "bg-[var(--paper)] hover:bg-[var(--stone)]"
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-lg font-semibold text-[var(--ink)]">
                              <button
                                type="button"
                                onClick={() => setSelectedJobId(job.id)}
                                aria-current={selected ? "true" : undefined}
                                className="text-left hover:underline underline-offset-4 cursor-pointer"
                              >
                                {job.title[lang]}
                              </button>
                            </h2>
                            <Badge variant="neutral">{t("templatesSampleBadge")}</Badge>
                          </div>
                          <p className="text-sm text-[var(--muted)]">
                            {job.employerType[lang]} ·{" "}
                            {job.remote ? t("jobsRemoteLabel") : job.city[lang]}
                          </p>
                        </div>

                        {totalSelected > 0 && (
                          <Badge
                            variant={metCount === totalSelected ? "success" : "neutral"}
                            icon={
                              metCount === totalSelected ? (
                                <Check size={13} strokeWidth={1.75} />
                              ) : undefined
                            }
                          >
                            {t("jobsMatchBadge", { met: metCount, total: totalSelected })}
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {job.offeredAccommodations.map((acc) => {
                          const matched = selectedSupport.includes(acc);
                          return (
                            <Badge
                              key={acc}
                              variant={matched ? "success" : "neutral"}
                              icon={matched ? <Check size={12} strokeWidth={1.75} /> : undefined}
                            >
                              {getAccomPlainLabel(acc)}
                            </Badge>
                          );
                        })}
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Job detail panel */}
              {activeJob && (
                <aside
                  aria-label={activeJob.title[lang]}
                  className="lg:col-span-5 rounded-[10px] border border-[var(--line)] bg-[var(--paper)] p-6 space-y-6 lg:sticky lg:top-24"
                >
                  <div className="space-y-2 pb-4 border-b border-[var(--line)]">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="neutral">{t("templatesSampleBadge")}</Badge>
                    </div>
                    <h2 className="text-[1.375rem] font-semibold text-[var(--ink)]">
                      {activeJob.title[lang]}
                    </h2>
                    <p className="text-sm text-[var(--muted)]">
                      {activeJob.employerType[lang]} ·{" "}
                      {activeJob.remote ? t("jobsRemoteLabel") : activeJob.city[lang]}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-base font-semibold text-[var(--ink)]">
                      {t("jobsAboutHeading")}
                    </h3>
                    <p className="text-base text-[var(--ink)] leading-relaxed">
                      {activeJob.summary[lang]}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-base font-semibold text-[var(--ink)]">
                      {t("jobsNeedHeading")}
                    </h3>
                    <p className="text-sm text-[var(--muted)] leading-relaxed">
                      {t("feat2Body")}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-base font-semibold text-[var(--ink)]">
                      {t("jobsSupportHeading")}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {activeJob.offeredAccommodations.map((acc) => (
                        <Badge
                          key={acc}
                          variant={selectedSupport.includes(acc) ? "success" : "neutral"}
                        >
                          {getAccomPlainLabel(acc)}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-[var(--line)]">
                    <h3 className="text-base font-semibold text-[var(--ink)]">
                      {t("jobsHowToApplyHeading")}
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        variant="primary"
                        size="lg"
                        fullWidth
                        onClick={() => {
                          setApplicationResult(null);
                          setApplyMode("speak");
                          setApplyingJob(activeJob);
                        }}
                      >
                        {t("jobsApplyVoiceBtn")}
                      </Button>
                      <Button
                        variant="secondary"
                        size="lg"
                        fullWidth
                        onClick={() => {
                          setApplicationResult(null);
                          setApplyMode("type");
                          setApplyingJob(activeJob);
                        }}
                      >
                        {t("jobsApplyTypeBtn")}
                      </Button>
                    </div>
                  </div>
                </aside>
              )}
            </div>
          )}
        </div>
      </section>

      <Dialog
        open={Boolean(applyingJob)}
        onClose={() => setApplyingJob(null)}
        title={applyingJob ? t("jobsApplyDialogTitle", { title: applyingJob.title[lang] }) : ""}
        maxWidthClass="max-w-2xl"
        closeLabel={t("closeButton")}
      >
        {applyingJob && (
          <div className="space-y-4">
            <MezgebWidget
              key={`${applyingJob.id}-${applyMode}`}
              template={JOB_APPLICATION_TEMPLATE}
              aiEnabled={true}
              offline={false}
              initialAnswerMode={applyMode}
              initialAnswers={
                savedProfile
                  ? ({
                      ...savedProfile.rawAnswers,
                      support_needs: savedProfile.supportNeedsInSession,
                    } as MezgebAnswers)
                  : undefined
              }
              platformName={applyingJob.employerType[lang]}
              storageKey={`mezgeb_job_apply_${applyingJob.id}`}
              onComplete={(res) => {
                setApplicationResult({
                  jobId: applyingJob.id,
                  jobTitle: applyingJob.title.en,
                  token: res.token,
                  supportSharedWithEmployer: res.supportShared,
                  payload: res.profile,
                });
              }}
            />

            {applicationResult && (
              <Banner variant="success">
                <p className="font-semibold">{t("jobsApplyResultTitle")}</p>
                <p className="text-xs mt-0.5">{t("jobsApplyResultNote")}</p>
              </Banner>
            )}
          </div>
        )}
      </Dialog>
    </Layout>
  );
}
