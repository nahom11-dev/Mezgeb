// Level 1 embed: <mezgeb-register>, loaded with one script tag.
//
//   <script type="module" src="https://YOUR-MEZGEB-SERVER/v1/mezgeb.js"></script>
//   <mezgeb-register site-key="pk_test_x" lang="am" platform-name="Savanna"></mezgeb-register>
//
// Attributes: site-key, lang (am|en), template, platform-name, ai ("off" turns AI off for this page),
// api-base (defaults to the server this script was loaded from).
// On completion it dispatches `mezgeb:complete` with ONLY a one-time token: the platform's server swaps
// it (plus its secret key) for the profile at POST /v1/registrations/exchange.
//
// TODO(audit): Remaining hackathon audit fixes 10, 11+12, 13 — checklist in /AUDIT_FIXES_TODO.md
//
// The widget renders inside a shadow root, so the host page's CSS (e.g. Bootstrap) and Mezgeb's CSS
// (Tailwind) cannot affect each other.
import React, { useEffect } from "react";
import { createRoot, Root } from "react-dom/client";
import { MezgebWidget } from "./components/MezgebWidget";
import { LiveAnnouncerProvider } from "./components/LiveAnnouncer";
import { I18nProvider, Lang, useI18n } from "./i18n";
import { setApiBase } from "./lib/apiBase";
import { attachEmbedOutboxSync } from "./lib/outboxSync";
import {
  EMPLOYER_TEMPLATE,
  JOB_APPLICATION_TEMPLATE,
  JOB_SEEKER_TEMPLATE,
  LEARNING_PLATFORM_TEMPLATE,
  PROGRAMME_INTAKE_TEMPLATE,
} from "./templates";
import rawCss from "./index.css?inline";

// rem is always relative to the HOST page's <html> font size (Savanna uses 14px), which a shadow root
// cannot isolate. Pin Mezgeb's sizes to a 16px base so it looks the same on every site; browser zoom
// still scales it (WCAG 1.4.4).
const css = rawCss.replace(/(-?\d*\.?\d+)rem\b/g, (_m, n: string) => `${+(parseFloat(n) * 16).toFixed(3)}px`);

const TEMPLATES = {
  "learning-platform": LEARNING_PLATFORM_TEMPLATE,
  "job-seeker": JOB_SEEKER_TEMPLATE,
  "employer-signup": EMPLOYER_TEMPLATE,
  "programme-intake": PROGRAMME_INTAKE_TEMPLATE,
  "job-application": JOB_APPLICATION_TEMPLATE,
} as const;

const SCRIPT_ORIGIN = (() => {
  try {
    return new URL(import.meta.url).origin;
  } catch {
    return "";
  }
})();

// Browsers ignore @property inside shadow roots, and Tailwind relies on it (shadows, rings, transforms).
// Register those rules once at document level; they only define --tw-* custom properties.
const PROPERTY_RULES = css.match(/@property\s+--[\w-]+\s*\{[^}]*\}/g) ?? [];
function ensureDocumentProperties() {
  if (!PROPERTY_RULES.length || document.getElementById("mezgeb-properties")) return;
  const style = document.createElement("style");
  style.id = "mezgeb-properties";
  style.textContent = PROPERTY_RULES.join("\n");
  document.head.appendChild(style);
}

function adoptStyles(shadow: ShadowRoot) {
  try {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(css);
    shadow.adoptedStyleSheets = [sheet];
  } catch {
    const style = document.createElement("style");
    style.textContent = css;
    shadow.appendChild(style);
  }
}

function InitialLang({ lang }: { lang: Lang }) {
  const { setLang } = useI18n();
  useEffect(() => {
    setLang(lang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);
  return null;
}

class MezgebRegister extends HTMLElement {
  static observedAttributes = ["lang", "ai", "template", "site-key", "platform-name", "api-base", "job-id", "job-title"];
  private root: Root | null = null;
  private detachOutboxSync: (() => void) | null = null;
  private outboxFlushNotice: { outboxId: string; token: string } | null = null;

  connectedCallback() {
    ensureDocumentProperties();
    const shadow = this.shadowRoot ?? this.attachShadow({ mode: "open" });
    if (!shadow.firstChild) {
      adoptStyles(shadow);
      const mount = document.createElement("div");
      mount.className = "mezgeb-root";
      shadow.appendChild(mount);
      this.root = createRoot(mount);
    }
    const siteKey = this.getAttribute("site-key") || "";
    this.detachOutboxSync?.();
    this.detachOutboxSync = attachEmbedOutboxSync(siteKey, (item) => {
      this.dispatchEvent(
        new CustomEvent("mezgeb:complete", {
          bubbles: true,
          composed: true,
          detail: { token: item.token, queued: true },
        })
      );
      this.outboxFlushNotice = { outboxId: item.outboxId, token: item.token };
      this.renderWidget();
    });
    this.renderWidget();
  }

  disconnectedCallback() {
    this.detachOutboxSync?.();
    this.detachOutboxSync = null;
    this.root?.unmount();
    this.root = null;
    if (this.shadowRoot) this.shadowRoot.replaceChildren();
  }

  attributeChangedCallback() {
    if (this.root) this.renderWidget();
  }

  private renderWidget() {
    setApiBase(this.getAttribute("api-base") || SCRIPT_ORIGIN);
    const lang: Lang = this.getAttribute("lang") === "am" ? "am" : "en";
    const aiOff = (this.getAttribute("ai") || "").toLowerCase() === "off";
    const key = (this.getAttribute("template") || "learning-platform") as keyof typeof TEMPLATES;
    const template = TEMPLATES[key] ?? LEARNING_PLATFORM_TEMPLATE;
    const platformName = this.getAttribute("platform-name") || undefined;
    const jobId = this.getAttribute("job-id") || undefined;
    const jobTitle = this.getAttribute("job-title") || undefined;
    const offerRememberSupport = key === "job-application" || key === "job-seeker";
    const resume = new URLSearchParams(window.location.search).get("resume");
    const outboxFlushNotice = this.outboxFlushNotice;

    this.root!.render(
      <I18nProvider setDocumentLang={false}>
        <LiveAnnouncerProvider>
          <InitialLang lang={lang} />
          <MezgebWidget
            template={template}
            aiEnabled={!aiOff}
            offline={false}
            platformName={platformName}
            resumeIdParam={resume}
            shortcutScope="widget"
            siteKey={this.getAttribute("site-key") || ""}
            jobId={jobId}
            jobTitle={jobTitle}
            offerRememberSupportLocal={offerRememberSupport}
            persistProfile={false}
            outboxFlushNotice={outboxFlushNotice}
            onEvent={(event) => {
              if (event.name === "step.completed") {
                this.dispatchEvent(
                  new CustomEvent("mezgeb:step", {
                    bubbles: true,
                    composed: true,
                    detail: event.payload,
                  })
                );
              }
            }}
            onComplete={(result) => {
              if (!result.token) return;
              if (result.supportToken) {
                this.dispatchEvent(
                  new CustomEvent("mezgeb:support", {
                    bubbles: true,
                    composed: true,
                    detail: { token: result.supportToken },
                  })
                );
              }
              this.dispatchEvent(
                new CustomEvent("mezgeb:complete", {
                  bubbles: true,
                  composed: true,
                  detail: { token: result.token, ...(result.outboxId ? { queued: true, outboxId: result.outboxId } : {}) },
                })
              );
            }}
          />
        </LiveAnnouncerProvider>
      </I18nProvider>
    );
  }
}

if (!customElements.get("mezgeb-register")) {
  customElements.define("mezgeb-register", MezgebRegister);
}
