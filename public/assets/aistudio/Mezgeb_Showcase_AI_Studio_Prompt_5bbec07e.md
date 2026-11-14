# Mezgeb Showcase Site: Prompt for Google AI Studio

This prompt builds a small showcase website for team discussion. It has five parts:

1. **Landing page** (the design we iterated on in Stitch)
2. **Documentation** (quick start, how it works, API, self-hosting, privacy)
3. **Templates** (four sign-up templates, with an AI template builder)
4. **Integration playground** (pick a template, get the embed code and server code, and simulate the token exchange)
5. **Live demo** (a working Mezgeb sign-up with read-aloud, Ethiopian calendar, offline saving, and an AI help feature)

## How to use it

1. Open Google AI Studio, choose **Build**, and paste everything between "PROMPT STARTS" and "PROMPT ENDS".
2. Wait for the first version. Then use the follow-up prompts at the end, one at a time.
3. Check the three things listed under "Before you show it to anyone" at the bottom.

## Notes for the team

- **The AI in this showcase uses Gemini in the cloud**, because that is what AI Studio provides. The real product defaults to self-hosted models. The demo labels this clearly so nobody is misled.
- **All data is sample data.** "Learnhub", "Hana" and the job listings are made up for the demo.
- **The Amharic text** is collected in one file (`src/i18n.ts`) so a native speaker can correct it in one place.

---

## PROMPT STARTS

