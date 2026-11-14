import fs from "fs";
import path from "path";
import crypto from "crypto";
import type { SupportRecord } from "../../src/lib/supportTypes";

export type ConsentRecord = {
  accepted: boolean;
  at?: string;
  textVersion?: string;
  language?: string;
};

export type LearnerRow = {
  id: string;
  siteKey: string;
  profile: Record<string, unknown>;
  consent: ConsentRecord;
  createdAt: string;
  updatedAt: string;
};

export type WebhookRow = {
  id: string;
  siteKey: string;
  url: string;
  events: string[];
  secret: string;
  createdAt: string;
};

export type WebhookDeliveryRow = {
  id: string;
  webhookId: string;
  event: string;
  status: string;
  attempts: number;
  lastError: string | null;
  createdAt: string;
};

export interface MezgebStore {
  createLearner(row: Omit<LearnerRow, "id" | "createdAt" | "updatedAt">): LearnerRow;
  getLearner(id: string, siteKey: string): LearnerRow | null;
  updateLearner(id: string, siteKey: string, profile: Record<string, unknown>): LearnerRow | null;
  deleteLearner(id: string, siteKey: string): boolean;
  putSupport(learnerId: string, siteKey: string, support: SupportRecord): SupportRecord & { updatedAt: string };
  getSupport(learnerId: string, siteKey: string): (SupportRecord & { updatedAt: string }) | null;
  deleteSupport(learnerId: string, siteKey: string): void;
  createWebhook(row: Omit<WebhookRow, "id" | "createdAt">): WebhookRow;
  listWebhooks(siteKey: string): Omit<WebhookRow, "secret">[];
  deleteWebhook(id: string, siteKey: string): boolean;
  getWebhook(id: string, siteKey: string): WebhookRow | null;
  listWebhooksForEvent(siteKey: string, event: string): WebhookRow[];
  recordDelivery(row: Omit<WebhookDeliveryRow, "id" | "createdAt">): void;
  listDeliveriesForLearner(learnerId: string, siteKey: string): { event: string; at: string }[];
}

type JsonDb = {
  learners: LearnerRow[];
  support: Record<string, SupportRecord & { updatedAt: string }>;
  webhooks: WebhookRow[];
  deliveries: WebhookDeliveryRow[];
};

function newId(prefix: string): string {
  return `${prefix}_${crypto.randomBytes(12).toString("base64url")}`;
}

function createJsonStore(dbPath: string): MezgebStore {
  const file = path.join(dbPath, "mezgeb.json");
  fs.mkdirSync(dbPath, { recursive: true });

  function read(): JsonDb {
    if (!fs.existsSync(file)) {
      return { learners: [], support: {}, webhooks: [], deliveries: [] };
    }
    return JSON.parse(fs.readFileSync(file, "utf8")) as JsonDb;
  }
  function write(db: JsonDb): void {
    fs.writeFileSync(file, JSON.stringify(db, null, 2));
  }

  return {
    createLearner(row) {
      const db = read();
      const now = new Date().toISOString();
      const learner: LearnerRow = { ...row, id: newId("lrn"), createdAt: now, updatedAt: now };
      db.learners.push(learner);
      write(db);
      return learner;
    },
    getLearner(id, siteKey) {
      const db = read();
      return db.learners.find((l) => l.id === id && l.siteKey === siteKey) ?? null;
    },
    updateLearner(id, siteKey, profile) {
      const db = read();
      const idx = db.learners.findIndex((l) => l.id === id && l.siteKey === siteKey);
      if (idx < 0) return null;
      db.learners[idx] = { ...db.learners[idx], profile, updatedAt: new Date().toISOString() };
      write(db);
      return db.learners[idx];
    },
    deleteLearner(id, siteKey) {
      const db = read();
      const before = db.learners.length;
      db.learners = db.learners.filter((l) => !(l.id === id && l.siteKey === siteKey));
      delete db.support[`${siteKey}:${id}`];
      write(db);
      return db.learners.length < before;
    },
    putSupport(learnerId, siteKey, support) {
      const db = read();
      const updatedAt = new Date().toISOString();
      const key = `${siteKey}:${learnerId}`;
      db.support[key] = { ...support, updatedAt };
      write(db);
      return db.support[key];
    },
    getSupport(learnerId, siteKey) {
      const db = read();
      return db.support[`${siteKey}:${learnerId}`] ?? null;
    },
    deleteSupport(learnerId, siteKey) {
      const db = read();
      delete db.support[`${siteKey}:${learnerId}`];
      write(db);
    },
    createWebhook(row) {
      const db = read();
      const wh: WebhookRow = { ...row, id: newId("whk"), createdAt: new Date().toISOString() };
      db.webhooks.push(wh);
      write(db);
      return wh;
    },
    listWebhooks(siteKey) {
      const db = read();
      return db.webhooks.filter((w) => w.siteKey === siteKey).map(({ secret: _s, ...rest }) => rest);
    },
    deleteWebhook(id, siteKey) {
      const db = read();
      const before = db.webhooks.length;
      db.webhooks = db.webhooks.filter((w) => !(w.id === id && w.siteKey === siteKey));
      write(db);
      return db.webhooks.length < before;
    },
    getWebhook(id, siteKey) {
      const db = read();
      return db.webhooks.find((w) => w.id === id && w.siteKey === siteKey) ?? null;
    },
    listWebhooksForEvent(siteKey, event) {
      const db = read();
      return db.webhooks.filter((w) => w.siteKey === siteKey && w.events.includes(event));
    },
    recordDelivery(row) {
      const db = read();
      db.deliveries.push({ ...row, id: newId("wdl"), createdAt: new Date().toISOString() });
      write(db);
    },
    listDeliveriesForLearner(_learnerId, _siteKey) {
      return [];
    },
  };
}

