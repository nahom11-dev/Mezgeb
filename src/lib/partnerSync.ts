import { safeGetStorage, safeSetStorage } from "./storage";

export interface PartnerSessionSnapshot {
  sessionId: string;
  partnerOrg: string;
  stepNumber: number;
  totalSteps: number;
  questionLabel: string;
  maskedFields: { id: string; label: string; hasValue: boolean }[];
  partnerJoined: boolean;
  verified: boolean;
  verifiedAt?: string;
  updatedAt: string;
}

const STORAGE_KEY = "mezgeb_partner_sessions_v1";
const CHANNEL_NAME = "mezgeb_partner_sync";

function getChannel(): BroadcastChannel | null {
  if (typeof BroadcastChannel === "undefined") return null;
  try {
    return new BroadcastChannel(CHANNEL_NAME);
  } catch {
    return null;
  }
}

export function readPartnerSessions(): PartnerSessionSnapshot[] {
  const raw = safeGetStorage(STORAGE_KEY).value;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function upsertPartnerSession(snapshot: PartnerSessionSnapshot): void {
  const existing = readPartnerSessions().filter((s) => s.sessionId !== snapshot.sessionId);
  const next = [snapshot, ...existing].slice(0, 10);
  safeSetStorage(STORAGE_KEY, JSON.stringify(next));
  const ch = getChannel();
  if (ch) {
    ch.postMessage({ type: "session_update", snapshot });
    ch.close();
  }
}

export function sendPartnerJoin(sessionId: string): void {
  const sessions = readPartnerSessions().map((s) =>
    s.sessionId === sessionId ? { ...s, partnerJoined: true, updatedAt: new Date().toISOString() } : s
  );
  safeSetStorage(STORAGE_KEY, JSON.stringify(sessions));
  const ch = getChannel();
  if (ch) {
    ch.postMessage({ type: "partner_joined", sessionId });
    ch.close();
  }
}

export function sendPartnerVerify(sessionId: string): string {
  const verifiedAt = new Date().toISOString();
  const sessions = readPartnerSessions().map((s) =>
    s.sessionId === sessionId
      ? { ...s, partnerJoined: true, verified: true, verifiedAt, updatedAt: verifiedAt }
      : s
  );
  safeSetStorage(STORAGE_KEY, JSON.stringify(sessions));
  const ch = getChannel();
  if (ch) {
    ch.postMessage({ type: "partner_verified", sessionId, verifiedAt });
    ch.close();
  }
  return verifiedAt;
}

export function subscribePartnerSync(
  onMessage: (msg: {
    type: "session_update" | "partner_joined" | "partner_verified";
    sessionId?: string;
    verifiedAt?: string;
    snapshot?: PartnerSessionSnapshot;
  }) => void
): () => void {
  const ch = getChannel();
  const handleChannel = (ev: MessageEvent) => {
    if (ev.data && ev.data.type) onMessage(ev.data);
  };
  ch?.addEventListener("message", handleChannel);

  const handleStorage = (ev: StorageEvent) => {
    if (ev.key === STORAGE_KEY) {
      const latest = readPartnerSessions()[0];
      if (latest) {
        onMessage({ type: "session_update", snapshot: latest });
      }
    }
  };
  window.addEventListener("storage", handleStorage);

  return () => {
    ch?.removeEventListener("message", handleChannel);
    ch?.close();
    window.removeEventListener("storage", handleStorage);
  };
}
