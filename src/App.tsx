import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { LiveAnnouncerProvider } from "./components/LiveAnnouncer";
import { I18nProvider } from "./i18n";
import { AccessibilityPage } from "./pages/AccessibilityPage";
import { DemoPage } from "./pages/DemoPage";
import { DocsPage } from "./pages/DocsPage";
import { JobsPage } from "./pages/JobsPage";
import { LandingPage } from "./pages/LandingPage";
import { PartnerPage } from "./pages/PartnerPage";
import { PlaygroundPage } from "./pages/PlaygroundPage";
import { ProfilePage } from "./pages/ProfilePage";
import { TemplateBuilderPage } from "./pages/TemplateBuilderPage";
import { TemplatesPage } from "./pages/TemplatesPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <I18nProvider>
      <LiveAnnouncerProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/demo" element={<DemoPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/partner" element={<PartnerPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/accessibility" element={<AccessibilityPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/templates/builder" element={<TemplateBuilderPage />} />
            <Route path="/playground" element={<PlaygroundPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/docs/:slug" element={<DocsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </LiveAnnouncerProvider>
    </I18nProvider>
  );
}