type SqlDb = {
  exec(sql: string): void;
  prepare(sql: string): {
    run(...args: unknown[]): void;
    get(...args: unknown[]): unknown;
    all(...args: unknown[]): unknown[];
  };
  close(): void;
};

function createSqliteStore(dbPath: string): (MezgebStore & { close?: () => void }) | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { DatabaseSync } = require("node:sqlite") as { DatabaseSync: new (path: string) => SqlDb };
    fs.mkdirSync(dbPath, { recursive: true });
    const dbFile = path.join(dbPath, "mezgeb.db");
    const db = new DatabaseSync(dbFile);
    db.exec(`
      CREATE TABLE IF NOT EXISTS learners (
        id TEXT PRIMARY KEY, site_key TEXT NOT NULL, profile TEXT NOT NULL,
        consent TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS learner_support (
        learner_id TEXT NOT NULL, site_key TEXT NOT NULL, support TEXT NOT NULL, updated_at TEXT NOT NULL,
        PRIMARY KEY (learner_id, site_key)
      );
      CREATE TABLE IF NOT EXISTS webhooks (
        id TEXT PRIMARY KEY, site_key TEXT NOT NULL, url TEXT NOT NULL, events TEXT NOT NULL,
        secret TEXT NOT NULL, created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS webhook_deliveries (
        id TEXT PRIMARY KEY, webhook_id TEXT NOT NULL, event TEXT NOT NULL, status TEXT NOT NULL,
        attempts INTEGER NOT NULL, last_error TEXT, created_at TEXT NOT NULL
      );
    `);

    const stmtInsertLearner = db.prepare(
      `INSERT INTO learners (id, site_key, profile, consent, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`
    );
    const stmtGetLearner = db.prepare(`SELECT * FROM learners WHERE id = ? AND site_key = ?`);
    const stmtUpdateLearner = db.prepare(`UPDATE learners SET profile = ?, updated_at = ? WHERE id = ? AND site_key = ?`);
    const stmtDeleteLearner = db.prepare(`DELETE FROM learners WHERE id = ? AND site_key = ?`);
    const stmtUpsertSupport = db.prepare(
      `INSERT INTO learner_support (learner_id, site_key, support, updated_at) VALUES (?, ?, ?, ?)
       ON CONFLICT(learner_id, site_key) DO UPDATE SET support = excluded.support, updated_at = excluded.updated_at`
    );
    const stmtGetSupport = db.prepare(`SELECT support, updated_at FROM learner_support WHERE learner_id = ? AND site_key = ?`);
    const stmtDeleteSupport = db.prepare(`DELETE FROM learner_support WHERE learner_id = ? AND site_key = ?`);
    const stmtInsertWebhook = db.prepare(
      `INSERT INTO webhooks (id, site_key, url, events, secret, created_at) VALUES (?, ?, ?, ?, ?, ?)`
    );
    const stmtListWebhooks = db.prepare(`SELECT * FROM webhooks WHERE site_key = ?`);
    const stmtGetWebhook = db.prepare(`SELECT * FROM webhooks WHERE id = ? AND site_key = ?`);
    const stmtDeleteWebhook = db.prepare(`DELETE FROM webhooks WHERE id = ? AND site_key = ?`);
    const stmtInsertDelivery = db.prepare(
      `INSERT INTO webhook_deliveries (id, webhook_id, event, status, attempts, last_error, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`
    );

    function rowToLearner(row: Record<string, unknown>): LearnerRow {
      return {
        id: String(row.id),
        siteKey: String(row.site_key),
        profile: JSON.parse(String(row.profile)) as Record<string, unknown>,
        consent: JSON.parse(String(row.consent)) as ConsentRecord,
        createdAt: String(row.created_at),
        updatedAt: String(row.updated_at),
      };
    }

    const store: MezgebStore & { close?: () => void } = {
      createLearner(row) {
        const now = new Date().toISOString();
        const learner: LearnerRow = { ...row, id: newId("lrn"), createdAt: now, updatedAt: now };
        stmtInsertLearner.run(
          learner.id,
          learner.siteKey,
          JSON.stringify(learner.profile),
          JSON.stringify(learner.consent),
          learner.createdAt,
          learner.updatedAt
        );
        return learner;
      },
      getLearner(id, siteKey) {
        const row = stmtGetLearner.get(id, siteKey) as Record<string, unknown> | undefined;
        return row ? rowToLearner(row) : null;
      },
      updateLearner(id, siteKey, profile) {
        const existing = store.getLearner(id, siteKey);
        if (!existing) return null;
        const updatedAt = new Date().toISOString();
        stmtUpdateLearner.run(JSON.stringify(profile), updatedAt, id, siteKey);
        return { ...existing, profile, updatedAt };
      },
      deleteLearner(id, siteKey) {
        const existing = store.getLearner(id, siteKey);
        if (!existing) return false;
        stmtDeleteLearner.run(id, siteKey);
        stmtDeleteSupport.run(id, siteKey);
        return true;
      },
      putSupport(learnerId, siteKey, support) {
        const updatedAt = new Date().toISOString();
        const payload = { ...support, updatedAt };
        stmtUpsertSupport.run(learnerId, siteKey, JSON.stringify(support), updatedAt);
        return payload;
      },
      getSupport(learnerId, siteKey) {
        const row = stmtGetSupport.get(learnerId, siteKey) as { support: string; updated_at: string } | undefined;
        if (!row) return null;
        const support = JSON.parse(row.support) as SupportRecord;
        return { ...support, updatedAt: row.updated_at };
      },
      deleteSupport(learnerId, siteKey) {
        stmtDeleteSupport.run(learnerId, siteKey);
      },
      createWebhook(row) {
        const wh: WebhookRow = { ...row, id: newId("whk"), createdAt: new Date().toISOString() };
        stmtInsertWebhook.run(wh.id, wh.siteKey, wh.url, JSON.stringify(wh.events), wh.secret, wh.createdAt);
        return wh;
      },
      listWebhooks(siteKey) {
        const rows = stmtListWebhooks.all(siteKey) as Record<string, unknown>[];
        return rows.map((r) => ({
          id: String(r.id),
          siteKey: String(r.site_key),
          url: String(r.url),
          events: JSON.parse(String(r.events)) as string[],
          createdAt: String(r.created_at),
        }));
      },
      deleteWebhook(id, siteKey) {
        const existing = store.getWebhook(id, siteKey);
        if (!existing) return false;
        stmtDeleteWebhook.run(id, siteKey);
        return true;
      },
      getWebhook(id, siteKey) {
        const row = stmtGetWebhook.get(id, siteKey) as Record<string, unknown> | undefined;
        if (!row) return null;
        return {
          id: String(row.id),
          siteKey: String(row.site_key),
          url: String(row.url),
          events: JSON.parse(String(row.events)) as string[],
          secret: String(row.secret),
          createdAt: String(row.created_at),
        };
      },
      listWebhooksForEvent(siteKey, event) {
        return store
          .listWebhooks(siteKey)
          .map((w) => store.getWebhook(w.id, siteKey)!)
          .filter((w) => w.events.includes(event));
      },
      recordDelivery(row) {
        stmtInsertDelivery.run(
          newId("wdl"),
          row.webhookId,
          row.event,
          row.status,
          row.attempts,
          row.lastError,
          new Date().toISOString()
        );
      },
      listDeliveriesForLearner(_learnerId, _siteKey) {
        return [];
      },
      close() {
        db.close();
      },
    };
    return store;
  } catch {
    return null;
  }
}

let singleton: MezgebStore | null = null;
let singletonCloser: (() => void) | null = null;
let singletonDir: string | null = null;

export function getStore(dataDir = process.env.DATA_DIR || "./data"): MezgebStore {
  const resolved = path.resolve(dataDir);
  if (singleton && singletonDir === resolved) return singleton;
  if (singletonCloser) {
    singletonCloser();
    singletonCloser = null;
  }
  singletonDir = resolved;
  const forceJson = String(process.env.MEZGEB_STORE ?? "").toLowerCase() === "json";
  const sqlite = forceJson ? null : createSqliteStore(resolved);
  if (sqlite) {
    singleton = sqlite;
    singletonCloser = sqlite.close?.bind(sqlite) ?? null;
  } else {
    singleton = createJsonStore(resolved);
  }
  return singleton;
}

export function resetStoreForTests(): void {
  if (singletonCloser) singletonCloser();
  singleton = null;
  singletonCloser = null;
  singletonDir = null;
}