import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useI18n } from "../i18n";
import { MezgebLogoMark } from "../components/Icons";

export interface SiteFooterProps {
  showFaq?: boolean;
  showGiantWordmark?: boolean;
}

export function SiteFooter({ showFaq = false, showGiantWordmark = false }: SiteFooterProps) {
  const { lang, setLang, t } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { q: t("faqQ1"), a: t("faqA1") },
    { q: t("faqQ2"), a: t("faqA2") },
    { q: t("faqQ3"), a: t("faqA3") },
    { q: t("faqQ4"), a: t("faqA4") },
    { q: t("faqQ5"), a: t("faqA5") },
    { q: t("faqQ6"), a: t("faqA6") },
    { q: t("faqQ7"), a: t("faqA7") },
    { q: t("faqQ8"), a: t("faqA8") },
  ];

  return (
    <section
      aria-labelledby={showFaq ? "faq-heading" : "footer-heading"}
      className="bg-[var(--night)] text-[var(--paper)] rounded-t-[40px] mt-16 overflow-hidden"
    >
      <div className="mezgeb-container px-4 sm:px-6 md:px-10 pt-16 md:pt-24 pb-12">
        {showFaq && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-20 border-b border-[var(--night-line)]">
            <div className="lg:col-span-5">
              <p className="text-sm font-medium text-[#C9B8F2] mb-3">{t("faqLabel")}</p>
              <h2
                id="faq-heading"
                className="text-3xl md:text-4xl font-semibold tracking-tight text-white leading-tight mb-4"
              >
                {t("faqHeadingLine1")}
                <br />
                {t("faqHeadingLine2")}
              </h2>
              <p className="text-[var(--night-muted)] text-base leading-relaxed max-w-sm mb-6">{t("faqSub")}</p>
              <a
                href="https://t.me/mezgeb_example"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-[#C9B8F2] underline underline-offset-4 min-h-[44px]"
              >
                {t("faqAskTelegram")} →
              </a>
            </div>

            <div className="lg:col-span-7 divide-y divide-[var(--night-line)] border-t border-b border-[var(--night-line)]">
              {faqs.map((item, idx) => {
                const isOpen = openIndex === idx;
                const panelId = `faq-panel-${idx}`;
                return (
                  <div key={idx}>
                    <h3>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setOpenIndex(isOpen ? null : idx)}
                        className="w-full py-5 flex items-center justify-between gap-4 text-left text-base md:text-lg font-medium text-white hover:text-[#C9B8F2] transition-colors min-h-[44px]"
                      >
                        <span>{item.q}</span>
                        <ChevronDown
                          size={18}
                          className={`shrink-0 text-[var(--night-muted)] transition-transform duration-200 ${
                            isOpen ? "rotate-180 text-[#C9B8F2]" : ""
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                    </h3>
                    <div
                      id={panelId}
                      hidden={!isOpen}
                      className="pb-5 pr-8 text-[15px] leading-relaxed text-[var(--night-muted)] max-w-[68ch]"
                    >
                      {item.a}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <footer className={showFaq ? "pt-16" : "pt-4"}>
          {!showFaq && (
            <h2 id="footer-heading" className="sr-only">
              Footer
            </h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-14">
            <div className="md:col-span-3">
              <Link to="/" className="inline-flex items-center gap-2.5 text-white font-bold text-xl tracking-tight">
                <MezgebLogoMark size={28} />
                <span>{t("brandName")}</span>
              </Link>
            </div>

            <div className="md:col-span-9 grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm">
              <div>
                <h3 className="font-semibold text-white mb-3">{t("footerCol1Title")}</h3>
                <ul className="space-y-2.5 text-[var(--night-muted)]">
                  <li>
                    <Link to="/docs/how-it-works" className="hover:text-white inline-block py-1 min-h-[32px]">
                      {t("footerCol1L1")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/demo" className="hover:text-white inline-block py-1 min-h-[32px]">
                      {t("footerCol1L2")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/profile" className="hover:text-white inline-block py-1 min-h-[32px]">
                      {t("footerCol1L3")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/accessibility" className="hover:text-white inline-block py-1 min-h-[32px]">
                      {t("footerCol1L4")}
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-3">{t("footerCol2Title")}</h3>
                <ul className="space-y-2.5 text-[var(--night-muted)]">
                  <li>
                    <Link to="/playground" className="hover:text-white inline-block py-1 min-h-[32px]">
                      {t("footerCol2L1")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/docs/quick-start" className="hover:text-white inline-block py-1 min-h-[32px]">
                      {t("footerCol2L2")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/docs/self-hosting" className="hover:text-white inline-block py-1 min-h-[32px]">
                      {t("footerCol2L3")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/templates" className="hover:text-white inline-block py-1 min-h-[32px]">
                      {t("footerCol2L4")}
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-3">{t("footerCol3Title")}</h3>
                <ul className="space-y-2.5 text-[var(--night-muted)]">
                  <li>
                    <Link to="/docs/ai-privacy" className="hover:text-white inline-block py-1 min-h-[32px]">
                      {t("footerCol3L1")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/docs/faq" className="hover:text-white inline-block py-1 min-h-[32px]">
                      {t("footerCol3L2")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/docs/ai-privacy" className="hover:text-white inline-block py-1 min-h-[32px]">
                      {t("footerCol3L3")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/docs/self-hosting" className="hover:text-white inline-block py-1 min-h-[32px]">
                      {t("footerCol3L4")}
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-3">{t("footerCol4Title")}</h3>
                <ul className="space-y-2.5 text-[var(--night-muted)]">
                  <li>
                    <a
                      href="https://t.me/mezgeb_example"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-white inline-block py-1 min-h-[32px]"
                    >
                      {t("footerCol4L1")}
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.linkedin.com"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-white inline-block py-1 min-h-[32px]"
                    >
                      {t("footerCol4L2")}
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/mezgeb/mezgeb"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-white inline-block py-1 min-h-[32px]"
                    >
                      {t("footerCol4L3")}
                    </a>
                  </li>
                  <li>
                    <a href="mailto:hello@mezgeb.example" className="hover:text-white inline-block py-1 min-h-[32px]">
                      {t("footerCol4L4")}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-[var(--night-line)] text-sm text-[var(--night-muted)]">
            <p className="max-w-2xl leading-relaxed">{t("footerOriginLine")}</p>
            <div className="flex items-center gap-4 shrink-0">
              <div
                className="inline-flex rounded-lg border border-white/15 p-0.5"
                role="group"
                aria-label={t("langToggleLabel")}
              >
                <button
                  type="button"
                  onClick={() => setLang("en")}
                  aria-pressed={lang === "en"}
                  className={`px-3 min-h-[38px] rounded-md text-xs font-medium transition-colors ${
                    lang === "en" ? "bg-white text-[var(--ink)]" : "text-[var(--night-muted)] hover:text-white"
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLang("am")}
                  aria-pressed={lang === "am"}
                  className={`px-3 min-h-[38px] rounded-md text-xs font-medium transition-colors ${
                    lang === "am" ? "bg-white text-[var(--ink)]" : "text-[var(--night-muted)] hover:text-white"
                  }`}
                >
                  አማርኛ
                </button>
              </div>
              <span className="whitespace-nowrap">{t("footerCopyright")}</span>
            </div>
          </div>
        </footer>
      </div>

      {showGiantWordmark && (
        <div className="relative select-none overflow-hidden pt-4 -mb-6 md:-mb-10" aria-hidden="true">
          <div className="text-center font-bold leading-none tracking-tight text-white/[0.06] text-[14vw] whitespace-nowrap">
            {t("brandWordmarkAm")}
          </div>
          <div className="text-center font-bold leading-[0.82] tracking-[-0.04em] text-white text-[22vw] -mt-[11vw] whitespace-nowrap">
            mezgeb
          </div>
        </div>
      )}
    </section>
  );
}