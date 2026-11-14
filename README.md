# Mezgeb Showcase

Mezgeb (Amharic: መዝገብ, "register") is an accessible sign-up and career onboarding component for training programmes, job boards, and NGOs. Learners can register by typing, speaking Amharic or English, or with a partner organisation beside them—with no time-outs and four flexible ID routes.

## Run locally in 5 minutes

Needs Node.js 20 or newer and git.

1. Install dependencies:
   ```bash
   npm install
   ```
2. Optional: add AI keys to `.env` (everything still works with AI switched off):
   ```bash
   ADDIS_API_KEY="your_addis_ai_key"         # Amharic voice answers + Amharic read-aloud (Addis AI)
   ELEVENLABS_API_KEY="your_elevenlabs_key"  # English voice answers + English read-aloud (ElevenLabs, free plan works)
   GEMINI_API_KEY="your_gemini_key"          # Smart Help, skills, simplify, template builder
   ```
   See [Voice answers and read-aloud](#voice-answers-and-read-aloud) for how the services are chosen.
3. Start the development server on port 3000:
   ```bash
   npm run dev
   ```
4. Run the test suite:
   ```bash
   npm test
   ```

## Add Mezgeb to your site (Level 1)

1. Build the web component and start the server (it serves `/v1/mezgeb.js` and the API):
   ```bash
   npm run build:embed
   npm run dev
   ```
2. In `.env`, register your site and allow its origin:
   ```bash
   MEZGEB_SITE_KEYS="pk_test_mysite:sk_test_change_me"
   MEZGEB_ALLOWED_ORIGINS="http://localhost:8080"
   ```
3. Put two lines on your sign-up page:
   ```html
   <script type="module" src="http://localhost:3000/v1/mezgeb.js"></script>
   <mezgeb-register site-key="pk_test_mysite" lang="am" platform-name="My site"></mezgeb-register>
   ```
4. Listen for `mezgeb:complete` (its `detail.token` is a one-time token, never the profile), send the token to
   your server, and exchange it there:
   ```bash
   curl -X POST http://localhost:3000/v1/registrations/exchange \
     -H "Authorization: Bearer sk_test_change_me" -H "Content-Type: application/json" \
     -d '{"token":"mzg_tok_…"}'
   ```
   The token works once and expires after 5 minutes. Full API: `/openapi.yaml` (Level 2).

The widget renders in a shadow root, so your CSS and Mezgeb's never mix.

## Pages in this showcase

- `/` — Product landing page, origin story, feature showcase, integration overview, and FAQ
- `/demo` — Interactive 9-step learner registration with Developer View, offline outbox, and rehearsal checklist
- `/jobs` — Sample career view with private support-needs filter, apply-by-voice, and Employer JobPosting JSON-LD generator
- `/employers/accommodations` — Employer accommodations wizard with JSON-LD preview
- `/partner` — Simulated partner console for joining a session and confirming identity
- `/profile` — View and edit the saved learner profile, support-sharing toggles, and device data deletion
- `/templates` — Four accessible templates plus AI Template Builder and Question Checker
- `/playground` — Embed code, Node/Python/PHP server exchange snippets, webhook, and Docker Compose self-hosting config
- `/docs/*` — Developer documentation
- `/accessibility` — Accessibility statement (WCAG 2.2 AA)

## Voice answers and read-aloud

With just the two keys set, Mezgeb uses:

| | Amharic | English |
|---|---|---|
| Voice answers (speech → text) | [Addis AI](https://docs.addisassistant.com/docs/capabilities/speech-to-text) | [ElevenLabs](https://elevenlabs.io/docs/api-reference/speech-to-text/convert) |
| Read aloud (text → speech) | [Addis AI](https://docs.addisassistant.com/docs/capabilities/text-to-speech) | [ElevenLabs](https://elevenlabs.io/docs/api-reference/text-to-speech/convert) |

**Voice answers.** Learners always see and can edit what was heard before it is saved. `MEZGEB_SPEECH` overrides the choice:

| `MEZGEB_SPEECH` | Who transcribes |
|---|---|
| unset | Amharic: Addis AI, else Gemini. English: ElevenLabs, else Addis AI, else Gemini (whichever keys are set) |
| `addis` | Addis AI for both languages |
| `elevenlabs` | ElevenLabs for English; Amharic as if unset |
| `gemini` | Gemini for both |
| `off` | nobody: the microphone button is hidden |

If the chosen service fails, the learner is asked to type instead; the recording is never sent to a second provider.

**Read aloud.** "Read aloud" uses Addis AI's Amharic voice and ElevenLabs' English voice when their keys are set. Only template text is sent (questions, hints, error messages, help), never the learner's answers, and only while AI is switched on. Each sentence is generated once and kept in the server's memory, so every learner after the first hears it without using more credit. Without a key, with `MEZGEB_TTS=off`, or if the service fails, the browser's own voice is used; Amharic is never read with an English voice.

- The browser converts each recording (max 20 seconds) to 16 kHz WAV and sends it to Mezgeb's server, which calls the provider. The API key never reaches the browser, and Mezgeb does not store the audio.
- With Addis AI, Mezgeb pulls the answer out of the transcript itself (`src/lib/voiceExtract.ts`): spoken numbers become digits ("ዜሮ ዘጠኝ አስራ አንድ …" → `0911…`), and choice answers are matched to the options. No other AI service is involved.
- Addis AI bills 3.5 ETB per 1,000 characters of transcript (a name or phone number is 10–20 characters) and 5 ETB per minute of read-aloud audio; new accounts get free starting credit. `ADDIS_STT_BACKEND=standard` uses its Amharic-only model (default `turbo`); `ADDIS_TTS_VOICE` picks the Amharic voice (default `am-hamen`).
- ElevenLabs' free plan gives 10,000 credits a month: speech-to-text costs about 330 credits per minute (a 20-second answer ≈ 110), read-aloud 0.5–1 credit per character with the default `eleven_flash_v2_5` model. The free plan has no commercial licence; a live product needs a paid plan. `ELEVENLABS_VOICE_ID` picks the English voice.

## What is simulated vs real

- **Simulated:** SMS "finish later" delivery (the resume link works on the same device only), the Partner Console (`/partner` synced across tabs via `BroadcastChannel`, so only in the same browser), and the sample job listings on `/jobs` (`Learnhub` and `Hana` are sample names).
- **Real:** The `<mezgeb-register>` embed and the one-time token exchange (tokens are kept in memory, so one server process), accessible one-question-per-screen flow, JDN Ethiopian/Gregorian calendar conversion, WCAG contrast checker, Service Worker + IndexedDB offline outbox, server-side Addis AI speech-to-text and Amharic read-aloud (when `ADDIS_API_KEY` is configured), ElevenLabs English speech-to-text and read-aloud (when `ELEVENLABS_API_KEY` is configured), and server-side Gemini API calls (when `GEMINI_API_KEY` is configured).

## The three demo moments

1. **Co-designer flow:** Register by keyboard, open Help (`Alt+H`) to see plain-language guidance without exposing typed answers, and choose "Refer me through a partner" without needing a Fayda ID.
2. **Connection off:** Toggle offline mode, complete a registration, observe it queued in the IndexedDB outbox, and reconnect to watch it send automatically.
3. **Live install:** Copy the two-line HTML snippet from `/playground` and test the token exchange.

## Honesty rules

- All company names (`Learnhub`), people (`Hana`), partners, and job listings in demos are clearly marked sample data.
- This showcase uses cloud services for AI: Addis AI (Amharic) and ElevenLabs (English) for voice and read-aloud, and Gemini for the other helpers. The microphone notice names the service in use. The real Mezgeb product runs speech and AI models on your own server by default.
- The only real statistics cited are from the Digital Bridge co-design session (21 October 2026; forty participants) and the Ethiopia GRF progress report (2025; about 138,000 of more than a million refugees enrolled in Fayda by October 2025).
