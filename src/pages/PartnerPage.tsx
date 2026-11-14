import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckIcon, LockIcon } from "../components/Icons";
import { Layout } from "../components/Layout";
import { useLiveAnnouncer } from "../components/LiveAnnouncer";
import { useI18n } from "../i18n";
import {
  PartnerSessionSnapshot,
  readPartnerSessions,
  sendPartnerJoin,
  sendPartnerVerify,
  subscribePartnerSync,
} from "../lib/partnerSync";
import { markLearnerProfileVerified } from "../lib/profileStore";

export function PartnerPage() {
  const { t } = useI18n();
  const { announce } = useLiveAnnouncer();
  const [sessions, setSessions] = useState<PartnerSessionSnapshot[]>(() => readPartnerSessions());

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

  const handleJoin = (sessionId: string) => {
    sendPartnerJoin(sessionId);
    setSessions(readPartnerSessions());
    announce(t("partnerJoinedLabel"));
  };

  const handleConfirmVerify = (sessionId: string) => {
    const verifiedAt = sendPartnerVerify(sessionId);
    markLearnerProfileVerified(verifiedAt);
    setSessions(readPartnerSessions());
    announce(t("partnerVerifiedLabel"));
  };

  return (
    <Layout>
      <div className="bg-[#F9F3EA] border-b border-[#E7E7E4] py-2.5 px-4 text-center text-xs font-semibold text-[#111111]">
        {t("partnerBanner")}
      </div>

      <section aria-labelledby="partner-heading" className="py-12 md:py-16 bg-[#FAF9F6] min-h-[75vh]">
        <div className="max-w-[960px] mx-auto px-4 sm:px-6 md:px-10 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <h1 id="partner-heading" className="text-3xl md:text-4xl font-bold tracking-tight text-[#111111]">
                {t("partnerTitle")}
              </h1>
              <p className="text-base text-[#6B6B6B]">{t("partnerSubtitle")}</p>
            </div>
            <Link to="/demo" className="mezgeb-btn-secondary shrink-0 text-sm">
              {t("partnerOpenDemoLink")}
            </Link>
          </div>

          {sessions.length === 0 ? (
            <div className="mezgeb-card p-8 text-center space-y-4">
              <p className="text-base text-[#6B6B6B]">{t("partnerNoSessions")}</p>
              <Link to="/demo" className="mezgeb-btn-primary text-sm">
                {t("partnerOpenDemoLink")}
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {sessions.map((session) => (
                <article key={session.sessionId} className="mezgeb-card p-6 space-y-5">
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#E7E7E4] pb-4">
                    <div>
                      <p className="text-xs font-mono text-[#6B6B6B]">{session.sessionId}</p>
                      <h2 className="text-xl font-semibold text-[#111111]">{session.partnerOrg}</h2>
                      <p className="text-sm text-[#6B6B6B] mt-1">
                        {t("partnerStepLabel", {
                          step: session.stepNumber,
                          total: session.totalSteps,
                        })}
                        {" · "}
                        {session.questionLabel}
                      </p>
                    </div>

                    {session.verified ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E4F2EC] text-[#1F5C46] text-xs font-semibold">
                        <CheckIcon size={14} />
                        <span>{t("partnerVerifiedLabel")}</span>
                      </span>
                    ) : session.partnerJoined ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEEBF8] text-[#6A4FC4] text-xs font-semibold">
                        <CheckIcon size={14} />
                        <span>{t("partnerJoinedLabel")}</span>
                      </span>
                    ) : null}
                  </div>

                  <div className="space-y-3">
                    <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B6B6B]">
                      <LockIcon size={13} />
                      <span>{t("partnerMaskedTitle")}</span>
                    </p>

                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {session.maskedFields.map((field) => (
                        <div
                          key={field.id}
                          className="p-3 rounded-xl bg-[#F5F5F3] border border-[#E7E7E4] flex items-center justify-between gap-2 text-xs"
                        >
                          <dt className="text-[#6B6B6B] font-medium truncate">{field.label}</dt>
                          <dd className="font-mono font-bold text-[#111111] shrink-0">
                            {field.hasValue ? "••••" : "—"}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#E7E7E4]">
                    {!session.partnerJoined && (
                      <button
                        type="button"
                        onClick={() => handleJoin(session.sessionId)}
                        className="mezgeb-btn-secondary text-sm"
                      >
                        {t("partnerJoinBtn")}
                      </button>
                    )}

                    {!session.verified && (
                      <button
                        type="button"
                        onClick={() => handleConfirmVerify(session.sessionId)}
                        className="mezgeb-btn-primary text-sm"
                      >
                        {t("partnerConfirmBtn")}
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
