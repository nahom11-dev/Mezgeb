import type { Request, Response, NextFunction } from "express";
import { getSiteKeys, secretsMatch, siteKeyForSecret } from "../siteKeys";

export type AuthedRequest = Request & { siteKey?: string; secret?: string };

export function requireSiteSecret(req: AuthedRequest, res: Response, next: NextFunction): void {
  const auth = String(req.headers.authorization ?? "");
  const secret = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!secret) {
    res.status(401).json({ error: "Missing or wrong secret key" });
    return;
  }
  const pk = siteKeyForSecret(secret);
  if (!pk) {
    res.status(401).json({ error: "Missing or wrong secret key" });
    return;
  }
  const expected = getSiteKeys().get(pk);
  if (!expected || !secretsMatch(secret, expected)) {
    res.status(401).json({ error: "Missing or wrong secret key" });
    return;
  }
  req.siteKey = pk;
  req.secret = secret;
  next();
}