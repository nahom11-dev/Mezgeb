import React from "react";
import { Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { useI18n } from "../i18n";
import { Button, EmptyState } from "../ui";

export function NotFoundPage() {
  const { t } = useI18n();
  return (
    <Layout>
      <section aria-labelledby="not-found-heading" className="py-16 md:py-24 bg-[var(--paper)]">
        <div className="mezgeb-container max-w-[720px]">
          <h1 id="not-found-heading" className="sr-only">
            {t("sys404Title")}
          </h1>
          <EmptyState
            title={t("sys404Title")}
            description={t("sys404Desc")}
            action={
              <Link
                to="/"
                className="inline-flex items-center justify-center min-h-[48px] px-5 rounded-[10px] bg-[var(--ink)] text-[var(--paper)] font-medium text-base hover:opacity-90 mezgeb-transition"
              >
                {t("sys404Btn")}
              </Link>
            }
          />
        </div>
      </section>
    </Layout>
  );
}

export function OfflineFallbackPage() {
  const { t } = useI18n();
  return (
    <Layout>
      <section aria-labelledby="offline-heading" className="py-16 md:py-24 bg-[var(--paper)]">
        <div className="mezgeb-container max-w-[720px]">
          <h1 id="offline-heading" className="sr-only">
            {t("sysOfflineTitle")}
          </h1>
          <EmptyState
            title={t("sysOfflineTitle")}
            description={t("sysOfflineDesc")}
            action={
              <Link
                to="/profile"
                className="inline-flex items-center justify-center min-h-[48px] px-5 rounded-[10px] bg-[var(--ink)] text-[var(--paper)] font-medium text-base hover:opacity-90 mezgeb-transition"
              >
                {t("sysOfflineBtn")}
              </Link>
            }
          />
        </div>
      </section>
    </Layout>
  );
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallbackView onReload={() => window.location.reload()} />;
    }
    return this.props.children;
  }
}

function ErrorFallbackView({ onReload }: { onReload: () => void }) {
  const { t } = useI18n();
  return (
    <Layout>
      <section aria-labelledby="error-heading" className="py-16 md:py-24 bg-[var(--paper)]">
        <div className="mezgeb-container max-w-[720px]">
          <h1 id="error-heading" className="sr-only">
            {t("sysErrorTitle")}
          </h1>
          <EmptyState
            title={t("sysErrorTitle")}
            description={t("sysErrorDesc")}
            action={
              <Button variant="primary" size="lg" onClick={onReload}>
                {t("sysErrorBtn")}
              </Button>
            }
          />
        </div>
      </section>
    </Layout>
  );
}
