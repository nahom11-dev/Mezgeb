import { describe, expect, it } from "vitest";
import {
  buildProgressSnapshot,
  parseSavedProgress,
  resolveResumeStep,
} from "../lib/resumeStep";

const ALL = [
  { id: "a" },
  { id: "b" },
  { id: "c" },
  { id: "d" },
];

describe("resolveResumeStep", () => {
  it("resolves by questionId when visible", () => {
    const visible = [{ id: "a" }, { id: "c" }];
    expect(resolveResumeStep({ questionId: "c", stepIndex: 1, answers: {} }, visible, ALL)).toBe(1);
  });

  it("falls back to nearest earlier visible when question hidden", () => {
    const visible = [{ id: "a" }, { id: "d" }];
    expect(resolveResumeStep({ questionId: "c", stepIndex: 2, answers: {} }, visible, ALL)).toBe(0);
  });

  it("uses stepIndex for legacy records", () => {
    const visible = [{ id: "a" }, { id: "b" }];
    expect(resolveResumeStep({ stepIndex: 1, answers: {} }, visible, ALL)).toBe(1);
  });

  it("returns 0 for broken JSON shape via parse", () => {
    expect(parseSavedProgress("not json")).toBeNull();
    expect(parseSavedProgress("{}")).toBeNull();
  });

  it("handles review marker", () => {
    const visible = [{ id: "a" }, { id: "b" }];
    expect(resolveResumeStep({ questionId: "__review__", answers: {} }, visible, ALL)).toBe(2);
  });
});

describe("buildProgressSnapshot", () => {
  it("stores question id for current step", () => {
    const snap = buildProgressSnapshot(1, [{ id: "a" }, { id: "b" }], { x: "1" });
    expect(snap.questionId).toBe("b");
    expect(snap.version).toBe(1);
  });
});