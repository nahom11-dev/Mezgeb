// Where the widget sends its API calls. Empty on the Mezgeb site itself (same origin).
// When embedded on another site, <mezgeb-register> sets it to Mezgeb's server origin.
let apiBase = "";

export function setApiBase(base: string): void {
  apiBase = base.replace(/\/+$/, "");
}

export function apiUrl(path: string): string {
  return /^https?:\/\//.test(path) ? path : `${apiBase}${path}`;
}