```
Build a multi-page React + TypeScript + Tailwind web app called "Mezgeb" that showcases a product to my team. It must look polished and professional, and it must itself be accessible (WCAG 2.2 AA), because the product is about accessibility.

=====================================================================
0. WHAT MEZGEB IS (source of truth for all copy)
=====================================================================

Mezgeb (Amharic: መዝገብ, "register") is a sign-up component that training programmes, job boards and NGOs add to their own website, so every person can create an account: people who are blind, people with a physical disability, people who read with difficulty, and refugees without a standard ID.

Three ways to sign up, one confirmed profile:
1. Type or listen: one question per screen, plain Amharic and English, icons, a read-aloud button on every question, no time-outs, autosave.
2. Speak: answer each question by voice in Amharic or English; the learner always sees and can edit the transcript before it is saved.
3. With a partner: the learner chooses "Refer me"; a partner organisation registers them with consent and can mark the profile "Verified by partner".

Features: help on every screen (Alt+H) that explains errors in plain words and moves focus to the field; four ID routes (Fayda, refugee ID, other document, refer me through a partner); private support requests with no diagnosis or medical proof, shared only where the learner chooses; skills from stories; finish later by SMS link; offline saving; Ethiopian calendar; job application by voice; private "support I need" job filter; employer accommodations form published as schema.org/JobPosting.

For platforms: add a script tag and a <mezgeb-register> element; when the learner finishes, the page receives a one-time token; the platform's server exchanges it with a secret key for the confirmed profile and creates the account. The platform keeps its own login and database. Integration levels: Level 1 script tag, Level 2 REST API with OpenAPI spec, Level 3 schema.org/JobPosting. Self-host with Docker Compose ("lite" or "full" profile) or use the hosted service.

AI rules: AI is never required; everything works with AI switched off. By default, speech and AI run on the platform's own server. Cloud AI is off by default. The help assistant never receives the learner's answers, only labels and error codes. Support needs never go to any AI. Audio is deleted after transcription.

Origin: on 21 October 2026, forty people who are blind, Deaf, disabled, refugees or returnees tried to register on a learning platform in Addis Ababa. Most could not finish: forms timed out, errors were silent to screen readers, and people without a kebele ID or passport were turned away.

HONESTY RULES (strict):
- Do NOT invent statistics, user counts, customers, partner logos, testimonials, awards or press.
- The only real figures you may use: 21 October 2026; forty people; "about 138,000 of more than a million refugees in Ethiopia were enrolled in Fayda by October 2025".
- Sample data inside demos ("Learnhub", "Hana", job listings) must be clearly sample data.
- Wherever the demo uses cloud AI (Gemini), show a small label: "Demo uses cloud AI (Gemini). The product runs AI on your own server by default."

=====================================================================
1. TECH
=====================================================================

- React + TypeScript + Tailwind, React Router with these routes:
  "/" landing, "/demo" live demo, "/templates" templates and AI builder, "/playground" integration playground, "/docs/*" documentation.
- AI: use the Gemini API through the @google/genai SDK that AI Studio provides, with the default fast Flash model. Use structured JSON output (responseSchema) for every AI call that must return data. Put all AI calls in one file, src/ai.ts, with a clear function per feature.
- Every AI call must have a timeout of 8 seconds and a non-AI fallback, and must never block the user.
- Fonts from Google Fonts: Inter (all Latin text, weights 400/500/600/700), Noto Sans Ethiopic (all Amharic text), JetBrains Mono (code).
- No external images, no stock photos, no icon fonts. Use inline SVG line icons (Lucide-style, 1.5px stroke).
- All visible strings for English and Amharic in src/i18n.ts, two objects with the same keys. A global language toggle (EN | አማ) switches the whole app and sets <html lang>.
- localStorage and sessionStorage only inside try/catch; the app must work if storage is blocked.

=====================================================================
2. DESIGN SYSTEM (use everywhere)
=====================================================================

Colours (CSS variables):
  --ink #111111 (main text), --ink-2 #6B6B6B (secondary text on white),
  --mint #E4F2EC, --lavender #EEEBF8, --cream #F9F3EA,
  --tile #F5F5F3 (feature tiles), --line #E7E7E4 (borders),
  --accent #8F6FE0 (selected states, dots), --accent-text #6A4FC4 (lavender text and links),
  --mint-text #1F5C46 (text on mint), --dark #161616 (footer/FAQ), --dark-2 #9B9B9B (small text on dark).
Cards: white, 1px var(--line) border, 14px corners, shadow "0 1px 2px rgba(0,0,0,0.05), 0 10px 30px rgba(0,0,0,0.08)".
Buttons: 8px corners, 40px tall (44px on mobile); primary black with white text; secondary white with 1px var(--line) border.
Type: headings Inter bold/medium with tight letter spacing; body 16-18px, line height 1.6; never smaller than 13px.
Focus: every interactive element shows a 3px solid #6A4FC4 outline with 2px offset. Never remove outlines.
Motion: subtle fades only; respect prefers-reduced-motion.

DO NOT USE: purple/neon gradients other than the specified hero wash, glassmorphism, blurred blobs, emoji, stock photos, generic three-icon-card rows, "seamless/empower/unlock/revolutionary" wording.

=====================================================================
3. GLOBAL LAYOUT
=====================================================================

Header (all pages): left logo (a small cluster of four rounded shapes: mint circle, lavender square, black circle, small lavender drop) plus "mezgeb" in bold lowercase; links "Demo", "Templates", "Playground", "Docs"; right: EN | አማ toggle (aria-pressed), black button "Request a pilot" (scrolls to the landing page CTA or opens a small accessible dialog form). Mobile: a "Menu" disclosure button (aria-expanded, Escape closes, focus returns).
A "Skip to main content" link as the first focusable element on every page.
Footer: see the landing page's final dark section; reuse it on all pages.

=====================================================================
4. LANDING PAGE "/"
=====================================================================

4.1 HERO
- Background: soft vertical gradient from pale mint #E4F2EC at the top to pale lavender #EEEBF8 at the bottom of the hero.
- Left-aligned text block (max width 640px): headline 56px bold, two lines: "Onboarding that listens," / "to every learner." Subline 18px: "Learners register by typing, by speaking Amharic, or with a partner beside them. No time-outs, no ID dead ends." Buttons: black "Try the live demo" (to /demo) and white outlined "Watch the demo" (scrolls to the video).
- Below: a wide inset panel (16px corners, translucent white fill, 1px #DCE3E0 border) with faint vertical lavender waveform lines (#C9B8F2, tallest at the left and right edges, fading toward the centre). Inside, two overlapping app windows:
  * Back-right, larger (about 70% width): a window titled "Mezgeb demo · 2 min" containing a 16:9 VIDEO area. Use a YouTube embed that loads only after clicking a designed poster (lite embed): the poster shows a learner's sign-up screen (Amharic question "የተወለዱበት ቀን መቼ ነው?", "When were you born?", Ethiopian calendar switch, an empty year field with an error, a round microphone button) with a large white play button. On click, load https://www.youtube-nocookie.com/embed/VIDEO_ID?cc_load_policy=1&rel=0 in an iframe with title "Video: Hana signs up by voice in Amharic". Put VIDEO_ID in one constant at the top of the file. Under the video, small pill links "CC", "Transcript" (opens an accessible dialog with a placeholder transcript).
  * Front-left, smaller (about 45% width), overlapping the bottom-left of the video window: a window titled "learnhub.et/join" showing a step list (Language ✓, Name and area ✓, Date of birth ✓, How you'll show who you are — current, Support you need, Review) and the current question "How will you show who you are?" with four options (Fayda, Refugee ID, Other document, Refer me through a partner — selected), a mint notice "Partner joined · They can see this form, not your answers." and a black "Continue" button.

4.2 WHY (cream section, background #F9F3EA, straight edge with the hero)
- Small pill label "Why we built Mezgeb".
- Large statement text, Inter semibold 36px, line height 1.3, left-aligned, max width 760px, black #111111 for key statements and warm grey #6B6560 for supporting text:
  P1 (black): "Most sign-up forms were never built for the people who need them most."
  P2 (grey, with [bracketed] parts black): "On 21 October 2026, forty people who are blind, Deaf, disabled, refugees or returnees tried to register on a learning platform in Addis Ababa. [Most could not finish.] Forms timed out. Errors were silent to screen readers. [Anyone without a kebele ID or passport was turned away.]"
  P3 (grey, bracketed black): "The ID wall is wide. By October 2025, [only about 138,000 of more than a million refugees in Ethiopia] were enrolled in Fayda, the national ID most services now ask for."
  P4 (black): "Registration should be the easy part."
- Small sources line, 13px grey: "Sources: Digital Bridge co-design session, 21 October 2026; Ethiopia GRF progress report, 2025."

4.3 FEATURES (white section, diagonal checkerboard of 440px square tiles; each row: one grey tile #F5F5F3 with 24px corners holding a realistic UI card, plus a white square with a centred small lavender label, a 26px heading and a 15px grey paragraph; tiles alternate left/right and touch corner to corner; on mobile, stack tile then text)
- Row 1, tile left. Label "No time-outs". Heading "Pick up exactly / where you left off". Text: "Every answer is saved the moment it is given. No time limit, and a link by SMS to finish later."
  Tile: an SMS notification card (black rounded app icon with "L", "Learnhub · now", "Your sign-up is saved. Continue from step 4:", link "lhb.et/r/7Kq2") above a resume card ("Welcome back, Hana", "Step 4 of 6 · saved 2 days ago", a 4px progress bar two-thirds filled, three saved rows with mint check circles: "Language — Amharic", "Name and area — Hana, Lideta", "Phone — 09•• ••• 214", a full-width black button "Continue where I left off", tiny grey "No time limit").
- Row 2, tile right. Label "Skills from stories". Heading "Experience counts, / even without a certificate". Text: "Learners describe the work they have done in their own words. Mezgeb suggests skills; the learner decides."
  Tile: a voice capture card: header "Tell us about work you've done" with grey tag "Paid or unpaid"; a light transcript box with the text "I sold clothes at Merkato for three years and kept the shop's accounts. I also helped customers find sizes." where "sold clothes", "three years", "kept the shop's accounts", "helped customers" are highlighted (lavender background, 2px #8F6FE0 underline); label "Skills we heard" with pills "Sales", "Bookkeeping", "Customer service", "Retail experience · 3 yrs", each with a tiny number badge 1-4 matching the highlights, and a dashed "+ Add a skill"; a bottom bar with a round black microphone button, a small lavender waveform of about 20 bars, "0:14", and a white button "Keep these".
- Row 3, tile left. Label "Private by default". Heading "Ask for support / without explaining why". Text: "Learners say what helps them. No diagnosis, no documents, and they choose exactly who can see it."
  Tile: a settings card "Support I need" (lock icon, subtitle "No diagnosis or documents needed"), chips "Screen reader" and "Extra time" selected (lavender), "Step-free access" and "Sign language interpreter" unselected; then "Who can see this" with three rows and toggles: "Learnhub — Your learning platform" ON, "Employers — Only if you apply and choose to share" OFF, "Partner organisation — Only during a help session" OFF; footer "Stored separately and encrypted" with a shield icon.
- Row 4, tile right. Label "Jobs that fit". Heading "Jobs that already / offer what you need". Text: "Employers list the support each job offers. Learners filter by their needs without disclosing anything."
  Tile: a job search card: search field "Search jobs"; mint filter chips "Screen reader ✓", "Extra time ✓" and grey "🔒 Filters are private" (use an SVG lock, not an emoji); result 1 expanded: grey square "L", "Junior data clerk", "Logistics company · Addis Ababa", mint pill "2 of 2 needs met", tags "Screen reader ✓", "Extra time for tests ✓" (mint) and "Flexible hours" (grey), buttons black "Apply by voice" (mic icon) and white "Save"; result 2 collapsed: "T", "Customer support agent", "Telecom company · Remote", grey pill "1 of 2 needs met".

4.4 FOR PLATFORMS (white)
- Intro: label "For platforms"; heading 44px "Add it to your sign-up page / in an afternoon."; right-side paragraph "One script tag on your page. When a learner finishes, your server receives a confirmed profile. Your login, your database and your design stay yours."
- Three grey step tiles in a row, each with a numbered circle and title:
  1 "Add one tag": dark code card (#161616) titled "signup.html" with a Copy button that copies the code and announces "Copied" via aria-live:
    <script type="module" src="https://cdn.mezgeb.example/v1/mezgeb.js"></script>
    <mezgeb-register site-key="pk_learnhub" lang="am"></mezgeb-register>
  2 "Learners sign up their way": an embedded sign-up card ("Learnhub · Powered by Mezgeb", "Step 2 of 6", "What is your phone number?" with Read aloud, input "09•• ••• 214", three option buttons "Type" (selected), "Speak", "Get help", black "Continue").
  3 "Get a confirmed profile": event pill "registration.completed · just now"; response card "POST /v1/registrations/exchange" with a mint "200" and JSON:
    { "name": "Hana", "area": "Lideta, Addis Ababa", "id_route": "partner_verified", "skills": ["Sales", "Bookkeeping"], "support_shared": false }
    and grey note "Support needs arrive only if the learner shares them".
- Integration levels card (three columns): Level 1 "Script tag — Drop the component into any page." (link to /docs/quick-start); Level 2 "REST API — Build your own interface with our OpenAPI spec." (link to /docs/api); Level 3 "Job boards — Publish job accommodations as schema.org/JobPosting." (link to /docs/jobposting).
- Hosting line: "Self-host with Docker: data never leaves your server · Or let us host it" and a button "Open the playground" (to /playground).

4.5 FINAL DARK SECTION (FAQ + footer as one long dark section)
- The section begins after "For platforms" with rounded TOP corners (40px) on the white page; background #161616 with very subtle grain; runs to the bottom of the page.
- FAQ: left column label "FAQ", heading "Questions, / answered.", text "For learners, partners and the platforms that add Mezgeb to their sign-up page.", link "Ask us on Telegram →". Right column: an accessible accordion (each question a <button aria-expanded>), first item open:
  1 "Does a learner need a Fayda ID?" — "No. Learners can use Fayda, a refugee ID or another document, or choose “Refer me” so a partner organisation can vouch for them."
  2 "Which languages does Mezgeb support?" — "Amharic and English today. Afaan Oromo, Tigrinya and Somali are planned."
  3 "Does the AI see what learners type?" — "No. The help assistant reads the page's labels and error messages, never the learner's answers."
  4 "What happens to voice recordings?" — "They are deleted as soon as they are written down."
  5 "Do learners have to disclose a disability?" — "No. Learners describe practical needs. No diagnosis or proof is asked for, and only sites they choose can see it."
  6 "How long does it take to add to our site?" — "One script tag and a small server step. Most sites can do it in an afternoon."
  7 "Can we host it ourselves?" — "Yes. It runs with Docker Compose on your server, including the speech and AI models."
  8 "Does it work on basic phones and slow connections?" — "Yes. It works on low-cost Android phones over 3G, saves answers on the phone when offline, and can send an SMS link to finish later."
- Divider, then footer: logo mark; four columns "For learners" (How it works, Register by voice, Get help, Accessibility statement), "For platforms" (Playground, Docs, Self-hosting, Templates), "The boring bits" (Privacy, Terms, Data protection, Open-source licence), "Say hello" (Telegram, LinkedIn, GitHub, hello@mezgeb.example). Line: "Open source. First built for the Digital Bridge Accessibility Hackathon 2026 in Addis Ababa, with blind, Deaf, disabled and displaced co-designers." Language switch. A giant "mezgeb" wordmark in white spanning the full width, bottom cut off by the page edge, aria-hidden="true", with a faint "መዝገብ" behind it. "© 2026 Mezgeb".

=====================================================================
5. LIVE DEMO "/demo" (a real, working sign-up)
=====================================================================

Layout: a browser-style frame titled "learnhub.et/join (sample platform)" containing the Mezgeb component, plus a right-hand "Developer view" panel that can be collapsed.

5.1 The component (left/main):
- Template: "Learning platform" (from /templates). Steps, one question per screen:
  1 Language (Amharic / English, large buttons with icons)
  2 Full name (text)
  3 Area (sub-city list for Addis Ababa plus "Other")
  4 Phone number (Ethiopian format: 10 digits starting 09 or 07; show digits grouped)
  5 Date of birth (Ethiopian calendar by default with a switch to Gregorian)
  6 How will you show who you are? (Fayda / Refugee ID / Other document / Refer me through a partner). If "Refer me", show a partner choice and a consent checkbox, then a mint notice "A partner will help you finish. They can see this form, not your answers."
  7 Support you need (private; multi-select chips; "Who can see this" toggles; no medical questions)
  8 Work you've done (skills from stories: a text box and a Speak button; then suggested skill pills to keep or remove)
  9 Review and confirm (all answers listed with "Change" links; black "Confirm")
- Each screen: step counter "Step N of 9", a thin progress bar, the question in Amharic and English (current language first), a "Read aloud" button, an icon, the input, plain inline errors linked with aria-describedby and announced via an aria-live region, an error summary at the top that receives focus on submit, "Continue" and "Back".
- No time-outs. Autosave every answer to localStorage (in try/catch). On reload, show "Welcome back. Continue from step N?"
- Read aloud: use the browser's speechSynthesis. If no Amharic voice is available on the device, show a small note: "Your device has no Amharic voice. In the product, Mezgeb provides its own Amharic audio."
- Ethiopian calendar: implement conversion with the Julian Day Number method. Ethiopian date to JDN: JDN = 1724220 + 365*(year-1) + floor(year/4) + 30*(month-1) + day. Convert JDN to Gregorian with the standard algorithm. Months: Meskerem, Tikimt, Hidar, Tahsas, Tir, Yekatit, Megabit, Miyazya, Ginbot, Sene, Hamle, Nehase, Pagume (Pagume has 5 days, or 6 in a leap year where year % 4 == 3). Show the converted Gregorian date under the inputs. Unit-test these two: 1 Meskerem 2018 = 11 September 2025; 12 Meskerem 1990 = 22 September 1997.
- Offline: a toggle "Simulate offline" in the developer panel. When offline: show a notice "You're offline. Your answers are saved and will send when you reconnect.", hide the Speak buttons and AI help, keep typing, read-aloud and rule-based errors working. Also listen to the real online/offline browser events.
- Completion: show "You're registered" in a simple success state with a mint check; then in the developer panel, simulate the platform flow step by step with short delays: "1. Page received token mzg_tok_7f3a…" → "2. Server called POST /v1/registrations/exchange with its secret key" → "3. Profile returned" (show the JSON, with "support_shared" true or false depending on the learner's toggle) → "4. Learnhub created the account".

5.2 AI features in the demo (each labelled "Demo uses cloud AI (Gemini). The product runs AI on your own server by default."):
a) VOICE ANSWERS: a "Speak" button on text questions. Record with MediaRecorder (max 20 seconds, visible timer, stop button). Send the audio to Gemini with the question and the expected field type; ask for JSON { "transcript": string, "value": string, "confidence": "high"|"medium"|"low" }. Show the transcript in an editable box: "Is this right? You can change it." Only save after the learner confirms. If the call fails or takes longer than 8 seconds: "Voice is slow right now. You can type instead." and focus the text input.
b) SMART HELP (Alt+H or a "Help" button on every screen): build a screen description in the browser containing ONLY: the question label, field types, the current error codes and messages, and button names. Strip every typed value. Send it plus the learner's typed or spoken problem to Gemini; ask for JSON { "explanation": string (plain, max 2 sentences, in the current language), "targetFieldId": string|null }. Show the explanation in a help panel with "Take me there" (moves focus to targetFieldId and announces "Moved to: <label>") and "Ask a person" (shows the partner message). In the developer panel, show "What the AI received" with the exact JSON sent, so viewers can see no answers were included. If AI fails or is offline, fall back to the pre-written explanation for the current error code.
c) SKILLS FROM STORIES: send the learner's work description to Gemini; ask for JSON { "skills": [{ "name": string, "evidence": string }] } with at most 6 skills. Show them as pills with the evidence phrase highlighted in the text; the learner removes or keeps each. Fallback: a simple checklist of common skills.

5.3 Developer view panel (right):
- Toggles: "Simulate offline", "AI on/off" (when off, Speak, Smart help and AI skills disappear and everything still works), language.
- Live JSON of the current answers (values shown here only because this is a demo; label it "Demo only: the real component never shows this").
- "What the AI received" log.
- Token exchange steps after completion.

=====================================================================
6. TEMPLATES "/templates"
=====================================================================

6.1 Template gallery: four cards in a grid, each with an icon, name, "For…" line, number of questions, which ID routes are on, and buttons "Preview" and "Use in playground":
- Learning platform — bootcamps, TVETs, online courses (9 questions; all four ID routes).
- Job board: job seeker — people looking for work (skills from stories, work history, interview support, private job filter).
- Employer sign-up — companies posting jobs (company details, contact, accommodations the company can offer).
- Programme intake — NGOs registering people (fewest fields; all four ID routes; partner registration on by default).
Each template is a real JSON object in src/templates/*.ts using this schema:
  { id, name, description, languages: ["am","en"], idRoutes: [...], supportNeeds: [...], questions: [{ id, type: "text"|"phone"|"date"|"choice"|"multichoice"|"id-routes"|"support"|"work-story", label: { am, en }, hint?: { am, en }, icon, required, options?, maps_to }], consent: { am, en } }
"Preview" opens an accessible dialog that renders the template in the same component as /demo (read-only walk-through). Show the JSON in a collapsible code block.

6.2 AI TEMPLATE BUILDER (an AI feature):
- A panel "Build a template with AI". Inputs: "Start from" (choose a template), a large text area "Paste your current sign-up fields or describe what you need" (placeholder: "Full name, email, phone, date of birth, highest education, which centre you want to attend"), and language choice.
- On "Draft template", send the base template and the text to Gemini; ask for JSON matching the schema above, plus "warnings": [{ "questionId": string, "issue": string, "suggestion": string }].
- Then run a QUESTION CHECKER: show warnings in a list, for example "Asks two things at once", "Uses jargon", "Asks for medical information", "Collects data you may not need (email is optional for many learners)". Each warning has "Apply suggestion" and "Ignore".
- Show a side-by-side: left the editable question list (reorder with up/down buttons, edit labels, delete), right a live preview of the form.
- "Use in playground" passes the template to /playground.
- Fallback without AI: let the user build from the base template manually.

=====================================================================
7. INTEGRATION PLAYGROUND "/playground"
=====================================================================

A two-column tool:
- Left, settings: template (dropdown, or the one passed from /templates); site key (text, default "pk_test_learnhub"); default language (am/en); integration type (Embedded / "Sign up with Mezgeb" button); accent colour (colour input; reject colours that fail contrast against white text and say why); hosting (Hosted / Self-hosted lite / Self-hosted full).
- Right, outputs in tabs, each with a Copy button announced via aria-live:
  * "Your page": the HTML snippet (embedded: script + <mezgeb-register site-key lang template theme-accent>; button: a "Sign up with Mezgeb" button snippet that links to the hosted page with a return URL).
  * "Your server": the token-exchange endpoint in three languages (Node/Express, Python/FastAPI, PHP), each ~15 lines: receive the token from the page, POST to /v1/registrations/exchange with the secret key from an environment variable, create the user, start a session.
  * "Webhook": an example handler for "profile.updated".
  * "Self-hosting": the docker compose command for the chosen profile and the .env file with MEZGEB_SPEECH and MEZGEB_AI values.
- Below: "Run a test registration" which opens the /demo component in a dialog with the chosen settings and then shows the simulated token exchange steps and returned JSON.

=====================================================================
8. DOCUMENTATION "/docs"
=====================================================================

A documentation layout like a good developer docs site: left sidebar navigation (collapsible on mobile), main article, right "On this page" table of contents. Code blocks with Copy buttons. A small banner at the top: "Draft documentation for team discussion."
Pages (write real, concise content for each, in plain English, using the facts in section 0):
- Quick start (5 steps: pick a template, add the tag, add the server endpoint, test, go live; with code)
- How it works (the three ways to sign up; the token exchange explained step by step with a simple numbered diagram)
- Templates (what they contain; the four templates; how to customise)
- Form schema reference (every question type and field, with examples)
- Theming (accent colour, fonts, how contrast is protected)
- Accessibility (what is tested: NVDA, TalkBack, keyboard only, 200% zoom, sound off; axe-core; WCAG 2.2 AA; how read-aloud and errors work)
- AI, privacy and low network (the three levels: browser/no AI, your server, optional cloud; what needs AI and what does not; offline behaviour; what the AI never receives; what AI must never do)
- Self-hosting (lite and full profiles, hardware notes stated as "to be measured", env variables, updating)
- REST API (endpoints with request/response examples: GET /v1/capabilities, POST /v1/registrations/exchange, POST /v1/speech/transcribe, POST /v1/forms, GET /v1/forms/{id}, webhooks profile.updated and registration.completed; authentication with publishable vs secret keys)
- JobPosting (how employer accommodations are published; a JSON-LD example)
- FAQ (reuse the landing page FAQ)

=====================================================================
9. ACCESSIBILITY REQUIREMENTS (non-negotiable, all pages)
=====================================================================
- Zero critical or serious axe-core issues.
- One <h1> per page; headings in order; landmarks (header, nav, main, footer); every section aria-labelledby its heading.
- Fully usable with keyboard only, in a logical order, with visible focus.
- Text contrast at least 4.5:1, UI and focus 3:1.
- Works at 200% zoom and 320px width without horizontal scrolling.
- All dialogs: focus trapped inside, Escape closes, focus returns to the opener.
- Decorative SVGs aria-hidden; meaningful ones role="img" with aria-label.
- Status changes (saved, copied, offline, AI result) announced through aria-live="polite".
- Touch targets at least 44x44px.

=====================================================================
10. QUALITY BAR
=====================================================================
Before finishing: test the full /demo flow by keyboard only; test with AI off and with "Simulate offline" on; confirm both Ethiopian calendar test dates; confirm no invented statistics, logos or testimonials appear anywhere; confirm every Amharic string is in src/i18n.ts.
```

