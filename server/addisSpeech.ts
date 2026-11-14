// Addis AI speech-to-text (Scribe): https://docs.addisassistant.com/docs/capabilities/speech-to-text
//   POST {base}/api/v1/scribe/transcribe?language=am|en&backend=turbo|standard&request_id=…
//   header x-api-key, multipart field "audio" → { data: { text, seconds, … } }
// The audio stays in memory: it is never written to disk or logged, and neither is the transcript.

import crypto from "crypto";

export interface AddisConfig {
  apiKey: string;
  baseUrl?: string;
  backend?: string;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}

export type SpeechResult =
  | { ok: true; text: string; seconds?: number }
  | { ok: false; status: number; error: string };
export type AddisResult = SpeechResult;

export type AudioResult =
  | { ok: true; audio: Buffer; contentType: string }
  | { ok: false; status: number; error: string };

export const ADDIS_DEFAULT_BASE = "https://api.addisassistant.com";
export const ADDIS_DEFAULT_VOICE = "am-hamen";

const EXTENSIONS: Record<string, string> = {
  "audio/wav": "wav",
  "audio/x-wav": "wav",
  "audio/wave": "wav",
  "audio/webm": "webm",
  "audio/ogg": "ogg",
  "audio/mp4": "m4a",
  "audio/mpeg": "mp3",
};

export async function transcribeWithAddis(
  params: { audio: Buffer; mimeType: string; lang: string },
  config: AddisConfig
): Promise<AddisResult> {
  const doFetch = config.fetchImpl ?? fetch;
  const base = (config.baseUrl || ADDIS_DEFAULT_BASE).replace(/\/+$/, "");
  const language = params.lang === "en" ? "en" : "am";
  // "standard" is Amharic-only; use turbo for English whatever the setting.
  const backend = config.backend === "standard" && language === "am" ? "standard" : "turbo";
  const url = new URL(`${base}/api/v1/scribe/transcribe`);
  url.searchParams.set("language", language);
  url.searchParams.set("backend", backend);
  url.searchParams.set("request_id", `mezgeb-${crypto.randomUUID()}`);

  const mime = params.mimeType.split(";")[0].trim().toLowerCase() || "audio/wav";
  const form = new FormData();
  form.append("audio", new Blob([new Uint8Array(params.audio)], { type: mime }), `answer.${EXTENSIONS[mime] ?? "wav"}`);

  let res: Response;
  try {
    res = await doFetch(url, {
      method: "POST",
      headers: { "x-api-key": config.apiKey },
      body: form,
      signal: AbortSignal.timeout(config.timeoutMs ?? 12_000),
    });
  } catch (err) {
    const timedOut = err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError");
    return { ok: false, status: 503, error: timedOut ? "Speech service took too long. Please try again." : "Speech service unreachable." };
  }

  if (res.status === 202) return { ok: false, status: 503, error: "Speech service is busy. Please try again." };
  if (!res.ok) {
    console.error(`Addis AI speech-to-text failed: HTTP ${res.status}`);
    if (res.status === 401 || res.status === 403) return { ok: false, status: 503, error: "Speech service key rejected." };
    if (res.status === 402) return { ok: false, status: 503, error: "Speech service credit is used up." };
    if (res.status === 429) return { ok: false, status: 503, error: "Speech service is busy. Please try again." };
    if (res.status === 413 || res.status === 422) return { ok: false, status: 400, error: "The recording could not be read." };
    return { ok: false, status: 502, error: "Speech service failed." };
  }

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    return { ok: false, status: 502, error: "Speech service sent an unreadable reply." };
  }
  const data = (body as { data?: { text?: unknown; transcription?: unknown; seconds?: unknown } })?.data;
  const text = typeof data?.text === "string" ? data.text : typeof data?.transcription === "string" ? data.transcription : null;
  if (text === null) return { ok: false, status: 502, error: "Speech service sent no transcript." };
  return { ok: true, text: text.trim(), seconds: typeof data?.seconds === "number" ? data.seconds : undefined };
}

