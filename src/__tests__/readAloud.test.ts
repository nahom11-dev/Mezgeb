import { describe, expect, it } from "vitest";
import { speakWithAddis } from "../../server/addisSpeech";
import { speakWithElevenLabs, transcribeWithElevenLabs } from "../../server/elevenLabs";

type Call = { url: string; init?: RequestInit };
function stub(...responses: Response[]) {
  const calls: Call[] = [];
  const impl = (async (url: URL | string, init?: RequestInit) => {
    calls.push({ url: String(url), init });
    const next = responses.shift();
    if (!next) throw new Error("no more stub responses");
    return next;
  }) as unknown as typeof fetch;
  return { impl, calls };
}

const mp3 = new Uint8Array([0x49, 0x44, 0x33, 1, 2, 3]); // "ID3…"

describe("Addis AI read-aloud (Voices 2)", () => {
  it("generates with voice, language and mp3, then downloads the signed audio_url without the key", async () => {
    const { impl, calls } = stub(
      new Response(JSON.stringify({ data: { id: "clip_1", audio_url: "https://cdn.example/clip_1.mp3?sig=x" } }), { status: 200 }),
      new Response(mp3, { status: 200, headers: { "content-type": "audio/mpeg" } })
    );
    const out = await speakWithAddis("ስምዎ ማን ነው?", "am", { apiKey: "k", fetchImpl: impl });
    expect(out.ok).toBe(true);
    if (out.ok) {
      expect([...out.audio]).toEqual([...mp3]);
      expect(out.contentType).toBe("audio/mpeg");
    }
    expect(calls[0].url).toBe("https://api.addisassistant.com/api/v1/voice/generations");
    expect((calls[0].init!.headers as Record<string, string>)["x-api-key"]).toBe("k");
    const body = JSON.parse(String(calls[0].init!.body));
    expect(body).toMatchObject({ text: "ስምዎ ማን ነው?", voice_id: "am-hamen", language: "am", output_format: "mp3_44100" });
    expect(body.client_request_id).toMatch(/^mezgeb-/);
    expect(calls[1].url).toBe("https://cdn.example/clip_1.mp3?sig=x");
    expect(calls[1].init?.headers).toBeUndefined(); // key never sent to the storage host
  });

  it("uses an inline data URL when the reply has one", async () => {
    const dataUrl = `data:audio/mpeg;base64,${Buffer.from(mp3).toString("base64")}`;
    const { impl, calls } = stub(new Response(JSON.stringify({ data: { audio: dataUrl, audio_url: "https://cdn.example/x.mp3" } }), { status: 200 }));
    const out = await speakWithAddis("ሰላም", "am", { apiKey: "k", voiceId: "am-other", fetchImpl: impl });
    expect(out.ok && [...out.audio]).toEqual([...mp3]);
    expect(calls).toHaveLength(1);
    expect(JSON.parse(String(calls[0].init!.body)).voice_id).toBe("am-other");
  });

  it("refuses a non-https audio link and maps errors", async () => {
    const a = stub(new Response(JSON.stringify({ data: { audio_url: "http://insecure/x.mp3" } }), { status: 200 }));
    expect((await speakWithAddis("x", "am", { apiKey: "k", fetchImpl: a.impl })).ok).toBe(false);
    const b = stub(new Response("{}", { status: 402 }));
    expect(await speakWithAddis("x", "am", { apiKey: "k", fetchImpl: b.impl })).toEqual({ ok: false, status: 503, error: "Read-aloud service credit is used up." });
  });
});

describe("ElevenLabs", () => {
  it("text-to-speech: voice in the path, xi-api-key, flash model, free-plan MP3", async () => {
    const { impl, calls } = stub(new Response(mp3, { status: 200, headers: { "content-type": "audio/mpeg" } }));
    const out = await speakWithElevenLabs("What is your full name?", { apiKey: "el", fetchImpl: impl });
    expect(out.ok).toBe(true);
    const url = new URL(calls[0].url);
    expect(url.origin + url.pathname).toBe("https://api.elevenlabs.io/v1/text-to-speech/JBFqnCBsd6RMkjVDRZzb");
    expect(url.searchParams.get("output_format")).toBe("mp3_44100_128");
    expect((calls[0].init!.headers as Record<string, string>)["xi-api-key"]).toBe("el");
    expect(JSON.parse(String(calls[0].init!.body))).toEqual({ text: "What is your full name?", model_id: "eleven_flash_v2_5" });
  });

  it("speech-to-text: multipart file + scribe model + English, reads `text`", async () => {
    const { impl, calls } = stub(new Response(JSON.stringify({ language_code: "en", text: " Hana Tesfaye. " }), { status: 200 }));
    const out = await transcribeWithElevenLabs({ audio: Buffer.from("RIFF"), mimeType: "audio/wav", lang: "en" }, { apiKey: "el", fetchImpl: impl });
    expect(out).toEqual({ ok: true, text: "Hana Tesfaye." });
    expect(calls[0].url).toBe("https://api.elevenlabs.io/v1/speech-to-text");
    const form = calls[0].init!.body as FormData;
    expect(form.get("model_id")).toBe("scribe_v2");
    expect(form.get("language_code")).toBe("eng");
    expect((form.get("file") as File).name).toBe("answer.wav");
  });

  it.each([
    [401, 503],
    [402, 503],
    [429, 503],
    [422, 400],
    [500, 502],
  ])("maps HTTP %i to %i", async (upstream, expected) => {
    const { impl } = stub(new Response("{}", { status: upstream }));
    const out = await speakWithElevenLabs("x", { apiKey: "el", fetchImpl: impl });
    expect(out.ok).toBe(false);
    if (!out.ok) expect(out.status).toBe(expected);
  });
});
