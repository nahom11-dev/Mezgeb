import crypto from "crypto";

/** MEZGEB_SITE_KEYS="pk_test_savanna:sk_test_…,pk_live_x:sk_live_…" (publishable:secret pairs) */
const SITE_KEYS = new Map<string, string>();
const SECRET_TO_PK = new Map<string, string>();

export function loadSiteKeysFromEnv(env = process.env.MEZGEB_SITE_KEYS ?? ""): void {
  SITE_KEYS.clear();
  SECRET_TO_PK.clear();
  for (const pair of env.split(",")) {
    const [pk, sk] = pair.split(":").map((s) => s?.trim());
    if (pk && sk) {
      SITE_KEYS.set(pk, sk);
      SECRET_TO_PK.set(sk, pk);
    }
  }
}

export function getSiteKeys(): Map<string, string> {
  return SITE_KEYS;
}

export function siteKeyForSecret(secret: string): string | undefined {
  return SECRET_TO_PK.get(secret);
}

export function secretsMatch(given: string, expected: string): boolean {
  if (!given || !expected) return false;
  const a = crypto.createHash("sha256").update(given).digest();
  const b = crypto.createHash("sha256").update(expected).digest();
  return crypto.timingSafeEqual(a, b);
}
