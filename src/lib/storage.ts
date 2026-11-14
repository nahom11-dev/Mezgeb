const memoryFallback = new Map<string, string>();

export function safeGetStorage(key: string): { value: string | null; blocked: boolean } {
  try {
    const v = window.localStorage.getItem(key);
    return { value: v, blocked: false };
  } catch {
    return { value: memoryFallback.get(key) ?? null, blocked: true };
  }
}

export function safeSetStorage(key: string, value: string): { blocked: boolean } {
  memoryFallback.set(key, value);
  try {
    window.localStorage.setItem(key, value);
    return { blocked: false };
  } catch {
    return { blocked: true };
  }
}

export function safeRemoveStorage(key: string): { blocked: boolean } {
  memoryFallback.delete(key);
  try {
    window.localStorage.removeItem(key);
    return { blocked: false };
  } catch {
    return { blocked: true };
  }
}

export function safeGetSession(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return memoryFallback.get(`session:${key}`) ?? null;
  }
}

export function safeSetSession(key: string, value: string): void {
  memoryFallback.set(`session:${key}`, value);
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // Fallback already stored in memory
  }
}
