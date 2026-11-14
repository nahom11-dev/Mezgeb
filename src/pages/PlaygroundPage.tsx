import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Check, ChevronRight, RotateCcw } from "lucide-react";
import { Layout } from "../components/Layout";
import { MezgebWidget, MezgebWidgetEvent } from "../components/MezgebWidget";
import { Lang, useI18n } from "../i18n";
import { safeGetSession } from "../lib/storage";
import { ACCENT_SWATCHES, DEFAULT_WIDGET_THEME, getTemplateById, TEMPLATES } from "../templates";
import { MezgebTemplate } from "../templates/types";
import { hexContrastAgainstWhite } from "../templates/validate";
import { CodeBlock } from "../ui";
import { inputClass, PhoneFrame, Segmented, selectClass, TemplateMark } from "./templates/kit";
import { useTs } from "./templates/strings";

type CodeTab = "html" | "server" | "webhook" | "config" | "events";
type ServerLang = "node" | "python" | "php";
type Hosting = "hosted" | "lite" | "full";

const CDN = "https://cdn.mezgeb.example/v1/mezgeb.js";

function serverSnippet(kind: ServerLang): { filename: string; code: string } {
  if (kind === "python") {
    return {
      filename: "app.py",
      code: `# Flask: exchange the one-time token for the learner's profile
import os, requests
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.post("/auth/mezgeb-callback")
def mezgeb_callback():
    token = request.json["token"]
    r = requests.post(
        "https://api.mezgeb.example/v1/registrations/exchange",
        headers={"Authorization": f"Bearer {os.environ['MEZGEB_SECRET_KEY']}"},
        json={"token": token},
        timeout=10,
    )
    r.raise_for_status()
    profile = r.json()
    # save profile["id"], profile["name"], ... to your users table
    return jsonify(ok=True)`,
    };
  }
  if (kind === "php") {
    return {
      filename: "mezgeb-callback.php",
      code: `<?php
// Exchange the one-time token for the learner's profile
$token = json_decode(file_get_contents("php://input"), true)["token"];

$ch = curl_init("https://api.mezgeb.example/v1/registrations/exchange");
curl_setopt_array($ch, [
  CURLOPT_POST => true,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_HTTPHEADER => [
    "Content-Type: application/json",
    "Authorization: Bearer " . getenv("MEZGEB_SECRET_KEY"),
  ],
  CURLOPT_POSTFIELDS => json_encode(["token" => $token]),
]);
$profile = json_decode(curl_exec($ch), true);
curl_close($ch);

// save $profile["id"], $profile["name"], ... to your users table
header("Content-Type: application/json");
echo json_encode(["ok" => true]);`,
    };
  }
  return {
    filename: "server.ts",
    code: `// Express: exchange the one-time token for the learner's profile
app.post("/auth/mezgeb-callback", async (req, res) => {
  const { token } = req.body;
  const r = await fetch("https://api.mezgeb.example/v1/registrations/exchange", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: \`Bearer \${process.env.MEZGEB_SECRET_KEY}\`,
    },
    body: JSON.stringify({ token }),
  });
  const profile = await r.json();
  await db.users.upsert({ externalId: profile.id, ...profile });
  res.json({ ok: true });
});`,
  };
}

