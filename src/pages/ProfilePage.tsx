import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Download, Lock } from "lucide-react";
import { Layout } from "../components/Layout";
import { useLiveAnnouncer } from "../components/LiveAnnouncer";
import { MezgebAnswers, MezgebWidget } from "../components/MezgebWidget";
import { useI18n } from "../i18n";
import { formatEthiopianDate, formatGregorianDate, gregorianToEthiopian } from "../lib/ethiopianCalendar";
import {
  clearLearnerProfileFromDevice,
  loadCompletedLearnerProfile,
  saveCompletedLearnerProfile,
  StoredLearnerRecord,
} from "../lib/profileStore";
import { buildCompletedProfile } from "../lib/validation";
import { LEARNING_PLATFORM_TEMPLATE, SUPPORT_OPTIONS } from "../templates";
import { TemplateQuestion } from "../templates/types";
import { Badge, Banner, Button, Dialog, EmptyState } from "../ui";

function formatSavedDate(iso: string | undefined, lang: "en" | "am"): string {
  const date = iso ? new Date(iso) : new Date();
  const valid = Number.isNaN(date.getTime()) ? new Date() : date;
  const gY = valid.getUTCFullYear();
  const gM = valid.getUTCMonth() + 1;
  const gD = valid.getUTCDate();
  const greg = formatGregorianDate({ year: gY, month: gM, day: gD });
  if (lang === "am") {
    const eth = gregorianToEthiopian({ year: gY, month: gM, day: gD });
    return `${formatEthiopianDate(eth, "am")} (${greg})`;
  }
  return greg;
}

