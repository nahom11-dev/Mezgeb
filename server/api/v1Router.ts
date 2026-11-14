import { Router } from "express";
import { requireSiteSecret, type AuthedRequest } from "./auth";
import { getStore } from "./store";
import { assertNoSupportKeys, normalizeProfile, patchProfile, parseSupportBody } from "./learnerValidation";
import { consumeRegistrationToken, consumeSupportToken } from "../tokens";
import { emitWebhook } from "./webhookDispatch";

const ALLOWED_WEBHOOK_EVENTS = new Set([
  "learner.created",
  "learner.updated",
  "learner.support_updated",
  "learner.deleted",
  "registration.completed",
]);

export function createV1Router(): Router {
  const r = Router();
  r.use(requireSiteSecret);

  r.post("/learners", (req: AuthedRequest, res) => {
    const store = getStore();
    const siteKey = req.siteKey!;

    if (req.body?.registrationToken) {
      const out = consumeRegistrationToken(String(req.body.registrationToken), req.secret!);
      if (out.status !== 200) return res.status(out.status).json(out.body);
      const profile = out.body.profile as Record<string, unknown>;
      const consent = req.body.consent ?? { accepted: true, textVersion: "v1", language: profile.preferred_language ?? "am" };
      if (consent?.accepted !== true) {
        return res.status(400).json({ error: "Consent is required to store a learner" });
      }
      const learner = store.createLearner({ siteKey, profile, consent });
      emitWebhook(store, siteKey, "learner.created", learner.id);
      res.status(201).location(`/api/v1/learners/${learner.id}`).json({ id: learner.id });
      return;
    }

    const profile = req.body?.profile;
    const consent = req.body?.consent;
    if (!profile || typeof profile !== "object") {
      return res.status(400).json({ error: "Missing profile object", field: "profile" });
    }
    const supportErr = assertNoSupportKeys(profile as Record<string, unknown>);
    if (supportErr) return res.status(400).json({ error: supportErr });
    if (consent?.accepted !== true) {
      return res.status(400).json({ error: "Consent is required to store a learner" });
    }
    const normalized = normalizeProfile(profile as Record<string, unknown>);
    if (normalized.error) return res.status(400).json({ error: normalized.error });
    const learner = store.createLearner({ siteKey, profile: normalized.profile, consent });
    emitWebhook(store, siteKey, "learner.created", learner.id);
    res.status(201).location(`/api/v1/learners/${learner.id}`).json({ id: learner.id });
  });

  r.get("/learners/:id", (req: AuthedRequest, res) => {
    const learner = getStore().getLearner(req.params.id, req.siteKey!);
    if (!learner) return res.status(404).json({ error: "Learner not found" });
    res.json({
      id: learner.id,
      profile: learner.profile,
      consent: learner.consent,
      createdAt: learner.createdAt,
      updatedAt: learner.updatedAt,
    });
  });

  r.patch("/learners/:id", (req: AuthedRequest, res) => {
    const store = getStore();
    const existing = store.getLearner(req.params.id, req.siteKey!);
    if (!existing) return res.status(404).json({ error: "Learner not found" });

    if (req.body?.registrationToken) {
      const out = consumeRegistrationToken(String(req.body.registrationToken), req.secret!);
      if (out.status !== 200) return res.status(out.status).json(out.body);
      const patched = patchProfile(existing.profile, out.body.profile as Record<string, unknown>);
      if (patched.error) return res.status(400).json({ error: patched.error });
      const updated = store.updateLearner(existing.id, req.siteKey!, patched.profile);
      emitWebhook(store, req.siteKey!, "learner.updated", existing.id);
      return res.json(updated);
    }

    const patch = req.body?.profile;
    if (!patch || typeof patch !== "object") {
      return res.status(400).json({ error: "Missing profile patch", field: "profile" });
    }
    const patched = patchProfile(existing.profile, patch as Record<string, unknown>);
    if (patched.error) return res.status(400).json({ error: patched.error });
    const updated = store.updateLearner(existing.id, req.siteKey!, patched.profile);
    emitWebhook(store, req.siteKey!, "learner.updated", existing.id);
    res.json(updated);
  });

  r.put("/learners/:id/support", (req: AuthedRequest, res) => {
    const store = getStore();
    const learner = store.getLearner(req.params.id, req.siteKey!);
    if (!learner) return res.status(404).json({ error: "Learner not found" });

    let support;
    if (req.body?.supportToken) {
      const out = consumeSupportToken(String(req.body.supportToken), req.secret!);
      if (out.status !== 200) return res.status(out.status).json(out.body);
      support = out.body.support;
    } else {
      const parsed = parseSupportBody(req.body);
      if (!parsed) return res.status(400).json({ error: "Invalid support body" });
      if (parsed.error) return res.status(400).json({ error: parsed.error });
      support = parsed.support;
    }
    const saved = store.putSupport(learner.id, req.siteKey!, support as import("../../src/lib/supportTypes").SupportRecord);
    emitWebhook(store, req.siteKey!, "learner.support_updated", learner.id);
    res.json({ needs: saved.needs, shareWith: saved.shareWith, updatedAt: saved.updatedAt });
  });

  r.get("/learners/:id/support", (req: AuthedRequest, res) => {
    const support = getStore().getSupport(req.params.id, req.siteKey!);
    if (!support) return res.status(404).json({ error: "Support record not found" });
    res.json(support);
  });

  r.get("/learners/:id/export", (req: AuthedRequest, res) => {
    const store = getStore();
    const learner = store.getLearner(req.params.id, req.siteKey!);
    if (!learner) return res.status(404).json({ error: "Learner not found" });
    const support = store.getSupport(learner.id, req.siteKey!);
    const doc = {
      exportedAt: new Date().toISOString(),
      learner: {
        id: learner.id,
        profile: learner.profile,
        consent: learner.consent,
        createdAt: learner.createdAt,
        updatedAt: learner.updatedAt,
      },
      support,
      webhookEventsSent: store.listDeliveriesForLearner(learner.id, req.siteKey!),
    };
    res.setHeader("Content-Disposition", `attachment; filename="mezgeb-export-${learner.id}.json"`);
    res.json(doc);
  });

  r.delete("/learners/:id", (req: AuthedRequest, res) => {
    const ok = getStore().deleteLearner(req.params.id, req.siteKey!);
    if (!ok) return res.status(404).json({ error: "Learner not found" });
    emitWebhook(getStore(), req.siteKey!, "learner.deleted", req.params.id);
    res.sendStatus(204);
  });

  r.post("/webhooks", (req: AuthedRequest, res) => {
    const url = String(req.body?.url ?? "");
    const events = req.body?.events;
    if (!url || !Array.isArray(events) || events.length === 0) {
      return res.status(400).json({ error: "url and events are required" });
    }
  const allowed =
    url.startsWith("https://") ||
    url.startsWith("http://localhost") ||
    url.startsWith("http://127.0.0.1");
    if (!allowed) return res.status(400).json({ error: "Webhook url must be https or localhost for testing" });
    for (const ev of events) {
      if (!ALLOWED_WEBHOOK_EVENTS.has(String(ev))) {
        return res.status(400).json({ error: `Unknown webhook event: ${ev}` });
      }
    }
    const secret = `whsec_${cryptoRandom()}`;
    const wh = getStore().createWebhook({
      siteKey: req.siteKey!,
      url,
      events: events.map(String),
      secret,
    });
    res.status(201).json({ id: wh.id, url: wh.url, events: wh.events, secret });
  });

  r.get("/webhooks", (req: AuthedRequest, res) => {
    res.json({ webhooks: getStore().listWebhooks(req.siteKey!) });
  });

  r.delete("/webhooks/:id", (req: AuthedRequest, res) => {
    const ok = getStore().deleteWebhook(req.params.id, req.siteKey!);
    if (!ok) return res.status(404).json({ error: "Webhook not found" });
    res.sendStatus(204);
  });

  return r;
}

function cryptoRandom(): string {
  const c = globalThis.crypto;
  if (c?.getRandomValues) {
    const buf = new Uint8Array(24);
    c.getRandomValues(buf);
    return Buffer.from(buf).toString("base64url");
  }
  return Math.random().toString(36).slice(2);
}