export function PlaygroundPage() {
  const { lang, setLang, t } = useI18n();
  const s = useTs();
  const location = useLocation();

  const [customTemplate, setCustomTemplate] = useState<MezgebTemplate | null>(() => {
    const fromState = (location.state as { template?: MezgebTemplate } | null)?.template;
    if (fromState) return fromState;
    const saved = safeGetSession("mezgeb_custom_template");
    if (!saved) return null;
    try {
      return JSON.parse(saved) as MezgebTemplate;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const fromState = (location.state as { template?: MezgebTemplate } | null)?.template;
    if (fromState) setCustomTemplate(fromState);
  }, [location.state]);

  const available: MezgebTemplate[] = useMemo(
    () => (customTemplate ? [customTemplate, ...TEMPLATES.filter((x) => x.id !== customTemplate.id)] : TEMPLATES),
    [customTemplate]
  );

  const [templateId, setTemplateId] = useState<string>(available[0].id);
  const selected = available.find((x) => x.id === templateId) ?? getTemplateById(templateId);
  const templateAccent = selected.theme?.accent ?? DEFAULT_WIDGET_THEME.accent;

  const [themeMode, setThemeMode] = useState<"light" | "hc">("light");
  const [siteKey, setSiteKey] = useState("pk_test_learnhub");
  const [integration, setIntegration] = useState<"embed" | "button">("embed");
  const [accentInput, setAccentInput] = useState(templateAccent);
  const [validAccent, setValidAccent] = useState(templateAccent);
  const [hosting, setHosting] = useState<Hosting>("hosted");

  const [codeTab, setCodeTab] = useState<CodeTab>("html");
  const [serverLang, setServerLang] = useState<ServerLang>("node");
  const [runKey, setRunKey] = useState(0);
  const [events, setEvents] = useState<MezgebWidgetEvent[]>([]);
  const [latestProfile, setLatestProfile] = useState<Record<string, unknown> | null>(null);

  const ratio = hexContrastAgainstWhite(accentInput);
  const accentOk = ratio >= 4.5;

  const changeAccent = (hex: string) => {
    setAccentInput(hex);
    if (hexContrastAgainstWhite(hex) >= 4.5) setValidAccent(hex);
  };

  const pickTemplate = (id: string) => {
    const next = available.find((x) => x.id === id) ?? getTemplateById(id);
    const accent = next.theme?.accent ?? DEFAULT_WIDGET_THEME.accent;
    setTemplateId(id);
    setAccentInput(accent);
    setValidAccent(accent);
    setEvents([]);
    setLatestProfile(null);
    setRunKey((k) => k + 1);
  };

  const restart = () => {
    setEvents([]);
    setLatestProfile(null);
    setRunKey((k) => k + 1);
  };

  const htmlSnippet =
    integration === "embed"
      ? `<script type="module" src="${CDN}"></script>
<mezgeb-register
  site-key="${siteKey}"
  template="${selected.id}"
  lang="${lang}"
  theme="${themeMode}"
  accent="${validAccent}"
></mezgeb-register>

<script>
  document.querySelector("mezgeb-register")
    .addEventListener("mezgeb:complete", (e) => {
      // Send the one-time token to your server (see "Your server")
      fetch("/auth/mezgeb-callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: e.detail.token }),
      });
    });
</script>`
      : `<a href="https://join.mezgeb.example/start?site_key=${encodeURIComponent(siteKey)}&template=${encodeURIComponent(
          selected.id
        )}&lang=${lang}&theme=${themeMode}&return_url=https://yoursite.example/callback">
  Sign up with Mezgeb
</a>`;

  const configSnippet = JSON.stringify(
    {
      siteKey,
      template: selected.id,
      lang,
      theme: themeMode,
      accent: validAccent,
      hosting,
      speech: hosting === "full" ? "local-whisper-eth" : "browser-or-off",
      offlineOutbox: true,
    },
    null,
    2
  );

  const webhookSnippet = JSON.stringify(
    {
      event: "registration.completed",
      created_at: new Date().toISOString().slice(0, 19) + "Z",
      site_key: siteKey,
      template: selected.id,
      data: latestProfile ?? {
        id: "usr_sample_92a1",
        name: "Hana Tesfaye",
        preferred_language: lang,
        area: "lideta",
        id_route: "partner_pending",
        skills: ["Sales", "Bookkeeping"],
        support_shared: false,
      },
    },
    null,
    2
  );

  const server = serverSnippet(serverLang);

  const tabs: { id: CodeTab; label: string; badge?: number }[] = [
    { id: "html", label: s.pgTabHtml },
    { id: "server", label: s.pgTabServer },
    { id: "webhook", label: s.pgTabWebhook },
    { id: "config", label: s.pgTabConfig },
    { id: "events", label: s.pgTabEvents, badge: events.length },
  ];

  const codeProps = {
    wrap: true,
    copyLabel: t("copyCodeBtn"),
    copiedLabel: t("copiedButton"),
    copiedAnnouncement: t("copiedAnnouncement"),
  };

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
    if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
    if (next === null) return;
    e.preventDefault();
    setCodeTab(tabs[next].id);
    document.getElementById(`pg-tab-${tabs[next].id}`)?.focus();
  };

  return (
    <Layout>
      <div className="bg-[var(--paper)] text-left">
        <header className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-10 md:pt-12 pb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="max-w-[62ch] space-y-2">
            <h1 className="mezgeb-display-heading text-[2rem] md:text-[2.5rem] font-semibold text-[var(--ink)]">{s.pgTitle}</h1>
            <p className="text-[1.0625rem] leading-relaxed text-[var(--ink-2)]">{s.pgLead}</p>
          </div>
          <Link
            to="/docs"
            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--ink)] underline underline-offset-4 shrink-0"
          >
            {t("navDocs")}
            <ChevronRight size={16} strokeWidth={1.75} aria-hidden="true" />
          </Link>
        </header>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pb-16">
          <div className="rounded-[20px] border border-[var(--line)] overflow-hidden grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)_minmax(0,500px)]">
            {/* ───── Setup ───── */}
            <section aria-labelledby="pg-setup" className="border-y lg:border-y-0 lg:border-r border-[var(--line)] p-5 space-y-6">
              <h2 id="pg-setup" className="text-[15px] font-semibold text-[var(--ink)]">
                {s.pgSetup}
              </h2>

              <div className="space-y-1.5">
                <label htmlFor="pg-template" className="block text-[13px] font-medium text-[var(--muted)]">
                  {s.pgTemplate}
                </label>
                <div className="flex items-center gap-2">
                  <TemplateMark tpl={selected} size={44} />
                  <select id="pg-template" value={selected.id} onChange={(e) => pickTemplate(e.target.value)} className={selectClass}>
                    {available.map((tpl) => (
                      <option key={tpl.id} value={tpl.id}>
                        {tpl.name[lang] || tpl.name.en}
                      </option>
                    ))}
                  </select>
                </div>
                {customTemplate && selected.id === customTemplate.id && (
                  <p className="text-[12px] text-[var(--muted)]">{s.pgFromBuilder}</p>
                )}
              </div>

              <Segmented
                fullWidth
                label={s.pgLanguage}
                value={lang}
                onChange={(v: Lang) => setLang(v)}
                options={[
                  { value: "am", label: "አማርኛ", lang: "am" },
                  { value: "en", label: "English", lang: "en" },
                ]}
              />

              <Segmented
                fullWidth
                label={s.pgTheme}
                value={themeMode}
                onChange={setThemeMode}
                options={[
                  { value: "light", label: s.pgThemeLight },
                  { value: "hc", label: s.pgThemeHc },
                ]}
              />

              <fieldset className="space-y-2.5">
                <legend className="text-[13px] font-medium text-[var(--muted)] mb-1.5">{s.pgAccent}</legend>
                <div className="flex flex-wrap items-center gap-2">
                  {Array.from(new Set([templateAccent, ...ACCENT_SWATCHES])).map((hex) => {
                    const on = validAccent.toLowerCase() === hex.toLowerCase() && accentOk;
                    return (
                      <button
                        key={hex}
                        type="button"
                        aria-label={hex}
                        aria-pressed={on}
                        onClick={() => changeAccent(hex)}
                        style={{ backgroundColor: hex }}
                        className={`w-8 h-8 rounded-full inline-flex items-center justify-center text-white cursor-pointer ${
                          on ? "ring-2 ring-offset-2 ring-[var(--ink)]" : ""
                        }`}
                      >
                        {on && <Check size={15} strokeWidth={2.5} aria-hidden="true" />}
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    aria-label={`${s.pgAccent}: custom`}
                    value={/^#[0-9a-f]{6}$/i.test(accentInput) ? accentInput : validAccent}
                    onChange={(e) => changeAccent(e.target.value)}
                    className="w-11 h-11 shrink-0 rounded-[10px] border border-[var(--line-strong)] bg-[var(--paper)] cursor-pointer p-1"
                  />
                  <input
                    aria-label={`${s.pgAccent} hex`}
                    value={accentInput}
                    spellCheck={false}
                    onChange={(e) => changeAccent(e.target.value)}
                    className={`${inputClass} font-mono !text-sm`}
                  />
                </div>
                <p role="status" className={`text-[13px] leading-snug ${accentOk ? "text-[var(--mint-ink)]" : "text-[var(--error)]"}`}>
                  {accentOk ? s.f("pgAccentPass", { ratio }) : s.f("pgAccentFail", { ratio })}
                </p>
              </fieldset>

              <Segmented
                fullWidth
                label={s.pgIntegration}
                value={integration}
                onChange={setIntegration}
                options={[
                  { value: "embed", label: s.pgEmbed },
                  { value: "button", label: s.pgButton },
                ]}
              />

              <div className="space-y-1.5">
                <label htmlFor="pg-sitekey" className="block text-[13px] font-medium text-[var(--muted)]">
                  {s.pgSiteKey}
                </label>
                <input
                  id="pg-sitekey"
                  value={siteKey}
                  spellCheck={false}
                  aria-describedby="pg-sitekey-hint"
                  onChange={(e) => setSiteKey(e.target.value)}
                  className={`${inputClass} font-mono !text-sm`}
                />
                <p id="pg-sitekey-hint" className="text-[12px] text-[var(--muted)]">
                  {s.pgSiteKeyHint}
                </p>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="pg-hosting" className="block text-[13px] font-medium text-[var(--muted)]">
                  {s.pgHosting}
                </label>
                <select id="pg-hosting" value={hosting} onChange={(e) => setHosting(e.target.value as Hosting)} className={selectClass}>
                  <option value="hosted">{t("playgroundHostingHosted")}</option>
                  <option value="lite">{t("playgroundHostingLite")}</option>
                  <option value="full">{t("playgroundHostingFull")}</option>
                </select>
              </div>
            </section>

            {/* ───── Preview ───── */}
            <section aria-labelledby="pg-preview" className="order-first lg:order-none mz-canvas min-w-0 border-b xl:border-b-0 xl:border-r border-[var(--line)] flex flex-col">
              <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-[var(--line)] bg-[var(--stone)]/90 backdrop-blur">
                <h2 id="pg-preview" className="text-[15px] font-semibold text-[var(--ink)]">
                  {s.pgPreview}
                </h2>
                <button
                  type="button"
                  onClick={restart}
                  className="inline-flex items-center gap-1.5 min-h-[36px] px-3 rounded-[10px] text-sm font-medium text-[var(--ink)] hover:bg-[var(--paper)] cursor-pointer"
                >
                  <RotateCcw size={16} strokeWidth={1.75} aria-hidden="true" />
                  {s.pgRestart}
                </button>
              </div>
              <div className={`flex-1 px-4 py-8 ${themeMode === "hc" ? "mezgeb-hc" : ""}`}>
                <PhoneFrame width={380}>
                  <MezgebWidget
                    key={`pg-${runKey}-${selected.id}-${lang}`}
                    template={selected}
                    aiEnabled={false}
                    offline={false}
                    ephemeralPreview
                    highContrast={themeMode === "hc"}
                    accentColor={validAccent}
                    platformName={selected.theme?.platformName}
                    siteKey={siteKey}
                    storageKey={`mezgeb_playground_${selected.id}`}
                    onEvent={(ev) => setEvents((prev) => [ev, ...prev])}
                    onComplete={(res) => setLatestProfile(res.profile)}
                  />
                </PhoneFrame>
              </div>
            </section>

            {/* ───── Code + events ───── */}
            <section aria-labelledby="pg-code" className="min-w-0 lg:col-span-2 xl:col-span-1 lg:border-t xl:border-t-0 border-[var(--line)] flex flex-col">
              <h2 id="pg-code" className="sr-only">
                {s.pgCode}
              </h2>
              <div role="tablist" aria-label={s.pgCode} className="flex items-stretch gap-1 px-3 border-b border-[var(--line)] overflow-x-auto mz-scroll">
                {tabs.map((tab, i) => {
                  const on = codeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      id={`pg-tab-${tab.id}`}
                      role="tab"
                      type="button"
                      aria-selected={on}
                      aria-controls="pg-tabpanel"
                      tabIndex={on ? 0 : -1}
                      onClick={() => setCodeTab(tab.id)}
                      onKeyDown={(e) => onTabKey(e, i)}
                      className={`mezgeb-transition inline-flex items-center gap-1.5 min-h-[48px] px-3 text-sm whitespace-nowrap border-b-2 -mb-px cursor-pointer ${
                        on ? "border-[var(--ink)] text-[var(--ink)] font-semibold" : "border-transparent text-[var(--muted)] hover:text-[var(--ink)] font-medium"
                      }`}
                    >
                      {tab.label}
                      {tab.badge !== undefined && tab.badge > 0 && (
                        <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-[var(--ink)] text-[var(--paper)] text-[11px] font-semibold inline-flex items-center justify-center tabular-nums">
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div id="pg-tabpanel" role="tabpanel" aria-labelledby={`pg-tab-${codeTab}`} className="p-5 space-y-4 min-w-0">
                {codeTab === "html" && (
                  <CodeBlock filename={integration === "embed" ? "signup.html" : "button.html"} code={htmlSnippet} {...codeProps} />
                )}

                {codeTab === "server" && (
                  <>
                    <p className="text-sm text-[var(--ink-2)] leading-relaxed">{s.pgServerNote}</p>
                    <Segmented
                      size="sm"
                      label={s.pgTabServer}
                      hideLabel
                      value={serverLang}
                      onChange={setServerLang}
                      options={[
                        { value: "node", label: "Node.js" },
                        { value: "python", label: "Python" },
                        { value: "php", label: "PHP" },
                      ]}
                    />
                    <CodeBlock filename={server.filename} code={server.code} {...codeProps} />
                  </>
                )}

                {codeTab === "webhook" && (
                  <>
                    <p className="text-sm text-[var(--ink-2)] leading-relaxed">{s.pgWebhookNote}</p>
                    <CodeBlock filename="registration.completed.json" code={webhookSnippet} {...codeProps} />
                  </>
                )}

                {codeTab === "config" && (
                  <>
                    <p className="text-sm text-[var(--ink-2)] leading-relaxed">{s.pgConfigNote}</p>
                    <CodeBlock filename="mezgeb.config.json" code={configSnippet} {...codeProps} />
                  </>
                )}

                {codeTab === "events" &&
                  (events.length === 0 ? (
                    <div className="rounded-[14px] border border-dashed border-[var(--line-strong)] p-6">
                      <p className="font-semibold text-[var(--ink)]">{s.pgEventsEmpty}</p>
                      <p className="mt-1 text-sm text-[var(--ink-2)]">{s.pgEventsEmptyBody}</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setEvents([])}
                          className="text-[13px] font-medium text-[var(--ink-2)] underline underline-offset-4 cursor-pointer"
                        >
                          {s.pgEventsClear}
                        </button>
                      </div>
                      <ol aria-live="polite" className="relative space-y-2">
                        {events.map((ev, i) => (
                          <li key={`${ev.timestamp}-${i}`}>
                            <details className="group rounded-[12px] border border-[var(--line)] open:bg-[var(--stone)]/50">
                              <summary className="list-none cursor-pointer px-4 min-h-[52px] flex items-center gap-3">
                                <span
                                  aria-hidden="true"
                                  className={`w-2 h-2 rounded-full shrink-0 ${
                                    ev.name === "registration.completed" ? "bg-[var(--mint-ink)]" : "bg-[var(--line-strong)]"
                                  }`}
                                />
                                <code className="text-[13px] text-[var(--ink)]" style={{ fontFamily: "var(--font-mono)" }}>
                                  {ev.name}
                                </code>
                                {typeof ev.payload.maps_to === "string" && (
                                  <span className="text-[13px] text-[var(--muted)] truncate">{ev.payload.maps_to}</span>
                                )}
                                <span className="ml-auto text-[12px] tabular-nums text-[var(--muted)] shrink-0">{ev.timestamp}</span>
                                <ChevronRight
                                  size={16}
                                  strokeWidth={1.75}
                                  aria-hidden="true"
                                  className="text-[var(--muted)] group-open:rotate-90 transition-transform shrink-0"
                                />
                                <span className="sr-only">{s.pgEventView}</span>
                              </summary>
                              <pre
                                tabIndex={0}
                                className="mx-4 mb-4 p-3 rounded-[8px] bg-[var(--paper)] border border-[var(--line)] text-[12px] leading-relaxed text-[var(--ink)] overflow-x-auto"
                                style={{ fontFamily: "var(--font-mono)" }}
                              >
                                <code>{JSON.stringify(ev.payload, null, 2)}</code>
                              </pre>
                            </details>
                          </li>
                        ))}
                      </ol>
                    </>
                  ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