export function ProfilePage() {
  const { lang, t } = useI18n();
  const { announce } = useLiveAnnouncer();

  const [record, setRecord] = useState<StoredLearnerRecord | null>(() =>
    loadCompletedLearnerProfile()
  );
  const [editingQuestion, setEditingQuestion] = useState<TemplateQuestion | null>(null);
  const [editedAnswersBuffer, setEditedAnswersBuffer] = useState<MezgebAnswers>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletedNotice, setDeletedNotice] = useState(false);

  const getDisplayValue = (q: TemplateQuestion): string => {
    if (!record) return "—";
    const p = record.profile;
    const raw = record.rawAnswers;
    if (q.type === "date") {
      return p.date_of_birth ? String(p.date_of_birth) : "—";
    }
    if (q.type === "id-routes") {
      return p.id_route ? String(p.id_route) : "—";
    }
    if (q.type === "work-story") {
      const skills = Array.isArray(p.skills) ? (p.skills as string[]) : [];
      return skills.length > 0 ? skills.join(", ") : String(p.work_story ?? "—");
    }
    const val = p[q.maps_to] ?? raw[q.id];
    if (val === undefined || val === null || val === "") return "—";
    return String(val);
  };

  const handleOpenEdit = (q: TemplateQuestion) => {
    if (!record) return;
    setEditedAnswersBuffer({ ...record.rawAnswers } as MezgebAnswers);
    setEditingQuestion(q);
  };

  const handleSaveSingleEdit = () => {
    if (!record || !editingQuestion) return;
    const mergedRaw = {
      ...record.rawAnswers,
      ...editedAnswersBuffer,
      support_needs: record.supportNeedsInSession,
      support_share_platform: record.sharing.platform,
      support_share_employers: record.sharing.employers,
      support_share_partner: record.sharing.partner,
    };
    const { profile } = buildCompletedProfile({
      answers: mergedRaw,
      template: LEARNING_PLATFORM_TEMPLATE,
    });
    if (record.profile.id_route === "partner_verified") {
      profile.id_route = "partner_verified";
    }
    saveCompletedLearnerProfile({
      profile,
      rawAnswers: mergedRaw,
      supportNeeds: record.supportNeedsInSession,
      sharing: record.sharing,
    });
    setRecord(loadCompletedLearnerProfile());
    setEditingQuestion(null);
    announce(t("saveButton"));
  };

  const handleToggleShare = (key: "platform" | "employers" | "partner") => {
    if (!record) return;
    const nextSharing = { ...record.sharing, [key]: !record.sharing[key] };
    const mergedRaw = {
      ...record.rawAnswers,
      support_needs: record.supportNeedsInSession,
      support_share_platform: nextSharing.platform,
      support_share_employers: nextSharing.employers,
      support_share_partner: nextSharing.partner,
    };
    const { profile } = buildCompletedProfile({
      answers: mergedRaw,
      template: LEARNING_PLATFORM_TEMPLATE,
    });
    saveCompletedLearnerProfile({
      profile,
      rawAnswers: mergedRaw,
      supportNeeds: record.supportNeedsInSession,
      sharing: nextSharing,
    });
    setRecord(loadCompletedLearnerProfile());
  };

  const handleDownloadJson = () => {
    if (!record) return;
    const payload = {
      profile: record.profile,
      supportNeedsInSession: record.supportNeedsInSession,
      sharing: record.sharing,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mezgeb-my-profile.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDeleteAll = () => {
    clearLearnerProfileFromDevice();
    setRecord(null);
    setDeleteDialogOpen(false);
    setDeletedNotice(true);
    announce(t("profileDeletedNotice"));
  };

  const findQ = (id: string) => LEARNING_PLATFORM_TEMPLATE.questions.find((q) => q.id === id);

  const sections = [
    {
      title: t("profileSecAbout"),
      questions: [findQ("full_name"), findQ("dob"), findQ("area")].filter(Boolean) as TemplateQuestion[],
    },
    {
      title: t("profileSecContact"),
      questions: [findQ("phone")].filter(Boolean) as TemplateQuestion[],
    },
    {
      title: t("profileSecIdentity"),
      questions: [findQ("id_route")].filter(Boolean) as TemplateQuestion[],
    },
    {
      title: t("profileSecEduSkills"),
      questions: [findQ("work_story")].filter(Boolean) as TemplateQuestion[],
    },
  ];

  const connectedPlatforms = record
    ? [
        record.sharing.platform && {
          key: "platform" as const,
          name: "Learnhub",
          detail: t("widgetSupportSharePlatform"),
        },
        record.sharing.employers && {
          key: "employers" as const,
          name: "Mezgeb Jobs",
          detail: t("widgetSupportShareEmployers"),
        },
        record.sharing.partner && {
          key: "partner" as const,
          name: t("widgetPartner1"),
          detail: t("widgetSupportSharePartner"),
        },
      ].filter(Boolean) as { key: "platform" | "employers" | "partner"; name: string; detail: string }[]
    : [];

  return (
    <Layout>
      <section aria-labelledby="profile-heading" className="py-12 md:py-16 bg-[var(--paper)] min-h-[75vh]">
        <div className="mezgeb-container max-w-[820px] space-y-8 text-left">
          <header className="space-y-2 pb-6 border-b border-[var(--line)]">
            <h1
              id="profile-heading"
              className="mezgeb-display-heading text-[1.75rem] md:text-[2.25rem] font-semibold text-[var(--ink)]"
            >
              {t("profileTitle")}
            </h1>
            <p className="text-base text-[var(--muted)] leading-relaxed">{t("profileSubtitle")}</p>
          </header>

          {deletedNotice && <Banner variant="success">{t("profileDeletedNotice")}</Banner>}

          {!record ? (
            <EmptyState
              title={t("profileEmptyTitle")}
              description={t("profileEmptyBody")}
              action={
                <Link
                  to="/demo"
                  className="inline-flex items-center justify-center min-h-[48px] px-5 rounded-[10px] bg-[var(--ink)] text-[var(--paper)] font-medium text-base hover:opacity-90 mezgeb-transition"
                >
                  {t("profileGoDemo")}
                </Link>
              }
            />
          ) : (
            <div className="space-y-6">
              {/* Top summary card */}
              <div className="rounded-[10px] border border-[var(--line)] bg-[var(--stone)] p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-[1.375rem] font-semibold text-[var(--ink)]">
                    {String(record.profile.name ?? t("profileTitle"))}
                  </h2>

                  {record.profile.id_route === "partner_verified" && (
                    <Badge variant="success" icon={<Check size={14} strokeWidth={1.75} />}>
                      {t("profileVerifiedBadge")}
                    </Badge>
                  )}
                  {record.profile.id_route === "partner_pending" && (
                    <Badge variant="warning">{t("profilePendingBadge")}</Badge>
                  )}
                </div>

                <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm pt-2 border-t border-[var(--line)]">
                  <div>
                    <dt className="text-[var(--muted)]">{t("qLangLabel")}</dt>
                    <dd className="font-medium text-[var(--ink)] mt-0.5">
                      {record.rawAnswers.language === "am" ? "አማርኛ" : "English"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[var(--muted)]">{t("profileModeLabel")}</dt>
                    <dd className="font-medium text-[var(--ink)] mt-0.5">
                      {t("widgetModeTypeTitle")}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[var(--muted)]">{t("profileLastSavedLabel")}</dt>
                    <dd className="font-medium text-[var(--ink)] mt-0.5">
                      {formatSavedDate(record.verifiedAt, lang)}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Editable sections */}
              {sections.map((sec) => (
                <section
                  key={sec.title}
                  className="rounded-[10px] border border-[var(--line)] bg-[var(--paper)] p-6 space-y-4"
                >
                  <div className="flex items-center justify-between gap-3 pb-3 border-b border-[var(--line)]">
                    <h2 className="text-lg font-semibold text-[var(--ink)]">{sec.title}</h2>
                    {sec.questions[0] && (
                      <Button variant="quiet" onClick={() => handleOpenEdit(sec.questions[0])}>
                        {t("templatesCustomizeBtn")}
                      </Button>
                    )}
                  </div>

                  <dl className="divide-y divide-[var(--line)]">
                    {sec.questions.map((q) => (
                      <div key={q.id} className="py-3 flex items-start justify-between gap-4">
                        <div>
                          <dt className="text-sm text-[var(--muted)]">{q.label[lang]}</dt>
                          <dd className="text-base font-medium text-[var(--ink)] mt-0.5">
                            {getDisplayValue(q)}
                          </dd>
                        </div>
                        <Button variant="quiet" onClick={() => handleOpenEdit(q)}>
                          {t("widgetChange")}
                        </Button>
                      </div>
                    ))}
                  </dl>
                </section>
              ))}

              {/* Support I need (Private to you) */}
              <section className="rounded-[10px] border border-[var(--line)] bg-[var(--paper)] p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[var(--line)]">
                  <div className="flex items-center gap-2">
                    <Lock size={18} strokeWidth={1.75} className="text-[var(--ink)]" aria-hidden="true" />
                    <h2 className="text-lg font-semibold text-[var(--ink)]">
                      {t("profileSecSupport")}
                    </h2>
                  </div>
                  <Badge variant="neutral">{t("profilePrivateToYou")}</Badge>
                </div>

                {record.supportNeedsInSession.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {record.supportNeedsInSession.map((val) => {
                      const opt = SUPPORT_OPTIONS.find((o) => o.value === val);
                      return (
                        <Badge key={val} variant="accent">
                          {opt ? opt.label[lang] : val}
                        </Badge>
                      );
                    })}
                  </div>
                )}

                <div className="space-y-3">
                  {[
                    { key: "platform" as const, label: t("widgetSupportSharePlatform") },
                    { key: "employers" as const, label: t("widgetSupportShareEmployers") },
                    { key: "partner" as const, label: t("widgetSupportSharePartner") },
                  ].map((row) => (
                    <label
                      key={row.key}
                      className="flex items-center justify-between gap-3 py-2 border-b border-[var(--line)] last:border-b-0 cursor-pointer"
                    >
                      <span className="text-base text-[var(--ink)]">{row.label}</span>
                      <input
                        type="checkbox"
                        checked={record.sharing[row.key]}
                        onChange={() => handleToggleShare(row.key)}
                        className="w-5 h-5 accent-[var(--accent)]"
                      />
                    </label>
                  ))}
                </div>
              </section>

              {/* Connected platforms */}
              <section className="rounded-[10px] border border-[var(--line)] bg-[var(--paper)] p-6 space-y-4">
                <h2 className="text-lg font-semibold text-[var(--ink)] pb-3 border-b border-[var(--line)]">
                  {t("profileSecConnected")}
                </h2>
                {connectedPlatforms.length === 0 ? (
                  <p className="text-sm text-[var(--muted)]">{t("profileNoConnectedPlatforms")}</p>
                ) : (
                  <ul className="divide-y divide-[var(--line)]">
                    {connectedPlatforms.map((item) => (
                      <li
                        key={item.key}
                        className="py-3 flex flex-wrap items-center justify-between gap-3"
                      >
                        <div>
                          <p className="text-base font-medium text-[var(--ink)]">{item.name}</p>
                          <p className="text-sm text-[var(--muted)]">{item.detail}</p>
                        </div>
                        <Button variant="secondary" onClick={() => handleToggleShare(item.key)}>
                          {t("profileStopSharingBtn")}
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {/* Bottom actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <Button variant="secondary" size="lg" onClick={handleDownloadJson}>
                  <Download size={18} strokeWidth={1.75} aria-hidden="true" />
                  <span>{t("profileDownloadDataBtn")}</span>
                </Button>
                <Button variant="danger" size="lg" onClick={() => setDeleteDialogOpen(true)}>
                  {t("profileDeleteBtn")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Single question edit dialog */}
      <Dialog
        open={Boolean(editingQuestion)}
        onClose={() => setEditingQuestion(null)}
        title={t("profileEditDialogTitle")}
        maxWidthClass="max-w-xl"
        closeLabel={t("closeButton")}
      >
        {editingQuestion && record && (
          <MezgebWidget
            key={editingQuestion.id}
            template={{
              ...LEARNING_PLATFORM_TEMPLATE,
              questions: [editingQuestion],
            }}
            aiEnabled={true}
            offline={false}
            singleQuestionMode={true}
            initialAnswers={record.rawAnswers as MezgebAnswers}
            storageKey={`mezgeb_profile_edit_${editingQuestion.id}`}
            onAnswersChange={(nextAns) => setEditedAnswersBuffer(nextAns)}
            onComplete={handleSaveSingleEdit}
          />
        )}
      </Dialog>

      {/* Delete confirmation dialog (no typing required, explains what gets deleted) */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title={t("profileDeleteConfirmTitle")}
        maxWidthClass="max-w-md"
        closeLabel={t("closeButton")}
      >
        <div className="space-y-5">
          <p className="text-base text-[var(--muted)] leading-relaxed">
            {t("profileDeleteConfirmBody")}
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteDialogOpen(false)}>
              {t("cancelButton")}
            </Button>
            <Button variant="danger" onClick={handleDeleteAll}>
              {t("profileDeleteConfirmAction")}
            </Button>
          </div>
        </div>
      </Dialog>
    </Layout>
  );
}
