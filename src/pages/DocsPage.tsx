import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronDown, ChevronLeft, ChevronRight, Hash } from "lucide-react";
import { Layout } from "../components/Layout";
import { useI18n } from "../i18n";
import { Badge, Banner, Button, CodeBlock, Table } from "../ui";

interface DocEndpointSpec {
  method: "GET" | "POST";
  path: string;
  requestFields?: { field: string; type: string; notes: string }[];
  responseFields?: { field: string; type: string; notes: string }[];
}

interface DocSection {
  id: string;
  heading: string;
  body: string[];
  callout?: { variant: "info" | "warning"; text: string };
  endpoint?: DocEndpointSpec;
  code?: { title: string; content: string };
}

interface DocPageData {
  slug: string;
  group: string;
  title: string;
  summary: string;
  sections: DocSection[];
}

const DOC_PAGES: DocPageData[] = [
  {
    slug: "quick-start",
    group: "Get started",
    title: "Quick start",
    summary:
      "Add Mezgeb to an existing sign-up page in four steps, keeping your own database and login.",
    sections: [
      {
        id: "pick-template",
        heading: "1. Pick a template",
        body: [
          "Choose one of the four built-in templates (Learning platform, Job seeker, Employer sign-up, or Programme intake) or build a custom template in /templates.",
        ],
      },
      {
        id: "add-tag",
        heading: "2. Add the script tag",
        body: [
          "Drop the Mezgeb web component onto your sign-up page. It renders one question per screen with read-aloud, Ethiopian calendar, and offline autosave built in.",
        ],
        code: {
          title: "signup.html",
          content: `<script type="module" src="https://cdn.mezgeb.example/v1/mezgeb.js"></script>
<mezgeb-register site-key="pk_learnhub" lang="am"></mezgeb-register>`,
        },
      },
      {
        id: "server-endpoint",
        heading: "3. Add the server exchange endpoint",
        body: [
          "When the learner finishes, the page receives a one-time token (for example mzg_tok_7f3a...). Send that token to your server and exchange it using your secret key.",
        ],
        code: {
          title: "exchange.ts",
          content: `const res = await fetch("https://api.mezgeb.example/v1/registrations/exchange", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": \`Bearer \${process.env.MEZGEB_SECRET_KEY}\`,
  },
  body: JSON.stringify({ token }),
});
const profile = await res.json();`,
        },
      },
      {
        id: "test-and-launch",
        heading: "4. Test by keyboard and go live",
        body: [
          "Test the complete flow using Tab, Shift+Tab, Enter, Space, and Alt+H for help before switching your site key from pk_test_* to pk_live_*.",
        ],
      },
    ],
  },
  {
    slug: "how-it-works",
    group: "Get started",
    title: "How it works",
    summary:
      "Three ways for learners to sign up, and a one-time token exchange for platforms.",
    sections: [
      {
        id: "three-ways",
        heading: "Three ways to sign up, one confirmed profile",
        body: [
          "1. Type or listen: one question per screen in plain Amharic or English, icons, read-aloud on every question, a 'Show simpler words' toggle, pre-written offline Help (Alt+H) on every screen, no time-outs, and instant autosave.",
          "2. Speak: learners answer by voice in Amharic or English (including speaking to select options on choice screens) and always review and confirm the transcript before anything is saved.",
          "3. With a partner: learners choose 'A partner can vouch for me'; the profile records id_route: 'partner_pending' while the partner console shows only masked fields until the partner confirms identity ('partner_verified').",
        ],
      },
      {
        id: "token-flow",
        heading: "Step-by-step token exchange and offline outbox",
        body: [
          "Step 1: Learner completes Mezgeb on your sign-up page and sees a clear 'What happens next' screen before confirmation.",
          "Step 2: If the learner is offline, the completed profile is stored in the browser's IndexedDB outbox (mezgeb_offline_db) without unshared support needs and flushed automatically when connectivity returns.",
          "Step 3: Online, <mezgeb-register> receives a short-lived one-time token and sends it to your server.",
          "Step 4: Your server calls POST /v1/registrations/exchange with its secret key to retrieve only the fields the learner answered and create the user in your own database.",
        ],
      },
    ],
  },
  {
    slug: "embed",
    group: "Embed",
    title: "Embed",
    summary:
      "Add Mezgeb inline with the <mezgeb-register> element or launch it from a sign-up link.",
    sections: [
      {
        id: "web-component",
        heading: "Web component attributes",
        body: [
          "Use <mezgeb-register> when you want the one-question-per-screen flow rendered directly inside your own sign-up container.",
        ],
        code: {
          title: "embed.html",
          content: `<mezgeb-register
  site-key="pk_live_learnhub"
  template="learning-platform"
  lang="am"
  theme="light"
></mezgeb-register>`,
        },
      },
      {
        id: "theming",
        heading: "Theming and contrast protection",
        body: [
          "Mezgeb rejects accent colours below 4.5:1 contrast against white text. Primary action buttons remain solid black or high-contrast dark tones, and focus outlines stay 3px solid with a 2px offset.",
        ],
      },
    ],
  },
  {
    slug: "server-exchange",
    group: "Server exchange",
    title: "Server exchange",
    summary:
      "Exchange one-time registration tokens on your backend so personal data stays private.",
    sections: [
      {
        id: "exchange-endpoint",
        heading: "Token exchange endpoint",
        body: [
          "After the learner clicks Confirm, the browser receives a single-use token valid for five minutes. Call this endpoint from your server with your secret key.",
        ],
        callout: {
          variant: "warning",
          text: "Never put your sk_live_* secret key inside browser JavaScript or HTML.",
        },
        endpoint: {
          method: "POST",
          path: "/v1/registrations/exchange",
          requestFields: [
            { field: "token", type: "string", notes: "One-time token emitted by registration.completed" },
          ],
          responseFields: [
            { field: "id", type: "string", notes: "Stable Mezgeb profile ID" },
            { field: "name", type: "string", notes: "Confirmed learner name" },
            { field: "id_route", type: "string", notes: "fayda, refugee_id, other_document, or partner_pending" },
            { field: "support_shared", type: "boolean", notes: "True only when learner switched sharing ON" },
          ],
        },
        code: {
          title: "exchange-response.json",
          content: `{
  "id": "usr_8912a",
  "name": "Hana Tesfaye",
  "area": "lideta",
  "id_route": "partner_pending",
  "skills": ["Sales", "Bookkeeping"],
  "support_shared": false
}`,
        },
      },
    ],
  },
  {
    slug: "webhooks",
    group: "Server exchange",
    title: "Webhooks",
    summary:
      "Verify signed registration and profile update webhooks on your server.",
    sections: [
      {
        id: "webhook-verify",
        heading: "Verify X-Mezgeb-Signature",
        body: [
          "Mezgeb signs every webhook body with HMAC-SHA256 using your webhook secret. Verify the raw request body before updating your local user table.",
        ],
        code: {
          title: "webhook-handler.ts",
          content: `app.post("/webhooks/mezgeb", (req, res) => {
  const sig = req.header("X-Mezgeb-Signature");
  if (!verifyHmac(req.rawBody, sig, process.env.MEZGEB_WEBHOOK_SECRET)) {
    return res.status(401).end();
  }
  if (req.body.event === "registration.completed") {
    await db.users.upsert({ externalId: req.body.data.id, ...req.body.data });
  }
  res.status(200).json({ received: true });
});`,
        },
      },
    ],
  },
  {
    slug: "templates",
    group: "Templates",
    title: "Templates",
    summary:
      "Four starting templates designed with blind, Deaf, disabled, and displaced co-designers.",
    sections: [
      {
        id: "four-templates",
        heading: "Built-in templates",
        body: [
          "Learning platform: 8 questions plus review (language, name, area, phone, date of birth, four ID routes, private support needs, work story).",
          "Job board (job seeker): focuses on skills from stories, work goals, and interview support preferences.",
          "Employer sign-up: captures company details, hiring contact, and workplace accommodations offered.",
          "Programme intake: minimal fields with all four ID routes and partner registration enabled by default.",
        ],
      },
      {
        id: "schema",
        heading: "Question schema",
        body: [
          "Supported types: text, phone, date, choice, multichoice, id-routes, support, work-story, yes-no, email, number, info, consent.",
        ],
        code: {
          title: "question.json",
          content: `{
  "id": "dob",
  "type": "date",
  "label": { "am": "የተወለዱበት ቀን መቼ ነው?", "en": "When were you born?" },
  "icon": "calendar",
  "required": true,
  "maps_to": "date_of_birth"
}`,
        },
      },
    ],
  },
  {
    slug: "accessibility",
    group: "Accessibility",
    title: "Accessibility",
    summary:
      "WCAG 2.2 AA compliance, screen reader behaviour, and keyboard support.",
    sections: [
      {
        id: "testing-matrix",
        heading: "What is tested",
        body: [
          "Mezgeb is checked against WCAG 2.2 AA and automated axe-core rules (zero critical or serious issues), plus manual testing with NVDA, TalkBack, keyboard-only navigation, 200% zoom, 320px narrow viewports, and sound switched off.",
        ],
      },
      {
        id: "errors-and-focus",
        heading: "Read-aloud and error summaries",
        body: [
          "Every question includes a Read aloud button. Moving between widget steps moves focus to the new question heading and announces progress. Validation errors appear in an alert summary at the top of the card linked directly to each field.",
        ],
      },
    ],
  },
  {
    slug: "offline",
    group: "Offline",
    title: "Offline and privacy",
    summary:
      "AI is optional, self-hosted by default, and never sees learner answers during help requests.",
    sections: [
      {
        id: "three-levels",
        heading: "Three operating levels",
        body: [
          "1. Browser / No AI: typing, read-aloud, Ethiopian calendar, IndexedDB outbox, SMS resume links, and pre-written help for every error code run locally.",
          "2. Your server (default): speech transcription, skill suggestions, and optional help run on your own Docker host so learner audio and data never leave your infrastructure.",
          "3. Optional cloud: only enabled if explicitly configured by the platform administrator.",
        ],
      },
      {
        id: "privacy-rules",
        heading: "Privacy guarantees and opt-in sharing",
        body: [
          "The Help drawer (Alt+H) works offline using built-in guidance per error code and question type. When AI is on, requests include only field labels, types, button names, and error codes—never typed answers.",
          "Support-need sharing switches are OFF by default, kept in session memory only, and a 'Clear this device' button removes saved browser data immediately. Voice recordings are discarded immediately after transcription.",
        ],
      },
    ],
  },
  {
    slug: "self-hosting",
    group: "Self-hosting",
    title: "Self-hosting",
    summary: "Run Mezgeb with Docker Compose in lite or full profile.",
    sections: [
      {
        id: "profiles",
        heading: "Lite and full profiles",
        body: [
          "The lite profile runs the form service, token exchange API, and encrypted storage with AI switched off (MEZGEB_SPEECH=off, MEZGEB_AI=off).",
          "The full profile includes local speech transcription and local language assistance models.",
        ],
        code: {
          title: "docker-compose.sh",
          content: `docker compose --profile lite up -d
# Or with local speech & AI:
docker compose --profile full up -d`,
        },
      },
    ],
  },
  {
    slug: "api",
    group: "API reference",
    title: "API reference",
    summary:
      "Core endpoints, authentication with publishable vs secret keys, and JobPosting standards.",
    sections: [
      {
        id: "capabilities-endpoint",
        heading: "Check server AI and voice capabilities",
        body: [
          "Call GET /api/capabilities on boot to discover whether voice transcription, Smart Help, Skills AI, Simplify AI, and server read-aloud are available. Responses include voiceProvider and readAloudProviders per language (Addis AI, ElevenLabs, Gemini, or off).",
          "GET /v1/mezgeb.js serves the <mezgeb-register> web component. Full spec: /openapi.yaml.",
        ],
        endpoint: {
          method: "GET",
          path: "/api/capabilities",
          responseFields: [
            { field: "voice", type: "boolean", notes: "True if audio transcription endpoint is ready" },
            { field: "help", type: "boolean", notes: "True if optional Smart Help AI is configured" },
            { field: "simplify", type: "boolean", notes: "True if question simplification is enabled" },
          ],
        },
      },
      {
        id: "voice-endpoint",
        heading: "Transcribe voice answers",
        body: [
          "POST /api/ai/voice accepts short <=1 MB audio clips (16 kHz WAV preferred), discards audio immediately after transcription, and returns an editable transcript. By default Amharic uses Addis AI (when ADDIS_API_KEY is set) and English uses ElevenLabs (when ELEVENLABS_API_KEY is set); see README for MEZGEB_SPEECH overrides.",
        ],
        endpoint: {
          method: "POST",
          path: "/api/ai/voice",
        },
      },
      {
        id: "tts-endpoint",
        heading: "Read template text aloud",
        body: [
          "POST /api/tts returns MP3 audio for a question, hint, or error string (Amharic via Addis AI, English via ElevenLabs). Only template text is sent—never learner answers. MEZGEB_TTS=off forces the browser voice instead.",
        ],
        endpoint: {
          method: "POST",
          path: "/api/tts",
        },
      },
      {
        id: "outbox-endpoint",
        heading: "Flush offline registrations",
        body: [
          "Queued offline registrations are posted to POST /api/registrations/outbox as soon as connectivity returns.",
        ],
        endpoint: {
          method: "POST",
          path: "/api/registrations/outbox",
          requestFields: [
            { field: "id", type: "string", notes: "Client outbox item UUID" },
            { field: "templateId", type: "string", notes: "Template identifier" },
            { field: "profile", type: "object", notes: "Confirmed learner fields (excludes unshared support)" },
          ],
          responseFields: [
            { field: "ok", type: "boolean", notes: "True when saved" },
            { field: "token", type: "string", notes: "Exchange token for the platform server" },
          ],
        },
        code: {
          title: "outbox-flush.json",
          content: `{
  "ok": true,
  "token": "mzg_tok_offline_9102"
}`,
        },
      },
      {
        id: "jobposting",
        heading: "schema.org/JobPosting accommodations",
        body: [
          "Employers publish workplace adjustments inside standard JSON-LD so candidates can filter privately on their own device.",
        ],
        code: {
          title: "jobposting.jsonld",
          content: `{
  "@context": "https://schema.org/",
  "@type": "JobPosting",
  "title": "Junior data clerk",
  "jobBenefits": ["screen_reader", "extra_time", "flexible_hours"],
  "mezgebAccommodations": ["screen_reader", "extra_time", "flexible_hours"]
}`,
        },
      },
    ],
  },
];

