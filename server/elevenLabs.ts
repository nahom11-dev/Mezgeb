// ElevenLabs: English read-aloud (text-to-speech) and English voice answers (speech-to-text).
//   TTS: POST {base}/v1/text-to-speech/{voice_id}?output_format=mp3_44100_128  JSON { text, model_id } → MP3 bytes
//   STT: POST {base}/v1/speech-to-text  multipart { model_id, file, language_code } → { text }
// Auth header xi-api-key. Docs: https://elevenlabs.io/docs/api-reference/text-to-speech/convert
//                                https://elevenlabs.io/docs/api-reference/speech-to-text/convert
// The free plan includes both (10,000 credits a month); it has no commercial licence.

import type { AudioResult, SpeechResult } from "./addisSpeech";

export interface ElevenLabsConfig {
  apiKey: string;
  baseUrl?: string;
  voiceId?: string;
  ttsModel?: string;
  sttModel?: string;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}

export const ELEVENLABS_DEFAULT_BASE = "https://api.elevenlabs.io";
export const ELEVENLABS_DEFAULT_VOICE = "JBFqnCBsd6RMkjVDRZzb"; // premade voice "George"
export const ELEVENLABS_DEFAULT_TTS_MODEL = "eleven_flash_v2_5"; // cheapest/fastest (0.5–1 credit per character)
export const ELEVENLABS_DEFAULT_STT_MODEL = "scribe_v2";

function base(config: ElevenLabsConfig) {
  return (config.baseUrl || ELEVENLABS_DEFAULT_BASE).replace(/\/+$/, "");
}

function mapError(status: number, what: string): { ok: false; status: number; error: string } {
  console.error(`ElevenLabs ${what} failed: HTTP ${status}`);
  if (status === 401 || status === 403) return { ok: false, status: 503, error: `${what} service key rejected.` };
  if (status === 402) return { ok: false, status: 503, error: `${what} service credit is used up.` };
  if (status === 429) return { ok: false, status: 503, error: `${what} service is busy. Please try again.` };
  if (status === 400 || status === 422) return { ok: false, status: 400, error: `${what} request was rejected.` };
  return { ok: false, status: 502, error: `${what} service failed.` };
}

function networkError(err: unknown, what: string) {
  const timedOut = err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError");
  return { ok: false as const, status: 503, error: timedOut ? `${what} service took too long. Please try again.` : `${what} service unreachable.` };
}

/** English text → MP3 bytes. */
export async function speakWithElevenLabs(text: string, config: ElevenLabsConfig): Promise<AudioResult> {
  const doFetch = config.fetchImpl ?? fetch;
  const url = new URL(`${base(config)}/v1/text-to-speech/${encodeURIComponent(config.voiceId || ELEVENLABS_DEFAULT_VOICE)}`);
  url.searchParams.set("output_format", "mp3_44100_128"); // the best MP3 the free plan allows
  let res: Response;
  try {
    res = await doFetch(url, {
      method: "POST",
      headers: { "xi-api-key": config.apiKey, "Content-Type": "application/json", Accept: "audio/mpeg" },
      body: JSON.stringify({ text, model_id: config.ttsModel || ELEVENLABS_DEFAULT_TTS_MODEL }),
      signal: AbortSignal.timeout(config.timeoutMs ?? 15_000),
    });
  } catch (err) {
    return networkError(err, "Read-aloud");
  }
  if (!res.ok) return mapError(res.status, "Read-aloud");
  const audio = Buffer.from(await res.arrayBuffer());
  if (!audio.length) return { ok: false, status: 502, error: "Read-aloud service sent no audio." };
  return { ok: true, audio, contentType: res.headers.get("content-type")?.startsWith("audio/") ? res.headers.get("content-type")! : "audio/mpeg" };
}

/** Short English recording → transcript. */
export async function transcribeWithElevenLabs(
  params: { audio: Buffer; mimeType: string; lang: string },
  config: ElevenLabsConfig
): Promise<SpeechResult> {
  const doFetch = config.fetchImpl ?? fetch;
  const mime = params.mimeType.split(";")[0].trim().toLowerCase() || "audio/wav";
  const form = new FormData();
  form.append("model_id", config.sttModel || ELEVENLABS_DEFAULT_STT_MODEL);
  form.append("language_code", params.lang === "am" ? "amh" : "eng");
  form.append("tag_audio_events", "false"); // no "(laughs)" tags in a form answer
  form.append("file", new Blob([new Uint8Array(params.audio)], { type: mime }), mime === "audio/wav" ? "answer.wav" : "answer.webm");
  let res: Response;
  try {
    res = await doFetch(`${base(config)}/v1/speech-to-text`, {
      method: "POST",
      headers: { "xi-api-key": config.apiKey },
      body: form,
      signal: AbortSignal.timeout(config.timeoutMs ?? 12_000),
    });
  } catch (err) {
    return networkError(err, "Speech");
  }
  if (!res.ok) return mapError(res.status, "Speech");
  let body: { text?: unknown; transcripts?: { text?: unknown }[] };
  try {
    body = await res.json();
  } catch {
    return { ok: false, status: 502, error: "Speech service sent an unreadable reply." };
  }
  const text = typeof body?.text === "string" ? body.text : typeof body?.transcripts?.[0]?.text === "string" ? String(body.transcripts[0].text) : null;
  if (text === null) return { ok: false, status: 502, error: "Speech service sent no transcript." };
  return { ok: true, text: text.trim() };
}
