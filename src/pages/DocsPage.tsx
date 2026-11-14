import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CopyIcon } from "../components/Icons";
import { Layout } from "../components/Layout";
import { useLiveAnnouncer } from "../components/LiveAnnouncer";
import { useI18n } from "../i18n";

interface DocSection {
  id: string;
  heading: string;
  body: string[];
  code?: { title: string; content: string };
}

interface DocPageData {
  slug: string;
  title: string;
  summary: string;
  sections: DocSection[];
}

const DOC_PAGES: DocPageData[] = [
  {
    slug: "quick-start",
    title: "Quick start",
    summary: "Add Mezgeb to an existing sign-up page in five steps, keeping your own database and login.",
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
    title: "How it works",
    summary: "Three ways for learners to sign up, and a simple one-time token exchange for platforms.",
    sections: [
      {
        id: "three-ways",
        heading: "Three ways to sign up, one confirmed profile",
        body: [
          "1. Type or listen: one question per screen in plain Amharic or English, icons, read-aloud on every question, a 'Say it more simply' toggle, pre-written offline Help (Alt+H) on every screen, no time-outs, and instant autosave.",
          "2. Speak: learners answer by voice in Amharic or English (including speaking to select options on choice screens) and always review and confirm the transcript before anything is saved.",
          "3. With a partner: learners choose 'Refer me through a partner'; the profile records id_route: 'partner_pending' while the partner console shows only masked fields until the partner confirms identity ('partner_verified').",
        ],
      },
      {
        id: "token-flow",
        heading: "Step-by-step token exchange & offline outbox",
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
    slug: "templates",
    title: "Templates",
    summary: "Four starting templates designed with blind, Deaf, disabled, and displaced co-designers.",
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
        id: "customising",
        heading: "Customising templates",
        body: [
          "Keep one question per screen. Never combine two unrelated inputs on one step, and never request medical proof or diagnoses for support requests.",
        ],
      },
    ],
  },
  {
    slug: "schema",
    title: "Form schema reference",
    summary: "JSON structure for Mezgeb form templates and question types.",
    sections: [
      {
        id: "question-types",
        heading: "Supported question types",
        body: [
          "text, phone, date (Ethiopian calendar default with Gregorian toggle), choice, multichoice, id-routes (Fayda, Refugee ID, Other document, Partner refer), support (encrypted private accommodations), and work-story.",
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
    slug: "theming",
    title: "Theming",
    summary: "Customise accent colours and fonts while preserving WCAG 2.2 AA contrast.",
    sections: [
      {
        id: "contrast-protection",
        heading: "How contrast is protected",
        body: [
          "Mezgeb rejects accent colours below 4.5:1 contrast against white text. Primary action buttons remain solid black (#111111) or high-contrast dark tones, and focus outlines remain 3px solid #6A4FC4 with a 2px offset.",
        ],
      },
      {
        id: "fonts",
        heading: "Typography",
        body: [
          "Latin text uses Inter (minimum 16px body, never smaller than 13px). Amharic text uses Noto Sans Ethiopic with line height 1.75 so Ethiopic ascenders and descenders never collide.",
        ],
      },
    ],
  },
  {
    slug: "accessibility",
    title: "Accessibility",
    summary: "WCAG 2.2 AA compliance, screen reader behaviour, and keyboard support.",
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
          "Every question includes a Read aloud button. Validation errors appear in an alert summary at the top of the card that receives keyboard focus on submit, linked directly to each field via aria-describedby.",
        ],
      },
    ],
  },
  {
    slug: "ai-privacy",
    title: "AI, privacy and low network",
    summary: "AI is optional, self-hosted by default, and never sees learner answers during help requests.",
    sections: [
      {
        id: "three-levels",
        heading: "Three operating levels",
        body: [
          "1. Browser / No AI: everything works offline or with AI switched off. Typing, read-aloud, Ethiopian calendar, IndexedDB outbox, SMS resume links, and pre-written help for every error code run locally.",
          "2. Your server (default): speech transcription, skill suggestions, and optional help run on your own Docker host so learner audio and data never leave your infrastructure.",
          "3. Optional cloud: only enabled if explicitly configured by the platform administrator.",
        ],
      },
      {
        id: "privacy-rules",
        heading: "Privacy guarantees and opt-in sharing",
        body: [
          "The Help drawer (Alt+H) works offline using built-in guidance per error code and question type. When AI is on, requests include only field labels, types, button names, and error codes—never typed answers.",
          "Support-need sharing switches are OFF by default, kept in session memory only (never written to localStorage), and a 'Clear this device' button removes saved browser data immediately. Voice recordings are discarded immediately after transcription.",
        ],
      },
    ],
  },
  {
    slug: "self-hosting",
    title: "Self-hosting",
    summary: "Run Mezgeb with Docker Compose in lite or full profile.",
    sections: [
      {
        id: "profiles",
        heading: "Lite and full profiles",
        body: [
          "The lite profile runs the form service, token exchange API, and encrypted storage with AI switched off (MEZGEB_SPEECH=off, MEZGEB_AI=off).",
          "The full profile includes local speech transcription and local language assistance models. Exact hardware sizing is to be measured against your expected concurrent learners.",
        ],
        code: {
          title: "docker-compose",
          content: `docker compose --profile lite up -d
# Or with local speech & AI:
docker compose --profile full up -d`,
        },
      },
    ],
  },
  {
    slug: "api",
    title: "REST API",
    summary: "Core endpoints, authentication with publishable vs secret keys, and webhook events.",
    sections: [
      {
        id: "auth",
        heading: "Publishable vs secret keys",
        body: [
          "Publishable keys (pk_*) are safe in HTML <mezgeb-register> attributes. Secret keys (sk_*) must only be used from your server to exchange tokens or manage forms.",
        ],
      },
      {
        id: "endpoints",
        heading: "Endpoints",
        body: [
          "GET /api/capabilities — check whether voice transcription, Smart Help, Skills AI, and Simplify AI are available on the running server.",
          "POST /v1/registrations/exchange — exchange a one-time registration token for the confirmed profile.",
          "POST /api/registrations/outbox — flush queued offline registrations upon reconnection.",
          "POST /api/ai/voice — transcribe short <=1 MB audio clips (or match choice options), discarding audio immediately after.",
          "POST /api/ai/simplify — rewrite a question in simpler wording (falls back to the template hint).",
        ],
        code: {
          title: "POST /v1/registrations/exchange",
          content: `{
  "id": "usr_8912a",
  "name": "Hana",
  "area": "Lideta",
  "id_route": "partner_pending",
  "partner_org": "Addis Accessibility Centre (sample)",
  "skills": ["Sales", "Bookkeeping"],
  "support_shared": false
}`,
        },
      },
    ],
  },
  {
    slug: "jobposting",
    title: "JobPosting",
    summary: "Publish employer workplace accommodations using standard schema.org/JobPosting.",
    sections: [
      {
        id: "schema-org",
        heading: "Structured accommodations for private job filtering",
        body: [
          "Employers declare offered accommodations in /jobs ('For employers'). Mezgeb publishes them inside standard JSON-LD (jobBenefits and mezgebAccommodations) so candidates can filter privately without disclosing their own needs before applying.",
        ],
        code: {
          title: "jobposting.jsonld",
          content: `{
  "@context": "https://schema.org/",
  "@type": "JobPosting",
  "title": "Junior data clerk",
  "hiringOrganization": { "@type": "Organization", "name": "Example Logistics" },
  "jobBenefits": ["screen_reader", "extra_time", "flexible_hours"],
  "mezgebAccommodations": ["screen_reader", "extra_time", "flexible_hours"]
}`,
        },
      },
    ],
  },
  {
    slug: "faq",
    title: "FAQ",
    summary: "Common questions from learners, partner organisations, and platform teams.",
    sections: [
      {
        id: "questions",
        heading: "Frequently asked questions",
        body: [
          "Does a learner need a Fayda ID? No. Learners can use Fayda, a refugee ID or another document, or choose 'Refer me' so a partner organisation can vouch for them.",
          "Which languages does Mezgeb support? Amharic and English today. Afaan Oromo, Tigrinya and Somali are planned.",
          "Does the AI see what learners type? No. The help assistant reads the page's labels and error messages, never the learner's answers.",
          "What happens to voice recordings? They are deleted as soon as they are written down.",
          "Do learners have to disclose a disability? No. Learners describe practical needs with no diagnosis or medical proof asked.",
        ],
      },
    ],
  },
];

