import { describe, expect, it } from "vitest";
import { matchesAllNeeds } from "../lib/jobMatch";

describe("matchesAllNeeds", () => {
  const job = { accommodations: ["screen_reader", "remote_option", "flexible_hours"] };

  it("matches all when no filters selected", () => {
    expect(matchesAllNeeds(job, [])).toBe(true);
  });

  it("matches when job offers every need", () => {
    expect(matchesAllNeeds(job, ["screen_reader", "remote_option"])).toBe(true);
  });

  it("rejects when a need is missing", () => {
    expect(matchesAllNeeds(job, ["quiet_room"])).toBe(false);
  });
});