import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useI18n } from "../i18n";
import { AccessibleDialog } from "./AccessibleDialog";
import { FaqFooterSection } from "./FaqFooterSection";
import { CheckIcon, MezgebLogoMark } from "./Icons";
import { safeSetStorage } from "../lib/storage";

export function Layout({
  children,
  showFaqInFooter = false,
}: {
  children: React.ReactNode;
  showFaqInFooter?: boolean;
}) {
  const { lang, setLang, t } = useI18n();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [pilotOpen, setPilotOpen] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  // Pilot form state
  const [pilotOrg, setPilotOrg] = useState("");
  const [pilotContact, setPilotContact] = useState("");
  const [pilotType, setPilotType] = useState("training");
  const [pilotNotes, setPilotNotes] = useState("");
  const [pilotError, setPilotError] = useState("");
  const [pilotSubmitted, setPilotSubmitted] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Escape closes mobile menu and returns focus
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

  const handlePilotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pilotOrg.trim() || !pilotContact.trim()) {
      setPilotError(t("pilotErrorRequired"));
      return;
    }
    setPilotError("");
    safeSetStorage(
      "mezgeb_pilot_request",
      JSON.stringify({
        org: pilotOrg.trim(),
        contact: pilotContact.trim(),
        type: pilotType,
        notes: pilotNotes.trim(),
        createdAt: new Date().toISOString(),
      })
    );
    setPilotSubmitted(true);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-[15px] font-medium whitespace-nowrap shrink-0 py-2 border-b-2 transition-colors ${
      isActive
        ? "text-[#111111] border-[#6A4FC4]"
        : "text-[#6B6B6B] border-transparent hover:text-[#111111]"
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111111]">
      <a href="#main-content" className="skip-link">
        {t("skipToContent")}
      </a>

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#E7E7E4]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 h-16 flex items-center justify-between gap-4 md:gap-8">
          {/* Zone 1: Logo + wordmark */}
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 text-[#111111] font-bold text-xl tracking-tight whitespace-nowrap shrink-0 min-h-[44px]"
          >
            <MezgebLogoMark size={28} />
            <span>{t("brandName")}</span>
          </Link>

          {/* Zone 2: Desktop nav links */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-7">
            <NavLink to="/demo" className={navLinkClass}>
              {t("navDemo")}
            </NavLink>
            <NavLink to="/jobs" className={navLinkClass}>
              {t("navJobs")}
            </NavLink>
            <NavLink to="/templates" className={navLinkClass}>
              {t("navTemplates")}
            </NavLink>
            <NavLink to="/playground" className={navLinkClass}>
              {t("navPlayground")}
            </NavLink>
            <NavLink to="/docs" className={navLinkClass}>
              {t("navDocs")}
            </NavLink>
          </nav>

          {/* Zone 3: Language toggle + Pilot CTA + Mobile Menu disclosure */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div
              className="inline-flex rounded-lg border border-[#E7E7E4] bg-[#F5F5F3] p-0.5"
              role="group"
              aria-label={t("langToggleLabel")}
            >
              <button
                type="button"
                onClick={() => setLang("en")}
                aria-pressed={lang === "en"}
                className={`px-2.5 min-h-[36px] rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                  lang === "en" ? "bg-white text-[#111111] shadow-xs" : "text-[#6B6B6B] hover:text-[#111111]"
                }`}
              >
                {t("langEnglish")}
              </button>
              <button
                type="button"
                onClick={() => setLang("am")}
                aria-pressed={lang === "am"}
                className={`px-2.5 min-h-[36px] rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                  lang === "am" ? "bg-white text-[#111111] shadow-xs" : "text-[#6B6B6B] hover:text-[#111111]"
                }`}
              >
                {t("langAmharic")}
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setPilotSubmitted(false);
                setPilotError("");
                setPilotOpen(true);
              }}
              className="hidden sm:inline-flex mezgeb-btn-primary whitespace-nowrap shrink-0"
            >
              {t("navPilotCta")}
            </button>

            <button
              ref={menuBtnRef}
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-menu"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="md:hidden mezgeb-btn-secondary px-3.5 text-sm whitespace-nowrap shrink-0"
            >
              {menuOpen ? t("navMenuClose") : t("navMenuOpen")}
            </button>
          </div>
        </div>

        {/* Mobile disclosure menu */}
        {menuOpen && (
          <nav
            id="mobile-nav-menu"
            aria-label="Mobile navigation"
            className="md:hidden border-t border-[#E7E7E4] bg-white px-4 py-4 space-y-2"
          >
            <Link
              to="/demo"
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-[#111111] hover:bg-[#F5F5F3]"
            >
              {t("navDemo")}
            </Link>
            <Link
              to="/jobs"
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-[#111111] hover:bg-[#F5F5F3]"
            >
              {t("navJobs")}
            </Link>
            <Link
              to="/templates"
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-[#111111] hover:bg-[#F5F5F3]"
            >
              {t("navTemplates")}
            </Link>
            <Link
              to="/playground"
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-[#111111] hover:bg-[#F5F5F3]"
            >
              {t("navPlayground")}
            </Link>
            <Link
              to="/docs"
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-[#111111] hover:bg-[#F5F5F3]"
            >
              {t("navDocs")}
            </Link>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setPilotSubmitted(false);
                  setPilotError("");
                  setPilotOpen(true);
                }}
                className="w-full mezgeb-btn-primary"
              >
                {t("navPilotCta")}
              </button>
            </div>
          </nav>
        )}
      </header>

      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>

      <FaqFooterSection showFaq={showFaqInFooter} />

      <AccessibleDialog
        open={pilotOpen}
        onClose={() => setPilotOpen(false)}
        title={t("pilotDialogTitle")}
        maxWidthClass="max-w-lg"
      >
        {pilotSubmitted ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-[#E4F2EC] text-[#1F5C46]">
              <span className="mt-0.5 inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1F5C46] text-white shrink-0">
                <CheckIcon size={14} />
              </span>
              <div>
                <p className="font-semibold">{t("pilotSuccessTitle")}</p>
                <p className="text-sm mt-1">{t("pilotSuccessBody")}</p>
              </div>
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={() => setPilotOpen(false)} className="mezgeb-btn-primary">
                {t("closeButton")}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePilotSubmit} className="space-y-4" noValidate>
            <p className="text-sm text-[#6B6B6B]">{t("pilotDialogDesc")}</p>
            {pilotError && (
              <div
                role="alert"
                className="p-3 rounded-lg border border-red-300 bg-red-50 text-sm text-red-900"
              >
                {pilotError}
              </div>
            )}
            <div>
              <label htmlFor="pilot-org" className="block text-sm font-medium text-[#111111] mb-1.5">
                {t("pilotOrgLabel")}
              </label>
              <input
                id="pilot-org"
                type="text"
                value={pilotOrg}
                onChange={(e) => setPilotOrg(e.target.value)}
                required
                className="w-full min-h-[44px] px-3.5 rounded-lg border border-[#E7E7E4] text-base text-[#111111]"
              />
            </div>
            <div>
              <label htmlFor="pilot-contact" className="block text-sm font-medium text-[#111111] mb-1.5">
                {t("pilotEmailLabel")}
              </label>
              <input
                id="pilot-contact"
                type="text"
                value={pilotContact}
                onChange={(e) => setPilotContact(e.target.value)}
                required
                className="w-full min-h-[44px] px-3.5 rounded-lg border border-[#E7E7E4] text-base text-[#111111]"
              />
            </div>
            <div>
              <label htmlFor="pilot-type" className="block text-sm font-medium text-[#111111] mb-1.5">
                {t("pilotTypeLabel")}
              </label>
              <select
                id="pilot-type"
                value={pilotType}
                onChange={(e) => setPilotType(e.target.value)}
                className="w-full min-h-[44px] px-3.5 rounded-lg border border-[#E7E7E4] bg-white text-base text-[#111111]"
              >
                <option value="training">{t("pilotTypeTraining")}</option>
                <option value="jobs">{t("pilotTypeJobs")}</option>
                <option value="ngo">{t("pilotTypeNgo")}</option>
                <option value="other">{t("pilotTypeOther")}</option>
              </select>
            </div>
            <div>
              <label htmlFor="pilot-notes" className="block text-sm font-medium text-[#111111] mb-1.5">
                {t("pilotNotesLabel")}
              </label>
              <textarea
                id="pilot-notes"
                rows={3}
                value={pilotNotes}
                onChange={(e) => setPilotNotes(e.target.value)}
                className="w-full p-3.5 rounded-lg border border-[#E7E7E4] text-base text-[#111111]"
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button type="button" onClick={() => setPilotOpen(false)} className="mezgeb-btn-secondary">
                {t("cancelButton")}
              </button>
              <button type="submit" className="mezgeb-btn-primary">
                {t("pilotSubmit")}
              </button>
            </div>
          </form>
        )}
      </AccessibleDialog>
    </div>
  );
}
