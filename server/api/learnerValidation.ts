import { normalizePhoneDigits, validatePhone } from "../../src/lib/validation";
import { normalizeSupportNeeds } from "../../src/lib/supportCatalog";
import type { SupportRecord } from "../../src/lib/supportTypes";

const ID_ROUTES = new Set(["fayda", "refugee_id", "other_document", "partner_refer", "partner_pending", "none"]);

export function assertNoSupportKeys(profile: Record<string, unknown>): string | null {
  for (const key of Object.keys(profile)) {
    if (key.toLowerCase().startsWith("support")) {
      return "Support choices must be sent separately to PUT /api/v1/learners/{id}/support";
    }
  }
  return null;
}

export function normalizeProfile(profile: Record<string, unknown>): { profile: Record<string, unknown>; error?: string } {
  const out = { ...profile };
  if (out.phone !== undefined) {
    const digits = normalizePhoneDigits(out.phone);
    if (digits && !validatePhone(digits)) return { profile: out, error: "Phone number format is not valid" };
    if (digits) out.phone = digits;
  }
  if (out.preferred_language !== undefined) {
    const lang = String(out.preferred_language);
    if (lang !== "am" && lang !== "en") return { profile: out, error: "Language must be am or en" };
    out.preferred_language = lang;
  }
  if (out.id_route !== undefined) {
    const route = String(out.id_route);
    if (!ID_ROUTES.has(route)) return { profile: out, error: "id_route is not a known value" };
    out.id_route = route;
  }
  return { profile: out };
}

export function patchProfile(
  existing: Record<string, unknown>,
  patch: Record<string, unknown>
): { profile: Record<string, unknown>; error?: string } {
  const merged: Record<string, unknown> = { ...existing };
  for (const [key, value] of Object.entries(patch)) {
    if (value === null) delete merged[key];
    else merged[key] = value;
  }
  const supportErr = assertNoSupportKeys(merged);
  if (supportErr) return { profile: merged, error: supportErr };
  return normalizeProfile(merged);
}

export function parseSupportBody(body: unknown): { support: SupportRecord; error?: string } | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const b = body as Record<string, unknown>;
  if (b.supportToken) return null;
  const needsRaw = b.needs;
  const normalized = normalizeSupportNeeds(needsRaw ?? [], true);
  if (!normalized.ok) return { support: { needs: [], shareWith: { platform: false, employers: false, partner: false } }, error: normalized.error };
  const shareWith = (b.shareWith ?? {}) as Record<string, unknown>;
  const support: SupportRecord = {
    needs: normalized.needs,
    shareWith: {
      platform: Boolean(shareWith.platform),
      employers: Boolean(shareWith.employers),
      partner: Boolean(shareWith.partner),
    },
  };
  return { support };
}