import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AccessibleDialog } from "../components/AccessibleDialog";
import {
  ArrowRightIcon,
  CheckIcon,
  CopyIcon,
  LockIcon,
  MicIcon,
  PlayIcon,
  SearchIcon,
  ShieldIcon,
  VolumeIcon,
} from "../components/Icons";
import { Layout } from "../components/Layout";
import { useLiveAnnouncer } from "../components/LiveAnnouncer";
import { useI18n } from "../i18n";

const VIDEO_ID = "";

const WAVEFORM_BARS = [
  16, 28, 42, 58, 72, 84, 66, 48, 34, 24, 18, 12, 10, 14, 22, 34, 48, 64, 78, 88, 70, 52, 36, 22, 14,
  10, 12, 18, 28, 44, 62, 80, 68, 50, 32, 20,
];

const MINI_WAVEFORM_BARS = [8, 14, 20, 12, 24, 18, 10, 22, 26, 16, 12, 24, 18, 14, 20, 10, 16, 22, 12, 8];

export function LandingPage() {
  const { t } = useI18n();
  const { announce } = useLiveAnnouncer();
  const videoSectionRef = useRef<HTMLDivElement>(null);

  const [videoPlaying, setVideoPlaying] = useState(false);
  const [ccEnabled, setCcEnabled] = useState(true);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  // Interactive preview toggles in Feature 3 tile so every toggle is wired
  const [sharePlatform, setSharePlatform] = useState(true);
  const [shareEmployers, setShareEmployers] = useState(false);
  const [sharePartner, setSharePartner] = useState(false);

  const snippetCode = `<script type="module" src="https://cdn.mezgeb.example/v1/mezgeb.js"></script>\n<mezgeb-register site-key="pk_learnhub" lang="am"></mezgeb-register>`;

  const handleCopySnippet = async () => {
    try {
      await navigator.clipboard.writeText(snippetCode);
    } catch {
      // Clipboard fallback ignored cleanly
    }
    setCodeCopied(true);
    announce(t("copiedButton"));
    window.setTimeout(() => setCodeCopied(false), 2000);
  };

  return (
    <Layout showFaqInFooter>
      {/* 4.1 HERO */}
      <section
        aria-labelledby="hero-heading"
        style={{
          background: "linear-gradient(180deg, #E4F2EC 0%, #EEEBF8 100%)",
        }}
        className="pt-12 md:pt-20 pb-16 md:pb-24"
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10">
          <div className="max-w-[640px] space-y-6">
            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl md:text-[56px] font-bold tracking-[-0.03em] leading-[1.08] text-[#111111]"
            >
              {t("heroTitleLine1")}
              <br />
              {t("heroTitleLine2")}
            </h1>
            <p className="text-[18px] leading-[1.6] text-[#111111]/80 max-w-[560px]">
              {t("heroSubtitle")}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link to="/demo" className="mezgeb-btn-primary">
                {t("heroCtaDemo")}
              </Link>
              <button
                type="button"
                onClick={() => videoSectionRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="mezgeb-btn-secondary"
              >
                {t("heroCtaWatch")}
              </button>
            </div>
          </div>

          {/* Wide inset panel with faint lavender waveform and two overlapping app windows */}
          <div
            ref={videoSectionRef}
            className="mt-12 md:mt-14 relative rounded-[16px] bg-white/75 border border-[#DCE3E0] p-4 sm:p-6 md:p-10 overflow-hidden"
          >
            {/* Background waveform lines: tallest at left & right edges, fading toward center */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-between px-4 opacity-50"
            >
              {WAVEFORM_BARS.map((h, i) => {
                const distFromCenter = Math.abs(i - WAVEFORM_BARS.length / 2) / (WAVEFORM_BARS.length / 2);
                const opacity = 0.25 + distFromCenter * 0.75;
                return (
                  <span
                    key={i}
                    className="w-[2px] rounded-full bg-[#C9B8F2]"
                    style={{ height: `${h * 2.2}px`, opacity }}
                  />
                );
              })}
            </div>

            <div className="relative z-10 flex flex-col lg:block min-h-0 lg:min-h-[470px]">
              {/* Back-right larger window (~70% width on desktop) */}
              <div className="lg:ml-auto lg:w-[70%] mezgeb-card overflow-hidden">
                <div className="px-4 py-2.5 border-b border-[#E7E7E4] bg-[#F5F5F3] flex items-center justify-between text-xs font-medium text-[#6B6B6B]">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex gap-1.5" aria-hidden="true">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#D8D8D4]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#D8D8D4]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#D8D8D4]" />
                    </span>
                    <span>{t("heroVideoWindowTitle")}</span>
                  </div>
                  <span className="text-[#6B6B6B]">{t("heroVideoPosterBadge")}</span>
                </div>

                {/* 16:9 Video embed or coming-soon poster */}
                <div className="aspect-video bg-[#FAF9F6] relative">
                  {VIDEO_ID && videoPlaying ? (
                    <iframe
                      className="w-full h-full border-0"
                      src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&cc_load_policy=${
                        ccEnabled ? 1 : 0
                      }&rel=0`}
                      title={t("heroVideoTitle")}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="w-full h-full p-5 sm:p-8 flex flex-col justify-between relative bg-gradient-to-br from-white to-[#F5F5F3]">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-[#6B6B6B]">learnhub.et · Step 3 of 6</span>
                        <span className="px-2.5 py-1 rounded-md bg-[#EEEBF8] text-[#6A4FC4] text-xs font-medium">
                          {t("heroVideoEthSwitch")}
                        </span>
                      </div>

                      <div className="my-auto max-w-md mx-auto w-full bg-white rounded-xl border border-[#E7E7E4] p-4 sm:p-5 shadow-xs space-y-3">
                        <p className="text-lg sm:text-xl font-semibold text-[#111111]">
                          {t("heroVideoQuestionAm")}
                        </p>
                        <p className="text-xs text-[#6B6B6B]">{t("heroVideoQuestionEn")}</p>

                        <div className="flex items-center gap-3 pt-1">
                          <div className="flex-1">
                            <div className="min-h-[40px] px-3 rounded-lg border-2 border-red-500 bg-red-50/40 flex items-center text-sm text-[#6B6B6B]">
                              {t("heroVideoYearPlaceholder")}
                            </div>
                            <p className="text-xs text-red-700 mt-1">{t("heroVideoYearError")}</p>
                          </div>
                          <div
                            aria-hidden="true"
                            className="w-11 h-11 rounded-full bg-[#111111] text-white flex items-center justify-center shrink-0"
                          >
                            <MicIcon size={18} />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-center">
                        {VIDEO_ID ? (
                          <button
                            type="button"
                            onClick={() => setVideoPlaying(true)}
                            aria-label={t("heroVideoPlayLabel")}
                            className="w-16 h-16 rounded-full bg-white border border-[#E7E7E4] text-[#111111] shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
                          >
                            <PlayIcon size={24} className="ml-0.5" />
                          </button>
                        ) : (
                          <p className="px-4 py-2 rounded-lg bg-white border border-[#E7E7E4] text-sm font-medium text-[#111111]">
                            {t("heroVideoComingSoon")}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Below video: CC and Transcript controls */}
                <div className="px-4 py-2.5 border-t border-[#E7E7E4] bg-white flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCcEnabled((v) => !v)}
                      aria-pressed={ccEnabled}
                      className={`px-2.5 min-h-[30px] rounded-md border font-mono font-semibold ${
                        ccEnabled
                          ? "bg-[#111111] text-white border-[#111111]"
                          : "bg-white text-[#111111] border-[#E7E7E4]"
                      }`}
                    >
                      {t("heroVideoCC")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTranscriptOpen(true)}
                      className="px-3 min-h-[30px] rounded-md border border-[#E7E7E4] bg-white text-[#111111] font-medium hover:bg-[#F5F5F3]"
                    >
                      {t("heroVideoTranscript")}
                    </button>
                  </div>
                  <span className="text-[#6B6B6B]">{t("demoSampleBadge")}</span>
                </div>
              </div>

              {/* Front-left smaller window (~45% width on desktop, overlapping bottom-left) */}
              <div className="mt-6 lg:mt-0 lg:w-[45%] lg:absolute lg:left-0 lg:bottom-0 mezgeb-card p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-[#E7E7E4] pb-2.5 text-xs font-medium text-[#6B6B6B]">
                  <span>{t("heroFrontWindowTitle")}</span>
                  <span>4 / 6</span>
                </div>

                {/* Compact step list */}
                <ol className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#6B6B6B]">
                  <li className="text-[#1F5C46] font-medium">✓ {t("heroStep1")}</li>
                  <li className="text-[#1F5C46] font-medium">✓ {t("heroStep2")}</li>
                  <li className="text-[#1F5C46] font-medium">✓ {t("heroStep3")}</li>
                  <li className="text-[#111111] font-semibold underline decoration-[#8F6FE0] decoration-2 underline-offset-4">
                    {t("heroStep4")}
                  </li>
                  <li>{t("heroStep5")}</li>
                  <li>{t("heroStep6")}</li>
                </ol>

                <div className="space-y-2.5">
                  <p className="text-base font-semibold text-[#111111]">{t("heroCurrentQuestion")}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                    <div className="px-3 py-2.5 rounded-lg border border-[#E7E7E4] text-[#6B6B6B]">
                      {t("heroOptFayda")}
                    </div>
                    <div className="px-3 py-2.5 rounded-lg border border-[#E7E7E4] text-[#6B6B6B]">
                      {t("heroOptRefugee")}
                    </div>
                    <div className="px-3 py-2.5 rounded-lg border border-[#E7E7E4] text-[#6B6B6B]">
                      {t("heroOptOther")}
                    </div>
                    <div className="px-3 py-2.5 rounded-lg border-2 border-[#8F6FE0] bg-[#EEEBF8] text-[#111111] font-semibold">
                      {t("heroOptPartner")}
                    </div>
                  </div>
                </div>

                <div className="px-3 py-2 rounded-lg bg-[#E4F2EC] text-[#1F5C46] text-xs font-medium">
                  {t("heroPartnerNotice")}
                </div>

                <Link to="/demo" className="w-full mezgeb-btn-primary text-sm">
                  {t("heroContinue")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4.2 WHY SECTION (#F9F3EA) */}
      <section aria-labelledby="why-heading" className="bg-[#F9F3EA] py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10">
          <div className="max-w-[760px] space-y-7">
            <h2 id="why-heading" className="text-sm font-semibold text-[#6A4FC4]">
              {t("whyLabel")}
            </h2>

            <div className="space-y-6 text-2xl sm:text-3xl md:text-[36px] font-semibold leading-[1.3] tracking-[-0.02em]">
              <p className="text-[#111111]">{t("whyP1")}</p>

              <p className="text-[#6B6560]">
                {t("whyP2Lead")}
                <span className="text-[#111111]">{t("whyP2Bold1")}</span>
                {t("whyP2Mid")}
                <span className="text-[#111111]">{t("whyP2Bold2")}</span>
              </p>

              <p className="text-[#6B6560]">
                {t("whyP3Lead")}
                <span className="text-[#111111]">{t("whyP3Bold")}</span>
                {t("whyP3Tail")}
              </p>

              <p className="text-[#111111]">{t("whyP4")}</p>
            </div>

            <p className="text-[13px] text-[#6B6560] pt-2">{t("whySources")}</p>
          </div>
        </div>
      </section>

      {/* 4.3 FEATURES CHECKERBOARD */}
      <section aria-labelledby="features-heading" className="bg-white py-20 md:py-24">
        <div className="max-w-[920px] mx-auto px-4 sm:px-6">
          <h2 id="features-heading" className="sr-only">
            {t("featuresSectionTitle")}
          </h2>

          <div className="space-y-12 md:space-y-0">
            {/* Row 1: Tile Left, Text Right */}
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="bg-[#F5F5F3] rounded-[24px] p-6 sm:p-8 flex flex-col justify-center gap-3 md:min-h-[440px]">
                {/* SMS notification card */}
                <div className="mezgeb-card p-3.5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#111111] text-white font-bold text-sm flex items-center justify-center shrink-0">
                    L
                  </div>
                  <div className="text-xs leading-relaxed">
                    <p className="font-semibold text-[#111111]">{t("feat1SmsSender")}</p>
                    <p className="text-[#6B6B6B]">
                      {t("feat1SmsText")}{" "}
                      <span className="text-[#6A4FC4] underline font-medium">{t("feat1SmsLink")}</span>
                    </p>
                  </div>
                </div>

                {/* Resume card */}
                <div className="mezgeb-card p-4 space-y-3.5">
                  <div>
                    <p className="text-base font-semibold text-[#111111]">{t("feat1ResumeTitle")}</p>
                    <p className="text-xs text-[#6B6B6B]">{t("feat1ResumeSub")}</p>
                  </div>

                  <div className="w-full h-1 bg-[#E7E7E4] rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-[#8F6FE0]" />
                  </div>

                  <ul className="space-y-2 text-xs">
                    {[
                      [t("feat1Row1Label"), t("feat1Row1Val")],
                      [t("feat1Row2Label"), t("feat1Row2Val")],
                      [t("feat1Row3Label"), t("feat1Row3Val")],
                    ].map(([label, val], i) => (
                      <li key={i} className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-2 text-[#6B6B6B]">
                          <span className="w-4 h-4 rounded-full bg-[#E4F2EC] text-[#1F5C46] inline-flex items-center justify-center shrink-0">
                            <CheckIcon size={11} />
                          </span>
                          <span>{label}</span>
                        </span>
                        <span className="font-medium text-[#111111]">{val}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-1.5 pt-1">
                    <Link to="/demo" className="w-full mezgeb-btn-primary text-xs min-h-[38px]">
                      {t("feat1ResumeBtn")}
                    </Link>
                    <p className="text-center text-[11px] text-[#6B6B6B]">{t("feat1NoLimit")}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center p-4 sm:p-8 md:p-12 space-y-3">
                <p className="text-xs font-semibold text-[#6A4FC4]">{t("feat1Label")}</p>
                <h3 className="text-[26px] font-semibold tracking-tight leading-snug text-[#111111]">
                  {t("feat1HeadingLine1")}
                  <br />
                  {t("feat1HeadingLine2")}
                </h3>
                <p className="text-[15px] text-[#6B6B6B] leading-relaxed">{t("feat1Body")}</p>
              </div>
            </div>

            {/* Row 2: Text Left, Tile Right */}
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="order-2 md:order-1 flex flex-col justify-center p-4 sm:p-8 md:p-12 space-y-3">
                <p className="text-xs font-semibold text-[#6A4FC4]">{t("feat2Label")}</p>
                <h3 className="text-[26px] font-semibold tracking-tight leading-snug text-[#111111]">
                  {t("feat2HeadingLine1")}
                  <br />
                  {t("feat2HeadingLine2")}
                </h3>
                <p className="text-[15px] text-[#6B6B6B] leading-relaxed">{t("feat2Body")}</p>
              </div>

              <div className="order-1 md:order-2 bg-[#F5F5F3] rounded-[24px] p-6 sm:p-8 flex flex-col justify-center md:min-h-[440px]">
                <div className="mezgeb-card p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-[#111111]">{t("feat2CardTitle")}</p>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#F5F5F3] text-[#6B6B6B]">
                      {t("feat2CardTag")}
                    </span>
                  </div>

                  <p className="p-3 rounded-lg bg-[#F5F5F3] text-xs leading-relaxed text-[#111111]">
                    {t("feat2TranscriptPart1")}
                    <span className="bg-[#EEEBF8] border-b-2 border-[#8F6FE0] px-0.5">
                      {t("feat2TranscriptHl1")}
                    </span>
                    {t("feat2TranscriptPart2")}
                    <span className="bg-[#EEEBF8] border-b-2 border-[#8F6FE0] px-0.5">
                      {t("feat2TranscriptHl2")}
                    </span>
                    {t("feat2TranscriptPart3")}
                    <span className="bg-[#EEEBF8] border-b-2 border-[#8F6FE0] px-0.5">
                      {t("feat2TranscriptHl3")}
                    </span>
                    {t("feat2TranscriptPart4")}
                    <span className="bg-[#EEEBF8] border-b-2 border-[#8F6FE0] px-0.5">
                      {t("feat2TranscriptHl4")}
                    </span>
                    {t("feat2TranscriptPart5")}
                  </p>

                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold text-[#6B6B6B]">{t("feat2SkillsLabel")}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        [1, t("feat2Skill1")],
                        [2, t("feat2Skill2")],
                        [3, t("feat2Skill3")],
                        [4, t("feat2Skill4")],
                      ].map(([num, label]) => (
                        <span
                          key={String(num)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EEEBF8] text-[#111111] text-xs font-medium"
                        >
                          <span className="w-4 h-4 rounded-full bg-[#8F6FE0] text-white text-[10px] font-bold inline-flex items-center justify-center">
                            {num}
                          </span>
                          <span>{label}</span>
                        </span>
                      ))}
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full border border-dashed border-[#C8C8C4] text-[#6B6B6B] text-xs">
                        {t("feat2AddSkill")}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E7E7E4] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-full bg-[#111111] text-white inline-flex items-center justify-center shrink-0">
                        <MicIcon size={14} />
                      </span>
                      <div className="flex items-center gap-[2px]" aria-hidden="true">
                        {MINI_WAVEFORM_BARS.map((h, idx) => (
                          <span
                            key={idx}
                            className="w-[2px] rounded-full bg-[#8F6FE0]"
                            style={{ height: `${h}px` }}
                          />
                        ))}
                      </div>
                      <span className="font-mono text-[11px] text-[#6B6B6B]">0:14</span>
                    </div>
                    <Link to="/demo" className="mezgeb-btn-secondary px-3 min-h-[34px] text-xs">
                      {t("feat2KeepBtn")}
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3: Tile Left, Text Right */}
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="bg-[#F5F5F3] rounded-[24px] p-6 sm:p-8 flex flex-col justify-center md:min-h-[440px]">
                <div className="mezgeb-card p-4 sm:p-5 space-y-4">
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 text-[#6A4FC4]">
                      <LockIcon size={16} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#111111]">{t("feat3CardTitle")}</p>
                      <p className="text-xs text-[#6B6B6B]">{t("feat3CardSub")}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-lg bg-[#EEEBF8] border border-[#8F6FE0] text-xs font-medium text-[#111111]">
                      {t("feat3Chip1")}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-[#EEEBF8] border border-[#8F6FE0] text-xs font-medium text-[#111111]">
                      {t("feat3Chip2")}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-[#E7E7E4] text-xs text-[#6B6B6B]">
                      {t("feat3Chip3")}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-[#E7E7E4] text-xs text-[#6B6B6B]">
                      {t("feat3Chip4")}
                    </span>
                  </div>

                  <div className="space-y-2.5 pt-1">
                    <p className="text-[11px] font-semibold text-[#6B6B6B]">{t("feat3WhoLabel")}</p>

                    {[
                      {
                        name: t("feat3Who1Name"),
                        desc: t("feat3Who1Desc"),
                        checked: sharePlatform,
                        toggle: () => setSharePlatform((v) => !v),
                      },
                      {
                        name: t("feat3Who2Name"),
                        desc: t("feat3Who2Desc"),
                        checked: shareEmployers,
                        toggle: () => setShareEmployers((v) => !v),
                      },
                      {
                        name: t("feat3Who3Name"),
                        desc: t("feat3Who3Desc"),
                        checked: sharePartner,
                        toggle: () => setSharePartner((v) => !v),
                      },
                    ].map((row, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-2 text-xs">
                        <div>
                          <p className="font-medium text-[#111111]">{row.name}</p>
                          <p className="text-[11px] text-[#6B6B6B]">{row.desc}</p>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={row.checked}
                          aria-label={row.name}
                          onClick={row.toggle}
                          className={`w-10 h-6 rounded-full p-0.5 transition-colors shrink-0 ${
                            row.checked ? "bg-[#6A4FC4]" : "bg-[#D8D8D4]"
                          }`}
                        >
                          <span
                            className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                              row.checked ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#E7E7E4] flex items-center gap-1.5 text-[11px] text-[#6B6B6B]">
                    <ShieldIcon size={13} />
                    <span>{t("feat3Encrypted")}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center p-4 sm:p-8 md:p-12 space-y-3">
                <p className="text-xs font-semibold text-[#6A4FC4]">{t("feat3Label")}</p>
                <h3 className="text-[26px] font-semibold tracking-tight leading-snug text-[#111111]">
                  {t("feat3HeadingLine1")}
                  <br />
                  {t("feat3HeadingLine2")}
                </h3>
                <p className="text-[15px] text-[#6B6B6B] leading-relaxed">{t("feat3Body")}</p>
              </div>
            </div>

            {/* Row 4: Text Left, Tile Right */}
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="order-2 md:order-1 flex flex-col justify-center p-4 sm:p-8 md:p-12 space-y-3">
                <p className="text-xs font-semibold text-[#6A4FC4]">{t("feat4Label")}</p>
                <h3 className="text-[26px] font-semibold tracking-tight leading-snug text-[#111111]">
                  {t("feat4HeadingLine1")}
                  <br />
                  {t("feat4HeadingLine2")}
                </h3>
                <p className="text-[15px] text-[#6B6B6B] leading-relaxed">{t("feat4Body")}</p>
              </div>

              <div className="order-1 md:order-2 bg-[#F5F5F3] rounded-[24px] p-6 sm:p-8 flex flex-col justify-center md:min-h-[440px]">
                <div className="mezgeb-card p-4 space-y-3">
                  <div className="flex items-center gap-2 px-3 min-h-[36px] rounded-lg border border-[#E7E7E4] bg-[#FAF9F6] text-xs text-[#6B6B6B]">
                    <SearchIcon size={14} />
                    <span>{t("feat4SearchPlaceholder")}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="px-2 py-1 rounded-md bg-[#E4F2EC] text-[#1F5C46] font-medium">
                      {t("feat4Filter1")} ✓
                    </span>
                    <span className="px-2 py-1 rounded-md bg-[#E4F2EC] text-[#1F5C46] font-medium">
                      {t("feat4Filter2")} ✓
                    </span>
                    <span className="inline-flex items-center gap-1 text-[#6B6B6B] ml-auto">
                      <LockIcon size={12} />
                      <span>{t("feat4FilterPrivate")}</span>
                    </span>
                  </div>

                  {/* Result 1 expanded */}
                  <div className="p-3 rounded-xl border border-[#E7E7E4] space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-lg bg-[#F5F5F3] text-[#111111] font-semibold text-xs flex items-center justify-center shrink-0">
                          L
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-[#111111]">{t("feat4Job1Title")}</p>
                          <p className="text-[11px] text-[#6B6B6B]">{t("feat4Job1Meta")}</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-[#E4F2EC] text-[#1F5C46] text-[10px] font-semibold shrink-0">
                        {t("feat4Job1Match")}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-[#E4F2EC] text-[#1F5C46] font-medium">
                        {t("feat4Job1Tag1")} ✓
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#E4F2EC] text-[#1F5C46] font-medium">
                        {t("feat4Job1Tag2")} ✓
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#F5F5F3] text-[#6B6B6B]">
                        {t("feat4Job1Tag3")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-0.5">
                      <Link
                        to="/demo"
                        className="flex-1 mezgeb-btn-primary min-h-[34px] text-xs px-3"
                      >
                        <MicIcon size={13} />
                        <span>{t("feat4Job1Apply")}</span>
                      </Link>
                      <Link
                        to="/templates"
                        className="mezgeb-btn-secondary min-h-[34px] text-xs px-3"
                      >
                        {t("feat4Job1Save")}
                      </Link>
                    </div>
                  </div>

                  {/* Result 2 collapsed */}
                  <div className="p-3 rounded-xl border border-[#E7E7E4] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-lg bg-[#F5F5F3] text-[#111111] font-semibold text-xs flex items-center justify-center shrink-0">
                        T
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-[#111111]">{t("feat4Job2Title")}</p>
                        <p className="text-[11px] text-[#6B6B6B]">{t("feat4Job2Meta")}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#F5F5F3] text-[#6B6B6B] text-[10px] font-medium shrink-0">
                      {t("feat4Job2Match")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4.4 FOR PLATFORMS */}
      <section aria-labelledby="platforms-heading" className="bg-white py-16 md:py-24 border-t border-[#E7E7E4]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7 space-y-3">
              <p className="text-sm font-semibold text-[#6A4FC4]">{t("platformsLabel")}</p>
              <h2
                id="platforms-heading"
                className="text-3xl sm:text-4xl md:text-[44px] font-bold tracking-[-0.025em] leading-[1.12] text-[#111111]"
              >
                {t("platformsHeadingLine1")}
                <br />
                {t("platformsHeadingLine2")}
              </h2>
            </div>
            <p className="lg:col-span-5 text-base text-[#6B6B6B] leading-relaxed">
              {t("platformsIntro")}
            </p>
          </div>

          {/* 3 step tiles */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Step 1: Add one tag */}
            <div className="bg-[#F5F5F3] rounded-[20px] p-6 flex flex-col justify-between gap-5">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#111111] text-white text-xs font-bold inline-flex items-center justify-center shrink-0">
                  1
                </span>
                <h3 className="text-base font-semibold text-[#111111]">{t("platStep1Title")}</h3>
              </div>

              <div className="rounded-xl bg-[#161616] text-white overflow-hidden">
                <div className="px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-xs text-[#9B9B9B]">
                  <span className="font-mono">signup.html</span>
                  <button
                    type="button"
                    onClick={handleCopySnippet}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 text-white hover:bg-white/20 text-xs font-medium"
                  >
                    <CopyIcon size={12} />
                    <span>{codeCopied ? t("copiedButton") : t("copyButton")}</span>
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono leading-relaxed overflow-x-auto text-[#E4F2EC]">
                  <code>{snippetCode}</code>
                </pre>
              </div>
            </div>

            {/* Step 2: Learners sign up their way */}
            <div className="bg-[#F5F5F3] rounded-[20px] p-6 flex flex-col justify-between gap-5">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#111111] text-white text-xs font-bold inline-flex items-center justify-center shrink-0">
                  2
                </span>
                <h3 className="text-base font-semibold text-[#111111]">{t("platStep2Title")}</h3>
              </div>

              <div className="mezgeb-card p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between text-[#6B6B6B]">
                  <span>{t("platStep2Org")}</span>
                  <span>{t("platStep2Step")}</span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-[#111111]">{t("platStep2Q")}</p>
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#6A4FC4] font-medium shrink-0">
                    <VolumeIcon size={13} />
                    <span>{t("platStep2ReadAloud")}</span>
                  </span>
                </div>

                <div className="px-3 py-2 rounded-lg border border-[#E7E7E4] font-mono text-sm text-[#111111]">
                  09•• ••• 214
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  <span className="text-center py-1.5 rounded-md bg-[#EEEBF8] border border-[#8F6FE0] font-semibold text-[#111111]">
                    {t("platStep2OptType")}
                  </span>
                  <span className="text-center py-1.5 rounded-md border border-[#E7E7E4] text-[#6B6B6B]">
                    {t("platStep2OptSpeak")}
                  </span>
                  <span className="text-center py-1.5 rounded-md border border-[#E7E7E4] text-[#6B6B6B]">
                    {t("platStep2OptHelp")}
                  </span>
                </div>

                <Link to="/demo" className="w-full mezgeb-btn-primary min-h-[36px] text-xs">
                  {t("heroContinue")}
                </Link>
              </div>
            </div>

            {/* Step 3: Get a confirmed profile */}
            <div className="bg-[#F5F5F3] rounded-[20px] p-6 flex flex-col justify-between gap-5">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#111111] text-white text-xs font-bold inline-flex items-center justify-center shrink-0">
                  3
                </span>
                <h3 className="text-base font-semibold text-[#111111]">{t("platStep3Title")}</h3>
              </div>

              <div className="space-y-2.5">
                <p className="text-xs font-mono text-[#6B6B6B]">{t("platStep3Event")}</p>
                <div className="mezgeb-card p-4 space-y-2.5">
                  <div className="flex items-center justify-between gap-2 text-xs font-mono">
                    <span className="text-[#111111] truncate">POST /v1/registrations/exchange</span>
                    <span className="px-2 py-0.5 rounded bg-[#E4F2EC] text-[#1F5C46] font-bold">
                      200
                    </span>
                  </div>
                  <pre className="text-[11px] font-mono leading-relaxed text-[#111111] bg-[#F5F5F3] p-3 rounded-lg overflow-x-auto">
                    <code>{`{
  "name": "Hana",
  "area": "Lideta, Addis Ababa",
  "id_route": "partner_verified",
  "skills": ["Sales", "Bookkeeping"],
  "support_shared": false
}`}</code>
                  </pre>
                  <p className="text-[11px] text-[#6B6B6B]">{t("platStep3Note")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Integration levels card */}
          <div className="mezgeb-card p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-[#111111]">{t("platLevel1Title")}</h3>
              <p className="text-sm text-[#6B6B6B]">{t("platLevel1Desc")}</p>
              <Link
                to="/docs/quick-start"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#6A4FC4] hover:underline pt-1"
              >
                <span>{t("platLevel1Link")}</span>
                <ArrowRightIcon size={14} />
              </Link>
            </div>
            <div className="space-y-2 md:border-l md:border-[#E7E7E4] md:pl-8">
              <h3 className="text-base font-semibold text-[#111111]">{t("platLevel2Title")}</h3>
              <p className="text-sm text-[#6B6B6B]">{t("platLevel2Desc")}</p>
              <Link
                to="/docs/api"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#6A4FC4] hover:underline pt-1"
              >
                <span>{t("platLevel2Link")}</span>
                <ArrowRightIcon size={14} />
              </Link>
            </div>
            <div className="space-y-2 md:border-l md:border-[#E7E7E4] md:pl-8">
              <h3 className="text-base font-semibold text-[#111111]">{t("platLevel3Title")}</h3>
              <p className="text-sm text-[#6B6B6B]">{t("platLevel3Desc")}</p>
              <Link
                to="/docs/jobposting"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#6A4FC4] hover:underline pt-1"
              >
                <span>{t("platLevel3Link")}</span>
                <ArrowRightIcon size={14} />
              </Link>
            </div>
          </div>

          {/* Hosting line + playground CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <p className="text-sm text-[#6B6B6B]">{t("platHostingLine")}</p>
            <Link to="/playground" className="mezgeb-btn-primary shrink-0">
              {t("platHostingBtn")}
            </Link>
          </div>
        </div>
      </section>

      <AccessibleDialog
        open={transcriptOpen}
        onClose={() => setTranscriptOpen(false)}
        title={t("heroVideoTranscriptTitle")}
      >
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-[#111111]">
          {t("heroVideoTranscriptBody")}
        </pre>
      </AccessibleDialog>
    </Layout>
  );
}
