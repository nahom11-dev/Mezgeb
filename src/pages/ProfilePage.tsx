import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AccessibleDialog } from "../components/AccessibleDialog";
import { CheckIcon, LockIcon } from "../components/Icons";
import { Layout } from "../components/Layout";
import { useLiveAnnouncer } from "../components/LiveAnnouncer";
import { MezgebAnswers, MezgebWidget } from "../components/MezgebWidget";
import { useI18n } from "../i18n";
import {
  clearLearnerProfileFromDevice,
  loadCompletedLearnerProfile,
  saveCompletedLearnerProfile,
  StoredLearnerRecord,
} from "../lib/profileStore";
import { buildCompletedProfile } from "../lib/validation";
import { LEARNING_PLATFORM_TEMPLATE, SUPPORT_OPTIONS } from "../templates";
import { TemplateQuestion } from "../templates/types";

export function ProfilePage() {
  const { lang, t } = useI18n();
  const { announce } = useLiveAnnouncer();

  const [record, setRecord] = useState<StoredLearnerRecord | null>(() => loadCompletedLearnerProfile());
  const [editingQuestion, setEditingQuestion] = useState<TemplateQuestion | null>(null);
  const [editedAnswersBuffer, setEditedAnswersBuffer] = useState<MezgebAnswers>({});
  const [deletedNotice, setDeletedNotice] = useState(false);

  const editableQuestions = LEARNING_PLATFORM_TEMPLATE.questions.filter((q) => q.type !== "support");

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

  const handleDeleteAll = () => {
    clearLearnerProfileFromDevice();
    setRecord(null);
    setDeletedNotice(true);
    announce(t("profileDeletedNotice"));
  };

  return (
    <Layout>
      <section aria-labelledby="profile-heading" className="py-12 md:py-16 bg-[#FAF9F6] min-h-[75vh]">
        <div className="max-w-[820px] mx-auto px-4 sm:px-6 md:px-10 space-y-8">
          <div className="space-y-2">
            <h1 id="profile-heading" className="text-3xl md:text-4xl font-bold tracking-tight text-[#111111]">
              {t("profileTitle")}
            </h1>
            <p className="text-base text-[#6B6B6B]">{t("profileSubtitle")}</p>
          </div>

          {deletedNotice && (
            <div role="status" className="p-4 rounded-xl bg-[#E4F2EC] text-[#1F5C46] text-sm font-medium">
              {t("profileDeletedNotice")}
            </div>
          )}

          {!record ? (
            <div className="mezgeb-card p-8 text-center space-y-4">
              <h2 className="text-lg font-semibold text-[#111111]">{t("profileEmptyTitle")}</h2>
              <p className="text-sm text-[#6B6B6B]">{t("profileEmptyBody")}</p>
              <Link to="/demo" className="mezgeb-btn-primary text-sm">
                {t("profileGoDemo")}
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="mezgeb-card p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E7E7E4]">
                  <span className="text-sm font-semibold text-[#111111]">
                    {String(record.profile.name ?? t("profileTitle"))}
                  </span>
                  {record.profile.id_route === "partner_verified" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E4F2EC] text-[#1F5C46] text-xs font-semibold">
                      <CheckIcon size={13} />
                      <span>{t("profileVerifiedBadge")}</span>
                    </span>
                  )}
                  {record.profile.id_route === "partner_pending" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F9F3EA] text-[#111111] border border-[#E7E7E4] text-xs font-semibold">
                      {t("profilePendingBadge")}
                    </span>
                  )}
                </div>

                <dl className="divide-y divide-[#E7E7E4]">
                  {editableQuestions.map((q) => (
                    <div key={q.id} className="py-3.5 flex items-start justify-between gap-4">
                      <div>
                        <dt className="text-xs font-medium text-[#6B6B6B]">{q.label[lang]}</dt>
                        <dd className="text-sm font-medium text-[#111111] mt-0.5">{getDisplayValue(q)}</dd>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(q)}
                        className="text-xs font-semibold text-[#6A4FC4] underline min-h-[36px] px-2 shrink-0"
                      >
                        {t("widgetChange")}
                      </button>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Who can see my support needs (default OFF) */}
              <div className="mezgeb-card p-6 space-y-4">
                <div className="flex items-start gap-2.5">
                  <LockIcon size={17} className="mt-0.5 text-[#6A4FC4]" />
                  <div>
                    <h2 className="text-base font-semibold text-[#111111]">{t("profileWhoCanSeeTitle")}</h2>
                    <p className="text-xs text-[#6B6B6B]">{t("widgetSupportSessionNote")}</p>
                  </div>
                </div>

                {record.supportNeedsInSession.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {record.supportNeedsInSession.map((val) => {
                      const opt = SUPPORT_OPTIONS.find((o) => o.value === val);
                      return (
                        <span
                          key={val}
                          className="px-2.5 py-1 rounded-md bg-[#EEEBF8] text-[#111111] text-xs font-medium"
                        >
                          {opt ? opt.label[lang] : val}
                        </span>
                      );
                    })}
                  </div>
                )}

                <div className="space-y-3 pt-1">
                  {[
                    { key: "platform" as const, label: t("widgetSupportSharePlatform") },
                    { key: "employers" as const, label: t("widgetSupportShareEmployers") },
                    { key: "partner" as const, label: t("widgetSupportSharePartner") },
                  ].map((row) => (
                    <label
                      key={row.key}
                      className="flex items-center justify-between gap-3 text-sm cursor-pointer"
                    >
                      <span className="text-[#111111]">{row.label}</span>
                      <input
                        type="checkbox"
                        checked={record.sharing[row.key]}
                        onChange={() => handleToggleShare(row.key)}
                        className="w-5 h-5 accent-[#6A4FC4]"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleDeleteAll}
                  className="mezgeb-btn-secondary border-red-300 text-red-700 hover:bg-red-50 text-sm"
                >
                  {t("profileDeleteBtn")}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <AccessibleDialog
        open={Boolean(editingQuestion)}
        onClose={() => setEditingQuestion(null)}
        title={t("profileEditDialogTitle")}
        maxWidthClass="max-w-xl"
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
      </AccessibleDialog>
    </Layout>
  );
}
