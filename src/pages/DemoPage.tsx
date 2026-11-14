import React, { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ScreenSummaryForAi } from "../ai";
import { Layout } from "../components/Layout";
import { MezgebAnswers, MezgebWidget } from "../components/MezgebWidget";
import { useI18n } from "../i18n";
import { flushOutbox, getOutboxItems } from "../lib/outbox";
import { LEARNING_PLATFORM_TEMPLATE } from "../templates";

export function DemoPage() {
  const { lang, setLang, t } = useI18n();
  const [searchParams] = useSearchParams();
  const resumeIdParam = searchParams.get("resume");

  const [devOpen, setDevOpen] = useState(true);
  const [simulateOffline, setSimulateOffline] = useState(false);
  const [browserOffline, setBrowserOffline] = useState(() =>
    typeof navigator !== "undefined" ? !navigator.onLine : false
  );
  const [aiEnabled, setAiEnabled] = useState(true);
  const [liveAnswers, setLiveAnswers] = useState<MezgebAnswers>({});
  const [aiLogs, setAiLogs] = useState<ScreenSummaryForAi[]>([]);
  const [exchangeSteps, setExchangeSteps] = useState<string[]>([]);
  const [exchangedProfile, setExchangedProfile] = useState<Record<string, unknown> | null>(null);
  const [outboxCount, setOutboxCount] = useState(0);
  const [widgetKey, setWidgetKey] = useState(0);

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

  // Flush IndexedDB outbox automatically whenever connection returns
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
          `Outbox flushed on reconnect: one-time token issued (${latest.token.slice(0, 14)}…)`,
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
        `1. Saved locally in IndexedDB outbox (queued while offline)`,
        `2. Waiting for connection to exchange profile with Learnhub`,
      ]);
      refreshOutboxCount();
      return;
    }

    // Real exchange: the page only has the one-time token; the server swaps it for the profile.
    setExchangeSteps([
      `1. Page received a one-time token (${result.token.slice(0, 14)}…), not the profile`,
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
          setExchangeSteps((prev) => [...prev, `3. Exchange refused (HTTP ${res.status}): ${data.error ?? "unknown error"}`]);
        }
      })
      .catch(() => setExchangeSteps((prev) => [...prev, "3. Could not reach the Mezgeb server"]));
  };

  const handleReset = () => {
    setExchangeSteps([]);
    setExchangedProfile(null);
    setAiLogs([]);
  };

  return (
    <Layout>
      <section aria-labelledby="demo-heading" className="py-10 md:py-14 bg-[#FAF9F6] min-h-[75vh]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#6B6B6B]">
                <span>{t("demoSampleBadge")}</span>
                <span aria-hidden="true">·</span>
                <span>{t("cloudAiNotice")}</span>
              </div>
              <h1 id="demo-heading" className="text-3xl md:text-4xl font-bold tracking-tight text-[#111111]">
                {t("demoPageTitle")}
              </h1>
              <p className="text-base text-[#6B6B6B]">{t("demoPageSubtitle")}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Link
                to="/partner"
                target="_blank"
                rel="noreferrer"
                className="mezgeb-btn-secondary text-sm"
              >
                {t("demoOpenPartnerBtn")}
              </Link>
              <Link to="/profile" className="mezgeb-btn-secondary text-sm">
                {t("demoViewProfileBtn")}
              </Link>
              <button
                type="button"
                onClick={() => setDevOpen((v) => !v)}
                aria-expanded={devOpen}
                className="mezgeb-btn-secondary shrink-0"
              >
                {devOpen ? t("demoDevToggleHide") : t("demoDevToggleShow")}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Browser-style frame containing MezgebWidget */}
            <div className={devOpen ? "lg:col-span-7" : "lg:col-span-10 lg:col-start-2"}>
              <div className="rounded-[18px] border border-[#E7E7E4] bg-white shadow-sm overflow-hidden">
                <div className="px-4 py-3 bg-[#F5F5F3] border-b border-[#E7E7E4] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex gap-1.5" aria-hidden="true">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#D2D2CD]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#D2D2CD]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#D2D2CD]" />
                    </span>
                    <span className="text-xs font-mono text-[#6B6B6B]">{t("demoBrowserTitle")}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleReset();
                      setWidgetKey((k) => k + 1);
                    }}
                    className="text-xs font-medium text-[#6A4FC4] hover:underline"
                  >
                    {t("demoDevResetBtn")}
                  </button>
                </div>

                <div className="p-4 sm:p-6 bg-[#FAF9F6]">
                  <MezgebWidget
                    key={widgetKey}
                    template={LEARNING_PLATFORM_TEMPLATE}
                    aiEnabled={aiEnabled}
                    offline={isOffline}
                    platformName="Learnhub"
                    resumeIdParam={resumeIdParam}
                    onAnswersChange={setLiveAnswers}
                    onAiPayloadLogged={(payload) => setAiLogs((prev) => [payload, ...prev].slice(0, 5))}
                    onComplete={handleComplete}
                    onOutboxUpdated={refreshOutboxCount}
                    onReset={handleReset}
                  />
                </div>
              </div>
            </div>

            {/* Collapsible Developer View */}
            {devOpen && (
              <aside
                aria-label={t("demoDevTitle")}
                className="lg:col-span-5 mezgeb-card p-5 sm:p-6 space-y-6"
              >
                <div className="flex items-center justify-between border-b border-[#E7E7E4] pb-3">
                  <h2 className="text-lg font-semibold text-[#111111]">{t("demoDevTitle")}</h2>
                </div>

                {/* Controls */}
                <div className="space-y-3.5 text-sm">
                  <label className="flex items-center justify-between gap-3 cursor-pointer">
                    <span className="font-medium text-[#111111]">{t("demoDevOfflineLabel")}</span>
                    <input
                      type="checkbox"
                      checked={simulateOffline}
                      onChange={(e) => setSimulateOffline(e.target.checked)}
                      className="w-5 h-5 accent-[#6A4FC4]"
                    />
                  </label>

                  <div className="flex items-center justify-between gap-3 py-1 px-3 rounded-lg bg-[#F5F5F3] text-xs">
                    <span className="font-medium text-[#111111]">{t("demoOutboxLabel")}</span>
                    <span className="font-mono text-[#6B6B6B]">
                      {outboxCount > 0
                        ? t("demoOutboxCount", { count: outboxCount })
                        : t("demoOutboxEmpty")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-[#111111]">{t("demoDevAiLabel")}</span>
                    <div className="inline-flex rounded-lg border border-[#E7E7E4] bg-[#F5F5F3] p-0.5">
                      <button
                        type="button"
                        onClick={() => setAiEnabled(true)}
                        aria-pressed={aiEnabled}
                        className={`px-3 min-h-[34px] rounded-md text-xs font-semibold ${
                          aiEnabled ? "bg-white text-[#111111] shadow-xs" : "text-[#6B6B6B]"
                        }`}
                      >
                        {t("demoDevAiOn")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setAiEnabled(false)}
                        aria-pressed={!aiEnabled}
                        className={`px-3 min-h-[34px] rounded-md text-xs font-semibold ${
                          !aiEnabled ? "bg-white text-[#111111] shadow-xs" : "text-[#6B6B6B]"
                        }`}
                      >
                        {t("demoDevAiOff")}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-[#111111]">{t("demoDevLangLabel")}</span>
                    <div className="inline-flex rounded-lg border border-[#E7E7E4] bg-[#F5F5F3] p-0.5">
                      <button
                        type="button"
                        onClick={() => setLang("en")}
                        aria-pressed={lang === "en"}
                        className={`px-3 min-h-[34px] rounded-md text-xs font-semibold ${
                          lang === "en" ? "bg-white text-[#111111] shadow-xs" : "text-[#6B6B6B]"
                        }`}
                      >
                        EN
                      </button>
                      <button
                        type="button"
                        onClick={() => setLang("am")}
                        aria-pressed={lang === "am"}
                        className={`px-3 min-h-[34px] rounded-md text-xs font-semibold ${
                          lang === "am" ? "bg-white text-[#111111] shadow-xs" : "text-[#6B6B6B]"
                        }`}
                      >
                        አማ
                      </button>
                    </div>
                  </div>
                </div>

                {/* Token Exchange Flow */}
                <div className="space-y-2 pt-2 border-t border-[#E7E7E4]">
                  <h3 className="text-sm font-semibold text-[#111111]">{t("demoDevExchangeTitle")}</h3>
                  {exchangeSteps.length === 0 ? (
                    <p className="text-xs text-[#6B6B6B]">{t("demoDevExchangePending")}</p>
                  ) : (
                    <ol className="space-y-1.5 text-xs text-[#1F5C46] bg-[#E4F2EC] p-3.5 rounded-xl">
                      {exchangeSteps.map((st, idx) => (
                        <li key={idx} className="font-medium">
                          {st}
                        </li>
                      ))}
                    </ol>
                  )}
                  {exchangedProfile && (
                    <pre className="p-3 rounded-xl bg-[#161616] text-[#E4F2EC] text-xs font-mono overflow-x-auto">
                      <code>{JSON.stringify(exchangedProfile, null, 2)}</code>
                    </pre>
                  )}
                </div>

                {/* What the AI received */}
                <div className="space-y-2 pt-2 border-t border-[#E7E7E4]">
                  <h3 className="text-sm font-semibold text-[#111111]">{t("demoDevAiLogTitle")}</h3>
                  {aiLogs.length === 0 ? (
                    <p className="text-xs text-[#6B6B6B]">{t("demoDevAiLogEmpty")}</p>
                  ) : (
                    <pre className="p-3 rounded-xl bg-[#F5F5F3] border border-[#E7E7E4] text-[11px] font-mono overflow-x-auto max-h-48">
                      <code>{JSON.stringify(aiLogs[0], null, 2)}</code>
                    </pre>
                  )}
                </div>

                {/* Live Answers JSON */}
                <div className="space-y-1.5 pt-2 border-t border-[#E7E7E4]">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-[#111111]">{t("demoDevAnswersTitle")}</h3>
                  </div>
                  <p className="text-xs text-[#6B6B6B]">{t("demoDevAnswersNotice")}</p>
                  <pre className="p-3 rounded-xl bg-[#F5F5F3] border border-[#E7E7E4] text-[11px] font-mono overflow-x-auto max-h-56">
                    <code>{JSON.stringify(liveAnswers, null, 2)}</code>
                  </pre>
                </div>

                {/* Demo Rehearsal Checklist */}
                <div className="space-y-2 pt-2 border-t border-[#E7E7E4]">
                  <h3 className="text-sm font-semibold text-[#111111]">{t("demoRehearsalTitle")}</h3>
                  <ul className="space-y-2 text-xs text-[#6B6B6B]">
                    <li>
                      <Link to="/partner" target="_blank" rel="noreferrer" className="text-[#6A4FC4] hover:underline">
                        {t("demoRehearsal1")}
                      </Link>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => setSimulateOffline((v) => !v)}
                        className="text-left text-[#6A4FC4] hover:underline"
                      >
                        {t("demoRehearsal2")}
                      </button>
                    </li>
                    <li>
                      <Link to="/playground" className="text-[#6A4FC4] hover:underline">
                        {t("demoRehearsal3")}
                      </Link>
                    </li>
                  </ul>
                </div>
              </aside>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
