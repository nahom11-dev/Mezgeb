import { describe, it, expect, beforeAll, afterAll } from "vitest";
import express from "express";
import http from "http";
import { loadSiteKeysFromEnv } from "../../server/siteKeys";
import { createV1Router } from "../../server/api/v1Router";
import { getStore, resetStoreForTests } from "../../server/api/store";
import fs from "fs";
import path from "path";

const SITE = "pk_test_api";
const SECRET = "sk_test_api";

describe("Level 2 /api/v1", () => {
  let base = "";
  let server: http.Server;

  beforeAll(async () => {
    resetStoreForTests();
    process.env.MEZGEB_SITE_KEYS = `${SITE}:${SECRET}`;
    process.env.DATA_DIR = path.join(process.cwd(), "data-test");
    process.env.MEZGEB_STORE = "json";
    fs.rmSync(process.env.DATA_DIR, { recursive: true, force: true });
    loadSiteKeysFromEnv();
    const app = express();
    app.use(express.json());
    app.use("/api/v1", createV1Router());
    server = http.createServer(app);
    await new Promise<void>((resolve) => server.listen(0, resolve));
    const addr = server.address();
    const port = typeof addr === "object" && addr ? addr.port : 0;
    base = `http://127.0.0.1:${port}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
    fs.rmSync(process.env.DATA_DIR!, { recursive: true, force: true });
  });

  function authHeaders() {
    return { Authorization: `Bearer ${SECRET}`, "Content-Type": "application/json" };
  }

  it("rejects missing auth with 401", async () => {
    const res = await fetch(`${base}/api/v1/learners`, { method: "POST", body: "{}" });
    expect(res.status).toBe(401);
  });

  it("creates learner with 201", async () => {
    const res = await fetch(`${base}/api/v1/learners`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        profile: { full_name: "Test Learner", phone: "0911223344", preferred_language: "am" },
        consent: { accepted: true, textVersion: "v1", language: "am" },
      }),
    });
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(String(data.id)).toMatch(/^lrn_/);
  });

  it("rejects support keys inside profile", async () => {
    const res = await fetch(`${base}/api/v1/learners`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        profile: { support_needs: ["screen_reader"] },
        consent: { accepted: true },
      }),
    });
    expect(res.status).toBe(400);
  });

  it("puts and gets support separately", async () => {
    const created = await fetch(`${base}/api/v1/learners`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        profile: { full_name: "Tigist" },
        consent: { accepted: true, textVersion: "v1", language: "am" },
      }),
    });
    const { id } = await created.json();
    const put = await fetch(`${base}/api/v1/learners/${id}/support`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({
        needs: ["screen_reader"],
        shareWith: { platform: true, employers: false, partner: false },
      }),
    });
    expect(put.status).toBe(200);
    const got = await fetch(`${base}/api/v1/learners/${id}`, { headers: authHeaders() });
    const learner = await got.json();
    expect(learner.profile.support_needs).toBeUndefined();
    const sup = await fetch(`${base}/api/v1/learners/${id}/support`, { headers: authHeaders() });
    expect((await sup.json()).needs).toContain("screen_reader");
  });

  it("returns 404 for wrong site secret", async () => {
    const created = await fetch(`${base}/api/v1/learners`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ profile: { full_name: "X" }, consent: { accepted: true } }),
    });
    const { id } = await created.json();
    const res = await fetch(`${base}/api/v1/learners/${id}`, {
      headers: { Authorization: "Bearer sk_other_site", "Content-Type": "application/json" },
    });
    expect(res.status).toBe(401);
  });
});