const SLUG_ALIASES: Record<string, string> = {
  theming: "embed",
  schema: "templates",
  "ai-privacy": "offline",
  jobposting: "api",
  faq: "how-it-works",
};

const NAV_GROUPS = [
  "Get started",
  "Embed",
  "Server exchange",
  "Templates",
  "Accessibility",
  "Offline",
  "Self-hosting",
  "API reference",
];

export function DocsPage() {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const { t } = useI18n();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const normalizedSlug = slug && SLUG_ALIASES[slug] ? SLUG_ALIASES[slug] : slug;
  const activeIdx = DOC_PAGES.findIndex((d) => d.slug === normalizedSlug);
  const resolvedIdx = activeIdx >= 0 ? activeIdx : 0;
  const activeDoc = DOC_PAGES[resolvedIdx];
  const prevDoc = resolvedIdx > 0 ? DOC_PAGES[resolvedIdx - 1] : null;
  const nextDoc = resolvedIdx < DOC_PAGES.length - 1 ? DOC_PAGES[resolvedIdx + 1] : null;

  return (
    <Layout>
      <div className="bg-[var(--sand)] border-b border-[var(--line)] py-2.5 px-4 text-left sm:text-center text-xs font-medium text-[var(--ink)]">
        {t("docsBanner")}
      </div>

      <div className="mezgeb-container py-8 md:py-12">
        {/* Mobile docs menu disclosure (< 1024px) */}
        <div className="lg:hidden mb-6">
          <Button
            type="button"
            variant="secondary"
            fullWidth
            aria-expanded={sidebarOpen}
            aria-controls="docs-sidebar-nav"
            onClick={() => setSidebarOpen((v) => !v)}
            className="justify-between"
          >
            <span>
              {t("docsMenuBtn")}: {activeDoc.title}
            </span>
            <ChevronDown
              size={16}
              strokeWidth={1.75}
              aria-hidden="true"
              className={sidebarOpen ? "rotate-180" : ""}
            />
          </Button>
        </div>

        {/* 3-column layout: 240px left nav, minmax(0, 720px) article, 200px right TOC (>= 1280px) */}
        <div className="grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_200px] gap-10 items-start">
          {/* Left collapsible sidebar navigation */}
          <aside
            id="docs-sidebar-nav"
            className={`${sidebarOpen ? "block" : "hidden lg:block"} lg:sticky lg:top-24`}
          >
            <nav aria-label={t("docsNavTitle")} className="space-y-2">
              {NAV_GROUPS.map((group) => {
                const items = DOC_PAGES.filter((d) => d.group === group);
                if (items.length === 0) return null;
                return (
                  <details key={group} open className="group border-b border-[var(--line)] pb-2">
                    <summary className="list-none cursor-pointer py-1.5 px-2 text-xs font-semibold uppercase tracking-[0.06em] text-[var(--muted)] hover:text-[var(--ink)] flex items-center justify-between">
                      <span>{group}</span>
                      <ChevronDown
                        size={14}
                        strokeWidth={1.75}
                        aria-hidden="true"
                        className="group-open:rotate-180"
                      />
                    </summary>
                    <ul className="mt-1 space-y-0.5">
                      {items.map((doc) => {
                        const isActive = doc.slug === activeDoc.slug;
                        return (
                          <li key={doc.slug}>
                            <Link
                              to={`/docs/${doc.slug}`}
                              onClick={() => setSidebarOpen(false)}
                              aria-current={isActive ? "page" : undefined}
                              className={`block px-3 py-2 rounded-[8px] text-sm font-medium min-h-[38px] ${
                                isActive
                                  ? "bg-[var(--accent-soft)] text-[var(--ink)] font-semibold"
                                  : "text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--stone)]"
                              }`}
                            >
                              {doc.title}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </details>
                );
              })}
            </nav>
          </aside>

          {/* Main article (max 720px) */}
          <article className="min-w-0 max-w-[720px] space-y-6 text-left">
            <header className="space-y-3 pb-6 border-b border-[var(--line)]">
              <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--muted)]">
                {activeDoc.group}
              </p>
              <h1 className="mezgeb-display-heading text-[2rem] sm:text-[2.25rem] font-semibold text-[var(--ink)]">
                {activeDoc.title}
              </h1>
              <p className="text-base text-[var(--muted)] leading-[1.7]">
                {activeDoc.summary}
              </p>
            </header>

            <div>
              {activeDoc.sections.map((sec, idx) => (
                <section
                  key={sec.id}
                  aria-labelledby={sec.id}
                  className={`${idx === 0 ? "mt-2" : "mt-12"} space-y-4 scroll-mt-24`}
                >
                  <h2
                    id={sec.id}
                    className="group text-[1.375rem] font-semibold text-[var(--ink)] flex items-center gap-2"
                  >
                    <span>{sec.heading}</span>
                    <a
                      href={`#${sec.id}`}
                      aria-label={`Link to ${sec.heading}`}
                      className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-[var(--muted)] hover:text-[var(--accent)] p-1 rounded-[6px]"
                    >
                      <Hash size={16} strokeWidth={1.75} aria-hidden="true" />
                    </a>
                  </h2>

                  {sec.endpoint && (
                    <div className="p-3.5 rounded-[10px] border border-[var(--line)] bg-[var(--stone)] flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2.5 min-w-0">
                        <Badge variant={sec.endpoint.method === "POST" ? "accent" : "success"}>
                          {sec.endpoint.method}
                        </Badge>
                        <code className="font-mono text-sm text-[var(--ink)] break-all">
                          {sec.endpoint.path}
                        </code>
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        size="md"
                        onClick={() => navigate("/playground")}
                      >
                        {t("docsTryInPlayground")}
                      </Button>
                    </div>
                  )}

                  {sec.body.map((para, pIdx) => (
                    <p key={pIdx} className="text-base leading-[1.7] text-[var(--ink)]">
                      {para}
                    </p>
                  ))}

                  {sec.callout && (
                    <Banner variant={sec.callout.variant}>{sec.callout.text}</Banner>
                  )}

                  {sec.endpoint?.requestFields && (
                    <div className="space-y-2 pt-2">
                      <h3 className="text-sm font-semibold text-[var(--ink)]">
                        {t("docsEndpointReqTitle")}
                      </h3>
                      <Table
                        rows={sec.endpoint.requestFields}
                        getRowKey={(r) => `req-${r.field}`}
                        columns={[
                          {
                            key: "field",
                            header: "Field",
                            render: (r) => <code className="font-mono text-xs">{r.field}</code>,
                          },
                          {
                            key: "type",
                            header: "Type",
                            render: (r) => (
                              <span className="text-xs font-mono text-[var(--muted)]">
                                {r.type}
                              </span>
                            ),
                          },
                          {
                            key: "notes",
                            header: "Notes",
                            render: (r) => <span className="text-xs text-[var(--ink)]">{r.notes}</span>,
                          },
                        ]}
                      />
                    </div>
                  )}

                  {sec.endpoint?.responseFields && (
                    <div className="space-y-2 pt-2">
                      <h3 className="text-sm font-semibold text-[var(--ink)]">
                        {t("docsEndpointResTitle")}
                      </h3>
                      <Table
                        rows={sec.endpoint.responseFields}
                        getRowKey={(r) => `res-${r.field}`}
                        columns={[
                          {
                            key: "field",
                            header: "Field",
                            render: (r) => <code className="font-mono text-xs">{r.field}</code>,
                          },
                          {
                            key: "type",
                            header: "Type",
                            render: (r) => (
                              <span className="text-xs font-mono text-[var(--muted)]">
                                {r.type}
                              </span>
                            ),
                          },
                          {
                            key: "notes",
                            header: "Notes",
                            render: (r) => <span className="text-xs text-[var(--ink)]">{r.notes}</span>,
                          },
                        ]}
                      />
                    </div>
                  )}

                  {sec.code && (
                    <CodeBlock
                      filename={sec.code.title}
                      code={sec.code.content}
                      copyLabel={t("copyCodeBtn")}
                      copiedLabel={t("copiedButton")}
                      copiedAnnouncement={t("copiedAnnouncement")}
                    />
                  )}
                </section>
              ))}
            </div>

            {/* Previous / Next navigation */}
            <nav
              aria-label="Documentation pagination"
              className="mt-12 pt-6 border-t border-[var(--line)] grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <div>
                {prevDoc && (
                  <Link
                    to={`/docs/${prevDoc.slug}`}
                    className="inline-flex items-center gap-2 p-3 rounded-[10px] border border-[var(--line)] hover:bg-[var(--stone)] w-full text-left"
                  >
                    <ChevronLeft size={16} strokeWidth={1.75} aria-hidden="true" />
                    <span className="min-w-0">
                      <span className="block text-xs text-[var(--muted)]">
                        {t("docsPrevPage")}
                      </span>
                      <span className="block text-sm font-semibold text-[var(--ink)] truncate">
                        {prevDoc.title}
                      </span>
                    </span>
                  </Link>
                )}
              </div>
              <div className="sm:text-right">
                {nextDoc && (
                  <Link
                    to={`/docs/${nextDoc.slug}`}
                    className="inline-flex items-center justify-between sm:justify-end gap-2 p-3 rounded-[10px] border border-[var(--line)] hover:bg-[var(--stone)] w-full text-left sm:text-right"
                  >
                    <span className="min-w-0">
                      <span className="block text-xs text-[var(--muted)]">
                        {t("docsNextPage")}
                      </span>
                      <span className="block text-sm font-semibold text-[var(--ink)] truncate">
                        {nextDoc.title}
                      </span>
                    </span>
                    <ChevronRight size={16} strokeWidth={1.75} aria-hidden="true" />
                  </Link>
                )}
              </div>
            </nav>
          </article>

          {/* Right "On this page" sticky TOC (hidden under 1280px) */}
          <aside className="hidden xl:block sticky top-24">
            <nav aria-label={t("docsOnThisPage")} className="space-y-2 border-l border-[var(--line)] pl-4">
              <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--muted)]">
                {t("docsOnThisPage")}
              </p>
              <ul className="space-y-2 text-xs">
                {activeDoc.sections.map((sec) => (
                  <li key={sec.id}>
                    <a
                      href={`#${sec.id}`}
                      className="text-[var(--muted)] hover:text-[var(--ink)] block py-1 leading-snug"
                    >
                      {sec.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>
      </div>
    </Layout>
  );
}
