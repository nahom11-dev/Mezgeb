import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";
import { buildJsonLdBlocks } from "../../scripts/build-jobs-jsonld";

describe("JobPosting JSON-LD", () => {
  const jobs = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "savanna/data/jobs.json"), "utf8")
  ).jobs;

  it("includes required schema.org fields and ISO dates", () => {
    const blocks = buildJsonLdBlocks(jobs.slice(0, 1));
    const parsed = JSON.parse(blocks.match(/<script[^>]*>\s*([\s\S]*?)\s*<\/script>/)![1]);
    expect(parsed["@type"]).toBe("JobPosting");
    expect(parsed.title).toBeTruthy();
    expect(parsed.datePosted).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(parsed.validThrough).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(Array.isArray(parsed.jobBenefits)).toBe(true);
    expect(parsed.jobBenefits.length).toBeGreaterThan(0);
  });
});