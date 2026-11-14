import { flushOutboxForSite, type FlushedOutboxItem } from "./outbox";

/** Serialize flushes so only one runs at a time across all embed instances. */
let flushChain: Promise<void> = Promise.resolve();

export type OutboxSentHandler = (item: FlushedOutboxItem) => void;

/**
 * Flush this site's outbox when the element connects and when the browser goes online.
 * Returns a disconnect function that removes the `online` listener.
 */
export function attachEmbedOutboxSync(siteKey: string, onItemSent: OutboxSentHandler): () => void {
  if (!siteKey || typeof window === "undefined") return () => {};

  const runFlush = () => {
    if (!navigator.onLine) return;
    flushChain = flushChain.then(async () => {
      let sent: FlushedOutboxItem[];
      try {
        sent = await flushOutboxForSite(siteKey);
      } catch {
        return;
      }
      for (const item of sent) onItemSent(item);
    });
  };

  const onOnline = () => runFlush();
  window.addEventListener("online", onOnline);
  runFlush();

  return () => window.removeEventListener("online", onOnline);
}