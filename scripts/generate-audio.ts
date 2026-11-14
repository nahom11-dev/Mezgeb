/**
 * Generate pre-recorded read-aloud clips for embed templates.
 *   npx tsx scripts/generate-audio.ts
 * Requires ADDIS_API_KEY and ELEVENLABS_API_KEY in .env (Amharic / English).
 */
import "dotenv/config";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { speakWithAddis } from "../server/addisSpeech";
import { speakWithElevenLabs } from "../server/elevenLabs";
import { translations } from "../src/i18n";
import type { MezgebTemplate } from "../src/templates/types";
import {
  EMPLOYER_TEMPLATE,
  JOB_APPLICATION_TEMPLATE,
  JOB_SEEKER_TEMPLATE,
  LEARNING_PLATFORM_TEMPLATE,
  PROGRAMME_INTAKE_TEMPLATE,
} from "../src/templates/index";

const EMBED_TEMPLATES: MezgebTemplate[] = [
  LEARNING_PLATFORM_TEMPLATE,
  JOB_SEEKER_TEMPLATE,
  EMPLOYER_TEMPLATE,
  PROGRAMME_INTAKE_TEMPLATE,
  JOB_APPLICATION_TEMPLATE,
];

const OUT_DIR = path.resolve("public/audio");
const MANIFEST_PATH = path.join(OUT_DIR, "manifest.json");

const WIDGET_I18N_KEYS = [
  "widgetOfflineQueuedTitle",
  "widgetQueuedRegistrationSent",
  "widgetSuccessTitle",
  "widgetSuccessBody",
  "helpErrREQUIRED",
  "helpErrPHONE_INVALID",
  "helpTypeText",
  "helpTypePhone",
  "helpTypeChoice",
  "widgetNoAmharicVoice",
] as const;

function hashKey(lang: string, text: string): string {
  return crypto.createHash("sha256").update(`${lang}|${text}`, "utf8").digest("hex").slice(0, 16);
}

function collectTexts(): { lang: "en" | "am"; text: string }[] {
  const seen = new Set<string>();
  const out: { lang: "en" | "am"; text: string }[] = [];
  const push = (lang: "en" | "am", text: string) => {
    const t = text.trim();
    if (!t) return;
    const key = `${lang}|${t}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ lang, text: t });
  };

  for (const tpl of EMBED_TEMPLATES) {
    for (const q of tpl.questions) {
      push("en", q.label.en);
      push("am", q.label.am);
      if (q.hint?.en) push("en", q.hint.en);
      if (q.hint?.am) push("am", q.hint.am);
      for (const opt of q.options ?? []) {
        push("en", opt.label.en);
        push("am", opt.label.am);
      }
    }
    if (tpl.consent) {
      push("en", tpl.consent.en);
      push("am", tpl.consent.am);
    }
  }

  for (const key of WIDGET_I18N_KEYS) {
    push("en", translations.en[key]);
    push("am", translations.am[key]);
  }

  return out;
}

type Manifest = { am: Record<string, string>; en: Record<string, string> };

function loadManifest(): Manifest {
  if (fs.existsSync(MANIFEST_PATH)) {
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8")) as Manifest;
  }
  return { am: {}, en: {} };
}

async function synth(lang: "en" | "am", text: string): Promise<Buffer | null> {
  if (lang === "am") {
    const key = process.env.ADDIS_API_KEY?.trim();
    if (!key) return null;
    const out = await speakWithAddis(text, { apiKey: key, lang: "am" });
    return out.ok ? out.audio : null;
  }
  const key = process.env.ELEVENLABS_API_KEY?.trim();
  if (!key) return null;
  const out = await speakWithElevenLabs(text, { apiKey: key });
  return out.ok ? out.audio : null;
}

async function main() {
  const items = collectTexts();
  const manifest = loadManifest();
  fs.mkdirSync(path.join(OUT_DIR, "am"), { recursive: true });
  fs.mkdirSync(path.join(OUT_DIR, "en"), { recursive: true });

  let generated = 0;
  for (const { lang, text } of items) {
    const hash = hashKey(lang, text);
    const rel = `${lang}/${hash}.mp3`;
    const file = path.join(OUT_DIR, rel);
    if (fs.existsSync(file)) {
      manifest[lang][hash] = rel;
      continue;
    }
    const audio = await synth(lang, text);
    if (!audio) {
      console.warn(`Skip (${lang}): no API key or TTS failed — ${text.slice(0, 40)}…`);
      continue;
    }
    fs.writeFileSync(file, audio);
    manifest[lang][hash] = rel;
    generated++;
    console.log(`Wrote ${rel}`);
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`Done. ${generated} new files. Manifest: ${MANIFEST_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});