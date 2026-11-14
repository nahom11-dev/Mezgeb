import React from "react";
import { SiteFooter, SiteHeader, type SiteHeaderVariant } from "../ui";

export function Layout({
  children,
  showFaqInFooter = false,
  showGiantWordmark = false,
  headerVariant = "solid",
  mainClassName = "",
}: {
  children: React.ReactNode;
  showFaqInFooter?: boolean;
  showGiantWordmark?: boolean;
  headerVariant?: SiteHeaderVariant;
  mainClassName?: string;
}) {
  const overlay = headerVariant === "overlay";

  return (
    <div
      className={`min-h-screen flex flex-col bg-[var(--paper)] text-[var(--ink)] ${
        overlay ? "relative" : ""
      }`}
    >
      <SiteHeader variant={headerVariant} />

      <main id="main" tabIndex={-1} className={`flex-1 outline-none ${mainClassName}`}>
        {children}
      </main>

      <SiteFooter showFaq={showFaqInFooter} showGiantWordmark={showGiantWordmark} />
    </div>
  );
}