export function DocsPage() {
  const { slug } = useParams<{ slug?: string }>();
  const { t } = useI18n();
  const { announce } = useLiveAnnouncer();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeDoc = DOC_PAGES.find((d) => d.slug === slug) ?? DOC_PAGES[0];

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore
    }
    setCopiedId(id);
    announce(t("copiedAnnouncement"));
    window.setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Layout>
      <div className="bg-[#F9F3EA] border-b border-[#E7E7E4] py-2.5 px-4 text-center text-xs font-medium text-[#111111]">
        {t("docsBanner")}
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 py-10 md:py-14">
        {/* Mobile docs menu disclosure */}
        <div className="lg:hidden mb-6">
          <button
            type="button"
            aria-expanded={sidebarOpen}
            aria-controls="docs-sidebar-nav"
            onClick={() => setSidebarOpen((v) => !v)}
            className="mezgeb-btn-secondary w-full justify-between"
          >
            <span>{t("docsMenuBtn")}</span>
            <span>{activeDoc.title}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left sidebar navigation */}
          <aside
            id="docs-sidebar-nav"
            className={`lg:col-span-3 ${sidebarOpen ? "block" : "hidden lg:block"}`}
          >
            <nav aria-label={t("docsNavTitle")} className="space-y-1">
              <p className="text-xs font-semibold text-[#6B6B6B] px-3 pb-2">{t("docsNavTitle")}</p>
              {DOC_PAGES.map((doc) => {
                const isActive = doc.slug === activeDoc.slug;
                return (
                  <Link
                    key={doc.slug}
                    to={`/docs/${doc.slug}`}
                    onClick={() => setSidebarOpen(false)}
                    className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[#EEEBF8] text-[#111111] font-semibold"
                        : "text-[#6B6B6B] hover:text-[#111111] hover:bg-[#F5F5F3]"
                    }`}
                  >
                    {doc.title}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main article */}
          <article className="lg:col-span-6 space-y-8 min-w-0">
            <header className="space-y-2 pb-6 border-b border-[#E7E7E4]">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#111111]">
                {activeDoc.title}
              </h1>
              <p className="text-base text-[#6B6B6B] leading-relaxed">{activeDoc.summary}</p>
            </header>

            <div className="space-y-10">
              {activeDoc.sections.map((sec) => (
                <section key={sec.id} aria-labelledby={sec.id} className="space-y-3 scroll-mt-24">
                  <h2 id={sec.id} className="text-xl font-semibold text-[#111111]">
                    {sec.heading}
                  </h2>
                  {sec.body.map((para, idx) => (
                    <p key={idx} className="text-[15px] leading-relaxed text-[#111111]/85">
                      {para}
                    </p>
                  ))}
                  {sec.code && (
                    <div className="rounded-xl bg-[#161616] text-white overflow-hidden mt-3">
                      <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between text-xs text-[#9B9B9B]">
                        <span className="font-mono">{sec.code.title}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(`${activeDoc.slug}-${sec.id}`, sec.code!.content)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 text-white hover:bg-white/20 text-xs font-medium"
                        >
                          <CopyIcon size={12} />
                          <span>
                            {copiedId === `${activeDoc.slug}-${sec.id}`
                              ? t("copiedButton")
                              : t("copyButton")}
                          </span>
                        </button>
                      </div>
                      <pre className="p-4 text-xs font-mono leading-relaxed overflow-x-auto text-[#E4F2EC]">
                        <code>{sec.code.content}</code>
                      </pre>
                    </div>
                  )}
                </section>
              ))}
            </div>
          </article>

          {/* Right "On this page" TOC */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24">
            <nav aria-label={t("docsOnThisPage")} className="space-y-2 border-l border-[#E7E7E4] pl-4">
              <p className="text-xs font-semibold text-[#6B6B6B]">{t("docsOnThisPage")}</p>
              <ul className="space-y-2 text-xs">
                {activeDoc.sections.map((sec) => (
                  <li key={sec.id}>
                    <a
                      href={`#${sec.id}`}
                      className="text-[#6B6B6B] hover:text-[#111111] block py-0.5"
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
