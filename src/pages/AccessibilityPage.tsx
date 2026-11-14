import React from "react";
import { Layout } from "../components/Layout";
import { useI18n } from "../i18n";
import { Badge, Banner, Table } from "../ui";

interface TestRow {
  area: string;
  method: string;
  status: string;
}

export function AccessibilityPage() {
  const { lang, t } = useI18n();

  const rows: TestRow[] =
    lang === "am"
      ? [
          {
            area: "የቁልፍ ሰሌዳ ብቻ አሰሳ እና 3px የትኩረት ቀለበት",
            method: "Tab / Shift+Tab / Enter / Esc / Alt+H",
            status: "አልፏል",
          },
          {
            area: "ስክሪን አንባቢ (NVDA እና TalkBack)",
            method: "መለያዎች፣ aria-describedby እና ቀጥታ ማስታወቂያዎች",
            status: "ተረጋግጧል",
          },
          {
            area: "200% ማጉላት እና 320px ስፋት ስልክ",
            method: "ያለ አግድም ማሸብለል የተሟላ አቀማመጥ",
            status: "አልፏል",
          },
          {
            area: "ድምፅ ጠፍቶ እና ከፍተኛ ንጽጽር (.mezgeb-hc)",
            method: "ሁሉም የድምፅ ምልክቶች በጽሑፍ ይታያሉ",
            status: "አልፏል",
          },
        ]
      : [
          {
            area: "Keyboard-only navigation & 3px focus ring",
            method: "Tab, Shift+Tab, Enter, Space, Esc, Alt+H",
            status: "Verified",
          },
          {
            area: "Screen readers (NVDA & TalkBack)",
            method: "Landmarks, aria-describedby errors, live step announcements",
            status: "Verified",
          },
          {
            area: "200% zoom & 320px narrow reflow",
            method: "Single-column widget layout with 48px touch targets",
            status: "Verified",
          },
          {
            area: "Sound off & high-contrast mode",
            method: "Visible text on all audio states; pure black-on-white 2px borders",
            status: "Verified",
          },
        ];

  return (
    <Layout>
      <section aria-labelledby="a11y-heading" className="py-12 md:py-16 bg-[var(--paper)]">
        <article className="mezgeb-container max-w-[760px] space-y-8 text-left">
          <header className="space-y-3 pb-6 border-b border-[var(--line)]">
            <h1
              id="a11y-heading"
              className="mezgeb-display-heading text-[1.75rem] md:text-[2.25rem] font-semibold text-[var(--ink)]"
            >
              {t("a11yPageTitle")}
            </h1>
            <p className="text-base text-[var(--muted)] leading-relaxed max-w-[68ch]">
              {t("a11yPageIntro")}
            </p>
          </header>

          <Banner variant="info">{t("a11yStandardBody")}</Banner>

          <section aria-labelledby="a11y-tested" className="space-y-4">
            <h2 id="a11y-tested" className="text-[1.375rem] font-semibold text-[var(--ink)]">
              {t("a11yTestedHeading")}
            </h2>
            <p className="text-base leading-relaxed text-[var(--ink)] max-w-[68ch]">
              {t("a11yTestedBody")}
            </p>

            <Table
              caption={t("a11yTestedHeading")}
              rows={rows}
              getRowKey={(r) => r.area}
              columns={[
                {
                  key: "area",
                  header: lang === "am" ? "የተፈተሸው ክፍል" : "Check",
                  render: (r) => <span className="font-medium">{r.area}</span>,
                },
                {
                  key: "method",
                  header: lang === "am" ? "ዘዴ" : "Method",
                  render: (r) => <span className="text-[var(--muted)]">{r.method}</span>,
                },
                {
                  key: "status",
                  header: lang === "am" ? "ሁኔታ" : "Status",
                  render: (r) => <Badge variant="success">{r.status}</Badge>,
                },
              ]}
            />
          </section>

          <section aria-labelledby="a11y-limits" className="space-y-2">
            <h2 id="a11y-limits" className="text-[1.375rem] font-semibold text-[var(--ink)]">
              {t("a11yLimitsHeading")}
            </h2>
            <p className="text-base leading-relaxed text-[var(--ink)] max-w-[68ch]">
              {t("a11yLimitsBody")}
            </p>
          </section>

          <section aria-labelledby="a11y-report" className="space-y-2">
            <h2 id="a11y-report" className="text-[1.375rem] font-semibold text-[var(--ink)]">
              {t("a11yReportHeading")}
            </h2>
            <p className="text-base leading-relaxed text-[var(--ink)] max-w-[68ch]">
              {t("a11yReportBody")}
            </p>
          </section>
        </article>
      </section>
    </Layout>
  );
}
