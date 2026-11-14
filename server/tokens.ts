import crypto from "crypto";
import type { SupportRecord } from "../src/lib/supportTypes";
import { profileContainsSupportKey } from "../src/lib/validation";
import { getSiteKeys, secretsMatch } from "./siteKeys";

const TOKEN_TTL_MS = Number(process.env.MEZGEB_TOKEN_TTL_MS) || 5 * 60_000;

type Registration = { siteKey: string; profile: Record<string, unknown>; createdAt: number; expiresAt: number };
type SupportRegistration = { siteKey: string; support: SupportRecord; createdAt: number; expiresAt: number };

const registrations = new Map<string, Registration>();
const supportTokens = new Map<string, SupportRegistration>();

function sweepRegistrations() {
  const cutoff = Date.now() - 10 * 60_000;
  for (const [token, reg] of registrations) if (reg.expiresAt < cutoff) registrations.delete(token);
  for (const [token, reg] of supportTokens) if (reg.expiresAt < cutoff) supportTokens.delete(token);
}

export function rejectSupportInProfile(profile: unknown): string | null {
  if (!profile || typeof profile !== "object" || Array.isArray(profile)) return "Missing registration profile";
  return profileContainsSupportKey(profile as Record<string, unknown>);
}

export function createRegistration(
  siteKey: unknown,
  profile: unknown
): { token: string; expiresAt: number } | { error: string; status: number } {
  if (typeof siteKey !== "string" || !getSiteKeys().has(siteKey)) return { error: "Unknown site key", status: 400 };
  if (!profile || typeof profile !== "object" || Array.isArray(profile)) return { error: "Missing registration profile", status: 400 };
  const supportKey = profileContainsSupportKey(profile as Record<string, unknown>);
  if (supportKey) {
    return {
      error: "Support choices must be sent separately to POST /v1/support",
      status: 400,
    };
  }
  sweepRegistrations();
  const token = `mzg_tok_${crypto.randomBytes(24).toString("base64url")}`;
  const now = Date.now();
  registrations.set(token, {
    siteKey,
    profile: profile as Record<string, unknown>,
    createdAt: now,
    expiresAt: now + TOKEN_TTL_MS,
  });
  return { token, expiresAt: now + TOKEN_TTL_MS };
}

export function createSupportToken(
  siteKey: unknown,
  support: unknown
): { token: string; expiresAt: number } | { error: string; status: number } {
  if (typeof siteKey !== "string" || !getSiteKeys().has(siteKey)) return { error: "Unknown site key", status: 400 };
  if (!support || typeof support !== "object" || Array.isArray(support)) return { error: "Missing support record", status: 400 };
  sweepRegistrations();
  const token = `mzg_sup_${crypto.randomBytes(24).toString("base64url")}`;
  const now = Date.now();
  supportTokens.set(token, {
    siteKey,
    support: support as SupportRecord,
    createdAt: now,
    expiresAt: now + TOKEN_TTL_MS,
  });
  return { token, expiresAt: now + TOKEN_TTL_MS };
}

export type ExchangeResult = { status: number; body: Record<string, unknown> };

export function exchangeRegistrationToken(token: unknown, secret: string): ExchangeResult {
  if (!secret) return { status: 401, body: { error: "Missing secret key (Authorization: Bearer sk_…)" } };
  if (typeof token !== "string" || !token) return { status: 400, body: { error: "Missing token" } };
  sweepRegistrations();
  const reg = registrations.get(token);
  if (!reg) return { status: 404, body: { error: "Unknown or already used token" } };
  if (!secretsMatch(secret, getSiteKeys().get(reg.siteKey) ?? "")) return { status: 401, body: { error: "Wrong secret key" } };
  registrations.delete(token);
  if (Date.now() > reg.expiresAt) return { status: 410, body: { error: "Token expired" } };
  return {
    status: 200,
    body: { profile: reg.profile, siteKey: reg.siteKey, createdAt: new Date(reg.createdAt).toISOString() },
  };
}

export function exchangeSupportToken(token: unknown, secret: string): ExchangeResult {
  if (!secret) return { status: 401, body: { error: "Missing secret key (Authorization: Bearer sk_…)" } };
  if (typeof token !== "string" || !token) return { status: 400, body: { error: "Missing token" } };
  sweepRegistrations();
  const reg = supportTokens.get(token);
  if (!reg) return { status: 404, body: { error: "Unknown or already used token" } };
  if (!secretsMatch(secret, getSiteKeys().get(reg.siteKey) ?? "")) return { status: 401, body: { error: "Wrong secret key" } };
  supportTokens.delete(token);
  if (Date.now() > reg.expiresAt) return { status: 410, body: { error: "Token expired" } };
  return {
    status: 200,
    body: { support: reg.support, siteKey: reg.siteKey, createdAt: new Date(reg.createdAt).toISOString() },
  };
}

/** Used by Level 2 API to exchange without consuming if already used internally — export peek for tests */
export function consumeRegistrationToken(token: string, secret: string): ExchangeResult {
  return exchangeRegistrationToken(token, secret);
}

export function consumeSupportToken(token: string, secret: string): ExchangeResult {
  return exchangeSupportToken(token, secret);
}

export function deleteTokensForLearner(_learnerId: string): void {
  // Level 2 will map learnerId ↔ pending tokens; no-op for handoff-only tokens until API links them
}