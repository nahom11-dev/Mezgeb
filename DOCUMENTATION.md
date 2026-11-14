# Mezgeb documentation

**Mezgeb** (Amharic: መዝገብ, “register”) is an accessible sign-up and career-onboarding experience for training programmes, job boards, and NGOs. Learners can register by typing, speaking Amharic or English, or with a partner beside them—with no time-outs and flexible ID options.

This file is the standalone product and developer guide for the showcase in this repository. The in-app developer articles live at `/docs` when the app is running. For a concise UI change log, see [UI_CHANGES.md](./UI_CHANGES.md). For clone-and-run instructions, see [README.md](./README.md).

---

## Table of contents

1. [Quick start](#quick-start)
2. [Showcase routes](#showcase-routes)
3. [Design system](#design-system)
4. [Template tools](#template-tools)
5. [Learner widget](#learner-widget)
6. [Embed and registration API](#embed-and-registration-api)
7. [Voice answers and read-aloud](#voice-answers-and-read-aloud)
8. [Sample test sites](#sample-test-sites)
9. [Environment variables](#environment-variables)
10. [Data and storage](#data-and-storage)
11. [Server and deployment](#server-and-deployment)
12. [Testing](#testing)
13. [Source map](#source-map)

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
npm run build:embed  # builds public/v1/mezgeb.js
npm run dev
```

Register a site key and allowed origin in `.env`, then add the script and `<mezgeb-register>` to your page (see [Embed and registration API](#embed-and-registration-api)). OpenAPI details: [openapi.yaml](./openapi.yaml).

---

## Showcase routes

| Route | Purpose |
| --- | --- |
| `/` | Product landing: features, integration overview, templates strip, FAQ |
| `/demo` | Interactive registration rehearsal; developer view and outbox |
| `/jobs` | Sample job board; apply by voice or typing |
| `/employers/accommodations` | Employer accommodations wizard + JobPosting JSON-LD preview |
| `/partner` | Partner console (same-browser demo via `BroadcastChannel`) |
| `/profile` | Learner profile, sharing toggles, export, delete |
| `/templates` | Template gallery, import, AI draft entry, compare table |
| `/templates/builder` | New template builder |
| `/templates/:id/edit` | Edit saved template |
| `/playground` | Integration workbench: live widget, code snippets, events |
| `/docs`, `/docs/:slug` | In-app developer documentation |
| `/accessibility` | WCAG 2.2 AA statement |
| `/offline` | Offline fallback page |
| `/sample-sites/...` | Bundled HTML test sites (see [Sample test sites](#sample-test-sites)) |

Routes are declared in `src/App.tsx` with lazy-loaded page components.

---

## Design system

### Tokens and global chrome

- **CSS variables** in `src/styles/tokens.css` and `src/index.css`: `--paper`, `--stone`, `--sand`, `--mint`, `--ink`, `--muted`, `--night`, `--line`, `--accent`, shadows, and state colours (`--ok`, `--warn`, `--error`).
- **High contrast:** `.mezgeb-hc` theme; respects `prefers-reduced-motion`.
- **Typography:** Inter + Noto Sans Ethiopic (loaded from `index.html`).
- **Focus:** 3px accent focus ring; skip link to `#main`.

### Shared UI kit (`src/ui/`)

Primitives used across marketing and app pages: `Button`, `Field`, `VoiceButton`, `ReadAloudButton`, `Dialog`, `Tabs`, `CodeBlock`, `Table`, `SiteHeader`, `SiteFooter`, and others. Export surface: `src/ui/index.ts`.

### Layout

`src/components/Layout.tsx` wraps most pages with `SiteHeader` and `SiteFooter`. **Exception:** the template builder uses `BuilderShell` (full viewport, no site header/footer) so the workspace uses the full height.

### Template-tool styling

Additional classes in `tokens.css` for gallery, builder, and playground:

- `.mz-canvas`, `.mz-phone` — preview framing
- `.mz-switch`, `.mz-autogrow`, `.mz-scroll` — controls and scrolling in dense UIs

---

## Template tools

The gallery, builder, and playground share a small kit and copy module so they look and read consistently.

### Shared modules

| Module | Role |
| --- | --- |
| `src/pages/templates/kit.tsx` | `Segmented`, `SwitchRow`, `TemplateMark`, `FlowOutline`, `PhoneFrame`, `FactList`, helpers (`estimateMinutes`, `questionLabel`, …) |
| `src/pages/templates/strings.ts` | English and Amharic UI strings for template pages |
| `src/pages/templates/ImportTemplateDialog.tsx` | JSON import dialog reused by gallery and builder |
| `src/templates/*` | Types, library starters, validation, `MezgebTemplate` model |
| `src/templates/storage.ts` | `localStorage` keys: `mezgeb_my_templates`, `mezgeb_builder_draft_v1` |

### Gallery (`/templates`)

- **New template** and **Import JSON** (dialog).
- Search, category segments, language filter.
- **Create with AI** card (opens builder when Gemini is available; offline fallback messaging when not).
- Grid of templates with mini widget previews, **Sample** badges, compare table, and a 3-tab preview dialog.

### Builder (`/templates/builder`, `/templates/:id/edit`)

**Shell:** `src/pages/builder/BuilderShell.tsx` — `100dvh` column layout, skip link only.

**Entry:** `StartScreen.tsx` — start from a starter template, describe with AI, paste an existing form (offline parser), **Import JSON**, or resume a draft.

**Top bar:** `TopBar.tsx` — back link, editable name, save status, undo/redo, **Checks** drawer, **Test as learner**, overflow menu (shortcuts, duplicate, import, delete). Primary navigation is a **numbered step flow**:

1. **Questions**
2. **Settings**
3. **Translations**
4. **Publish** (share / embed / export)

**Questions workspace** (three columns):

- **Question list** (`QuestionList.tsx`) — reorder (drag or `Alt+ArrowUp` / `Alt+ArrowDown`), sections, status chips (must fix, missing Amharic, conditional).
- **Canvas** (`QuestionCanvas.tsx`) — 390px live `MezgebWidget` with `builderCanvas` inline editing; **EditingLang** toggle (persisted as `mezgeb_builder_edit_lang`).
- **Question panel** (`QuestionPanel.tsx`) — type, required/skip, voice, conditions, sensitive fields, “More options”.

**Other views:**

- `SettingsView.tsx` — theme, accent contrast check (blocks save if contrast fails), welcome copy.
- `TranslationsView.tsx` — side-by-side EN/AM, missing-only filter, per-field AI suggest, bulk translate.
- `ShareView.tsx` — embed snippet (`CodeBlock`), playground link, save to My templates, JSON copy/download.
- `ChecksDrawer.tsx` — Must fix / Should fix / Tips (`Alt+C`); optional AI check.
- `AddQuestionDialog.tsx`, `TestRunDialog.tsx` — add questions and full learner test run.

**State:** `useBuilderState.ts` — autosave, 30-step undo/redo, contrast gating, keyboard shortcuts.

**Re-export:** `src/pages/TemplateBuilderPage.tsx` → `BuilderPage`.

### Playground (`/playground`)

Single workbench aligned with the revamp:

- **Setup** — template, language, theme (light / high contrast), reset.
- **Live preview** — live `MezgebWidget` plus **Events log** (table + JSON dialog).
- **Code & events** — tabs for your page HTML, server exchange (Node / Python / PHP), webhook payload, Docker/config notes.

Use this page to copy integration snippets and watch `mezgeb:*` events during testing.

### Template JSON model (summary)

Templates are `MezgebTemplate` objects: metadata (id, name, category, languages), `questions[]` with bilingual `label` / `hint` / options, theme accent, and flags (voice, simple words, etc.). Validation: `src/templates/validate.ts`. Built-in starters: `src/templates/library.ts`.

---

## Learner widget

**Component:** `src/components/MezgebWidget.tsx`

Highlights:

- Welcome screen (language, start, resume saved link).
- **How do you want to answer?** — speak/listen, read/type, simple words with pictures; switchable from the top bar.
- Ethiopian date of birth (three selects; calendar logic in `src/lib/ethiopianCalendar.ts`).
- Optional document photo, support-sharing default OFF, help drawer.
- Props for embed: `siteKey`, `shortcutScope`, `persistProfile`, `highContrast`, `assistedMode`, `onEvent`, `builderCanvas` (builder-only).
- Demo page can drive eight `demoTrigger` preview states.

**Read aloud:** `src/ui/ReadAloudButton.tsx` — server TTS when configured, else browser speech.

**Voice input:** records in the browser, converts to 16 kHz WAV (`src/lib/wav.ts`), posts to `/api/ai/voice`; extraction helpers in `src/lib/voiceExtract.ts`.

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

Tokens are single-use and short-lived (in-memory store in this showcase). Sample sites use `POST /api/sample/registrations/exchange` with publishable keys only on the client.

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

**Read aloud privacy:** Only template chrome text (questions, hints, errors, help)—not learner answers. Server caches generated audio in memory per sentence.

**Addis-specific:** `ADDIS_STT_BACKEND`, `ADDIS_TTS_VOICE`; number and choice parsing via `voiceExtract.ts`.

**Recording limit:** 20 seconds; converted to WAV before upload.

Check runtime capabilities: `GET /api/capabilities`.

---

## Sample test sites

Directory: [sample-sites/](./sample-sites/). Each site is static HTML:

| Folder | Brand | Template id |
| --- | --- | --- |
| `learning-site/` | Kelem Learn | `learning-platform` |
| `jobs-site/` | Sira Board | `job-seeker` |
| `programme-site/` | Meskot Skills | `programme-intake` |

- **`index.html`** — host site unchanged (listings, legacy footer forms).
- **`onboarding.html`** — loads `<mezgeb-register>`; exchanges token with Mezgeb; writes profile to the same `localStorage` keys as legacy forms; redirects to `index.html`.

Publishable keys: `pk_sample_kelem`, `pk_sample_sira`, `pk_sample_meskot` (secrets in `MEZGEB_SITE_KEYS`).

After `npm run build:embed` and `npm run dev`:

- http://localhost:3000/sample-sites/learning-site/onboarding.html  
- http://localhost:3000/sample-sites/jobs-site/onboarding.html  
- http://localhost:3000/sample-sites/programme-site/onboarding.html  

---

## Environment variables

| Variable | Purpose |
| --- | --- |
| `ADDIS_API_KEY` | Amharic STT/TTS via Addis AI |
| `ELEVENLABS_API_KEY` | English STT/TTS via ElevenLabs |
| `GEMINI_API_KEY` | Help, simplify, template AI, checks |
| `MEZGEB_SPEECH` | `addis` \| `elevenlabs` \| `gemini` \| `off` |
| `MEZGEB_TTS` | `off` disables server TTS |
| `ADDIS_STT_BACKEND` | e.g. `turbo` (default), `standard` |
| `ADDIS_TTS_VOICE` | Amharic voice id (default `am-hamen`) |
| `ELEVENLABS_VOICE_ID` | English voice id |
| `MEZGEB_SITE_KEYS` | `pk_…:sk_…` comma-separated pairs |
| `MEZGEB_ALLOWED_ORIGINS` | Comma-separated origins for CORS/embed |
| `PORT` | HTTP port (default 3000) |

Never commit `.env`. Use `.env.example` as the template.

---

## Data and storage

| Key / area | Contents |
| --- | --- |
| `mezgeb_my_templates` | User-saved custom templates |
| `mezgeb_builder_draft_v1` | In-progress builder draft |
| `mezgeb_builder_edit_lang` | Builder editing language (`en` / `am`) |
| Profile / outbox | `src/lib/profileStore.ts`, `src/lib/outbox.ts`, IndexedDB + Service Worker (`public/sw.js`) |

Partner console and some demos use in-browser simulation only (see README “What is simulated vs real”).

---

## Server and deployment

- **Dev / prod server:** `server.ts` — static Vite build, API routes (`/api/tts`, `/api/ai/voice`, registration exchange, sample exchange, capabilities).
- **Docker:** `Dockerfile`, `docker-compose.yml` (see playground config tab).
- **Embed asset:** `npm run build:embed` → `public/v1/mezgeb.js`.

---

## Testing

```bash
npm test
```

Notable suites: `src/__tests__/mezgeb.test.ts`, `addisSpeech.test.ts`, `readAloud.test.ts`, `voiceExtract.test.ts`, template validation tests.

---

## Source map

| Area | Primary paths |
| --- | --- |
| Routing | `src/App.tsx` |
| i18n | `src/i18n.ts` |
| Templates domain | `src/templates/` |
| Builder UI | `src/pages/builder/` |
| Template pages kit | `src/pages/templates/` |
| Marketing pages | `src/pages/LandingPage.tsx`, `DemoPage.tsx`, … |
| Widget | `src/components/MezgebWidget.tsx` |
| Embed WC | `src/embed.tsx` |
| API server | `server.ts`, `server/addisSpeech.ts`, `server/elevenLabs.ts` |
| AI client helpers | `src/ai.ts` |
| OpenAPI | `openapi.yaml` |

---

## Revision note

**Template tools revamp (November 2026):** Gallery, builder, and playground were rebuilt on `src/pages/templates/kit.tsx`, `strings.ts`, and `BuilderShell`, with a four-step builder flow and a unified playground workbench. Details are listed under [Template tools](#template-tools) and in [UI_CHANGES.md](./UI_CHANGES.md#template-tools-revamp-nov-2026).

---

*Digital Bridge Accessibility Hackathon 2026 — Mezgeb showcase. Licence: Apache-2.0 (see repository notice).*