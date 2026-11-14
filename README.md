# Mezgeb Showcase

Mezgeb (Amharic: መዝገብ, "register") is an accessible sign-up and career onboarding component for training programmes, job boards, and NGOs. Learners can register by typing, speaking Amharic or English, or with a partner organisation beside them—with no time-outs and four flexible ID routes.

## Run locally in 5 minutes

Needs Node.js 20 or newer and git.

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set your Gemini API key in `.env` (optional—everything still works with AI switched off):
   ```bash
   GEMINI_API_KEY="your_key_here"
   ```
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
- `/partner` — Simulated partner console for joining a session and confirming identity
- `/profile` — View and edit the saved learner profile, support-sharing toggles, and device data deletion
- `/templates` — Four accessible templates plus AI Template Builder and Question Checker
- `/playground` — Embed code, Node/Python/PHP server exchange snippets, webhook, and Docker Compose self-hosting config
- `/docs/*` — Developer documentation
- `/accessibility` — Accessibility statement (WCAG 2.2 AA)

## What is simulated vs real

- **Simulated:** SMS "finish later" delivery (the resume link works on the same device only), the Partner Console (`/partner` synced across tabs via `BroadcastChannel`, so only in the same browser), and the sample job listings on `/jobs` (`Learnhub` and `Hana` are sample names).
- **Real:** The `<mezgeb-register>` embed and the one-time token exchange (tokens are kept in memory, so one server process), accessible one-question-per-screen flow, JDN Ethiopian/Gregorian calendar conversion, WCAG contrast checker, Service Worker + IndexedDB offline outbox, and server-side Gemini API calls (when `GEMINI_API_KEY` is configured).

## The three demo moments

1. **Co-designer flow:** Register by keyboard, open Help (`Alt+H`) to see plain-language guidance without exposing typed answers, and choose "Refer me through a partner" without needing a Fayda ID.
2. **Connection off:** Toggle offline mode, complete a registration, observe it queued in the IndexedDB outbox, and reconnect to watch it send automatically.
3. **Live install:** Copy the two-line HTML snippet from `/playground` and test the token exchange.

## Honesty rules

- All company names (`Learnhub`), people (`Hana`), partners, and job listings in demos are clearly marked sample data.
- This showcase uses cloud AI (Gemini) because it runs in AI Studio. The real Mezgeb product runs speech and AI models on your own server by default.
- The only real statistics cited are from the Digital Bridge co-design session (21 October 2026; forty participants) and the Ethiopia GRF progress report (2025; about 138,000 of more than a million refugees enrolled in Fayda by October 2025).
