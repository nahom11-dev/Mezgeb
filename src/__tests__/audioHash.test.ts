import { describe, expect, it } from "vitest";
import { audioTextHash } from "../lib/audioHash";
import { hasRecordedAudio } from "../lib/recordedAudio";

describe("audioTextHash", () => {
  it("is stable for the same text", () => {
    expect(audioTextHash("en", "Hello")).toBe(audioTextHash("en", "Hello"));
  });

  it("differs by language", () => {
    expect(audioTextHash("en", "Hello")).not.toBe(audioTextHash("am", "Hello"));
  });

  it("returns 16 hex characters", () => {
    expect(audioTextHash("am", "ሰላም")).toMatch(/^[a-f0-9]{16}$/);
  });
});

describe("recorded audio source order helpers", () => {
  it("detects manifest entries", () => {
    const hash = audioTextHash("am", "ቃል");
    const manifest = { am: { [hash]: `am/${hash}.mp3` } };
    expect(hasRecordedAudio(manifest, "ቃል", "am")).toBe(true);
    expect(hasRecordedAudio(manifest, "other", "am")).toBe(false);
  });
});