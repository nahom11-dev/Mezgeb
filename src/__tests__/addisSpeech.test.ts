import { describe, expect, it } from "vitest";
import { transcribeWithAddis } from "../../server/addisSpeech";

function stubFetch(response: Response | Error) {
  const calls: { url: URL; init: RequestInit }[] = [];
  const impl = (async (url: URL, init: RequestInit) => {
    calls.push({ url, init });
    if (response instanceof Error) throw response;
    return response;
  }) as unknown as typeof fetch;
  return { impl, calls };
}

const audio = Buffer.from("RIFF....WAVEfmt ");

describe("Addis AI speech-to-text adapter", () => {
  it("sends the audio as multipart 'audio' with x-api-key, language and backend", async () => {
    const { impl, calls } = stubFetch(new Response(JSON.stringify({ data: { text: "ሐና ተስፋዬ", seconds: 2.1 } }), { status: 200 }));
    const out = await transcribeWithAddis({ audio, mimeType: "audio/wav", lang: "am" }, { apiKey: "test-key", fetchImpl: impl });

    expect(out).toEqual({ ok: true, text: "ሐና ተስፋዬ", seconds: 2.1 });
    const { url, init } = calls[0];
    expect(url.origin + url.pathname).toBe("https://api.addisassistant.com/api/v1/scribe/transcribe");
    expect(url.searchParams.get("language")).toBe("am");
    expect(url.searchParams.get("backend")).toBe("turbo");
    expect(url.searchParams.get("request_id")).toMatch(/^mezgeb-/);
    expect((init.headers as Record<string, string>)["x-api-key"]).toBe("test-key");
    const file = (init.body as FormData).get("audio") as File;
    expect(file.type).toBe("audio/wav");
    expect(file.name).toBe("answer.wav");
  });

  it("uses English and never sends 'standard' for English", async () => {
    const { impl, calls } = stubFetch(new Response(JSON.stringify({ data: { text: "hello" } }), { status: 200 }));
    await transcribeWithAddis({ audio, mimeType: "audio/webm;codecs=opus", lang: "en" }, { apiKey: "k", backend: "standard", fetchImpl: impl });
    expect(calls[0].url.searchParams.get("language")).toBe("en");
    expect(calls[0].url.searchParams.get("backend")).toBe("turbo");
    expect(((calls[0].init.body as FormData).get("audio") as File).name).toBe("answer.webm");
  });

  it("honours ADDIS_API_BASE and the standard backend for Amharic", async () => {
    const { impl, calls } = stubFetch(new Response(JSON.stringify({ data: { text: "x" } }), { status: 200 }));
    await transcribeWithAddis({ audio, mimeType: "audio/wav", lang: "am" }, { apiKey: "k", baseUrl: "http://localhost:9999/", backend: "standard", fetchImpl: impl });
    expect(calls[0].url.href.startsWith("http://localhost:9999/api/v1/scribe/transcribe?")).toBe(true);
    expect(calls[0].url.searchParams.get("backend")).toBe("standard");
  });

  it.each([
    [402, 503, "credit"],
    [429, 503, "busy"],
    [202, 503, "busy"],
    [401, 503, "key"],
    [422, 400, "could not be read"],
    [500, 502, "failed"],
  ])("maps HTTP %i to %i", async (upstream, expected, words) => {
    const { impl } = stubFetch(new Response("{}", { status: upstream }));
    const out = await transcribeWithAddis({ audio, mimeType: "audio/wav", lang: "am" }, { apiKey: "k", fetchImpl: impl });
    expect(out.ok).toBe(false);
    if (!out.ok) {
      expect(out.status).toBe(expected);
      expect(out.error).toContain(words);
    }
  });

  it("maps a timeout to 503", async () => {
    const err = new Error("timed out");
    err.name = "TimeoutError";
    const { impl } = stubFetch(err);
    const out = await transcribeWithAddis({ audio, mimeType: "audio/wav", lang: "am" }, { apiKey: "k", fetchImpl: impl });
    expect(out).toEqual({ ok: false, status: 503, error: "Speech service took too long. Please try again." });
  });

  it("rejects a reply with no transcript", async () => {
    const { impl } = stubFetch(new Response(JSON.stringify({ data: {} }), { status: 200 }));
    const out = await transcribeWithAddis({ audio, mimeType: "audio/wav", lang: "am" }, { apiKey: "k", fetchImpl: impl });
    expect(out.ok).toBe(false);
  });
});
