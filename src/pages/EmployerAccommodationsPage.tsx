import React, { useEffect, useRef, useState } from "react";
import { Briefcase, Building2, Check, ChevronDown, HeartHandshake, MapPin } from "lucide-react";
import { Layout } from "../components/Layout";
import { useLiveAnnouncer } from "../components/LiveAnnouncer";
import { TranslationKeys, useI18n } from "../i18n";
import { EMPLOYER_ACCOM_OPTIONS } from "../templates";
import { Badge, Banner, Button, ChoiceList, CodeBlock, Field, Progress } from "../ui";

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

export function EmployerAccommodationsPage() {
  const { lang, t } = useI18n();
  const { announce } = useLiveAnnouncer();

  const [step, setStep] = useState(0); // 0=title, 1=company, 2=location, 3=accommodations, 4=review
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [accommodations, setAccommodations] = useState<string[]>([
    "screen_reader",
    "flexible_hours",
  ]);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const totalSteps = 5;

  useEffect(() => {
    window.setTimeout(() => headingRef.current?.focus(), 20);
  }, [step]);

  const getAccomWords = (code: string) => {
    const key = getPlainAccomKey(code);
    if (key) return t(key);
    const opt = EMPLOYER_ACCOM_OPTIONS.find((o) => o.value === code);
    return opt ? opt.label[lang] : code;
  };

  const handleNext = () => {
    setError(null);
    if (step === 0 && !jobTitle.trim()) {
      setError(t("errRequired"));
      return;
    }
    if (step === 1 && !companyName.trim()) {
      setError(t("errRequired"));
      return;
    }
    if (step === 2 && !jobLocation.trim()) {
      setError(t("errRequired"));
      return;
    }
    if (step < totalSteps - 1) {
      const nextStep = step + 1;
      setStep(nextStep);
      announce(t("widgetStepOf", { current: nextStep + 1, total: totalSteps }));
    } else {
      setConfirmed(true);
      announce(t("widgetSuccessTitle"));
    }
  };

  const handleBack = () => {
    setError(null);
    setConfirmed(false);
    if (step > 0) {
      setStep((s) => s - 1);
    }
  };

  const isRemote =
    jobLocation.toLowerCase().includes("remote") ||
    jobLocation.includes("ርቀት") ||
    accommodations.includes("remote_option");

  const jobPostingJsonLd = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: jobTitle.trim() || "Junior data clerk",
    hiringOrganization: {
      "@type": "Organization",
      name: companyName.trim() || "Sample Employer",
    },
    ...(isRemote
      ? { jobLocationType: "TELECOMMUTE" }
      : {
          jobLocation: {
            "@type": "Place",
            address: {
              "@type": "PostalAddress",
              addressLocality: jobLocation.trim() || "Addis Ababa",
              addressCountry: "ET",
            },
          },
        }),
    jobBenefits: accommodations.map((a) => getAccomWords(a)),
    mezgebAccommodations: accommodations,
  };

  return (
    <Layout>
      <section aria-labelledby="emp-accom-page-title" className="py-12 md:py-16 bg-[var(--paper)]">
        <div className="mezgeb-container max-w-[720px] space-y-8">
          <header className="space-y-2 border-b border-[var(--line)] pb-6">
            <h1
              id="emp-accom-page-title"
              className="mezgeb-display-heading text-[1.75rem] md:text-[2.25rem] font-semibold text-[var(--ink)]"
            >
              {t("employerAccomTitle")}
            </h1>
            <p className="text-base text-[var(--muted)] leading-relaxed">
              {t("employerAccomSubtitle")}
            </p>
          </header>

          {/* One-question-per-screen widget-style container */}
          <div className="rounded-[16px] border border-[var(--line)] bg-[var(--paper)] p-5 sm:p-8 space-y-6">
            <Progress
              current={step + 1}
              total={totalSteps}
              label={
                lang === "am"
                  ? `ጥያቄ ${step + 1} ከ ${totalSteps}`
                  : `Question ${step + 1} of ${totalSteps}`
              }
            />

            {confirmed && (
              <Banner variant="success">
                <span>
                  {t("widgetSuccessTitle")} — {jobTitle.trim() || "Job"} ({companyName.trim() || "Organisation"})
                </span>
              </Banner>
            )}

            {step === 0 && (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Briefcase size={24} strokeWidth={1.75} className="text-[var(--ink)] mt-1 shrink-0" aria-hidden="true" />
                  <h2
                    ref={headingRef}
                    tabIndex={-1}
                    className="text-[1.375rem] md:text-[1.75rem] font-semibold text-[var(--ink)] outline-none"
                  >
                    {t("qJobTitleLabel")}
                  </h2>
                </div>
                <Field
                  id="emp-job-title"
                  label={t("qJobTitleLabel")}
                  labelLang={lang}
                  hint={t("qJobTitleHint")}
                  error={error ?? undefined}
                  inputProps={{
                    value: jobTitle,
                    onChange: (e) => {
                      setJobTitle(e.target.value);
                      setError(null);
                    },
                  }}
                />
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Building2 size={24} strokeWidth={1.75} className="text-[var(--ink)] mt-1 shrink-0" aria-hidden="true" />
                  <h2
                    ref={headingRef}
                    tabIndex={-1}
                    className="text-[1.375rem] md:text-[1.75rem] font-semibold text-[var(--ink)] outline-none"
                  >
                    {t("qCompanyNameLabel")}
                  </h2>
                </div>
                <Field
                  id="emp-company-name"
                  label={t("qCompanyNameLabel")}
                  labelLang={lang}
                  hint={t("qCompanyNameHint")}
                  error={error ?? undefined}
                  inputProps={{
                    value: companyName,
                    onChange: (e) => {
                      setCompanyName(e.target.value);
                      setError(null);
                    },
                  }}
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin size={24} strokeWidth={1.75} className="text-[var(--ink)] mt-1 shrink-0" aria-hidden="true" />
                  <h2
                    ref={headingRef}
                    tabIndex={-1}
                    className="text-[1.375rem] md:text-[1.75rem] font-semibold text-[var(--ink)] outline-none"
                  >
                    {t("qJobLocationLabel")}
                  </h2>
                </div>
                <Field
                  id="emp-job-location"
                  label={t("qJobLocationLabel")}
                  labelLang={lang}
                  hint={t("qJobLocationHint")}
                  error={error ?? undefined}
                  inputProps={{
                    value: jobLocation,
                    onChange: (e) => {
                      setJobLocation(e.target.value);
                      setError(null);
                    },
                  }}
                />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <HeartHandshake size={24} strokeWidth={1.75} className="text-[var(--ink)] mt-1 shrink-0" aria-hidden="true" />
                  <div className="space-y-1">
                    <h2
                      ref={headingRef}
                      tabIndex={-1}
                      className="text-[1.375rem] md:text-[1.75rem] font-semibold text-[var(--ink)] outline-none"
                    >
                      {t("qEmployerAccomLabel")}
                    </h2>
                    <p className="text-sm text-[var(--muted)]">{t("qEmployerAccomHint")}</p>
                  </div>
                </div>

                <ChoiceList
                  name="emp-accom-list"
                  legend={t("qEmployerAccomLabel")}
                  mode="multi"
                  value={accommodations}
                  onChange={(next) => setAccommodations(Array.isArray(next) ? next : [next])}
                  options={EMPLOYER_ACCOM_OPTIONS.map((opt) => ({
                    value: opt.value,
                    title: getAccomWords(opt.value),
                    lang,
                  }))}
                />
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h2
                  ref={headingRef}
                  tabIndex={-1}
                  className="text-[1.375rem] md:text-[1.75rem] font-semibold text-[var(--ink)] outline-none"
                >
                  {t("widgetReviewTitle")}
                </h2>

                <dl className="divide-y divide-[var(--line)] border-t border-b border-[var(--line)]">
                  {[
                    { label: t("qJobTitleLabel"), value: jobTitle || "—", jump: 0 },
                    { label: t("qCompanyNameLabel"), value: companyName || "—", jump: 1 },
                    { label: t("qJobLocationLabel"), value: jobLocation || "—", jump: 2 },
                    {
                      label: t("qEmployerAccomLabel"),
                      value:
                        accommodations.length > 0
                          ? accommodations.map((a) => getAccomWords(a)).join(", ")
                          : "—",
                      jump: 3,
                    },
                  ].map((row) => (
                    <div key={row.label} className="py-3.5 flex items-start justify-between gap-4">
                      <div>
                        <dt className="text-sm font-medium text-[var(--muted)]">{row.label}</dt>
                        <dd className="text-base font-medium text-[var(--ink)] mt-0.5">{row.value}</dd>
                      </div>
                      <Button variant="quiet" onClick={() => setStep(row.jump)}>
                        {t("widgetChange")}
                      </Button>
                    </div>
                  ))}
                </dl>

                {/* Preview of how the badges look on a job row */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-sm font-semibold text-[var(--ink)]">
                    {t("employerAccomPreviewTitle")}
                  </h3>
                  <div className="p-4 rounded-[10px] border border-[var(--line)] bg-[var(--stone)] space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-base font-semibold text-[var(--ink)]">
                          {jobTitle.trim() || "Junior data clerk"}
                        </p>
                        <p className="text-sm text-[var(--muted)]">
                          {companyName.trim() || "Employer"} · {jobLocation.trim() || "Addis Ababa"}
                        </p>
                      </div>
                      <Badge variant="neutral">{t("templatesSampleBadge")}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {accommodations.map((acc) => (
                        <Badge
                          key={acc}
                          variant="success"
                          icon={<Check size={13} strokeWidth={1.75} />}
                        >
                          {getAccomWords(acc)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Fixed-ratio 1:2 bottom action bar */}
            <div className="pt-4 border-t border-[var(--line)] grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  disabled={step === 0}
                  disabledReason={step === 0 ? undefined : undefined}
                  onClick={handleBack}
                >
                  {t("widgetBack")}
                </Button>
              </div>
              <div className="col-span-2">
                <Button variant="primary" size="lg" fullWidth onClick={handleNext}>
                  {step === totalSteps - 1 ? t("widgetConfirm") : t("widgetSaveContinue")}
                </Button>
              </div>
            </div>
          </div>

          {/* Collapsible For developers (schema.org/JobPosting JSON) */}
          <details className="rounded-[10px] border border-[var(--line)] bg-[var(--paper)] group">
            <summary className="px-5 py-4 flex items-center justify-between gap-3 cursor-pointer font-medium text-base text-[var(--ink)] list-none min-h-[48px]">
              <span>{t("employerAccomForDevs")}</span>
              <ChevronDown
                size={20}
                strokeWidth={1.75}
                className="text-[var(--muted)] transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <div className="px-5 pb-5 space-y-3 border-t border-[var(--line)] pt-4">
              <p className="text-sm text-[var(--muted)]">{t("jobsEmployerExplain")}</p>
              <CodeBlock
                filename="jobposting.jsonld"
                code={JSON.stringify(jobPostingJsonLd, null, 2)}
                copyLabel={t("copyCodeBtn")}
                copiedLabel={t("copiedButton")}
                copiedAnnouncement={t("copiedAnnouncement")}
              />
            </div>
          </details>
        </div>
      </section>
    </Layout>
  );
}
