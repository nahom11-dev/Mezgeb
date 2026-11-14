import React, { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { ScreenSummaryForAi } from "../ai";
import { Layout } from "../components/Layout";
import { DemoWidgetTriggerType, MezgebAnswers, MezgebWidget } from "../components/MezgebWidget";
import { useI18n } from "../i18n";
import { flushOutbox, getOutboxItems } from "../lib/outbox";
import { LEARNING_PLATFORM_TEMPLATE, TEMPLATES } from "../templates";
import { Badge, Button, CodeBlock } from "../ui";

export function DemoPage() {
  const { lang, setLang, t } = useI18n();
  const [searchParams] = useSearchParams();
  const resumeIdParam = searchParams.get("resume");

  const [selectedTemplateId, setSelectedTemplateId] = useState(LEARNING_PLATFORM_TEMPLATE.id);
  const [settingsOpenMobile, setSettingsOpenMobile] = useState(false);
  const [simulateOffline, setSimulateOffline] = useState(false);
  const [browserOffline, setBrowserOffline] = useState(() =>
    typeof navigator !== "undefined" ? !navigator.onLine : false
  );
  const [aiEnabled, setAiEnabled] = useState(true);
  const [highContrast, setHighContrast] = useState(false);

  const [liveAnswers, setLiveAnswers] = useState<MezgebAnswers>({});
  const [aiLogs, setAiLogs] = useState<ScreenSummaryForAi[]>([]);
  const [exchangeSteps, setExchangeSteps] = useState<string[]>([]);
  const [exchangedProfile, setExchangedProfile] = useState<Record<string, unknown> | null>(null);
  const [outboxCount, setOutboxCount] = useState(0);
  const [widgetKey, setWidgetKey] = useState(0);
  const [demoTrigger, setDemoTrigger] = useState<{
    type: DemoWidgetTriggerType;
    seq: number;
  } | null>(null);

  const activeTemplate =
    TEMPLATES.find((tpl) => tpl.id === selectedTemplateId) ?? LEARNING_PLATFORM_TEMPLATE;

  const refreshOutboxCount = useCallback(async () => {
    const items = await getOutboxItems();
    setOutboxCount(items.length);
  }, []);

  useEffect(() => {
    refreshOutboxCount();
  }, [refreshOutboxCount]);

  useEffect(() => {
    const onOnline = () => setBrowserOffline(false);
    const onOffline = () => setBrowserOffline(true);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  const isOffline = simulateOffline || browserOffline;

  useEffect(() => {
    if (isOffline) return;
    let active = true;
    (async () => {
      const sent = await flushOutbox();
      if (!active) return;
      if (sent.length > 0) {
        const latest = sent[sent.length - 1];
        setExchangeSteps((prev) => [
          ...prev,
          `Outbox flushed on reconnect: one-time token issued (${latest.token.slice(0, 14)}.)`,
        ]);
        setExchangedProfile(latest.profile);
      }
      await refreshOutboxCount();
    })();
    return () => {
      active = false;
    };
  }, [isOffline, refreshOutboxCount]);

  const handleComplete = (result: {
    token: string;
    profile: Record<string, unknown>;
    supportShared: boolean;
    queuedOffline?: boolean;
  }) => {
    setExchangeSteps([]);
    setExchangedProfile(null);

    if (result.queuedOffline) {
      setExchangeSteps([
        "1. Saved locally in IndexedDB outbox (queued while offline)",
        "2. Waiting for connection to exchange profile with platform",
      ]);
      refreshOutboxCount();
      return;
    }

  setExchangeSteps([
      `1. Page received a one-time token (${result.token.slice(0, 14)}.), not the profile`,
      `2. Learnhub's server calls POST /v1/registrations/exchange with its secret key`,
    ]);
    fetch("/api/demo/exchange", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: result.token }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          setExchangeSteps((prev) => [
            ...prev,
            `3. Mezgeb returned the confirmed profile (support_shared: ${String(data.profile?.support_shared ?? result.supportShared)})`,
            `4. Learnhub created the account. The token is now used up: a second exchange is refused.`,
          ]);
          setExchangedProfile(data.profile ?? null);
        } else {
          setExchangeSteps((prev) => [
            ...prev,
            `3. Exchange refused (HTTP ${res.status}): ${data.error ?? "unknown error"}`,
          ]);
        }
      })
      .catch(() => setExchangeSteps((prev) => [...prev, "3. Could not reach the Mezgeb server"]));
  };

  const handleReset = () => {
    setExchangeSteps([]);
    setExchangedProfile(null);
    setAiLogs([]);
    setDemoTrigger(null);
    setWidgetKey((k) => k + 1);
  };

  const triggerWidgetState = (type: DemoWidgetTriggerType) => {
    if (type === "outbox_sending") {
      setSimulateOffline(false);
    }
    setDemoTrigger((prev) => ({ type, seq: (prev?.seq ?? 0) + 1 }));
  };

  const stateTriggerList: { id: DemoWidgetTriggerType; label: string }[] = [
    { id: "field_error", label: t("demoTriggerError") },
    { id: "voice_listening", label: t("demoTriggerVoiceListen") },
    { id: "voice_review", label: t("demoTriggerVoiceReview") },
    { id: "voice_failed", label: t("demoTriggerVoiceFail") },
    { id: "outbox_sending", label: t("demoTriggerOutboxSending") },
    { id: "help_open", label: t("demoTriggerHelpOpen") },
    { id: "sms_sent", label: t("demoTriggerSmsSent") },
    { id: "restored", label: t("demoTriggerRestored") },
  ];

  return (
    <Layout>
      <section aria-labelledby="demo-heading" className="py-6 sm:py-10 bg-[var(--stone)] min-h-[80vh]">
        <div className="mezgeb-container space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1 text-left">
              <div className="flex flex-wrap items-center gap-2">
                <h1
                  id="demo-heading"
                  className="mezgeb-display-heading text-[1.75rem] font-semibold text-[var(--ink)]"
                >
                  {t("demoPageTitle")}
                </h1>
                <Badge variant="neutral">{t("templatesSampleBadge")}</Badge>
              </div>
              <p className="text-sm text-[var(--muted)] max-w-[68ch]">{t("demoPageSubtitle")}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSettingsOpenMobile((v) => !v)}
                aria-expanded={settingsOpenMobile}
                aria-controls="demo-controls-panel"
                className="lg:hidden min-h-[44px] px-4 rounded-[10px] border border-[var(--ink)] bg-[var(--paper)] text-[var(--ink)] text-sm font-medium inline-flex items-center gap-2 cursor-pointer"
              >
                <SlidersHorizontal size={16} strokeWidth={1.75} aria-hidden="true" />
                <span>{t("demoSettingsToggle")}</span>
              </button>
              <Link
                to="/partner"
                className="min-h-[44px] px-3.5 rounded-[10px] border border-[var(--line-strong)] bg-[var(--paper)] text-[var(--ink)] text-sm font-medium inline-flex items-center"
              >
                {t("demoOpenPartnerBtn")}
              </Link>
              <Link
                to="/profile"
                className="min-h-[44px] px-3.5 rounded-[10px] border border-[var(--line-strong)] bg-[var(--paper)] text-[var(--ink)] text-sm font-medium inline-flex items-center"
              >
                {t("demoViewProfileBtn")}
              </Link>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left column (320px desktop, collapsed into "Demo settings" on phone) */}
            <aside
              id="demo-controls-panel"
              aria-label={t("demoSettingsToggle")}
              className={`w-full lg:w-[320px] shrink-0 rounded-[10px] border border-[var(--line)] bg-[var(--paper)] p-5 space-y-5 text-left ${
                settingsOpenMobile ? "block" : "hidden lg:block"
              }`}
            >
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-[var(--line)]">
                <h2 className="text-base font-semibold text-[var(--ink)]">
                  {t("demoSettingsToggle")}
                </h2>
                <Button variant="quiet" onClick={handleReset}>
                  {t("demoDevResetBtn")}
                </Button>
              </div>

              {/* Template selector */}
              <div className="space-y-1.5">
                <label htmlFor="demo-template-select" className="block text-sm font-medium text-[var(--ink)]">
                  {t("playgroundTemplateLabel")}
                </label>
                <select
                  id="demo-template-select"
                  value={selectedTemplateId}
                  onChange={(e) => {
                    setSelectedTemplateId(e.target.value);
                    setWidgetKey((k) => k + 1);
                  }}
                  className="w-full min-h-[44px] px-3 rounded-[6px] border border-[var(--line-strong)] bg-[var(--paper)] text-sm text-[var(--ink)]"
                >
                  {TEMPLATES.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.name[lang]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Language selector */}
              <div className="space-y-1.5">
                <span className="block text-sm font-medium text-[var(--ink)]">
                  {t("demoDevLangLabel")}
                </span>
                <div className="grid grid-cols-2 gap-2" role="group" aria-label={t("demoDevLangLabel")}>
                  <button
                    type="button"
                    lang="am"
                    aria-pressed={lang === "am"}
                    onClick={() => setLang("am")}
                    className={`min-h-[44px] rounded-[10px] border text-sm font-medium cursor-pointer ${
                      lang === "am"
                        ? "border-2 border-[var(--accent)] bg-[var(--lilac)] text-[var(--ink)]"
                        : "border-[var(--line-strong)] bg-[var(--paper)] text-[var(--ink)]"
                    }`}
                  >
                    አማርኛ
                  </button>
                  <button
                    type="button"
                    lang="en"
                    aria-pressed={lang === "en"}
                    onClick={() => setLang("en")}
                    className={`min-h-[44px] rounded-[10px] border text-sm font-medium cursor-pointer ${
                      lang === "en"
                        ? "border-2 border-[var(--accent)] bg-[var(--lilac)] text-[var(--ink)]"
                        : "border-[var(--line-strong)] bg-[var(--paper)] text-[var(--ink)]"
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>

              {/* Simulate offline switch */}
              <div className="flex items-center justify-between gap-3 py-1">
                <span id="demo-offline-lbl" className="text-sm font-medium text-[var(--ink)]">
                  {t("demoDevOfflineLabel")}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={simulateOffline}
                  aria-labelledby="demo-offline-lbl"
                  onClick={() => setSimulateOffline((v) => !v)}
                  className={`min-h-[36px] min-w-[68px] px-3 rounded-[6px] border text-xs font-semibold cursor-pointer ${
                    simulateOffline
                      ? "bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]"
                      : "bg-[var(--paper)] text-[var(--ink)] border-[var(--line-strong)]"
                  }`}
                >
                  {simulateOffline ? "ON" : "OFF"}
                </button>
              </div>

              {/* High contrast switch */}
              <div className="flex items-center justify-between gap-3 py-1">
                <span id="demo-hc-lbl" className="text-sm font-medium text-[var(--ink)]">
                  {t("playgroundThemeHc")}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={highContrast}
                  aria-labelledby="demo-hc-lbl"
                  onClick={() => setHighContrast((v) => !v)}
                  className={`min-h-[36px] min-w-[68px] px-3 rounded-[6px] border text-xs font-semibold cursor-pointer ${
                    highContrast
                      ? "bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]"
                      : "bg-[var(--paper)] text-[var(--ink)] border-[var(--line-strong)]"
                  }`}
                >
                  {highContrast ? "ON" : "OFF"}
                </button>
              </div>

              {/* AI on/off switch */}
              <div className="flex items-center justify-between gap-3 py-1">
                <span id="demo-ai-lbl" className="text-sm font-medium text-[var(--ink)]">
                  {t("demoDevAiLabel")}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={aiEnabled}
                  aria-labelledby="demo-ai-lbl"
                  onClick={() => setAiEnabled((v) => !v)}
                  className={`min-h-[36px] min-w-[68px] px-3 rounded-[6px] border text-xs font-semibold cursor-pointer ${
                    aiEnabled
                      ? "bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]"
                      : "bg-[var(--paper)] text-[var(--ink)] border-[var(--line-strong)]"
                  }`}
                >
                  {aiEnabled ? t("demoDevAiOn") : t("demoDevAiOff")}
                </button>
              </div>

              {/* Outbox counter */}
              <div className="px-3 py-2.5 rounded-[6px] bg-[var(--stone)] border border-[var(--line)] flex items-center justify-between text-xs">
                <span className="font-medium text-[var(--ink)]">{t("demoOutboxLabel")}</span>
                <span className="text-[var(--muted)]">
                  {outboxCount > 0 ? t("demoOutboxCount", { count: outboxCount }) : t("demoOutboxEmpty")}
                </span>
              </div>

              {/* Preview all 8 Section 6.2 widget states */}
              <div className="space-y-2 pt-3 border-t border-[var(--line)]">
                <p className="text-xs font-semibold text-[var(--muted)]">
                  {t("demoStateTriggersLabel")}
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {stateTriggerList.map((btn) => (
                    <button
                      key={btn.id}
                      type="button"
                      onClick={() => triggerWidgetState(btn.id)}
                      className="min-h-[40px] px-2.5 py-1.5 rounded-[6px] border border-[var(--line-strong)] bg-[var(--paper)] hover:bg-[var(--stone)] text-xs font-medium text-[var(--ink)] text-left cursor-pointer"
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Collapsible Developer payloads */}
              <details className="pt-3 border-t border-[var(--line)] group">
                <summary className="list-none flex items-center justify-between gap-2 cursor-pointer text-sm font-semibold text-[var(--ink)] min-h-[44px]">
                  <span>{t("demoDevTitle")}</span>
                  <ChevronDown
                    size={18}
                    strokeWidth={1.75}
                    className="text-[var(--muted)] group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <div className="pt-3 space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-semibold text-[var(--ink)]">
                      {t("demoDevExchangeTitle")}
                    </h3>
                    {exchangeSteps.length === 0 ? (
                      <p className="text-xs text-[var(--muted)]">{t("demoDevExchangePending")}</p>
                    ) : (
                      <ol className="space-y-1 text-xs text-[var(--mint-ink)] bg-[var(--mint)] p-3 rounded-[6px]">
                        {exchangeSteps.map((st, idx) => (
                          <li key={idx}>{st}</li>
                        ))}
                      </ol>
                    )}
                    {exchangedProfile && (
                      <CodeBlock
                        filename="exchange-response.json"
                        code={JSON.stringify(exchangedProfile, null, 2)}
                        copyLabel={t("copyCodeBtn")}
                        copiedLabel={t("copiedButton")}
                        copiedAnnouncement={t("copiedAnnouncement")}
                      />
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-xs font-semibold text-[var(--ink)]">
                      {t("demoDevAiLogTitle")}
                    </h3>
                    {aiLogs.length === 0 ? (
                      <p className="text-xs text-[var(--muted)]">{t("demoDevAiLogEmpty")}</p>
                    ) : (
                      <CodeBlock
                        filename="ai-payload.json"
                        code={JSON.stringify(aiLogs[0], null, 2)}
                        copyLabel={t("copyCodeBtn")}
                        copiedLabel={t("copiedButton")}
                        copiedAnnouncement={t("copiedAnnouncement")}
                      />
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-xs font-semibold text-[var(--ink)]">
                      {t("demoDevAnswersTitle")}
                    </h3>
                    <p className="text-xs text-[var(--muted)]">{t("demoDevAnswersNotice")}</p>
                    <CodeBlock
                      filename="answers.json"
                      code={JSON.stringify(liveAnswers, null, 2)}
                      copyLabel={t("copyCodeBtn")}
                      copiedLabel={t("copiedButton")}
                      copiedAnnouncement={t("copiedAnnouncement")}
                    />
                  </div>
                </div>
              </details>
            </aside>

            {/* Centered 390px widget frame (full-screen without outer frame on narrow phones) */}
            <div className="flex-1 w-full flex justify-center">
              <div
                style={{ boxShadow: "var(--shadow-float)" }}
                className="w-full sm:max-w-[390px] sm:rounded-[16px] sm:border border-[var(--line)] bg-[var(--paper)] overflow-hidden"
              >
                <MezgebWidget
                  key={`${selectedTemplateId}-${widgetKey}`}
                  template={activeTemplate}
                  aiEnabled={aiEnabled}
                  offline={isOffline}
                  highContrast={highContrast}
                  showWelcomeFlow={true}
                  outboxCount={outboxCount}
                  demoTrigger={demoTrigger}
                  platformName={activeTemplate.theme?.platformName ?? "Learnhub"}
                  resumeIdParam={resumeIdParam}
                  onAnswersChange={setLiveAnswers}
                  onAiPayloadLogged={(payload) =>
                    setAiLogs((prev) => [payload, ...prev].slice(0, 5))
                  }
                  onComplete={handleComplete}
                  onOutboxUpdated={refreshOutboxCount}
                  onReset={handleReset}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
