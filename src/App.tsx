import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { LiveAnnouncerProvider } from "./components/LiveAnnouncer";
import { I18nProvider } from "./i18n";
import { AppErrorBoundary, NotFoundPage, OfflineFallbackPage } from "./pages/SystemPages";
import { PageLoadingSkeleton } from "./ui";

const LandingPage = lazy(() =>
  import("./pages/LandingPage").then((m) => ({ default: m.LandingPage }))
);
const DemoPage = lazy(() =>
  import("./pages/DemoPage").then((m) => ({ default: m.DemoPage }))
);
const JobsPage = lazy(() =>
  import("./pages/JobsPage").then((m) => ({ default: m.JobsPage }))
);
const EmployerAccommodationsPage = lazy(() =>
  import("./pages/EmployerAccommodationsPage").then((m) => ({
    default: m.EmployerAccommodationsPage,
  }))
);
const PartnerPage = lazy(() =>
  import("./pages/PartnerPage").then((m) => ({ default: m.PartnerPage }))
);
const ProfilePage = lazy(() =>
  import("./pages/ProfilePage").then((m) => ({ default: m.ProfilePage }))
);
const AccessibilityPage = lazy(() =>
  import("./pages/AccessibilityPage").then((m) => ({ default: m.AccessibilityPage }))
);
const TemplatesPage = lazy(() =>
  import("./pages/TemplatesPage").then((m) => ({ default: m.TemplatesPage }))
);
const TemplateDetailPage = lazy(() =>
  import("./pages/TemplateDetailPage").then((m) => ({ default: m.TemplateDetailPage }))
);
const TemplateBuilderPage = lazy(() =>
  import("./pages/TemplateBuilderPage").then((m) => ({ default: m.TemplateBuilderPage }))
);
const PlaygroundPage = lazy(() =>
  import("./pages/PlaygroundPage").then((m) => ({ default: m.PlaygroundPage }))
);
const DocsPage = lazy(() =>
  import("./pages/DocsPage").then((m) => ({ default: m.DocsPage }))
);

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
          <AppErrorBoundary>
            <Suspense fallback={<PageLoadingSkeleton />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/demo" element={<DemoPage />} />
                <Route path="/jobs" element={<JobsPage />} />
                <Route path="/employers/accommodations" element={<EmployerAccommodationsPage />} />
                <Route path="/partner" element={<PartnerPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/accessibility" element={<AccessibilityPage />} />
                <Route path="/templates" element={<TemplatesPage />} />
                <Route path="/templates/builder" element={<TemplateBuilderPage />} />
                <Route path="/templates/:id/edit" element={<TemplateBuilderPage />} />
                <Route path="/templates/:id" element={<TemplateDetailPage />} />
                <Route path="/playground" element={<PlaygroundPage />} />
                <Route path="/docs" element={<DocsPage />} />
                <Route path="/docs/:slug" element={<DocsPage />} />
                <Route path="/offline" element={<OfflineFallbackPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </AppErrorBoundary>
        </BrowserRouter>
      </LiveAnnouncerProvider>
    </I18nProvider>
  );
}
