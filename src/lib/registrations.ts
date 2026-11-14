import { apiUrl } from "./apiBase";
import type { SupportRecord } from "./supportTypes";

/**
 * Stores the confirmed profile on the Mezgeb server and returns a one-time token.
 * The platform's server exchanges that token (+ its secret key) at POST /v1/registrations/exchange.
 */
export async function createRegistration(siteKey: string, profile: Record<string, unknown>): Promise<string> {
  const res = await fetch(apiUrl("/v1/registrations"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ siteKey, profile }),
  });
  if (!res.ok) throw new Error(`Registration failed (HTTP ${res.status})`);
  const data = await res.json();
  if (typeof data.token !== "string" || !data.token) throw new Error("Registration returned no token");
  return data.token;
}

/** Support choices are stored separately from the profile (Fix 11). */
export async function createSupportToken(siteKey: string, support: SupportRecord): Promise<string> {
  const res = await fetch(apiUrl("/v1/support"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ siteKey, support }),
  });
  if (!res.ok) throw new Error(`Support token failed (HTTP ${res.status})`);
  const data = await res.json();
  if (typeof data.token !== "string" || !data.token) throw new Error("Support returned no token");
  return data.token;
}
