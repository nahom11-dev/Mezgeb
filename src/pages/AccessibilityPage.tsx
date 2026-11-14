import React from "react";
import { Layout } from "../components/Layout";
import { useI18n } from "../i18n";

export function AccessibilityPage() {
  const { t } = useI18n();

  return (
    <Layout>
      <section aria-labelledby="a11y-heading" className="py-12 md:py-16 bg-white">
        <article className="max-w-[760px] mx-auto px-4 sm:px-6 md:px-10 space-y-8">
          <header className="space-y-3 pb-6 border-b border-[#E7E7E4]">
            <h1 id="a11y-heading" className="text-3xl md:text-4xl font-bold tracking-tight text-[#111111]">
              {t("a11yPageTitle")}
            </h1>
            <p className="text-base text-[#6B6B6B] leading-relaxed">{t("a11yPageIntro")}</p>
          </header>

          <section aria-labelledby="a11y-standard" className="space-y-2">
            <h2 id="a11y-standard" className="text-xl font-semibold text-[#111111]">
              {t("a11yStandardHeading")}
            </h2>
            <p className="text-[15px] leading-relaxed text-[#111111]/85">{t("a11yStandardBody")}</p>
          </section>

          <section aria-labelledby="a11y-tested" className="space-y-2">
            <h2 id="a11y-tested" className="text-xl font-semibold text-[#111111]">
              {t("a11yTestedHeading")}
            </h2>
            <p className="text-[15px] leading-relaxed text-[#111111]/85">{t("a11yTestedBody")}</p>
          </section>

          <section aria-labelledby="a11y-limits" className="space-y-2">
            <h2 id="a11y-limits" className="text-xl font-semibold text-[#111111]">
              {t("a11yLimitsHeading")}
            </h2>
            <p className="text-[15px] leading-relaxed text-[#111111]/85">{t("a11yLimitsBody")}</p>
          </section>

          <section aria-labelledby="a11y-report" className="space-y-2">
            <h2 id="a11y-report" className="text-xl font-semibold text-[#111111]">
              {t("a11yReportHeading")}
            </h2>
            <p className="text-[15px] leading-relaxed text-[#111111]/85">{t("a11yReportBody")}</p>
          </section>
        </article>
      </section>
    </Layout>
  );
}
