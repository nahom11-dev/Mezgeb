import React, { useMemo, useState } from "react";
import { AccessibleDialog } from "../components/AccessibleDialog";
import { CheckIcon, CopyIcon, LockIcon, MicIcon } from "../components/Icons";
import { Layout } from "../components/Layout";
import { useLiveAnnouncer } from "../components/LiveAnnouncer";
import { MezgebWidget } from "../components/MezgebWidget";
import { SAMPLE_JOBS, SampleJob } from "../data/jobs";
import { useI18n } from "../i18n";
import { loadCompletedLearnerProfile } from "../lib/profileStore";
import {
  EMPLOYER_ACCOM_OPTIONS,
  EMPLOYER_TEMPLATE,
  JOB_APPLICATION_TEMPLATE,
  SUPPORT_OPTIONS,
} from "../templates";

export function JobsPage() {
  const { lang, t } = useI18n();
  const { announce } = useLiveAnnouncer();

  const [activeTab, setActiveTab] = useState<"seeker" | "employer">("seeker");

  // Pre-populate private filters from session-stored support needs if present
  const [selectedFilters, setSelectedFilters] = useState<string[]>(() => {
    const saved = loadCompletedLearnerProfile();
    return saved?.supportNeedsInSession ?? [];
  });

  // Apply by voice modal
  const [applyingJob, setApplyingJob] = useState<SampleJob | null>(null);
  const [applicationResult, setApplicationResult] = useState<Record<string, unknown> | null>(null);

  // Employer JobPosting JSON-LD output
  const [jobPostingJsonLd, setJobPostingJsonLd] = useState<Record<string, unknown> | null>(null);
  const [copiedJsonLd, setCopiedJsonLd] = useState(false);

  const toggleFilter = (val: string) => {
    setSelectedFilters((prev) =>
      prev.includes(val) ? prev.filter((item) => item !== val) : [...prev, val]
    );
  };

  const getAccomLabel = (val: string): string => {
    const opt = EMPLOYER_ACCOM_OPTIONS.find((o) => o.value === val);
    return opt ? opt.label[lang] : val;
  };

  const rankedJobs = useMemo(() => {
    return SAMPLE_JOBS.map((job) => {
      const metCount = selectedFilters.filter((f) => job.offeredAccommodations.includes(f)).length;
      return { job, metCount };
    }).sort((a, b) => b.metCount - a.metCount);
  }, [selectedFilters]);

  const handleEmployerComplete = (result: {
    token: string;
    profile: Record<string, unknown>;
    supportShared: boolean;
  }) => {
    const p = result.profile;
    const title = String(p.job_title ?? "Job position");
    const company = String(p.company_name ?? "Employer");
    const location = String(p.job_location ?? "Addis Ababa");
    const contact = p.contact_person ? String(p.contact_person) : undefined;
    const accommodations = Array.isArray(p.offered_accommodations)
      ? (p.offered_accommodations as string[])
      : [];

    const isRemote = location.toLowerCase().includes("remote") || location.includes("ርቀት");

    const jsonLd: Record<string, unknown> = {
      "@context": "https://schema.org/",
      "@type": "JobPosting",
      title,
      hiringOrganization: {
        "@type": "Organization",
        name: company,
      },
      ...(isRemote
        ? { jobLocationType: "TELECOMMUTE" }
        : {
            jobLocation: {
              "@type": "Place",
              address: {
                "@type": "PostalAddress",
                addressLocality: location,
                addressCountry: "ET",
              },
            },
          }),
      ...(contact ? { applicationContact: { "@type": "ContactPoint", name: contact } } : {}),
      jobBenefits: accommodations,
      mezgebAccommodations: accommodations,
    };

    setJobPostingJsonLd(jsonLd);
  };

  const handleCopyJsonLd = async () => {
    if (!jobPostingJsonLd) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(jobPostingJsonLd, null, 2));
    } catch {
      // ignore clipboard fallback
    }
    setCopiedJsonLd(true);
    announce(t("copiedAnnouncement"));
    window.setTimeout(() => setCopiedJsonLd(false), 2000);
  };

  return (
    <Layout>
      <section aria-labelledby="jobs-heading" className="py-12 md:py-16 bg-[#FAF9F6] min-h-[75vh]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-medium text-[#6B6B6B]">{t("demoSampleBadge")}</span>
              <h1 id="jobs-heading" className="text-3xl md:text-4xl font-bold tracking-tight text-[#111111]">
                {t("jobsTitle")}
              </h1>
              <p className="text-base text-[#6B6B6B]">{t("jobsSubtitle")}</p>
            </div>

            <div
              role="tablist"
              aria-label={t("jobsTitle")}
              className="inline-flex rounded-xl border border-[#E7E7E4] bg-white p-1 shrink-0"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "seeker"}
                onClick={() => setActiveTab("seeker")}
                className={`px-4 min-h-[40px] rounded-lg text-sm font-semibold transition-colors ${
                  activeTab === "seeker" ? "bg-[#111111] text-white" : "text-[#6B6B6B] hover:text-[#111111]"
                }`}
              >
                {t("jobsTabSeeker")}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "employer"}
                onClick={() => setActiveTab("employer")}
                className={`px-4 min-h-[40px] rounded-lg text-sm font-semibold transition-colors ${
                  activeTab === "employer" ? "bg-[#111111] text-white" : "text-[#6B6B6B] hover:text-[#111111]"
                }`}
              >
                {t("jobsTabEmployer")}
              </button>
            </div>
          </div>

          {activeTab === "seeker" ? (
            <div className="space-y-8">
              {/* Private filter panel */}
              <div className="mezgeb-card p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-base font-semibold text-[#111111]">{t("jobsPrivateFilterTitle")}</h2>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B6B6B]">
                    <LockIcon size={14} />
                    <span>{t("jobsPrivateFilterNote")}</span>
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {SUPPORT_OPTIONS.map((opt) => {
                    const active = selectedFilters.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        aria-pressed={active}
                        onClick={() => toggleFilter(opt.value)}
                        className={`px-3.5 min-h-[40px] rounded-xl border text-sm font-medium inline-flex items-center gap-2 transition-colors ${
                          active
                            ? "border-[#8F6FE0] bg-[#EEEBF8] text-[#111111] font-semibold"
                            : "border-[#E7E7E4] bg-white text-[#6B6B6B] hover:border-[#C8C8C4]"
                        }`}
                      >
                        {active && <CheckIcon size={14} className="text-[#6A4FC4]" />}
                        <span>{opt.label[lang]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Job cards grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rankedJobs.map(({ job, metCount }) => {
                  const totalSelected = selectedFilters.length;
                  return (
                    <article key={job.id} className="mezgeb-card p-6 flex flex-col justify-between gap-5">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h2 className="text-lg font-semibold text-[#111111]">{job.title[lang]}</h2>
                            <p className="text-sm text-[#6B6B6B]">
                              {job.employerType[lang]} · {job.remote ? t("jobsRemoteLabel") : job.city[lang]}
                            </p>
                          </div>
                          <span
                            className={`px-2.5 py-1 rounded-md text-xs font-semibold shrink-0 ${
                              totalSelected > 0 && metCount === totalSelected
                                ? "bg-[#E4F2EC] text-[#1F5C46]"
                                : "bg-[#F5F5F3] text-[#6B6B6B]"
                            }`}
                          >
                            {totalSelected > 0
                              ? t("jobsMatchBadge", { met: metCount, total: totalSelected })
                              : t("jobsNoFilterBadge")}
                          </span>
                        </div>

                        <p className="text-sm text-[#111111]/85 leading-relaxed">{job.summary[lang]}</p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {job.offeredAccommodations.map((acc) => {
                            const matched = selectedFilters.includes(acc);
                            return (
                              <span
                                key={acc}
                                className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                                  matched
                                    ? "bg-[#E4F2EC] text-[#1F5C46] border border-[#1F5C46]/25"
                                    : "bg-[#F5F5F3] text-[#6B6B6B]"
                                }`}
                              >
                                {getAccomLabel(acc)}
                                {matched ? " ✓" : ""}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#E7E7E4]">
                        <button
                          type="button"
                          onClick={() => {
                            setApplicationResult(null);
                            setApplyingJob(job);
                          }}
                          className="mezgeb-btn-primary text-sm"
                        >
                          <MicIcon size={15} />
                          <span>{t("jobsApplyVoiceBtn")}</span>
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-4">
                <p className="text-sm text-[#6B6B6B]">{t("jobsEmployerIntro")}</p>
                <MezgebWidget
                  template={EMPLOYER_TEMPLATE}
                  aiEnabled={true}
                  offline={false}
                  platformName="Mezgeb Jobs"
                  storageKey="mezgeb_employer_job_v1"
                  onComplete={handleEmployerComplete}
                />
              </div>

              <div className="lg:col-span-5 mezgeb-card p-6 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-base font-semibold text-[#111111]">{t("jobsEmployerOutputTitle")}</h2>
                  {jobPostingJsonLd && (
                    <button
                      type="button"
                      onClick={handleCopyJsonLd}
                      className="inline-flex items-center gap-1.5 px-3 min-h-[34px] rounded-lg border border-[#E7E7E4] text-xs font-medium hover:bg-[#F5F5F3]"
                    >
                      <CopyIcon size={13} />
                      <span>{copiedJsonLd ? t("copiedButton") : t("copyButton")}</span>
                    </button>
                  )}
                </div>
                <p className="text-xs text-[#6B6B6B]">{t("jobsEmployerExplain")}</p>
                <pre className="p-4 rounded-xl bg-[#161616] text-[#E4F2EC] text-xs font-mono overflow-x-auto max-h-[420px]">
                  <code>
                    {jobPostingJsonLd
                      ? JSON.stringify(jobPostingJsonLd, null, 2)
                      : JSON.stringify(
                          {
                            "@context": "https://schema.org/",
                            "@type": "JobPosting",
                            title: "...",
                            jobBenefits: [],
                          },
                          null,
                          2
                        )}
                  </code>
                </pre>
              </div>
            </div>
          )}
        </div>
      </section>

      <AccessibleDialog
        open={Boolean(applyingJob)}
        onClose={() => setApplyingJob(null)}
        title={applyingJob ? t("jobsApplyDialogTitle", { title: applyingJob.title[lang] }) : ""}
        maxWidthClass="max-w-2xl"
      >
        {applyingJob && (
          <div className="space-y-4">
            <MezgebWidget
              key={applyingJob.id}
              template={JOB_APPLICATION_TEMPLATE}
              aiEnabled={true}
              offline={false}
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
              <div className="p-4 rounded-xl bg-[#E4F2EC] text-[#1F5C46] space-y-2">
                <p className="text-sm font-semibold">{t("jobsApplyResultTitle")}</p>
                <p className="text-xs">{t("jobsApplyResultNote")}</p>
                <pre className="p-3 rounded-lg bg-[#161616] text-[#E4F2EC] text-xs font-mono overflow-x-auto">
                  <code>{JSON.stringify(applicationResult, null, 2)}</code>
                </pre>
              </div>
            )}
          </div>
        )}
      </AccessibleDialog>
    </Layout>
  );
}
