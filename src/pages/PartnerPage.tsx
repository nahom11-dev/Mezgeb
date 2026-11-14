import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Clock, FileWarning, Lock } from "lucide-react";
import { Layout } from "../components/Layout";
import { useLiveAnnouncer } from "../components/LiveAnnouncer";
import { MezgebWidget } from "../components/MezgebWidget";
import { useI18n } from "../i18n";
import { formatEthiopianDate, formatGregorianDate, gregorianToEthiopian } from "../lib/ethiopianCalendar";
import {
  PartnerSessionSnapshot,
  readPartnerSessions,
  sendPartnerJoin,
  sendPartnerVerify,
  subscribePartnerSync,
} from "../lib/partnerSync";
import { markLearnerProfileVerified } from "../lib/profileStore";
import { LEARNING_PLATFORM_TEMPLATE } from "../templates";
import { Badge, Banner, Button, Dialog, EmptyState, Field, Table } from "../ui";

function formatBilingualTimestamp(iso: string, lang: "en" | "am"): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const gYear = date.getUTCFullYear();
  const gMonth = date.getUTCMonth() + 1;
  const gDay = date.getUTCDate();
  const greg = formatGregorianDate({ year: gYear, month: gMonth, day: gDay });
  if (lang === "am") {
    const eth = gregorianToEthiopian({ year: gYear, month: gMonth, day: gDay });
    return `${formatEthiopianDate(eth, "am")} (${greg})`;
  }
  return greg;
}