// ---------------------------------------------------------------------------
// Addis AI text-to-speech (Voices 2): https://docs.addisassistant.com/docs/capabilities/text-to-speech
//   POST {base}/api/v1/voice/generations  JSON { text, voice_id, language, output_format, client_request_id }
//   → { data: { audio_url, … } }  (a signed link to the MP3, fetched here so the browser never needs the key)
// Billed per generated minute of audio. Mezgeb only sends template text (questions, hints, errors), never answers.
// ---------------------------------------------------------------------------

export interface AddisVoiceConfig extends AddisConfig {
  voiceId?: string;
}

/** Find an inline "data:audio/…;base64,…" value anywhere in the reply (the docs say one may be included). */
function findDataUrl(value: unknown, depth = 0): string | null {
  if (typeof value === "string") return value.startsWith("data:audio/") ? value : null;
  if (!value || typeof value !== "object" || depth > 3) return null;
  for (const v of Object.values(value)) {
    const hit = findDataUrl(v, depth + 1);
    if (hit) return hit;
  }
  return null;
}

/** Amharic (or Afaan Oromo, Tigrinya…) text → MP3 bytes. */
export async function speakWithAddis(text: string, lang: string, config: AddisVoiceConfig): Promise<AudioResult> {
  const doFetch = config.fetchImpl ?? fetch;
  const baseUrl = (config.baseUrl || ADDIS_DEFAULT_BASE).replace(/\/+$/, "");
  const signal = () => AbortSignal.timeout(config.timeoutMs ?? 15_000);
  let res: Response;
  try {
    res = await doFetch(`${baseUrl}/api/v1/voice/generations`, {
      method: "POST",
      headers: { "x-api-key": config.apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        voice_id: config.voiceId || ADDIS_DEFAULT_VOICE,
        language: lang,
        output_format: "mp3_44100",
        client_request_id: `mezgeb-${crypto.randomUUID()}`,
      }),
      signal: signal(),
    });
  } catch (err) {
    const timedOut = err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError");
    return { ok: false, status: 503, error: timedOut ? "Read-aloud service took too long." : "Read-aloud service unreachable." };
  }
  if (!res.ok) {
    console.error(`Addis AI text-to-speech failed: HTTP ${res.status}`);
    if (res.status === 402) return { ok: false, status: 503, error: "Read-aloud service credit is used up." };
    if (res.status === 429 || res.status === 409) return { ok: false, status: 503, error: "Read-aloud service is busy." };
    if (res.status === 400 || res.status === 422) return { ok: false, status: 400, error: "Read-aloud request was rejected." };
    return { ok: false, status: 502, error: "Read-aloud service failed." };
  }

  let body: { data?: { audio_url?: unknown } } & Record<string, unknown>;
  try {
    body = await res.json();
  } catch {
    return { ok: false, status: 502, error: "Read-aloud service sent an unreadable reply." };
  }

  const inline = findDataUrl(body);
  if (inline) {
    const comma = inline.indexOf(",");
    const contentType = inline.slice(5, inline.indexOf(";")) || "audio/mpeg";
    return { ok: true, audio: Buffer.from(inline.slice(comma + 1), "base64"), contentType };
  }

  const audioUrl = typeof body?.data?.audio_url === "string" ? body.data.audio_url : null;
  if (!audioUrl || !/^https:\/\//.test(audioUrl)) return { ok: false, status: 502, error: "Read-aloud service sent no audio." };
  try {
    // Signed link: no API key sent to the storage host.
    const file = await doFetch(audioUrl, { signal: signal() });
    if (!file.ok) return { ok: false, status: 502, error: "Read-aloud audio could not be downloaded." };
    const audio = Buffer.from(await file.arrayBuffer());
    const type = file.headers.get("content-type") ?? "";
    return { ok: true, audio, contentType: type.startsWith("audio/") ? type : "audio/mpeg" };
  } catch {
    return { ok: false, status: 503, error: "Read-aloud audio could not be downloaded." };
  }
}
