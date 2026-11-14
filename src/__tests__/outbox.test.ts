import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import {
  outboxItemsForSite,
  flushOutboxForSite,
  addOutboxItem,
  type OutboxRegistration,
} from "../lib/outbox";

describe("outboxItemsForSite", () => {
  const items: OutboxRegistration[] = [
    { id: "a", createdAt: "", profile: {}, supportShared: false, siteKey: "pk_a" },
    { id: "b", createdAt: "", profile: {}, supportShared: false, siteKey: "pk_b" },
    { id: "c", createdAt: "", profile: {}, supportShared: false },
  ];

  it("returns only items matching the site key", () => {
    expect(outboxItemsForSite(items, "pk_a").map((i) => i.id)).toEqual(["a"]);
    expect(outboxItemsForSite(items, "pk_b").map((i) => i.id)).toEqual(["b"]);
    expect(outboxItemsForSite(items, "pk_c")).toEqual([]);
  });

  it("returns nothing for empty site key", () => {
    expect(outboxItemsForSite(items, "")).toEqual([]);
  });
});

describe("flushOutboxForSite", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("navigator", { onLine: true });
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("removes only successfully sent items", async () => {
    await addOutboxItem({
      id: "flush_ok",
      createdAt: "",
      profile: { name: "x" },
      supportShared: false,
      siteKey: "pk_site",
    });
    await addOutboxItem({
      id: "flush_bad",
      createdAt: "",
      profile: { name: "y" },
      supportShared: false,
      siteKey: "pk_site",
    });

    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: "mzg_tok_a" }),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: "fail" }),
      });

    const sent = await flushOutboxForSite("pk_site");
    expect(sent).toHaveLength(1);
    expect(sent[0].outboxId).toBe("flush_ok");

    const retry = await flushOutboxForSite("pk_site");
    expect(retry).toHaveLength(0);
  });

  it("does not flush another site's items", async () => {
    await addOutboxItem({
      id: "other_site",
      createdAt: "",
      profile: {},
      supportShared: false,
      siteKey: "pk_other",
    });

    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ token: "mzg_tok_x" }),
    });

    const sent = await flushOutboxForSite("pk_mine");
    expect(sent).toHaveLength(0);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});