import { apiUrl } from "./apiBase";
import { audioTextHash } from "./audioHash";

export type AudioManifest = {
  am?: Record<string, string>;
  en?: Record<string, string>;
};

let manifestPromise: Promise<AudioManifest | null> | null = null;
let manifestCache: AudioManifest | null = null;

export function loadAudioManifest(): Promise<AudioManifest | null> {
  if (manifestCache) return Promise.resolve(manifestCache);
  if (!manifestPromise) {
    manifestPromise = (async () => {
      try {
        const res = await fetch(apiUrl("/audio/manifest.json"), { credentials: "omit" });
        if (!res.ok) return null;
        const data = (await res.json()) as AudioManifest;
        manifestCache = data;
        return data;
      } catch {
        return null;
      }
    })();
  }
  return manifestPromise;
}

export function hasRecordedAudio(manifest: AudioManifest | null, text: string, lang: "en" | "am"): boolean {
  if (!manifest || !text.trim()) return false;
  const hash = audioTextHash(lang, text);
  const rel = manifest[lang]?.[hash];
  return Boolean(rel);
}

/** Absolute URL for a pre-recorded clip, if present in the manifest. */
export function getRecordedAudioUrlFromManifest(
  manifest: AudioManifest | null,
  text: string,
  lang: "en" | "am"
): string | null {
  if (!manifest || !text.trim()) return null;
  const hash = audioTextHash(lang, text);
  const rel = manifest[lang]?.[hash];
  if (!rel) return null;
  return apiUrl(`/audio/${rel}`);
}

export { audioTextHash };