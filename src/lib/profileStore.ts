import { safeGetSession, safeGetStorage, safeRemoveStorage, safeSetSession, safeSetStorage } from "./storage";

export interface StoredLearnerRecord {
  profile: Record<string, unknown>;
  rawAnswers: Record<string, unknown>;
  supportNeedsInSession: string[];
  sharing: {
    platform: boolean;
    employers: boolean;
    partner: boolean;
  };
  verifiedAt?: string;
}

const PROFILE_LOCAL_KEY = "mezgeb_last_profile_v1";
const SUPPORT_SESSION_KEY = "mezgeb_support_session_v1";

let memorySupportSession: {
  supportNeedsInSession: string[];
  sharing: { platform: boolean; employers: boolean; partner: boolean };
} | null = null;

export function saveCompletedLearnerProfile(params: {
  profile: Record<string, unknown>;
  rawAnswers: Record<string, unknown>;
  supportNeeds: string[];
  sharing: { platform: boolean; employers: boolean; partner: boolean };
}): void {
  // Strip support_needs & sharing toggles from localStorage completely (privacy rule B2)
  const cleanRaw: Record<string, unknown> = { ...params.rawAnswers };
  delete cleanRaw.support_needs;
  delete cleanRaw.support_share_platform;
  delete cleanRaw.support_share_employers;
  delete cleanRaw.support_share_partner;

  const cleanProfile: Record<string, unknown> = { ...params.profile };
  if (!params.sharing.platform) {
    delete cleanProfile.support_needs;
  }

  safeSetStorage(
    PROFILE_LOCAL_KEY,
    JSON.stringify({
      profile: cleanProfile,
      rawAnswers: cleanRaw,
    })
  );

  // Support needs stay in session/memory only
  memorySupportSession = {
    supportNeedsInSession: [...params.supportNeeds],
    sharing: { ...params.sharing },
  };
  safeSetSession(SUPPORT_SESSION_KEY, JSON.stringify(memorySupportSession));
}

export function loadCompletedLearnerProfile(): StoredLearnerRecord | null {
  const raw = safeGetStorage(PROFILE_LOCAL_KEY).value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as {
      profile: Record<string, unknown>;
      rawAnswers: Record<string, unknown>;
      verifiedAt?: string;
    };
    let supportInfo = memorySupportSession;
    if (!supportInfo) {
      const sRaw = safeGetSession(SUPPORT_SESSION_KEY);
      if (sRaw) {
        try {
          supportInfo = JSON.parse(sRaw);
        } catch {
          supportInfo = null;
        }
      }
    }
    return {
      profile: parsed.profile ?? {},
      rawAnswers: parsed.rawAnswers ?? {},
      supportNeedsInSession: supportInfo?.supportNeedsInSession ?? [],
      sharing: supportInfo?.sharing ?? {
        platform: false,
        employers: false,
        partner: false,
      },
      verifiedAt: parsed.verifiedAt,
    };
  } catch {
    return null;
  }
}

export function markLearnerProfileVerified(verifiedAt: string): void {
  const current = loadCompletedLearnerProfile();
  if (!current) return;
  const updatedProfile = {
    ...current.profile,
    id_route: "partner_verified",
    verified_at: verifiedAt,
  };
  safeSetStorage(
    PROFILE_LOCAL_KEY,
    JSON.stringify({
      profile: updatedProfile,
      rawAnswers: current.rawAnswers,
      verifiedAt,
    })
  );
}

export function clearLearnerProfileFromDevice(): void {
  safeRemoveStorage(PROFILE_LOCAL_KEY);
  safeRemoveStorage("mezgeb_demo_state_v1");
  memorySupportSession = null;
  try {
    window.sessionStorage.removeItem(SUPPORT_SESSION_KEY);
  } catch {
    // ignore
  }
}
