import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AccessibleDialog } from "../components/AccessibleDialog";
import { CopyIcon } from "../components/Icons";
import { Layout } from "../components/Layout";
import { useLiveAnnouncer } from "../components/LiveAnnouncer";
import { MezgebWidget } from "../components/MezgebWidget";
import { Lang, useI18n } from "../i18n";
import { safeGetSession } from "../lib/storage";
import { getTemplateById, TEMPLATES } from "../templates";
import { MezgebTemplate } from "../templates/types";

function hexToContrastAgainstWhite(hex: string): number {
  const clean = hex.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return 1;
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const L = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  return Number(((1.0 + 0.05) / (L + 0.05)).toFixed(2));
}

export function PlaygroundPage() {
  const { lang, t } = useI18n();
  const { announce } = useLiveAnnouncer();
  const location = useLocation();

  const [customTemplate, setCustomTemplate] = useState<MezgebTemplate | null>(() => {
    const stateTpl = (location.state as { template?: MezgebTemplate } | null)?.template;
    if (stateTpl) return stateTpl;
    const saved = safeGetSession("mezgeb_custom_template");
    if (saved) {
      try {
        return JSON.parse(saved) as MezgebTemplate;
      } catch {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    const stateTpl = (location.state as { template?: MezgebTemplate } | null)?.template;
    if (stateTpl) setCustomTemplate(stateTpl);
  }, [location.state]);

  const availableTemplates: MezgebTemplate[] = customTemplate
    ? [customTemplate, ...TEMPLATES.filter((item) => item.id !== customTemplate.id)]
    : TEMPLATES;

  const [templateId, setTemplateId] = useState<string>(availableTemplates[0].id);
  const [siteKey, setSiteKey] = useState("pk_test_learnhub");
  const [defaultLang, setDefaultLang] = useState<Lang>("am");
  const [integrationType, setIntegrationType] = useState<"embed" | "button">("embed");
  const [accentInput, setAccentInput] = useState("#6A4FC4");
  const [validAccent, setValidAccent] = useState("#6A4FC4");
  const [hosting, setHosting] = useState<"hosted" | "lite" | "full">("hosted");

  const [activeTab, setActiveTab] = useState<"page" | "server" | "webhook" | "selfhost">("page");
  const [serverLang, setServerLang] = useState<"node" | "python" | "php">("node");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Test registration dialog
  const [testOpen, setTestOpen] = useState(false);
  const [testResult, setTestResult] = useState<{
    token: string;
    profile: Record<string, unknown>;
    supportShared: boolean;
  } | null>(null);

  const selectedTemplate =
    availableTemplates.find((tpl) => tpl.id === templateId) ?? getTemplateById(templateId);

  const contrastRatio = hexToContrastAgainstWhite(accentInput);
  const contrastPasses = contrastRatio >= 4.5;

  const handleAccentChange = (nextHex: string) => {
    setAccentInput(nextHex);
    if (hexToContrastAgainstWhite(nextHex) >= 4.5) {
      setValidAccent(nextHex);
    }
  };

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore clipboard fallback
    }
    setCopiedId(id);
    announce(t("copiedAnnouncement"));
    window.setTimeout(() => setCopiedId(null), 2000);
  };

  const pageSnippet =
    integrationType === "embed"
      ? `<script type="module" src="https://cdn.mezgeb.example/v1/mezgeb.js"></script>\n<mezgeb-register\n  site-key="${siteKey}"\n  lang="${defaultLang}"\n  template="${selectedTemplate.id}"\n  theme-accent="${validAccent}"\n></mezgeb-register>`
      : `<a\n  href="https://join.mezgeb.example/start?site_key=${encodeURIComponent(
          siteKey
        )}&template=${encodeURIComponent(selectedTemplate.id)}&lang=${defaultLang}&return_url=https://yoursite.example/callback"\n  style="display:inline-flex;align-items:center;padding:10px 18px;border-radius:8px;background:${validAccent};color:#ffffff;font-weight:600;text-decoration:none"\n>\n  Sign up with Mezgeb\n</a>`;

  const serverSnippets: Record<"node" | "python" | "php", string> = {
    node: `app.post("/auth/mezgeb-callback", async (req, res) => {
  const { token } = req.body;
  const r = await fetch("https://api.mezgeb.example/v1/registrations/exchange", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": \`Bearer \${process.env.MEZGEB_SECRET_KEY}\`,
    },
    body: JSON.stringify({ token }),
  });
  const profile = await r.json();
  const user = await db.users.upsert({ externalId: profile.id, ...profile });
  req.session.userId = user.id;
  res.json({ ok: true });
});`,
    python: `@app.post("/auth/mezgeb-callback")
async def mezgeb_callback(payload: dict, request: Request):
    async with httpx.AsyncClient() as client:
        r = await client.post(
            "https://api.mezgeb.example/v1/registrations/exchange",
            headers={"Authorization": f"Bearer {os.environ['MEZGEB_SECRET_KEY']}"},
            json={"token": payload["token"]},
        )
    profile = r.json()
    user = await db.upsert_user(profile)
    request.session["user_id"] = user.id
    return {"ok": True}`,
    php: `<?php
$body = json_decode(file_get_contents('php://input'), true);
$ch = curl_init('https://api.mezgeb.example/v1/registrations/exchange');
curl_setopt_array($ch, [
  CURLOPT_POST => true,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_HTTPHEADER => [
    'Content-Type: application/json',
    'Authorization: Bearer ' . getenv('MEZGEB_SECRET_KEY'),
  ],
  CURLOPT_POSTFIELDS => json_encode(['token' => $body['token']]),
]);
$profile = json_decode(curl_exec($ch), true);
$_SESSION['user_id'] = upsert_user($profile);
echo json_encode(['ok' => true]);`,
  };

  const webhookSnippet = `app.post("/webhooks/mezgeb", (req, res) => {
  const sig = req.header("X-Mezgeb-Signature");
  if (!verifyHmac(req.rawBody, sig, process.env.MEZGEB_WEBHOOK_SECRET)) {
    return res.status(401).end();
  }
  if (req.body.event === "profile.updated") {
    await db.users.updateByExternalId(req.body.data.id, req.body.data);
  }
  res.status(200).json({ received: true });
});`;

  const selfHostProfile = hosting === "full" ? "full" : "lite";
  const selfHostSnippet = `# Run Mezgeb on your own server
docker compose --profile ${selfHostProfile} up -d

# .env
MEZGEB_PORT=8080
MEZGEB_SITE_KEY=${siteKey}
MEZGEB_SECRET_KEY=sk_live_replace_with_random_secret
MEZGEB_SPEECH=${hosting === "full" ? "local-whisper-eth" : "off"}
MEZGEB_AI=${hosting === "full" ? "local-llm" : "off"}
MEZGEB_CLOUD_AI=off`;

  return (
    <Layout>
      <section aria-labelledby="playground-heading" className="py-12 md:py-16 bg-[#FAF9F6] min-h-[75vh]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 space-y-8">
          <div className="max-w-2xl space-y-2">
            <h1 id="playground-heading" className="text-3xl md:text-4xl font-bold tracking-tight text-[#111111]">
              {t("playgroundTitle")}
            </h1>
            <p className="text-base text-[#6B6B6B]">{t("playgroundSubtitle")}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left settings */}
            <div className="lg:col-span-5 mezgeb-card p-6 space-y-5">
              <h2 className="text-lg font-semibold text-[#111111]">{t("playgroundSettingsTitle")}</h2>

              <div>
                <label htmlFor="pg-template" className="block text-sm font-medium text-[#111111] mb-1.5">
                  {t("playgroundTemplateLabel")}
                </label>
                <select
                  id="pg-template"
                  value={selectedTemplate.id}
                  onChange={(e) => setTemplateId(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#E7E7E4] bg-white text-sm"
                >
                  {availableTemplates.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.name[lang]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="pg-sitekey" className="block text-sm font-medium text-[#111111] mb-1.5">
                  {t("playgroundSiteKeyLabel")}
                </label>
                <input
                  id="pg-sitekey"
                  type="text"
                  value={siteKey}
                  onChange={(e) => setSiteKey(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#E7E7E4] font-mono text-sm"
                />
              </div>

              <div>
                <label htmlFor="pg-lang" className="block text-sm font-medium text-[#111111] mb-1.5">
                  {t("playgroundDefaultLangLabel")}
                </label>
                <select
                  id="pg-lang"
                  value={defaultLang}
                  onChange={(e) => setDefaultLang(e.target.value as Lang)}
                  className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#E7E7E4] bg-white text-sm"
                >
                  <option value="am">am (Amharic)</option>
                  <option value="en">en (English)</option>
                </select>
              </div>

              <div>
                <span className="block text-sm font-medium text-[#111111] mb-1.5">
                  {t("playgroundTypeLabel")}
                </span>
                <div className="grid grid-cols-1 gap-2">
                  <label className="flex items-center gap-2.5 p-3 rounded-xl border border-[#E7E7E4] cursor-pointer text-sm">
                    <input
                      type="radio"
                      name="pg-type"
                      checked={integrationType === "embed"}
                      onChange={() => setIntegrationType("embed")}
                      className="accent-[#6A4FC4]"
                    />
                    <span>{t("playgroundTypeEmbed")}</span>
                  </label>
                  <label className="flex items-center gap-2.5 p-3 rounded-xl border border-[#E7E7E4] cursor-pointer text-sm">
                    <input
                      type="radio"
                      name="pg-type"
                      checked={integrationType === "button"}
                      onChange={() => setIntegrationType("button")}
                      className="accent-[#6A4FC4]"
                    />
                    <span>{t("playgroundTypeButton")}</span>
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="pg-accent" className="block text-sm font-medium text-[#111111] mb-1.5">
                  {t("playgroundAccentLabel")}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    id="pg-accent"
                    type="color"
                    value={accentInput}
                    onChange={(e) => handleAccentChange(e.target.value)}
                    className="w-12 h-11 rounded-lg border border-[#E7E7E4] p-1 bg-white cursor-pointer"
                  />
                  <input
                    type="text"
                    value={accentInput}
                    onChange={(e) => handleAccentChange(e.target.value)}
                    aria-label="Accent hex colour"
                    className="flex-1 min-h-[44px] px-3 rounded-xl border border-[#E7E7E4] font-mono text-sm"
                  />
                </div>
                <p
                  role="status"
                  className={`mt-2 text-xs font-medium ${
                    contrastPasses ? "text-[#1F5C46]" : "text-red-700"
                  }`}
                >
                  {contrastPasses
                    ? t("playgroundAccentContrastPass", { ratio: contrastRatio })
                    : t("playgroundAccentContrastFail", { ratio: contrastRatio })}
                </p>
              </div>

              <div>
                <label htmlFor="pg-hosting" className="block text-sm font-medium text-[#111111] mb-1.5">
                  {t("playgroundHostingLabel")}
                </label>
                <select
                  id="pg-hosting"
                  value={hosting}
                  onChange={(e) => setHosting(e.target.value as "hosted" | "lite" | "full")}
                  className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#E7E7E4] bg-white text-sm"
                >
                  <option value="hosted">{t("playgroundHostingHosted")}</option>
                  <option value="lite">{t("playgroundHostingLite")}</option>
                  <option value="full">{t("playgroundHostingFull")}</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => {
                  setTestResult(null);
                  setTestOpen(true);
                }}
                className="w-full mezgeb-btn-primary"
              >
                {t("playgroundTestBtn")}
              </button>
            </div>

            {/* Right outputs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="mezgeb-card overflow-hidden">
                <div
                  role="tablist"
                  aria-label="Code outputs"
                  className="flex flex-wrap border-b border-[#E7E7E4] bg-[#F5F5F3] px-2 pt-2 gap-1"
                >
                  {(
                    [
                      ["page", t("playgroundTabPage")],
                      ["server", t("playgroundTabServer")],
                      ["webhook", t("playgroundTabWebhook")],
                      ["selfhost", t("playgroundTabSelfHost")],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      role="tab"
                      type="button"
                      aria-selected={activeTab === id}
                      onClick={() => setActiveTab(id)}
                      className={`px-4 min-h-[42px] rounded-t-lg text-sm font-medium transition-colors ${
                        activeTab === id
                          ? "bg-white text-[#111111] border border-b-white border-[#E7E7E4] -mb-px"
                          : "text-[#6B6B6B] hover:text-[#111111]"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="p-5 sm:p-6 space-y-4">
                  {activeTab === "page" && (
                    <CodeBlockWithCopy
                      id="pg-page"
                      title="index.html"
                      code={pageSnippet}
                      copiedId={copiedId}
                      onCopy={handleCopy}
                    />
                  )}

                  {activeTab === "server" && (
                    <div className="space-y-4">
                      <div className="inline-flex rounded-lg border border-[#E7E7E4] bg-[#F5F5F3] p-0.5">
                        {(
                          [
                            ["node", "Node / Express"],
                            ["python", "Python / FastAPI"],
                            ["php", "PHP"],
                          ] as const
                        ).map(([id, label]) => (
                          <button
                            key={id}
                            type="button"
                            onClick={() => setServerLang(id)}
                            aria-pressed={serverLang === id}
                            className={`px-3 min-h-[36px] rounded-md text-xs font-semibold ${
                              serverLang === id ? "bg-white text-[#111111] shadow-xs" : "text-[#6B6B6B]"
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                      <CodeBlockWithCopy
                        id={`pg-srv-${serverLang}`}
                        title={`server.${serverLang === "node" ? "ts" : serverLang === "python" ? "py" : "php"}`}
                        code={serverSnippets[serverLang]}
                        copiedId={copiedId}
                        onCopy={handleCopy}
                      />
                    </div>
                  )}

                  {activeTab === "webhook" && (
                    <CodeBlockWithCopy
                      id="pg-webhook"
                      title="webhook-handler.ts"
                      code={webhookSnippet}
                      copiedId={copiedId}
                      onCopy={handleCopy}
                    />
                  )}

                  {activeTab === "selfhost" && (
                    <CodeBlockWithCopy
                      id="pg-selfhost"
                      title={`docker-compose (${selfHostProfile})`}
                      code={selfHostSnippet}
                      copiedId={copiedId}
                      onCopy={handleCopy}
                    />
                  )}
                </div>
              </div>

              {testResult && (
                <div className="mezgeb-card p-6 space-y-3">
                  <h2 className="text-lg font-semibold text-[#111111]">{t("playgroundTestResultTitle")}</h2>
                  <p className="text-xs font-mono text-[#1F5C46] bg-[#E4F2EC] px-3 py-2 rounded-lg">
                    POST /v1/registrations/exchange · token: {testResult.token} · 200 OK
                  </p>
                  <pre className="p-4 rounded-xl bg-[#161616] text-[#E4F2EC] text-xs font-mono overflow-x-auto">
                    <code>{JSON.stringify(testResult.profile, null, 2)}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <AccessibleDialog
        open={testOpen}
        onClose={() => setTestOpen(false)}
        title={selectedTemplate.name[lang]}
        maxWidthClass="max-w-2xl"
      >
        <MezgebWidget
          template={selectedTemplate}
          aiEnabled={false}
          offline={false}
          accentColor={validAccent}
          platformName={siteKey}
          storageKey="mezgeb_playground_test"
          onComplete={(res) => {
            setTestResult(res);
          }}
        />
      </AccessibleDialog>
    </Layout>
  );
}

function CodeBlockWithCopy({
  id,
  title,
  code,
  copiedId,
  onCopy,
}: {
  id: string;
  title: string;
  code: string;
  copiedId: string | null;
  onCopy: (id: string, code: string) => void;
}) {
  const { t } = useI18n();
  const isCopied = copiedId === id;

  return (
    <div className="rounded-xl bg-[#161616] text-white overflow-hidden">
      <div className="px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-xs text-[#9B9B9B]">
        <span className="font-mono">{title}</span>
        <button
          type="button"
          onClick={() => onCopy(id, code)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 text-white hover:bg-white/20 text-xs font-medium"
        >
          <CopyIcon size={12} />
          <span>{isCopied ? t("copiedButton") : t("copyButton")}</span>
        </button>
      </div>
      <pre className="p-4 text-xs font-mono leading-relaxed overflow-x-auto text-[#E4F2EC]">
        <code>{code}</code>
      </pre>
    </div>
  );
}
