# Mezgeb documentation

**Mezgeb** (Amharic: መዝገብ, “register”) is an accessible sign-up web component for training programmes, job boards, and NGOs. Learners can register by typing, speaking Amharic or English, or with a partner beside them—with no time-outs and flexible ID options.

This file describes the embed, widget, API, and deployment in this repository. For a quick start, see [README.md](./README.md). OpenAPI: [openapi.yaml](./openapi.yaml).

---

## Table of contents

1. [Quick start](#quick-start)
2. [Front page and static assets](#front-page-and-static-assets)
3. [Learner widget](#learner-widget)
4. [Embed and registration API](#embed-and-registration-api)
5. [Voice answers and read-aloud](#voice-answers-and-read-aloud)
6. [Sample test sites](#sample-test-sites)
7. [Environment variables](#environment-variables)
8. [Data and storage](#data-and-storage)
9. [Server and deployment](#server-and-deployment)
10. [Testing](#testing)

---

## Quick start

**Requirements:** Node.js 20+, git.

```bash
npm install
# optional: copy .env.example → .env and add API keys
npm run dev          # http://localhost:3000
npm test             # Vitest suite
```

**Embed (Level 1 integration):**

```bash
npm run build:embed  # builds dist-embed/mezgeb.js, served at /v1/mezgeb.js
npm run dev
```

Register a site key and allowed origin in `.env`, then add the script and `<mezgeb-register>` to your page (see [Embed and registration API](#embed-and-registration-api)).

---

## Front page and static assets

The root URL serves a single static page from `site/index.html` (no SPA). Additional static trees:

- `/sample-sites/*` — bundled HTML partner demos
- `/demo/*`, `/savanna/*` — reserved for hackathon demo pages (may be empty until filled)
- `/audio/*` — pre-recorded read-aloud clips from `public/audio/`

Unknown paths return HTTP 404 (no catch-all to the home page).

---

## Learner widget

**Component:** `src/components/MezgebWidget.tsx`

Highlights:

- Welcome screen (language, start, resume saved link via `?resume=` on the host page URL).
- **How do you want to answer?** — speak/listen, read/type, simple words with pictures.
- Ethiopian date of birth (three selects; `src/lib/ethiopianCalendar.ts`).
- Optional document photo, support-sharing default OFF, help drawer.
- Embed props via `<mezgeb-register>` attributes and `mezgeb:complete` event.

**Read aloud:** `src/ui/ReadAloudButton.tsx` — server TTS when configured, else browser speech.

**Voice input:** records in the browser, converts to 16 kHz WAV (`src/lib/wav.ts`), posts to `/api/ai/voice`; extraction in `src/lib/voiceExtract.ts`.

---

## Embed and registration API

1. Build and serve `mezgeb.js` from `/v1/mezgeb.js` (`src/embed.tsx`, `vite.embed.config.ts`).
2. On the host page:

   ```html
   <script type="module" src="https://your-mezgeb-host/v1/mezgeb.js"></script>
   <mezgeb-register
     site-key="pk_your_publishable_key"
     lang="am"
     platform-name="Your site"
   ></mezgeb-register>
   ```

3. Listen for `mezgeb:complete`. The event carries a **one-time token**, not the profile.
4. Your backend exchanges the token:

   ```http
   POST /v1/registrations/exchange
   Authorization: Bearer sk_your_secret_key
   Content-Type: application/json

   { "token": "mzg_tok_…" }
   ```

Tokens are single-use and short-lived (in-memory store). Sample sites use `POST /api/sample/registrations/exchange` with publishable keys only on the client.

**CORS / origins:** `MEZGEB_ALLOWED_ORIGINS`. **Site keys:** `MEZGEB_SITE_KEYS` as `publishable:secret` pairs.

---

## Voice answers and read-aloud

| Capability | Amharic | English |
| --- | --- | --- |
| Speech → text | Addis AI | ElevenLabs |
| Text → speech (read aloud) | Addis AI | ElevenLabs |

Server modules: `server/addisSpeech.ts`, `server/elevenLabs.ts`. Client never receives provider API keys.

**`MEZGEB_SPEECH`** — force provider or `off` (hides microphone).

**`MEZGEB_TTS`** — `off` disables server read-aloud (browser fallback).

**Read aloud privacy:** Only template chrome text—not learner answers. Server caches generated audio in memory per sentence.

Check runtime capabilities: `GET /api/capabilities`.

---

## Sample test sites

Directory: [sample-sites/](./sample-sites/).

| Folder | Brand | Template id |
| --- | --- | --- |
| `learning-site/` | Kelem Learn | `learning-platform` |
| `jobs-site/` | Sira Board | `job-seeker` |
| `programme-site/` | Meskot Skills | `programme-intake` |

Publishable keys: `pk_sample_kelem`, `pk_sample_sira`, `pk_sample_meskot` (secrets in `MEZGEB_SITE_KEYS`).

After `npm run build:embed` and `npm run dev`:

- http://localhost:3000/sample-sites/learning-site/onboarding.html
- http://localhost:3000/sample-sites/jobs-site/onboarding.html
- http://localhost:3000/sample-sites/programme-site/onboarding.html

---

## Environment variables

See `.env.example` and README for the full list (`ADDIS_API_KEY`, `ELEVENLABS_API_KEY`, `GEMINI_API_KEY`, `MEZGEB_SITE_KEYS`, `MEZGEB_ALLOWED_ORIGINS`, `MEZGEB_SPEECH`, `MEZGEB_TTS`, `PORT`).

Never commit `.env`.

---

## Data and storage

| Key / area | Contents |
| --- | --- |
| `mezgeb_my_templates` | User-saved custom templates (browser localStorage; optional) |
| Profile / outbox | `src/lib/profileStore.ts`, `src/lib/outbox.ts`, IndexedDB for offline queue |

The embed syncs the outbox per `site-key` via `src/lib/outboxSync.ts`.

---

## Server and deployment

- **Server:** `server.ts` — static files, `/v1/mezgeb.js`, registration and AI API routes.
- **Docker:** `Dockerfile`, `docker-compose.yml` — `npm run build:embed` then `tsx server.ts --production`.

---

## Testing

```bash
npm test
```

Suites include `mezgeb.test.ts`, `addisSpeech.test.ts`, `readAloud.test.ts`, `voiceExtract.test.ts`, `outbox.test.ts`, `resumeStep.test.ts`, `audioHash.test.ts`.