import { describe, expect, it } from "vitest";
import { extractVoiceAnswer, matchSpokenOption, spokenDigits, spokenPhone } from "../lib/voiceExtract";

describe("spoken numbers → digits", () => {
  it("reads Amharic digits one by one", () => {
    expect(spokenPhone("ዜሮ ዘጠኝ አንድ አንድ ሁለት ሁለት ሶስት ሶስት አራት አራት")).toBe("0911223344");
  });

  it("reads Amharic two-digit groups (አስራ አንድ = 11, ሃያ ሁለት = 22)", () => {
    expect(spokenPhone("ዜሮ ዘጠኝ አስራ አንድ ሃያ ሁለት ሰላሳ ሶስት አርባ አራት")).toBe("0911223344");
  });

  it("accepts spelling variants and joined words", () => {
    expect(spokenDigits("ሦስት ሠላሳ")).toBe("330");
    expect(spokenDigits("አስራሁለት")).toBe("12");
    expect(spokenDigits("ሰባት ሰባ")).toBe("770");
  });

  it("reads hundreds", () => {
    expect(spokenDigits("ዘጠኝ መቶ አስራ ሁለት")).toBe("912");
    expect(spokenDigits("nine hundred and twelve")).toBe("912");
  });

  it("reads English digits, teens, tens and 'double'", () => {
    expect(spokenPhone("zero nine one one, twenty two, thirty three, double four")).toBe("0911223344");
    expect(spokenDigits("oh seven eleven")).toBe("0711");
  });

  it("keeps digits the transcriber already wrote, and Ethiopic numerals", () => {
    expect(spokenPhone("0911 22 33 44.")).toBe("0911223344");
    expect(spokenDigits("፲፪")).toBe("12");
    expect(spokenDigits("፳፭")).toBe("25");
  });

  it("turns +251 and a missing leading 0 into the local form", () => {
    expect(spokenPhone("+251 911 22 33 44")).toBe("0911223344");
    expect(spokenPhone("911223344")).toBe("0911223344");
  });

  it("ignores words that are not numbers", () => {
    expect(spokenDigits("ስልኬ ዜሮ ዘጠኝ ነው")).toBe("09");
    expect(spokenDigits("my number is often busy")).toBe("");
  });
});

describe("spoken choice → option", () => {
  const areas = [
    { value: "addis", label: "Addis Ababa" },
    { value: "adama", label: "Adama" },
    { value: "bahir_dar", label: "Bahir Dar" },
  ];
  const areasAm = [
    { value: "addis", label: "አዲስ አበባ" },
    { value: "adama", label: "አዳማ" },
    { value: "bahir_dar", label: "ባሕር ዳር" },
  ];

  it("matches an English label inside a sentence", () => {
    expect(matchSpokenOption("I live in Bahir Dar.", areas)).toBe("bahir_dar");
  });

  it("matches an Amharic label, with prefixes and spelling variants", () => {
    expect(matchSpokenOption("የምኖረው በአዲስ አበባ ነው።", areasAm)).toBe("addis");
    expect(matchSpokenOption("ባህር ዳር", areasAm)).toBe("bahir_dar");
  });

  it("returns null when nothing fits", () => {
    expect(matchSpokenOption("Gondar", areas)).toBeNull();
  });

  it("understands yes and no in both languages", () => {
    const yesNo = [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ];
    expect(matchSpokenOption("አዎ", yesNo)).toBe("yes");
    expect(matchSpokenOption("አይ አልፈልግም", yesNo)).toBe("no");
    expect(matchSpokenOption("No, thank you", yesNo)).toBe("no");
  });

  it("matches the option value when the label differs", () => {
    const ids = [
      { value: "refugee_id", label: "Refugee ID card" },
      { value: "partner_pending", label: "Refer me through a partner" },
    ];
    expect(matchSpokenOption("refugee id", ids)).toBe("refugee_id");
    expect(matchSpokenOption("through a partner please", ids)).toBe("partner_pending");
  });
});

describe("extractVoiceAnswer", () => {
  it("phone: high confidence only for a valid Ethiopian number", () => {
    expect(extractVoiceAnswer({ transcript: "ዜሮ ዘጠኝ አስራ አንድ ሃያ ሁለት ሰላሳ ሶስት አርባ አራት", expectedType: "phone" })).toEqual({
      value: "0911223344",
      confidence: "high",
      matchedValue: null,
    });
    expect(extractVoiceAnswer({ transcript: "ዜሮ ዘጠኝ", expectedType: "phone" }).confidence).toBe("low");
  });

  it("text: trims and drops the closing full stop", () => {
    expect(extractVoiceAnswer({ transcript: " ሐና ተስፋዬ። ", expectedType: "text" }).value).toBe("ሐና ተስፋዬ");
    expect(extractVoiceAnswer({ transcript: "Hana Tesfaye.", expectedType: "text" }).value).toBe("Hana Tesfaye");
  });

  it("email: 'at' and 'dot' become symbols", () => {
    expect(extractVoiceAnswer({ transcript: "hana at gmail dot com", expectedType: "email" }).value).toBe("hana@gmail.com");
  });

  it("choice: returns matchedValue", () => {
    const out = extractVoiceAnswer({
      transcript: "Adama",
      expectedType: "choice",
      options: [
        { value: "addis", label: "Addis Ababa" },
        { value: "adama", label: "Adama" },
      ],
    });
    expect(out.matchedValue).toBe("adama");
  });

  it("empty transcript: low confidence, nothing filled", () => {
    expect(extractVoiceAnswer({ transcript: "  ", expectedType: "text" })).toEqual({ value: "", confidence: "low", matchedValue: null });
  });
});

describe("WAV encoding", () => {
  it("writes a 16 kHz mono 16-bit PCM header and samples", async () => {
    const { encodeWav16 } = await import("../lib/wav");
    const wav = encodeWav16(new Float32Array([0, 1, -1]), 16000);
    const view = new DataView(wav.buffer);
    expect(String.fromCharCode(...wav.slice(0, 4))).toBe("RIFF");
    expect(String.fromCharCode(...wav.slice(8, 12))).toBe("WAVE");
    expect(view.getUint16(22, true)).toBe(1);
    expect(view.getUint32(24, true)).toBe(16000);
    expect(view.getUint32(40, true)).toBe(6);
    expect([view.getInt16(44, true), view.getInt16(46, true), view.getInt16(48, true)]).toEqual([0, 32767, -32768]);
  });
});
