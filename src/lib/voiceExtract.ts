// Turn a plain speech transcript into a form answer, without an LLM.
// Used when the speech provider (Addis AI) only returns the words it heard: Gemini used to do this step itself.
// The learner always sees and can edit the result before it is saved, so a miss costs one edit, not wrong data.

export type VoiceConfidence = "high" | "medium" | "low";

export interface VoiceOption {
  value: string;
  label: string;
}

export interface ExtractedVoiceAnswer {
  value: string;
  confidence: VoiceConfidence;
  matchedValue: string | null;
}

// ---------------------------------------------------------------------------
// Text normalisation
// ---------------------------------------------------------------------------

/** Ethiopic letters that sound the same are written several ways (ሀ/ሐ/ኀ, ሰ/ሠ, አ/ዐ, ጸ/ፀ). Fold each family to one row. */
function foldEthiopic(text: string): string {
  let out = "";
  for (const ch of text) {
    const c = ch.codePointAt(0)!;
    let mapped = c;
    if (c >= 0x1210 && c <= 0x1217) mapped = c - 0x10; // ሐ row → ሀ row
    else if (c >= 0x1280 && c <= 0x1287) mapped = c - 0x80; // ኀ row → ሀ row
    else if (c >= 0x1220 && c <= 0x1227) mapped = c + 0x10; // ሠ row → ሰ row
    else if (c >= 0x12d0 && c <= 0x12d7) mapped = c - 0x30; // ዐ row → አ row
    else if (c >= 0x1340 && c <= 0x1347) mapped = c - 0x08; // ፀ row → ጸ row
    out += String.fromCodePoint(mapped);
  }
  return out;
}

