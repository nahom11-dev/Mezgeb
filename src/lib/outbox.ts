import { apiUrl } from "./apiBase";

export interface OutboxRegistration {
  id: string;
  createdAt: string;
  profile: Record<string, unknown>;
  supportShared: boolean;
  siteKey?: string;
}

const DB_NAME = "mezgeb_offline_db";
const STORE_NAME = "outbox";
const memoryOutbox = new Map<string, OutboxRegistration>();

function openOutboxDb(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === "undefined") return Promise.resolve(null);
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id" });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function addOutboxItem(item: OutboxRegistration): Promise<void> {
  // Never store unshared support needs in outbox
  const sanitizedProfile = { ...item.profile };
  if (!item.supportShared) {
    delete sanitizedProfile.support_needs;
  }
  const safeItem: OutboxRegistration = { ...item, profile: sanitizedProfile };
  memoryOutbox.set(safeItem.id, safeItem);

  const db = await openOutboxDb();
  if (!db) return;
  await new Promise<void>((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).put(safeItem);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

export async function getOutboxItems(): Promise<OutboxRegistration[]> {
  const db = await openOutboxDb();
  if (!db) return Array.from(memoryOutbox.values());
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, "readonly");
      const req = tx.objectStore(STORE_NAME).getAll();
      req.onsuccess = () => {
        const items = Array.isArray(req.result) ? (req.result as OutboxRegistration[]) : [];
        resolve(items);
      };
      req.onerror = () => resolve(Array.from(memoryOutbox.values()));
    } catch {
      resolve(Array.from(memoryOutbox.values()));
    }
  });
}

export async function removeOutboxItem(id: string): Promise<void> {
  memoryOutbox.delete(id);
  const db = await openOutboxDb();
  if (!db) return;
  await new Promise<void>((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

export type FlushedOutboxItem = {
  outboxId: string;
  token: string;
  profile: Record<string, unknown>;
};

/** Items that belong to this publishable site key (others stay in the outbox). */
export function outboxItemsForSite(items: OutboxRegistration[], siteKey: string): OutboxRegistration[] {
  const key = siteKey.trim();
  if (!key) return [];
  return items.filter((item) => (item.siteKey ?? "").trim() === key);
}

async function postOutboxItem(item: OutboxRegistration): Promise<FlushedOutboxItem | null> {
  const siteKey = (item.siteKey ?? "").trim();
  if (!siteKey) return null;
  try {
    const res = await fetch(apiUrl("/api/registrations/outbox"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, profile: item.profile, siteKey }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (typeof data.token !== "string") return null;
    await removeOutboxItem(item.id);
    return { outboxId: item.id, token: data.token, profile: item.profile };
  } catch {
    return null;
  }
}

export async function flushOutboxForSite(siteKey: string): Promise<FlushedOutboxItem[]> {
  const key = siteKey.trim();
  if (!key) return [];
  const items = await getOutboxItems();
  const mine = outboxItemsForSite(items, key);
  const sent: FlushedOutboxItem[] = [];

  for (const item of mine) {
    const result = await postOutboxItem(item);
    if (result) sent.push(result);
    else if (typeof navigator !== "undefined" && !navigator.onLine) break;
  }

  return sent;
}
