export const LOCAL_SUPPORT_STORAGE_KEY = "mezgeb:support:local";

type Saved = { needs: string[]; savedAt: string };

export function loadLocalSupportNeeds(win: Window = window): string[] | null {
  try {
    const raw = win.localStorage.getItem(LOCAL_SUPPORT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Saved;
    if (!Array.isArray(parsed.needs)) return null;
    return parsed.needs.map(String);
  } catch {
    return null;
  }
}

export function saveLocalSupportNeeds(needs: string[], win: Window = window): void {
  const payload: Saved = { needs, savedAt: new Date().toISOString() };
  win.localStorage.setItem(LOCAL_SUPPORT_STORAGE_KEY, JSON.stringify(payload));
}

export function clearLocalSupportNeeds(win: Window = window): void {
  win.localStorage.removeItem(LOCAL_SUPPORT_STORAGE_KEY);
}