const PUNCTUATION = /[.,!?;:"'“”‘’()[\]{}\-–—_/\\።፣፤፥፦፧፨…]+/g;

export function normalizeForMatch(text: string): string {
  return foldEthiopic(String(text ?? "").normalize("NFC").toLowerCase())
    .replace(PUNCTUATION, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(text: string): string[] {
  return normalizeForMatch(text).split(" ").filter(Boolean);
}

// ---------------------------------------------------------------------------
// Numbers: Amharic / English words, Ethiopic numerals and digits → digit string
// ---------------------------------------------------------------------------

type NumWord = { kind: "unit"; n: number } | { kind: "tens"; n: number } | { kind: "teen"; n: number } | { kind: "hundred" } | { kind: "double"; times: number } | { kind: "filler" };

const RAW_WORDS: [string[], NumWord][] = [
  // Amharic units
  [["ዜሮ", "ዜሮው", "ባዶ"], { kind: "unit", n: 0 }],
  [["አንድ"], { kind: "unit", n: 1 }],
  [["ሁለት"], { kind: "unit", n: 2 }],
  [["ሶስት", "ሦስት", "ሶሥት"], { kind: "unit", n: 3 }],
  [["አራት"], { kind: "unit", n: 4 }],
  [["አምስት"], { kind: "unit", n: 5 }],
  [["ስድስት"], { kind: "unit", n: 6 }],
  [["ሰባት"], { kind: "unit", n: 7 }],
  [["ስምንት"], { kind: "unit", n: 8 }],
  [["ዘጠኝ"], { kind: "unit", n: 9 }],
  // Amharic tens (አስራ = "ten-and", as in አስራ ሁለት = 12)
  [["አስር", "አሥር", "አስራ", "አሥራ"], { kind: "tens", n: 10 }],
  [["ሃያ", "ሀያ", "ኻያ"], { kind: "tens", n: 20 }],
  [["ሰላሳ", "ሠላሳ", "ሰላሣ", "ሠላሣ"], { kind: "tens", n: 30 }],
  [["አርባ"], { kind: "tens", n: 40 }],
  [["ሃምሳ", "ሀምሳ", "ሐምሳ", "ሃምሣ"], { kind: "tens", n: 50 }],
  [["ስልሳ", "ስድሳ", "ስልሣ", "ስድሣ"], { kind: "tens", n: 60 }],
  [["ሰባ"], { kind: "tens", n: 70 }],
  [["ሰማንያ", "ሰማኒያ"], { kind: "tens", n: 80 }],
  [["ዘጠና"], { kind: "tens", n: 90 }],
  [["መቶ"], { kind: "hundred" }],
  [["እና"], { kind: "filler" }],
  // English
  [["zero", "oh", "o"], { kind: "unit", n: 0 }],
  [["one"], { kind: "unit", n: 1 }],
  [["two"], { kind: "unit", n: 2 }],
  [["three"], { kind: "unit", n: 3 }],
  [["four"], { kind: "unit", n: 4 }],
  [["five"], { kind: "unit", n: 5 }],
  [["six"], { kind: "unit", n: 6 }],
  [["seven"], { kind: "unit", n: 7 }],
  [["eight"], { kind: "unit", n: 8 }],
  [["nine"], { kind: "unit", n: 9 }],
  [["ten"], { kind: "teen", n: 10 }],
  [["eleven"], { kind: "teen", n: 11 }],
  [["twelve"], { kind: "teen", n: 12 }],
  [["thirteen"], { kind: "teen", n: 13 }],
  [["fourteen"], { kind: "teen", n: 14 }],
  [["fifteen"], { kind: "teen", n: 15 }],
  [["sixteen"], { kind: "teen", n: 16 }],
  [["seventeen"], { kind: "teen", n: 17 }],
  [["eighteen"], { kind: "teen", n: 18 }],
  [["nineteen"], { kind: "teen", n: 19 }],
  [["twenty"], { kind: "tens", n: 20 }],
  [["thirty"], { kind: "tens", n: 30 }],
  [["forty", "fourty"], { kind: "tens", n: 40 }],
  [["fifty"], { kind: "tens", n: 50 }],
  [["sixty"], { kind: "tens", n: 60 }],
  [["seventy"], { kind: "tens", n: 70 }],
  [["eighty"], { kind: "tens", n: 80 }],
  [["ninety"], { kind: "tens", n: 90 }],
  [["hundred"], { kind: "hundred" }],
  [["double"], { kind: "double", times: 2 }],
  [["triple"], { kind: "double", times: 3 }],
  [["and"], { kind: "filler" }],
];

const NUM_WORDS = new Map<string, NumWord>();
for (const [forms, meaning] of RAW_WORDS) for (const f of forms) NUM_WORDS.set(foldEthiopic(f), meaning);
// Longest first, so ሰባት (7) wins over ሰባ (70) when a token is split into words.
const NUM_WORD_KEYS = [...NUM_WORDS.keys()].sort((a, b) => b.length - a.length);

/** Split a token like "አስራሁለት" into known number words; null if it isn't made only of number words. */
function splitNumberToken(token: string): NumWord[] | null {
  const direct = NUM_WORDS.get(token);
  if (direct) return [direct];
  if (/[a-z]/.test(token)) return null; // English words are spaced; don't split "often" into "o"+"ften".
  const parts: NumWord[] = [];
  let rest = token;
  while (rest) {
    const key = NUM_WORD_KEYS.find((k) => rest.startsWith(k) && k.length > 1);
    if (!key) return null;
    parts.push(NUM_WORDS.get(key)!);
    rest = rest.slice(key.length);
  }
  return parts;
}

/** Ethiopic numerals ፩–፱ (1–9), ፲–፺ (10–90), ፻ (100) in one token → number. */
function ethiopicNumeralValue(token: string): number | null {
  if (!/^[፩-፼]+$/.test(token)) return null;
  let total = 0;
  let group = 0;
  for (const ch of token) {
    const c = ch.codePointAt(0)!;
    if (c >= 0x1369 && c <= 0x1371) group += c - 0x1368;
    else if (c >= 0x1372 && c <= 0x137a) group += (c - 0x1371) * 10;
    else if (c === 0x137b) {
      total += (group || 1) * 100;
      group = 0;
    } else return null;
  }
  return total + group;
}

/**
 * Every number spoken in the transcript, written out as digits in the order spoken.
 * "ዜሮ ዘጠኝ አስራ አንድ ሃያ ሁለት" → "091122"; "zero nine double one" → "0911"; "0911 22 33 44" → "0911223344".
 */
export function spokenDigits(transcript: string): string {
  let out = "";
  let hundreds: number | null = null;
  let tens: number | null = null;
  let unit: number | null = null;
  let repeat = 1;

  const flush = () => {
    if (hundreds === null && tens === null && unit === null) return;
    out += String((hundreds ?? 0) + (tens ?? 0) + (unit ?? 0));
    hundreds = tens = unit = null;
  };

  const onWord = (w: NumWord) => {
    switch (w.kind) {
      case "filler":
        return;
      case "double":
        flush();
        repeat = w.times;
        return;
      case "unit":
        if (repeat > 1) {
          flush();
          out += String(w.n).repeat(repeat);
          repeat = 1;
          return;
        }
        if (unit !== null) flush();
        if (tens !== null || hundreds !== null) {
          unit = w.n;
          flush();
        } else {
          unit = w.n; // may still become "N hundred"
        }
        return;
      case "teen":
        if (unit !== null || tens !== null) flush();
        tens = w.n;
        flush();
        return;
      case "tens":
        if (unit !== null || tens !== null) flush();
        tens = w.n;
        return;
      case "hundred":
        if (unit !== null && tens === null && hundreds === null) {
          hundreds = unit * 100;
          unit = null;
        } else {
          flush();
          hundreds = 100;
        }
        return;
    }
  };

  for (const raw of String(transcript ?? "").normalize("NFC").toLowerCase().split(/[\s,.;:!?።፣፤፥\-–—/]+/)) {
    const token = foldEthiopic(raw).replace(/^\+/, "");
    if (!token) continue;
    if (/^\d+$/.test(token)) {
      flush();
      out += token;
      continue;
    }
    const eth = ethiopicNumeralValue(token);
    if (eth !== null) {
      flush();
      out += String(eth);
      continue;
    }
    const words = splitNumberToken(token);
    if (words) {
      words.forEach(onWord);
      continue;
    }
    // A token that mixes digits and letters ("0911abc"): keep the digits.
    const digits = token.replace(/\D/g, "");
    if (digits) {
      flush();
      out += digits;
    }
  }
  flush();
  return out;
}

/** Spoken Ethiopian phone number → 10 digits starting 09/07 where possible ("+251 9…" → "09…"). */
export function spokenPhone(transcript: string): string {
  let d = spokenDigits(transcript);
  if (d.startsWith("251") && d.length === 12) d = `0${d.slice(3)}`;
  else if (/^[97]\d{8}$/.test(d)) d = `0${d}`;
  return d;
}

// ---------------------------------------------------------------------------
// Choices
// ---------------------------------------------------------------------------

const YES_WORDS = new Set(["yes", "yeah", "yep", "yup", "sure", "ok", "okay", "አዎ", "አዎን", "እሺ", "ትክክል"].map((w) => foldEthiopic(w)));
const NO_WORDS = new Set(["no", "nope", "not", "አይ", "አይደለም", "የለም", "አልፈልግም"].map((w) => foldEthiopic(w)));

function yesNoOption(said: string[], options: VoiceOption[]): string | null {
  const yesOpt = options.find((o) => /^(yes|true|y)$/i.test(o.value));
  const noOpt = options.find((o) => /^(no|false|n)$/i.test(o.value));
  if (!yesOpt || !noOpt) return null;
  const saidNo = said.some((w) => NO_WORDS.has(w));
  const saidYes = said.some((w) => YES_WORDS.has(w));
  if (saidNo && !saidYes) return noOpt.value;
  if (saidYes && !saidNo) return yesOpt.value;
  return null;
}

const ETHIOPIC = /^[ሀ-፿]+$/;

/**
 * Does a spoken word stand for this label word? Amharic adds short prefixes and suffixes
 * (በአዲስ = "in Addis", ከተማው = "the city"), so an Ethiopic word may carry up to 2 extra letters
 * before and 3 after. English words must match exactly (or with a plural "s").
 */
function wordMatches(spoken: string, labelWord: string): boolean {
  if (spoken === labelWord) return true;
  if (!ETHIOPIC.test(labelWord)) return spoken === `${labelWord}s` || labelWord === `${spoken}s`;
  if (labelWord.length < 2) return false;
  const at = spoken.indexOf(labelWord);
  return at >= 0 && at <= 2 && spoken.length - at - labelWord.length <= 3;
}

/** Pick the option the learner said, or null if none (or two) fit. */
export function matchSpokenOption(transcript: string, options: VoiceOption[]): string | null {
  if (!options.length) return null;
  const said = tokens(transcript);
  if (!said.length) return null;

  const yn = yesNoOption(said, options);
  if (yn) return yn;

  const saidText = ` ${said.join(" ")} `;
  const scored = options.map((o) => {
    const label = normalizeForMatch(o.label);
    const valueText = normalizeForMatch(o.value.replace(/_/g, " "));
    let score = 0;
    for (const candidate of [label, valueText]) {
      if (!candidate) continue;
      if (saidText.includes(` ${candidate} `)) score = Math.max(score, 1000 + candidate.length);
      const words = candidate.split(" ").filter((w) => w.length >= 2);
      if (words.length) {
        const hit = words.filter((w) => said.some((s) => wordMatches(s, w))).length;
        score = Math.max(score, Math.round((hit / words.length) * 100));
      }
    }
    return { value: o.value, score };
  });
  scored.sort((a, b) => b.score - a.score);
  const [best, second] = scored;
  if (!best || best.score < 50) return null;
  if (second && second.score === best.score) return null; // ambiguous: let the learner choose
  return best.value;
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

function cleanText(transcript: string): string {
  return String(transcript ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[.።!]+$/u, "")
    .trim();
}

function spokenEmail(transcript: string): string {
  return String(transcript ?? "")
    .toLowerCase()
    .replace(/\s+(at|ኣት|አት)\s+/g, "@")
    .replace(/\s+(dot|ነጥብ)\s+/g, ".")
    .replace(/\s+/g, "")
    .replace(/\.+$/, "");
}

const CHOICE_TYPES = new Set(["choice", "multichoice", "yes-no", "id-routes", "support"]);

export function extractVoiceAnswer(params: {
  transcript: string;
  expectedType?: string;
  options?: VoiceOption[];
}): ExtractedVoiceAnswer {
  const transcript = String(params.transcript ?? "");
  const type = String(params.expectedType ?? "text");
  const options = params.options ?? [];

  if (!transcript.trim()) return { value: "", confidence: "low", matchedValue: null };

  if (options.length > 0 || CHOICE_TYPES.has(type)) {
    const matchedValue = matchSpokenOption(transcript, options);
    return { value: cleanText(transcript), confidence: matchedValue ? "medium" : "low", matchedValue };
  }

  if (type === "phone") {
    const value = spokenPhone(transcript);
    return { value, confidence: /^0[97]\d{8}$/.test(value) ? "high" : "low", matchedValue: null };
  }

  if (type === "number") {
    const value = spokenDigits(transcript);
    return { value, confidence: value ? "medium" : "low", matchedValue: null };
  }

  if (type === "email") {
    const value = spokenEmail(transcript);
    return { value, confidence: /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value) ? "medium" : "low", matchedValue: null };
  }

  const value = cleanText(transcript);
  return { value, confidence: value ? "medium" : "low", matchedValue: null };
}
