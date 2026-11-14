// Browsers record webm/opus (Chrome, Firefox) or mp4 (Safari). Speech services all accept WAV
// (Addis AI documents only WAV), so recordings are converted here: 16 kHz, mono, 16-bit PCM.
// 20 seconds ≈ 640 KB. If the browser can't decode the recording, the original is sent unchanged.

const TARGET_RATE = 16_000;

/** Float samples (-1..1) → 16-bit PCM WAV bytes. */
export function encodeWav16(samples: Float32Array, sampleRate: number): Uint8Array {
  const bytes = new Uint8Array(44 + samples.length * 2);
  const view = new DataView(bytes.buffer);
  const ascii = (offset: number, text: string) => {
    for (let i = 0; i < text.length; i++) view.setUint8(offset + i, text.charCodeAt(i));
  };
  ascii(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  ascii(8, "WAVE");
  ascii(12, "fmt ");
  view.setUint32(16, 16, true); // fmt chunk size
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // byte rate
  view.setUint16(32, 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  ascii(36, "data");
  view.setUint32(40, samples.length * 2, true);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return bytes;
}

/** Recording → 16 kHz mono WAV blob, or the original blob if it can't be decoded here. */
export async function blobToWav16k(blob: Blob): Promise<Blob> {
  const Ctx: typeof AudioContext | undefined =
    typeof window !== "undefined"
      ? window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      : undefined;
  if (!Ctx || typeof OfflineAudioContext === "undefined") return blob;
  let ctx: AudioContext | null = null;
  try {
    ctx = new Ctx();
    const decoded = await ctx.decodeAudioData(await blob.arrayBuffer());
    const length = Math.max(1, Math.ceil(decoded.duration * TARGET_RATE));
    const offline = new OfflineAudioContext(1, length, TARGET_RATE); // 1 channel: mixes stereo down
    const source = offline.createBufferSource();
    source.buffer = decoded;
    source.connect(offline.destination);
    source.start();
    const rendered = await offline.startRendering();
    const wav = encodeWav16(rendered.getChannelData(0), TARGET_RATE);
    return new Blob([wav.buffer as ArrayBuffer], { type: "audio/wav" });
  } catch {
    return blob;
  } finally {
    ctx?.close().catch(() => {});
  }
}