## PROMPT ENDS

---

## Follow-up prompts (one at a time, after the first build)

1. **Fix gaps:**
   `List every requirement from my first prompt that is missing or only partly built, then build the missing parts. Do not change what already works.`

2. **Demo robustness:**
   `Go through /demo with AI turned off, then with "Simulate offline" on, then with storage blocked. Fix anything that breaks, and make sure every fallback message appears as specified.`

3. **Accessibility pass:**
   `Audit every page as a screen reader and keyboard user would: heading order, labels, aria-live announcements, dialog focus, accordion buttons, focus visibility. Fix every issue without changing the visual design.`

4. **Design polish:**
   `Compare the landing page against the design system and section 4 of my prompt. Tighten spacing, alignment and type sizes so the feature tiles and platform tiles look like polished product screenshots. Remove anything generic.`

5. **Amharic layout:**
   `Switch the whole app to Amharic and fix any text that is cut off, wraps badly or uses the wrong font. Amharic must use Noto Sans Ethiopic with line height 1.7 or more.`

6. **Mobile:**
   `Check every page at 360px and 390px wide. Stack the hero windows, feature tiles and playground columns cleanly; keep buttons at least 44px tall; make the docs sidebar a menu.`

## Before you show it to anyone

- [ ] **Amharic:** read every string in `src/i18n.ts` and correct it.
- [ ] **Video:** replace `VIDEO_ID` with your real YouTube video ID, or hide the video until you have one.
- [ ] **Honesty check:** search the site for any number, company name, logo or quote that is not in section 0 of the prompt, and remove it.
