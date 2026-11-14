import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { useI18n } from "../i18n";

export type SiteHeaderVariant = "solid" | "overlay";

export function SiteHeader({ variant = "solid" }: { variant?: SiteHeaderVariant }) {
  const { lang, setLang, t } = useI18n();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const productRef = useRef<HTMLDivElement>(null);

  const overlay = variant === "overlay";

  useEffect(() => {
    setMenuOpen(false);
    setProductOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuBtnRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    if (!productOpen) return;
    const onClick = (e: MouseEvent) => {
      if (productRef.current && !productRef.current.contains(e.target as Node)) {
        setProductOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [productOpen]);

  const isNavActive = (path: string) => {
    if (path === "/docs/how-it-works") return location.pathname === "/docs/how-it-works";
    if (path === "/docs") {
      return (
        location.pathname === "/docs" ||
        (location.pathname.startsWith("/docs/") && location.pathname !== "/docs/how-it-works")
      );
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const productLinks = [
    { to: "/docs/how-it-works", label: t("navHowItWorks") },
    { to: "/templates", label: t("navTemplates") },
    { to: "/demo", label: t("navTryDemo") },
  ];

  const headerShell = overlay
    ? "absolute top-0 inset-x-0 z-50 bg-transparent border-transparent"
    : "md:sticky md:top-0 z-40 bg-[var(--paper)] border-b border-[var(--line)]";

  const textMuted = overlay ? "text-[var(--ink)]/70 hover:text-[var(--ink)]" : "text-[var(--muted)] hover:text-[var(--ink)]";
  const textInk = "text-[var(--ink)]";
  const glassBtn =
    "inline-flex items-center justify-center min-h-[40px] px-3.5 rounded-full text-sm font-medium border border-[var(--ink)]/15 bg-white/40 backdrop-blur-sm hover:bg-white/60 mezgeb-transition";
  const pilotBtn =
    "inline-flex items-center justify-center min-h-[40px] px-4 rounded-full text-sm font-medium border border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] hover:opacity-90 mezgeb-transition whitespace-nowrap";

  return (
    <>
      <a href="#main" className="skip-link">
        {t("skipToContent")}
      </a>

      <header className={headerShell}>
        <div className="mezgeb-container h-16 flex items-center justify-between gap-3 md:gap-5">
          <div className="flex items-center gap-5 md:gap-8 min-w-0">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 min-h-[44px] py-2 shrink-0 no-underline group"
            >
              <div className="w-8 h-8 bg-[var(--ink)] rounded-lg flex items-center justify-center text-white shadow-sm group-hover:bg-[var(--accent)] transition-colors">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" aria-hidden="true">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2.2" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2.2" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2.2" />
                  <circle cx="17.5" cy="17.5" r="3.5" stroke="currentColor" strokeWidth="2.2" />
                </svg>
              </div>
              <span className="hidden sm:flex flex-col leading-tight">
                <span className={`font-bold text-xl tracking-tight ${textInk}`}>{t("brandName")}</span>
                <span className="text-[11px] font-medium text-[var(--muted)]">{t("brandTagline")}</span>
              </span>
            </Link>

            <nav aria-label={t("navMainAria")} className="hidden lg:flex items-center gap-5">
              <div className="relative" ref={productRef}>
                <button
                  type="button"
                  aria-expanded={productOpen}
                  onClick={() => setProductOpen((p) => !p)}
                  className={`min-h-[44px] inline-flex items-center gap-1 text-[0.9375rem] font-medium ${textMuted}`}
                >
                  {t("navProduct")}
                  <ChevronDown size={16} className={productOpen ? "rotate-180" : ""} aria-hidden="true" />
                </button>
                {productOpen && (
                  <div className="absolute left-0 top-full mt-1 w-52 rounded-xl border border-[var(--line)] bg-[var(--paper)] shadow-lg p-1.5 z-50">
                    {productLinks.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="block px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--ink)] hover:bg-[var(--stone)]"
                        onClick={() => setProductOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                to="/#platforms"
                className={`min-h-[44px] inline-flex items-center text-[0.9375rem] font-medium whitespace-nowrap ${textMuted}`}
              >
                {t("navForPlatforms")}
              </Link>

              <Link
                to="/docs"
                aria-current={isNavActive("/docs") ? "page" : undefined}
                className={`min-h-[44px] inline-flex items-center text-[0.9375rem] font-medium whitespace-nowrap ${
                  isNavActive("/docs") ? `${textInk} underline decoration-2 underline-offset-6` : textMuted
                }`}
              >
                {t("navDocs")}
              </Link>

              <Link
                to="/playground"
                aria-current={isNavActive("/playground") ? "page" : undefined}
                className={`min-h-[44px] inline-flex items-center text-[0.9375rem] font-medium whitespace-nowrap ${
                  isNavActive("/playground") ? `${textInk} underline decoration-2 underline-offset-6` : textMuted
                }`}
              >
                {t("navPlayground")}
              </Link>

              <Link
                to="/partner"
                aria-current={isNavActive("/partner") ? "page" : undefined}
                className={`min-h-[44px] inline-flex items-center gap-1 text-[0.9375rem] font-medium whitespace-nowrap ${
                  isNavActive("/partner") ? `${textInk} underline decoration-2 underline-offset-6` : textMuted
                }`}
              >
                {t("navPartners")}
                <ChevronDown size={14} className="-rotate-90 opacity-60" aria-hidden="true" />
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div
              className={`inline-flex rounded-full border p-0.5 ${
                overlay ? "border-[var(--ink)]/15 bg-white/40 backdrop-blur-sm" : "border-[var(--line-strong)] bg-[var(--stone)]"
              }`}
              role="group"
              aria-label={t("langToggleLabel")}
            >
              <button
                type="button"
                lang="am"
                onClick={() => setLang("am")}
                aria-pressed={lang === "am"}
                className={`mezgeb-transition px-2 sm:px-2.5 min-h-[36px] rounded-full text-xs font-medium whitespace-nowrap cursor-pointer ${
                  lang === "am" ? "bg-[var(--paper)] text-[var(--ink)] shadow-sm" : textMuted
                }`}
              >
                {t("langAmharic")}
              </button>
              <button
                type="button"
                lang="en"
                onClick={() => setLang("en")}
                aria-pressed={lang === "en"}
                className={`mezgeb-transition px-2 sm:px-2.5 min-h-[36px] rounded-full text-xs font-medium whitespace-nowrap cursor-pointer ${
                  lang === "en" ? "bg-[var(--paper)] text-[var(--ink)] shadow-sm" : textMuted
                }`}
              >
                {t("langEnglish")}
              </button>
            </div>

            <Link to="/partner" className={`hidden md:inline-flex ${pilotBtn}`}>
              {t("navPilotCta")}
            </Link>

            <button
              ref={menuBtnRef}
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-menu"
              onClick={() => setMenuOpen((prev) => !prev)}
              className={`lg:hidden inline-flex items-center gap-1.5 min-h-[44px] px-3 rounded-full text-sm font-medium cursor-pointer ${glassBtn} ${textInk}`}
            >
              {menuOpen ? (
                <X size={20} strokeWidth={1.75} aria-hidden="true" />
              ) : (
                <Menu size={20} strokeWidth={1.75} aria-hidden="true" />
              )}
              <span className="sr-only sm:not-sr-only">{menuOpen ? t("navMenuClose") : t("navMenuOpen")}</span>
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav
            id="mobile-nav-menu"
            aria-label={t("navMobileAria")}
            className={`lg:hidden border-t px-4 py-3 space-y-1 ${
              overlay ? "border-[var(--ink)]/10 bg-white/80 backdrop-blur-md" : "border-[var(--line)] bg-[var(--paper)]"
            }`}
          >
            <p className="px-3 pt-1 pb-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              {t("navProduct")}
            </p>
            {productLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center min-h-[48px] px-3 rounded-[10px] text-base font-medium text-[var(--ink)] hover:bg-[var(--stone)]"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/#platforms"
              className="flex items-center min-h-[48px] px-3 rounded-[10px] text-base font-medium text-[var(--ink)] hover:bg-[var(--stone)]"
            >
              {t("navForPlatforms")}
            </Link>
            <Link
              to="/docs"
              className="flex items-center min-h-[48px] px-3 rounded-[10px] text-base font-medium text-[var(--ink)] hover:bg-[var(--stone)]"
            >
              {t("navDocs")}
            </Link>
            <Link
              to="/playground"
              className="flex items-center min-h-[48px] px-3 rounded-[10px] text-base font-medium text-[var(--ink)] hover:bg-[var(--stone)]"
            >
              {t("navPlayground")}
            </Link>
            <Link
              to="/partner"
              className="flex items-center min-h-[48px] px-3 rounded-[10px] text-base font-medium text-[var(--ink)] hover:bg-[var(--stone)]"
            >
              {t("navPartners")}
            </Link>
            <div className="pt-2">
              <Link to="/partner" className={`flex w-full justify-center ${pilotBtn} min-h-[48px]`}>
                {t("navPilotCta")}
              </Link>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}