export function PartnerPage() {
  const { lang, t } = useI18n();
  const { announce } = useLiveAnnouncer();

  const [sessions, setSessions] = useState<PartnerSessionSnapshot[]>(() => readPartnerSessions());
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "waiting" | "complete">("all");
  const [selectedSession, setSelectedSession] = useState<PartnerSessionSnapshot | null>(null);

  // Register a learner (assisted mode)
  const [registerOpen, setRegisterOpen] = useState(false);
  const [learnerNamePrompt, setLearnerNamePrompt] = useState("");
  const [assistedStarted, setAssistedStarted] = useState(false);

  useEffect(() => {
    setSessions(readPartnerSessions());
    return subscribePartnerSync((msg) => {
      if (msg.type === "session_update" && msg.snapshot) {
        setSessions((prev) => [
          msg.snapshot!,
          ...prev.filter((item) => item.sessionId !== msg.snapshot!.sessionId),
        ]);
      } else {
        setSessions(readPartnerSessions());
      }
    });
  }, []);

  const filteredSessions = useMemo(() => {
    const q = searchFilter.trim().toLowerCase();
    return sessions.filter((s) => {
      if (statusFilter === "waiting" && s.verified) return false;
      if (statusFilter === "complete" && !s.verified) return false;
      if (!q) return true;
      return (
        s.partnerOrg.toLowerCase().includes(q) ||
        s.sessionId.toLowerCase().includes(q) ||
        s.questionLabel.toLowerCase().includes(q)
      );
    });
  }, [sessions, searchFilter, statusFilter]);

  const handleJoin = (sessionId: string) => {
    sendPartnerJoin(sessionId);
    const updated = readPartnerSessions();
    setSessions(updated);
    setSelectedSession(updated.find((s) => s.sessionId === sessionId) ?? null);
    announce(t("partnerJoinedLabel"));
  };

  const handleConfirmVerify = (sessionId: string) => {
    const verifiedAt = sendPartnerVerify(sessionId);
    markLearnerProfileVerified(verifiedAt);
    const updated = readPartnerSessions();
    setSessions(updated);
    setSelectedSession(updated.find((s) => s.sessionId === sessionId) ?? null);
    announce(t("partnerVerifiedLabel"));
  };

  return (
    <Layout>
      <section aria-labelledby="partner-heading" className="py-12 md:py-16 bg-[var(--paper)] min-h-[75vh]">
        <div className="mezgeb-container space-y-8 text-left">
          <Banner variant="info">{t("partnerBanner")}</Banner>

          {/* Header with partner name and Register a learner */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[var(--line)]">
            <div className="space-y-1.5 max-w-[64ch]">
              <p className="mezgeb-section-label">{t("widgetPartner1")}</p>
              <h1
                id="partner-heading"
                className="mezgeb-display-heading text-[1.75rem] md:text-[2.25rem] font-semibold text-[var(--ink)]"
              >
                {t("partnerTitle")}
              </h1>
              <p className="text-base text-[var(--muted)] leading-relaxed">{t("partnerSubtitle")}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/demo"
                className="min-h-[44px] px-4 rounded-[10px] border border-[var(--ink)] bg-[var(--paper)] text-[var(--ink)] text-sm font-medium inline-flex items-center hover:bg-[var(--stone)] mezgeb-transition"
              >
                {t("partnerOpenDemoLink")}
              </Link>
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  setAssistedStarted(false);
                  setLearnerNamePrompt("");
                  setRegisterOpen(true);
                }}
              >
                {t("partnerRegisterLearnerBtn")}
              </Button>
            </div>
          </header>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <Field
              id="partner-search"
              label={t("templatesSearchLabel")}
              inputProps={{
                type: "search",
                value: searchFilter,
                onChange: (e) => setSearchFilter(e.target.value),
              }}
            />

            <div>
              <label
                htmlFor="partner-status-filter"
                className="block text-sm font-medium text-[var(--ink)] mb-1.5"
              >
                {t("partnerColStatus")}
              </label>
              <select
                id="partner-status-filter"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as "all" | "waiting" | "complete")
                }
                className="w-full min-h-[48px] px-3 rounded-[6px] border border-[var(--line-strong)] bg-[var(--paper)] text-sm text-[var(--ink)]"
              >
                <option value="all">{t("templatesFilterAll")}</option>
                <option value="waiting">{t("partnerStatusWaitingConsent")}</option>
                <option value="complete">{t("partnerStatusComplete")}</option>
              </select>
            </div>
          </div>

          {/* Learners Table or EmptyState */}
          {filteredSessions.length === 0 ? (
            <EmptyState
              title={t("partnerEmptyTitle")}
              description={t("partnerEmptyDesc")}
              action={
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    setAssistedStarted(false);
                    setLearnerNamePrompt("");
                    setRegisterOpen(true);
                  }}
                >
                  {t("partnerRegisterLearnerBtn")}
                </Button>
              }
            />
          ) : (
            <Table
              caption={t("partnerTitle")}
              rows={filteredSessions}
              getRowKey={(s) => s.sessionId}
              columns={[
                {
                  key: "learner",
                  header: t("partnerColLearner"),
                  render: (s) => (
                    <div>
                      <p className="font-medium text-[var(--ink)]">{s.partnerOrg}</p>
                      <p
                        className="text-xs text-[var(--muted)]"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {s.sessionId}
                      </p>
                    </div>
                  ),
                },
                {
                  key: "template",
                  header: t("partnerColTemplate"),
                  render: (s) => (
                    <span className="text-sm text-[var(--ink)]">
                      {t("tplLearningName")} ({s.stepNumber}/{s.totalSteps})
                    </span>
                  ),
                },
                {
                  key: "status",
                  header: t("partnerColStatus"),
                  render: (s) => {
                    const needsDoc = !s.verified && s.maskedFields.some((f) => !f.hasValue);
                    if (s.verified) {
                      return (
                        <Badge
                          variant="success"
                          icon={<Check size={13} strokeWidth={1.75} />}
                        >
                          {t("partnerStatusComplete")}
                        </Badge>
                      );
                    }
                    if (s.partnerJoined) {
                      return (
                        <Badge
                          variant="accent"
                          icon={<Clock size={13} strokeWidth={1.75} />}
                        >
                          {t("partnerStatusWaitingConsent")}
                        </Badge>
                      );
                    }
                    return (
                      <Badge
                        variant={needsDoc ? "warning" : "neutral"}
                        icon={<FileWarning size={13} strokeWidth={1.75} />}
                      >
                        {needsDoc
                          ? t("partnerStatusNeedsDoc")
                          : t("partnerStatusWaitingConsent")}
                      </Badge>
                    );
                  },
                },
                {
                  key: "updated",
                  header: t("partnerColUpdated"),
                  render: (s) => (
                    <span className="text-sm text-[var(--muted)]">
                      {formatBilingualTimestamp(s.updatedAt, lang)}
                    </span>
                  ),
                },
                {
                  key: "action",
                  header: t("partnerColAction"),
                  align: "right",
                  render: (s) => (
                    <Button variant="quiet" onClick={() => setSelectedSession(s)}>
                      {t("partnerOpenBtn")}
                    </Button>
                  ),
                },
              ]}
            />
          )}
        </div>
      </section>

      {/* Open Learner Session Dialog (masked fields + join/confirm) */}
      <Dialog
        open={Boolean(selectedSession)}
        onClose={() => setSelectedSession(null)}
        title={selectedSession ? `${selectedSession.partnerOrg} (${selectedSession.sessionId})` : ""}
        maxWidthClass="max-w-xl"
        closeLabel={t("closeButton")}
      >
        {selectedSession && (
          <div className="space-y-5">
            <p className="inline-flex items-center gap-2 text-sm text-[var(--muted)]">
              <Lock size={16} strokeWidth={1.75} aria-hidden="true" />
              <span>{t("partnerMaskedTitle")}</span>
            </p>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedSession.maskedFields.map((field) => (
                <div
                  key={field.id}
                  className="p-3 rounded-[10px] border border-[var(--line)] bg-[var(--stone)] flex items-center justify-between gap-2 text-sm"
                >
                  <dt className="text-[var(--muted)] truncate">{field.label}</dt>
                  <dd className="font-semibold text-[var(--ink)] shrink-0">
                    {field.hasValue ? "••••" : "—"}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[var(--line)]">
              {!selectedSession.partnerJoined && (
                <Button variant="secondary" onClick={() => handleJoin(selectedSession.sessionId)}>
                  {t("partnerJoinBtn")}
                </Button>
              )}
              {!selectedSession.verified && (
                <Button
                  variant="primary"
                  onClick={() => handleConfirmVerify(selectedSession.sessionId)}
                >
                  {t("partnerConfirmBtn")}
                </Button>
              )}
            </div>
          </div>
        )}
      </Dialog>

      {/* Assisted Mode Registration Dialog */}
      <Dialog
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        title={t("partnerRegisterLearnerBtn")}
        maxWidthClass="max-w-2xl"
        closeLabel={t("closeButton")}
      >
        {!assistedStarted ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!learnerNamePrompt.trim()) return;
              setAssistedStarted(true);
            }}
            className="space-y-4"
          >
            <Field
              id="assisted-learner-name"
              label={t("qFullNameLabel")}
              hint={t("qFullNameHint")}
              inputProps={{
                required: true,
                value: learnerNamePrompt,
                onChange: (e) => setLearnerNamePrompt(e.target.value),
              }}
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setRegisterOpen(false)}>
                {t("cancelButton")}
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={!learnerNamePrompt.trim()}
                disabledReason={!learnerNamePrompt.trim() ? t("errRequired") : undefined}
              >
                {t("widgetWelcomeStart")}
              </Button>
            </div>
          </form>
        ) : (
          <MezgebWidget
            template={LEARNING_PLATFORM_TEMPLATE}
            aiEnabled={true}
            offline={false}
            assistedMode={true}
            assistedLearnerName={learnerNamePrompt.trim()}
            initialAnswers={{
              full_name: learnerNamePrompt.trim(),
              id_route: "partner_refer",
              partner_org: "Addis Accessibility Centre",
              partner_consent: true,
            }}
            storageKey={`mezgeb_partner_assisted_${Date.now()}`}
            onComplete={() => {
              setSessions(readPartnerSessions());
            }}
          />
        )}
      </Dialog>
    </Layout>
  );
}
