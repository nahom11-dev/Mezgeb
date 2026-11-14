import { describe, expect, it } from "vitest";
import {
  LOCAL_SUPPORT_STORAGE_KEY,
  loadLocalSupportNeeds,
  saveLocalSupportNeeds,
  clearLocalSupportNeeds,
} from "../lib/localSupportMemory";

describe("localSupportMemory", () => {
  it("saves and loads needs", () => {
    const storage = new Map<string, string>();
    const win = { localStorage: { getItem: (k: string) => storage.get(k) ?? null, setItem: (k: string, v: string) => storage.set(k, v), removeItem: (k: string) => storage.delete(k) } };
    const w = win as unknown as Window;
    saveLocalSupportNeeds(["screen_reader"], w);
    expect(loadLocalSupportNeeds(w)).toEqual(["screen_reader"]);
    clearLocalSupportNeeds(w);
    expect(loadLocalSupportNeeds(w)).toBeNull();
    expect(LOCAL_SUPPORT_STORAGE_KEY).toBe("mezgeb:support:local");
  });
});