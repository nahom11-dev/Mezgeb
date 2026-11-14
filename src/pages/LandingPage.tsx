import React from "react";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import { Layout } from "../components/Layout";
import { useI18n } from "../i18n";
import { Badge, Button, CodeBlock, Field, VoiceButton } from "../ui";

const WAVE_LEFT = [120, 135, 110, 125, 95, 105, 85, 115, 70, 90, 60, 75, 45, 55, 35, 40, 28, 32, 20];
const WAVE_CENTER = [18, 24, 16, 22, 18];
const WAVE_RIGHT = [20, 34, 28, 45, 38, 65, 50, 80, 70, 98, 85, 120, 95, 130, 115, 125, 105, 130];

const embedCode = `<script type="module" src="https://cdn.mezgeb.example/v1/mezgeb.js"></script>
<mezgeb-register site-key="pk_yoursite" lang="am"></mezgeb-register>`;

const webhookCode = `POST /v1/registrations/exchange
{
  "event": "registration.completed",
  "template_id": "learning-platform",
  "profile": { "name": "…", "lang": "am" }
}
// 200 OK`;

export function LandingPage() {
  const { t } = useI18n();

  return (
    <Layout showFaqInFooter showGiantWordmark headerVariant="overlay">
      <section
        aria-labelledby="hero-heading"
        className="relative overflow-hidden mz-hero-gradient min-h-screen pb-24 pt-16"
      >
        <div className="max-w-4xl mx-auto px-4 pt-8 md:pt-12 pb-12 text-center relative z-20">
          <h1
            id="hero-heading"
            className="mezgeb-display-heading text-5xl sm:text-6xl md:text-[4.75rem] leading-[1.05] font-extrabold tracking-[-0.03em] text-[var(--ink)] mb-6"
          >
            <span className="block">{t("landingHeroH1Line1")}</span>
            <span className="block">{t("landingHeroH1Line2")}</span>
          </h1>
          <p className="text-base sm:text-lg text-[var(--muted)] max-w-xl mx-auto leading-relaxed mb-10">
            {t("heroSubtitle")}
          </p>
          <Link
            to="/partner"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#C9A7F5] text-[var(--ink)] font-semibold text-base hover:brightness-95 active:scale-[0.98] transition-all shadow-md ring-8 ring-white/40"
          >
            {t("navPilotCta")}
          </Link>
          <p className="text-[13px] text-[var(--muted)] font-medium mt-4">{t("heroPilotSubline")}</p>
        </div>

        <div className="relative w-full max-w-6xl mx-auto px-4">
          <HeroWaveform />
          <div className="relative z-10 max-w-[1000px] mx-auto p-3 rounded-[28px] bg-white/60 backdrop-blur-md border border-white/80 shadow-[0_24px_50px_-12px_rgba(20,32,27,0.12)]">
            <div className="relative rounded-[18px] overflow-hidden bg-[#F9FAF9] border border-[var(--line)] min-h-[420px]">
              <span className="absolute top-4 left-4 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/65 backdrop-blur-md text-white text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {t("heroVideoPosterBadge")}
              </span>
              <button
                type="button"
                aria-label={t("heroVideoPlayLabel")}
                className="absolute inset-0 z-10 flex items-center justify-center"
              >
                <span className="w-16 h-16 rounded-full bg-white shadow-2xl flex items-center justify-center hover:scale-110 transition-transform">
                  <Play size={28} className="ml-1 text-[var(--ink)]" fill="currentColor" aria-hidden="true" />
                </span>
              </button>
              <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-end justify-between gap-2">
                <div className="px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-white/70 text-xs font-semibold text-[var(--ink)]">
                  {t("heroVideoTitle")} · 2 min
                </div>
                <div className="hidden sm:flex gap-2">
                  <span className="px-3 py-1.5 rounded-full bg-white/85 text-[11px] font-medium border border-white/70">
                    {t("heroVideoCC")}
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-white/85 text-[11px] font-medium border border-white/70">
                    Audio described
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-white/85 text-[11px] font-medium border border-white/70">
                    {t("heroVideoTranscript")}
                  </span>
                </div>
              </div>

              <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-24 md:pt-20">
                <div className="md:col-span-8 space-y-4 text-left">
                  <p lang="am" className="text-xl font-semibold text-[var(--ink)]">
                    {t("heroVideoQuestionAm")}
                  </p>
                  <p lang="en" className="text-sm text-[var(--muted)]">
                    {t("heroVideoQuestionEn")}
                  </p>
                  <div className="flex flex-wrap gap-2 items-center">
                    <Badge variant="neutral">{t("heroVideoEthSwitch")}</Badge>
                    <div className="flex gap-2">
                      {["12", "Meskerem", t("heroVideoYearPlaceholder")].map((v, i) => (
                        <div
                          key={i}
                          className="h-10 min-w-[72px] px-3 rounded-lg border border-[var(--line)] bg-white flex items-center text-sm text-[var(--muted)]"
                        >
                          {v}
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-[var(--error)]">{t("heroVideoYearError")}</p>
                  <div className="flex justify-end">
                    <span className="w-12 h-12 rounded-full bg-[var(--accent)] text-white flex items-center justify-center mz-mic-ripple">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
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
                <aside className="md:col-span-4 rounded-xl border border-[var(--line)] bg-white p-4 text-left text-sm space-y-2 shadow-sm">
                  <p className="font-semibold text-[var(--ink)]">{t("optAreaKolfe")}</p>
                  <p className="text-[var(--muted)] leading-snug">{t("heroPartnerNotice")}</p>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="why-heading" className="bg-[var(--mint)] py-20 md:py-32">
        <div className="mezgeb-container max-w-3xl text-left space-y-6">
          <p className="text-sm font-semibold text-[var(--accent)] uppercase tracking-wide">{t("whyLabel")}</p>
          <h2 id="why-heading" className="sr-only">
            {t("whyLabel")}
          </h2>
          <p className="text-2xl md:text-[2.25rem] font-semibold text-[var(--ink)] leading-snug">{t("whyP1")}</p>
          <p className="text-lg text-[var(--ink-2)] leading-relaxed">
            {t("whyP2Lead")}
            <strong>{t("whyP2Bold1")}</strong>
            {t("whyP2Mid")}
            <strong>{t("whyP2Bold2")}</strong>
          </p>
          <p className="text-lg text-[var(--ink-2)] leading-relaxed">
            {t("whyP3Lead")}
            <strong>{t("whyP3Bold")}</strong>
            {t("whyP3Tail")}
          </p>
          <p className="text-xl font-medium text-[var(--ink)]">{t("whyP4")}</p>
          <p className="text-sm text-[var(--muted)]">{t("whySources")}</p>
        </div>
      </section>

      <section aria-labelledby="features-heading" className="bg-[var(--paper)] py-20 md:py-28">
        <div className="mezgeb-container space-y-20">
          <div className="text-left space-y-2">
            <p className="text-xs font-mono uppercase tracking-wider text-[var(--accent)] font-semibold">
              {t("featuresSectionTitle")}
            </p>
            <h2 id="features-heading" className="text-3xl md:text-4xl font-semibold text-[var(--ink)]">
              Designed for every way people sign up
            </h2>
          </div>

          <FeatureRow
            label={t("feat1Label")}
            title={[t("feat1HeadingLine1"), t("feat1HeadingLine2")]}
            body={t("feat1Body")}
            reverse={false}
            visual={
              <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-5 space-y-3 max-w-md shadow-sm">
                <p className="text-xs text-[var(--muted)]">{t("feat1SmsSender")}</p>
                <p className="text-sm">{t("feat1SmsText")}</p>
                <p className="text-sm font-mono text-[var(--accent)]">{t("feat1SmsLink")}</p>
                <div className="pt-3 border-t border-[var(--line)]">
                  <p className="font-semibold">{t("feat1ResumeTitle")}</p>
                  <p className="text-xs text-[var(--muted)]">{t("feat1ResumeSub")}</p>
                  <Button variant="primary" size="sm" className="mt-3" tabIndex={-1}>
                    {t("feat1ResumeBtn")}
                  </Button>
                </div>
              </div>
            }
          />

          <FeatureRow
            label={t("feat2Label")}
            title={[t("feat2HeadingLine1"), t("feat2HeadingLine2")]}
            body={t("feat2Body")}
            reverse
            visual={
              <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-5 max-w-md shadow-sm space-y-3">
                <p className="font-semibold">{t("feat2CardTitle")}</p>
                <p className="text-xs text-[var(--muted)] p-2 rounded-lg bg-[var(--stone)] border border-[var(--line)]">
                  &quot;{t("feat2TranscriptHl1")}…&quot;
                </p>
                <p className="text-xs font-semibold text-[var(--muted)]">{t("feat2SkillsLabel")}</p>
                <div className="flex flex-wrap gap-1">
                  {[t("feat2Skill1"), t("feat2Skill2"), t("feat2Skill3")].map((s) => (
                    <span key={s} className="text-[10px] px-2 py-0.5 rounded bg-[var(--mint)] text-[var(--mint-ink)] font-mono">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            }
          />

          <FeatureRow
            label={t("feat3Label")}
            title={[t("feat3HeadingLine1"), t("feat3HeadingLine2")]}
            body={t("feat3Body")}
            reverse={false}
            visual={
              <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-5 max-w-md shadow-sm space-y-3">
                <p className="font-semibold">{t("feat3CardTitle")}</p>
                <p className="text-xs text-[var(--muted)]">{t("feat3CardSub")}</p>
                <div className="flex flex-wrap gap-1">
                  {[t("feat3Chip1"), t("feat3Chip2"), t("feat3Chip3")].map((c) => (
                    <span key={c} className="text-xs px-2 py-1 rounded-full border border-[var(--line)]">
                      {c}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-[var(--muted)]">{t("feat3Encrypted")}</p>
              </div>
            }
          />

          <FeatureRow
            label={t("feat4Label")}
            title={[t("feat4HeadingLine1"), t("feat4HeadingLine2")]}
            body={t("feat4Body")}
            reverse
            visual={
              <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-5 max-w-md shadow-sm space-y-2">
                <Field
                  id="feat4-search"
                  label={t("feat4SearchPlaceholder")}
                  inputProps={{ readOnly: true, value: "", placeholder: t("feat4SearchPlaceholder"), tabIndex: -1 }}
                />
                <p className="text-sm font-semibold">{t("feat4Job1Title")}</p>
                <p className="text-xs text-[var(--muted)]">{t("feat4Job1Meta")}</p>
                <p className="text-xs text-[var(--mint-ink)] font-medium">{t("feat4Job1Match")}</p>
              </div>
            }
          />
        </div>
      </section>

      <section id="platforms" aria-labelledby="platforms-heading" className="bg-[var(--paper)] border-t border-[var(--line)] py-20 md:py-28">
        <div className="mezgeb-container space-y-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div>
              <p className="text-xs font-mono uppercase text-[var(--accent)] font-semibold mb-2">{t("platformsLabel")}</p>
              <h2 id="platforms-heading" className="text-3xl md:text-[2.75rem] font-semibold text-[var(--ink)] leading-tight">
                {t("platformsHeadingLine1")}
                <br />
                {t("platformsHeadingLine2")}
              </h2>
            </div>
            <p className="text-lg text-[var(--muted)] leading-relaxed max-w-xl">{t("platformsIntro")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PlatformTile title={t("platStep1Title")}>
              <CodeBlock
                filename="signup.html"
                code={embedCode}
                copyLabel={t("copyCodeBtn")}
                copiedLabel={t("copiedButton")}
                copiedAnnouncement={t("copiedAnnouncement")}
              />
            </PlatformTile>
            <PlatformTile title={t("platStep2Title")}>
              <div className="rounded-xl border border-[var(--line)] p-4 bg-[var(--stone)] text-left space-y-2">
                <p className="text-xs text-[var(--muted)]">{t("platStep2Org")}</p>
                <p className="text-xs font-mono text-[var(--accent)]">{t("platStep2Step")}</p>
                <p className="font-semibold text-[var(--ink)]">{t("platStep2Q")}</p>
                <VoiceButton
                  state="idle"
                  onStart={() => {}}
                  onStop={() => {}}
                  labels={{ speakLabel: t("platStep2OptSpeak") }}
                />
              </div>
            </PlatformTile>
            <PlatformTile title={t("platStep3Title")}>
              <CodeBlock
                filename="webhook.json"
                code={webhookCode}
                copyLabel={t("copyCodeBtn")}
                copiedLabel={t("copiedButton")}
                copiedAnnouncement={t("copiedAnnouncement")}
              />
              <p className="text-xs text-[var(--muted)] mt-2">{t("platStep3Note")}</p>
            </PlatformTile>
          </div>

          <div className="rounded-2xl border border-[var(--line)] p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-[var(--stone)]">
            {[
              { title: t("platLevel1Title"), desc: t("platLevel1Desc"), link: t("platLevel1Link"), to: "/docs/quick-start" },
              { title: t("platLevel2Title"), desc: t("platLevel2Desc"), link: t("platLevel2Link"), to: "/docs/api" },
              { title: t("platLevel3Title"), desc: t("platLevel3Desc"), link: t("platLevel3Link"), to: "/employers/accommodations" },
            ].map((lvl) => (
              <div key={lvl.title} className="space-y-2">
                <h3 className="font-semibold text-[var(--ink)]">{lvl.title}</h3>
                <p className="text-sm text-[var(--muted)]">{lvl.desc}</p>
                <Link to={lvl.to} className="text-sm font-medium text-[var(--accent)] underline underline-offset-4">
                  {lvl.link}
                </Link>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-sm text-[var(--muted)]">{t("platHostingLine")}</p>
            <Link
              to="/playground"
              className="inline-flex items-center justify-center min-h-[44px] px-5 rounded-lg bg-[var(--accent)] text-white font-medium text-sm hover:bg-[var(--accent-hover)]"
            >
              {t("platHostingBtn")}
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function FeatureRow({
  label,
  title,
  body,
  visual,
  reverse,
}: {
  label: string;
  title: [string, string];
  body: string;
  visual: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
      <div className={`lg:col-span-5 space-y-4 text-left ${reverse ? "lg:order-2" : ""}`}>
        <p className="text-xs font-mono uppercase text-[var(--accent)] font-semibold">{label}</p>
        <h3 className="text-2xl md:text-3xl font-semibold text-[var(--ink)]">
          {title[0]}
          <br />
          {title[1]}
        </h3>
        <p className="text-base text-[var(--muted)] leading-relaxed max-w-md">{body}</p>
      </div>
      <div className={`lg:col-span-7 ${reverse ? "lg:order-1" : ""}`}>
        <div className="h-[440px] rounded-2xl bg-[var(--stone)] flex items-center justify-center p-8 overflow-hidden">
          {visual}
        </div>
      </div>
    </div>
  );
}

function PlatformTile({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-[var(--ink)]">{title}</h3>
      {children}
    </div>
  );
}

function HeroWaveform() {
  return (
    <div
      aria-hidden="true"
      className="absolute left-0 right-0 top-16 sm:top-20 md:top-24 h-40 flex items-center justify-between pointer-events-none select-none px-2 z-0 overflow-hidden opacity-90"
    >
      <WaveWing wing={WAVE_LEFT} justify="start" />
      <WaveWing wing={WAVE_CENTER} justify="center" />
      <WaveWing wing={WAVE_RIGHT} justify="end" />
    </div>
  );
}

function WaveWing({ wing, justify }: { wing: number[]; justify: "start" | "center" | "end" }) {
  const justifyClass =
    justify === "start" ? "justify-start flex-1" : justify === "end" ? "justify-end flex-1" : "px-8";
  return (
    <div className={`flex items-center h-full space-x-[3px] ${justifyClass}`}>
      {wing.map((h, i) => (
        <span key={i} className="mz-waveform-bar" style={{ height: h }} />
      ))}
    </div>
  );
}
