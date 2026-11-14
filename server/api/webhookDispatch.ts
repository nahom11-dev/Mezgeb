import crypto from "crypto";
import type { MezgebStore } from "./store";

const RETRY_MS = [10_000, 60_000, 300_000];

export type WebhookEventName =
  | "learner.created"
  | "learner.updated"
  | "learner.support_updated"
  | "learner.deleted"
  | "registration.completed";

export function signBody(secret: string, rawBody: string): string {
  const hex = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return `sha256=${hex}`;
}

async function postOnce(url: string, secret: string, payload: object): Promise<{ ok: boolean; error?: string }> {
  const body = JSON.stringify(payload);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Mezgeb-Event": String((payload as { event?: string }).event ?? ""),
        "Mezgeb-Signature": signBody(secret, body),
      },
      body,
      signal: controller.signal,
    });
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Request failed" };
  } finally {
    clearTimeout(timer);
  }
}

export function emitWebhook(
  store: MezgebStore,
  siteKey: string,
  event: WebhookEventName,
  learnerId: string
): void {
  const hooks = store.listWebhooksForEvent(siteKey, event);
  if (!hooks.length) return;
  const occurredAt = new Date().toISOString();
  const payload = { id: `evt_${crypto.randomBytes(8).toString("hex")}`, event, occurredAt, learnerId };

  for (const hook of hooks) {
    void (async () => {
      let attempt = 0;
      let lastError: string | null = null;
      let status = "failed";
      while (attempt < 4) {
        const result = await postOnce(hook.url, hook.secret, payload);
        attempt++;
        if (result.ok) {
          status = "delivered";
          lastError = null;
          break;
        }
        lastError = result.error ?? "failed";
        if (attempt < 4) await new Promise((r) => setTimeout(r, RETRY_MS[attempt - 1] ?? 300_000));
      }
      store.recordDelivery({
        webhookId: hook.id,
        event,
        status,
        attempts: attempt,
        lastError,
      });
    })();
  }
}