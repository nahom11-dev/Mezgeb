# Mezgeb: Full UI Revamp Prompt (one prompt, every page)

Paste everything below the line into Google AI Studio, with the current Mezgeb project open. It restyles the whole showcase page by page. It does not change routes, data, or AI logic.

---

## 0. Your job

You are redesigning the interface of **Mezgeb** (መዝገብ, "register"), an accessible sign-up and profile component for Ethiopian learning and job platforms. The app already works. Your job is to **replace the look and layout of every page and every section** with the system below, and to fix the UI states that are missing.

Rules for the job:

1. Keep every route, API call, data shape, and piece of business logic exactly as it is. If a visual change needs a logic change, make the smallest change and say so in a comment.
2. Restyle by building a small shared component set first (section 4), then rebuilding each page from those components. Do not style pages one-off.
3. The learner-facing widget is the product. It gets the most care. Marketing pages come second.
4. Every screen must still pass: keyboard only, screen reader (NVDA / TalkBack), 200% zoom, sound off, and a 360 px wide phone.
5. No invented facts anywhere: no partner logos, user counts, testimonials, percentages, or awards. Sample data is labelled "Sample".

## 1. What "AI slop" means here, and is banned

Do not produce any of the following. If an existing screen has them, remove them.

- Purple-to-blue or pink gradient washes, gradient text, gradient buttons, glowing blobs, mesh backgrounds, noise textures.
- Glassmorphism (blurred translucent cards), neon glows, large soft drop shadows on everything.
- Emoji used as icons. The sparkle icon used to mean "AI". Robot heads. Magic wands.
- A row of three identical cards with an icon on top, repeated on every page.
- Cards with a coloured left border used as decoration.
- Everything centred. Centre only short single lines (a section label, a one-line call to action). Body text and forms are left-aligned.
- Every corner at 24 px or more. Pill shapes on things that are not pills.
- Animated number counters, typing-effect headlines, parallax, scroll-jacking, auto-playing carousels.
- Marketing words: "unlock", "empower", "seamless", "revolutionise", "supercharge", "next-generation", "cutting-edge", "effortless", "magic".
- Stock 3D illustrations, abstract people, isometric laptops.
- Lorem ipsum, "John Doe", fake company names with fake logos.
- Placeholder text used instead of a label.
- Disabled buttons with no explanation of why they are disabled.

What to do instead: flat colour fields, real product screens as the main imagery, a strict type scale, generous whitespace, thin 1 px borders, one accent colour used sparingly, and copy that states facts plainly.

## 2. Design tokens

Put these in one CSS file (`src/styles/tokens.css`) as custom properties and use only these values.

### 2.1 Colour

| Token | Hex | Use |
|---|---|---|
| `--ink` | #111111 | Main text, primary buttons |
| `--ink-2` | #3D3935 | Secondary headings |
| `--muted` | #6B6560 | Supporting text (passes 4.5:1 on white and on cream) |
| `--line` | #E4E1DC | Borders, dividers |
| `--line-strong` | #C9C4BD | Input borders (3:1 against white) |
| `--paper` | #FFFFFF | Page background |
| `--sand` | #F9F3EA | Warm section background ("Why" section, info panels) |
| `--stone` | #F5F5F3 | Feature tiles, code blocks, table headers |
| `--mint` | #E4F2EC | Hero panel, success backgrounds |
| `--mint-ink` | #1F5C46 | Text and icons on mint; success text |
| `--lilac` | #EEEBF8 | Voice and listening states |
| `--accent` | #6A4FC4 | Links, focus ring, selected states, the one accent |
| `--accent-soft` | #8F6FE0 | Decorative only (waveform lines). Never text. |
| `--night` | #161616 | Footer and FAQ block |
| `--night-muted` | #A8A29E | Text on night |
| `--error` | #B42318 | Error text and icon |
| `--error-bg` | #FDECEA | Error field background |
| `--warn` | #8A5A00 | Warning text |
| `--warn-bg` | #FFF4DC | Offline banner, warnings |

Rules: status is never shown by colour alone; always add an icon and a word ("Saved", "Not sent yet", "Needs a fix"). The accent appears on at most one or two elements per screen.

### 2.2 Type

- Latin: **Inter** (400, 500, 600). Ethiopic: **Noto Sans Ethiopic** (400, 600). Font stack: `"Inter", "Noto Sans Ethiopic", system-ui, sans-serif`. Monospace: `"JetBrains Mono", ui-monospace, monospace` for code only.
- Load only these weights, `font-display: swap`, subset where possible.
- Scale (rem, root 16 px): 0.8125 / 0.875 / 1 / 1.125 / 1.375 / 1.75 / 2.25 / 3 / 4.
- Body 1 rem, line-height 1.6. Amharic body line-height 1.8 (Ethiopic glyphs are taller). Headings line-height 1.15, letter-spacing -0.02em for 2.25 rem and above, never on Amharic.
- Learner widget body text: 1.125 rem minimum. Question text: 1.375–1.75 rem.
- Maximum line length 68 characters for reading text.
- Sentence case everywhere. No all-caps except small section labels (0.8125 rem, 600, letter-spacing 0.06em), and never in Amharic.

### 2.3 Space, shape, depth, motion

- Spacing scale (px): 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Sections on marketing pages: 96 px top and bottom on desktop, 64 px on phone.
- Radius: 6 px inputs and small buttons, 10 px buttons and cards, 16 px large panels and product windows, 28 px only on the two big dark-block top corners. Nothing else.
- Borders: 1 px `--line`. Inputs 1 px `--line-strong`, 2 px `--ink` when focused.
- Shadow: one only, for floating things (menus, dialogs, the product window): `0 1px 2px rgba(17,17,17,.06), 0 8px 24px rgba(17,17,17,.08)`.
- Focus ring: `outline: 3px solid var(--accent); outline-offset: 2px` on every focusable element, never removed.
- Motion: 150 ms ease-out for hover and colour, 200 ms for panels. Wrap all motion in `@media (prefers-reduced-motion: no-preference)`. Nothing moves on its own except the listening waveform, which stops when reduced motion is on.

### 2.4 Icons

Lucide icons, stroke 1.75, 20 px (24 px in the learner widget). Icon-only buttons get `aria-label`. Decorative icons get `aria-hidden="true"`. One icon per idea; do not decorate headings with icons.

### 2.5 Layout

- Container max width 1200 px, side padding 24 px (16 px under 480 px).
- 12-column grid with 24 px gutters on desktop; single column under 768 px.
- Breakpoints: 480, 768, 1024, 1280.
- Build phone-first. Test at 360 px.
- Touch targets at least 44 × 44 px. In the learner widget, 48 px.

## 3. Writing rules (all pages)

- Plain words. Short sentences. One idea per sentence.
- Buttons say what happens: "Save and continue", "Send support request", "Copy code". Never "Submit", "OK", "Click here".
- Errors say what went wrong and how to fix it, next to the field: "Enter your phone number with 10 digits, like 0911 234 567." Never "Invalid input".
- Every English string has an Amharic string. Language switch is always visible, labelled "አማርኛ" / "English" (each in its own language, with `lang` set).
- Numbers and dates: show the Ethiopian calendar first in Amharic mode, the Gregorian date in brackets.
- Never blame the user. Never say "simply" or "just".

## 4. Shared components (build these first)

Put them in `src/ui/`. Every page uses these and nothing else.

1. **Button**: variants `primary` (ink background, white text), `secondary` (white, 1 px ink border), `quiet` (text only with underline on hover), `danger` (error colour). Sizes 40 px and 48 px high. Loading state shows a spinner plus the word "Saving…"; keeps its width. Disabled buttons show a one-line reason beneath them.
2. **Field**: label above (always visible, 1 rem 500), optional hint below the label in `--muted`, the input, then the error row (icon + text in `--error`, linked with `aria-describedby`). Error state: 2 px error border and `--error-bg` fill. Never put the label inside the input.
3. **VoiceButton**: a 48 px square button at the right of the input, mic icon, label "Speak your answer". States: idle; listening (lilac background, live waveform, text "Listening… tap to stop"); processing ("Writing what you said…"); review (the transcript appears in the field, highlighted, with "Keep" and "Try again" buttons). Never submits on its own.
4. **ReadAloudButton**: speaker icon with text "Read aloud". Uses an Amharic voice in Amharic mode; if none exists, plays the pre-recorded audio; if neither, the button is hidden, not broken.
5. **ChoiceList**: large selectable rows (radio or checkbox), each 56 px minimum, with icon, title, and one-line description. Selected state: 2 px accent border and a check icon. Whole row is the label.
6. **Progress**: text "Question 3 of 9" plus a thin 4 px bar. No percentages, no step dots.
7. **Banner**: `info`, `success`, `warning`, `error`. Icon + one sentence + optional action. Offline banner uses `warning`: "You are offline. Your answers are saved on this phone and will send when you reconnect."
8. **Toast**: bottom-left, `role="status"`, disappears after 6 s but can be dismissed; never the only place an error appears.
9. **Dialog**: native `<dialog>`, focus moves in and returns on close, Esc closes, title and one action.
10. **Tabs**: real tablist with arrow-key support.
11. **CodeBlock**: stone background, mono 0.875 rem, a "Copy code" button that changes to "Copied" for 2 s and announces it.
12. **Table**: stone header row, 1 px row lines, 48 px rows, horizontal scroll in its own box on phone.
13. **Badge**: text first, small icon, neutral by default; status badges use the status colours plus a word.
14. **EmptyState**: one line of what is missing, one line of what to do, one button. No illustration.
15. **Skeleton**: grey blocks shaped like the real content, for loading over 300 ms.
16. **SiteHeader** and **SiteFooter** (section 5).

## 5. Global shell

### 5.1 Header (all marketing and developer pages)

- Height 64 px, white, 1 px bottom line. Sticky only on desktop.
- Left: the "mezgeb" wordmark in Inter 600, 1.25 rem, ink, followed by "መዝገብ" in muted. No icon logo.
- Centre-left links: "How it works", "Templates", "Docs", "Playground". Current page: ink text with a 2 px underline offset 6 px.
- Right: language switch, then "Try the demo" (secondary button), then "Add to your site" (primary).
- Under 768 px: wordmark, language switch, and a "Menu" button (text plus icon) that opens a full-width panel with the same links stacked at 56 px each.
- First focusable element on every page: a "Skip to main content" link, visible on focus.

### 5.2 Footer

Part of the dark block at the end of the landing page; on other pages, a short version: night background, 28 px rounded top corners, three link columns (Product, Developers, Project), the licence name, a link to the source code, and "Built for the Digital Bridge Accessibility Hackathon 2026". No social icons unless real accounts exist.

## 6. Page by page

### 6.1 Landing page `/`

Order of sections, top to bottom. Every section is full-width with its own background; content sits in the 1200 px container.

**1. Hero**
- Background: white page with a large inset panel (16 px radius, 24 px from the edges) filled flat `--mint`. No gradient.
- Left half: a small label "Accessible sign-up for Ethiopian platforms" (section label style), the headline "Sign-up that listens, / to every learner." at 4 rem (2.25 rem on phone), a 1.125 rem paragraph of two sentences saying what it is: "Mezgeb is a sign-up and profile form you add to your site with two lines of code. Learners can speak or type each answer, in Amharic or English, on a cheap phone, even offline."
- Buttons: "Try the demo" (primary) and "See the code" (secondary). No email box.
- Right half: the **product window**: a real phone-sized widget screen (not a drawing), 16 px radius, the one shadow, showing the question "ስምህ ማን ነው? / What is your name?" with the VoiceButton in its listening state and the transcript "ሐና ተስፋዬ" being reviewed. Behind it, offset up and left, a second window showing the ID route choice screen. Thin lilac waveform lines (accent-soft, 1.5 px) run behind the windows inside the panel, purely decorative, `aria-hidden`.
- Under the panel, one row of four plain facts in muted text, separated by thin vertical lines: "Works with NVDA and TalkBack" · "Amharic and English" · "Works offline" · "Open source". Only claims that are true in the build.

**2. Why** (background `--sand`)
- One large statement in 2.25 rem ink, left-aligned, max 22 words, about the problem: many sign-up forms time out, hide labels, and demand documents some learners do not have.
- Below it, three short columns of muted text, each starting with a bold ink lead-in: "Forms that time out", "Questions only some can read", "Proof people do not have". Each two sentences. No icons, no cards.

**3. Features** (white, zig-zag)
- Section label and heading "What learners get".
- Five rows. Each row: text on one side (heading 1.75 rem, two-sentence paragraph, a quiet link), a 440 px tall `--stone` tile with 16 px radius on the other. Sides alternate.
- Each tile shows a real, cropped widget screen, not an illustration:
  1. **Speak each answer**: a field with the VoiceButton in review state; transcript highlighted; "Keep" and "Try again" visible.
  2. **One question per screen**: a single large question, Progress "Question 3 of 9", big Back and "Save and continue" buttons.
  3. **ID routes for everyone**: the ChoiceList with Fayda, refugee ID, another document, "A partner can vouch for me".
  4. **Ask for support privately**: the support screen with the line "You do not need to show medical proof" and the share toggle set to OFF by default.
  5. **Keeps working offline**: the warning Banner on top of a filled form, with a badge "3 answers waiting to send".
- Inside each tile, the screen sits on a white card with 1 px line, offset so it is cropped by the tile edge on one side. No floating shapes.

**4. For platforms** (white, top border line)
- Heading "Add it in an afternoon".
- Three numbered steps in a row (stacked on phone), each a plain block with a large muted number, a title, one sentence, and a small CodeBlock:
  1. "Pick a template" — Learning platform, Job seeker, Employer, Programme intake.
  2. "Add two lines" — the script tag and `<mezgeb-register site-key="…" lang="am">`.
  3. "Receive the profile" — `POST /v1/registrations/exchange` and the `registration.completed` webhook.
- Below: a row of three plain links: "Read the docs", "Open the playground", "See the OpenAPI spec".

**5. Templates strip** (stone background)
- Heading "Start from a template". A horizontal row of four template cards (scrolls with buttons on phone): name, who it is for, number of questions, languages, "Preview" quiet button. Cards are white with 1 px line, 10 px radius. No icons on top.

**6. FAQ + footer** (one long night block, 28 px rounded top corners)
- FAQ: heading in white, then 6–8 questions as native `<details>` rows with 1 px `#2A2A2A` dividers, plus/minus icon on the right. Questions: Is it free? Does it need the internet? Is AI required? Where is data stored? What does a platform need to install? Which screen readers were tested? Is support information shared?
- Then the footer columns, then a giant "mezgeb" wordmark in `#262626` across the bottom, `aria-hidden`.

### 6.2 Demo page `/demo` (the learner widget, most important)

Layout: on desktop, a narrow left column (320 px) with plain controls for the person demoing ("Template", "Language", "Simulate offline" switch, "Reset"), and the widget centred in the remaining space at real phone width (390 px) inside a 16 px radius frame. On phone, the controls collapse into a "Demo settings" button above the widget. The widget itself must also work full-screen on a phone with no frame.

Widget screens, in order. Each screen: Progress at top, one question, the answer area, then a fixed bottom bar with "Back" (secondary) and "Save and continue" (primary), both 48 px, full width split 1:2. A "Help" button and "Read aloud" sit under the question. No timers anywhere.

1. **Welcome**: title "Create your profile", three short lines (what it asks, that it saves as you go, that nothing times out), language choice as two large rows (አማርኛ / English), "Start". A quiet link "I have a saved link" for resume.
2. **How do you want to answer?**: ChoiceList: "Speak and listen", "Read and type", "Simple words with pictures". This sets the mode; it can be changed any time from the top bar.
3. **Question screens** (name, phone, date of birth, location, education, skills): one Field per screen with VoiceButton. Date of birth uses three plain selects (day, month, year) with Ethiopian months in Amharic mode and the Gregorian date shown beneath as "That is 22 September 1997". No date picker pop-up. No pre-filled values.
4. **Identity**: ChoiceList of four routes. Choosing "Another document" shows an upload field with a camera option. Choosing "A partner can vouch for me" shows partner selection and the status "Waiting for the partner to confirm" (never shown as verified until confirmed).
5. **Support I need** (optional, clearly marked): checkboxes in plain words (e.g. "Screen reader", "Sign language interpreter", "Extra time", "Step-free access", "Something else"), the line "You do not need to show medical proof", and a switch "Share this with the platform" set to OFF by default, with one sentence explaining who sees it when it is ON.
6. **Review**: a list of every answer with an "Edit" quiet button per row that jumps back to that question and returns here. Support needs show "Private" unless shared.
7. **Done**: success Banner, the learner's name, one sentence on what happens next, and "Get a link to continue later" (SMS) if anything is incomplete.

States the widget must have (draw each): field error, voice listening, voice review, voice failed ("We could not hear that. Try again or type your answer."), offline banner, sending queued answers, help panel open, save-and-resume link sent, session restored ("Welcome back. You were on question 5.").

**Help panel**: opens as a bottom sheet on phone and a side panel on desktop; focus moves to its heading; Esc and a "Close help" button return focus to the field. Contains: the question explained in simpler words, an example answer, "Read aloud", and (only if AI is available) "Ask a question about this field". Help works with AI off; AI only adds the last item.

**Simple words with pictures mode**: each question gets a 64 px line icon beside it, text drops to the simple wording, and Read aloud plays automatically once (can be turned off).

### 6.3 Templates gallery `/templates`

- Page header: title "Templates", one sentence, primary button "New template", secondary "Import JSON".
- Filter row: search field (with a visible label), segment control "All / Learning / Jobs / Employers / Programmes", language filter.
- Grid of template cards (3 columns desktop, 1 phone). Each card: name (1.125 rem 600), one-line purpose, a row of facts in muted text ("9 questions · Amharic, English · 2 ID routes"), a small preview of the first question rendered as a mini widget screen on stone, and actions "Preview", "Duplicate", "Edit". Sample templates carry a "Sample" badge.
- "Create with AI" is a normal card at the start of the grid with a plain text box "Describe who is signing up" and a button "Draft a template"; output always opens in the builder for review. Say "Draft", never "magic".
- EmptyState for no search results.

### 6.4 Template builder `/templates/:id/edit`

Three panels, full height below a 56 px toolbar.

- **Toolbar**: back link "Templates", editable template name, save status ("Saved" with check / "Saving…" / "Not saved: retry"), Undo, Redo, "Check accessibility", "Export", "Preview as learner" (primary).
- **Left, Outline (280 px)**: ordered list of questions, each row showing type icon, short label, and badges for "Required", "Has condition", "Voice on". Drag handle plus "Move up" / "Move down" buttons for keyboard users. "Add question" opens a menu of types with one-line descriptions: Short text, Long text, Phone, Email, Number, Date (Ethiopian/Gregorian), Single choice, Multiple choice, Yes or no, Location, ID route, Support needs, File, Info text, Consent.
- **Centre, Inspector**: grouped sections with headings: "Question" (English text, Amharic text side by side, simple-words version), "Answer" (type settings, choices editor), "Rules" (required, show only if…), "Voice and audio" (voice input on/off, read-aloud audio status), "Checks" (results of the checker for this question). AI actions appear as quiet buttons inside the relevant field: "Suggest simpler wording", "Translate to Amharic", each producing a suggestion card with "Use this" / "Dismiss". Nothing changes without the user choosing "Use this".
- **Right, Live preview (390 px)**: the real widget rendering the selected question, with a language toggle and a mode toggle. Updates as you type.
- Under 1024 px: panels become tabs "Outline / Edit / Preview".
- **Accessibility checker** results open in a side panel: list of issues with severity word ("Must fix", "Should fix"), the question it belongs to, and a "Go to question" button.

### 6.5 Playground `/playground`

- Two columns: left, a code editor area with Tabs "HTML", "Options", "Webhook payload"; right, the live widget running the code. A top bar with template select, language select, theme select ("Light", "High contrast"), and "Reset".
- Under the preview, an **Events log**: a Table of events emitted (`step.completed`, `registration.completed`) with time and a "View JSON" button.
- A strip at the bottom with the three integration levels as Tabs: "Script tag", "REST API", "Standards (schema.org JobPosting)", each with a CodeBlock.

### 6.6 Docs `/docs`

- Three-column docs layout: left nav (240 px, collapsible sections: Get started, Embed, Server exchange, Webhooks, Templates, Accessibility, Offline, Self-hosting, API reference), centre article (max 720 px), right "On this page" list (hidden under 1280 px).
- On phone, left nav becomes a "Docs menu" button at the top.
- Article styling: H1 2.25 rem, H2 1.375 rem with 48 px top space and an anchor link on hover/focus, body 1 rem/1.7, CodeBlocks with filename label, callouts as Banner `info` / `warning` only.
- API reference pages: endpoint line (method badge in text + path in mono), request and response Tables, example CodeBlocks, and a "Try it" button that opens the Playground.
- Each page ends with "Previous" / "Next" links and "Edit this page on GitHub" (only if a real repo link exists).

### 6.7 Jobs `/jobs` (career part)

- Search field with VoiceButton, filters as a collapsible panel: location, job type, and the private filter "Support I need" with the line "This filter stays on your phone. Employers do not see it."
- Job rows (not cards): title, employer, location, type, and accommodation badges in words ("Screen reader friendly application", "Flexible hours"). "Sample" badge on demo data.
- Job detail: clear sections (About the job, What you need, Support the employer offers, How to apply), then "Apply by voice" (primary) and "Apply by typing" (secondary). Applying reuses the widget screens and the saved profile.

### 6.8 Employer accommodations form `/employers/accommodations`

A widget-style one-question-per-screen form for employers listing what they offer, built from the same components, ending in a Review screen and a preview of how the badges will look on a job row. Output maps to schema.org JobPosting fields; show the JSON in a collapsible "For developers" block.

### 6.9 Partner console `/partner`

- For organisations such as disability associations registering learners with consent.
- Header with partner name and "Register a learner" (primary).
- Table of learners: name, template, status badge ("Waiting for learner consent", "Complete", "Needs a document"), last updated, "Open". Filters above. EmptyState when none.
- "Register a learner" runs the widget in assisted mode with a banner "You are filling this in with [name]. They must agree before it is sent." and a final consent screen the learner completes themselves.

### 6.10 My profile `/profile`

- Summary card at top: name, language, mode, last saved.
- Sections with an "Edit" button each: About me, Contact, Identity, Education and skills, Support I need (marked "Private to you" with the current sharing state), Connected platforms (list with "Stop sharing").
- "Download my data" and "Delete my profile" at the bottom; delete uses a Dialog that asks the user to type nothing, just confirm with a clear sentence of what is deleted.

### 6.11 System pages

404, offline fallback page, error page, and loading states. Each uses EmptyState: one line, one action, header and footer present.

## 7. Accessibility acceptance (check every page)

- WCAG 2.2 AA: contrast 4.5:1 text, 3:1 large text and UI parts; focus visible and not hidden by sticky bars (2.4.11); targets 24 px minimum, 44–48 px here; no drag-only actions (2.5.7); help in the same place on every widget screen (3.2.6); no re-entering information already given (3.3.7); no cognitive tests to log in (3.3.8).
- Landmarks: one `<header>`, `<nav>` with label, `<main id="main">`, `<footer>`. One H1 per page; headings in order.
- Every input has a `<label>`; groups use `<fieldset>` and `<legend>`; errors are linked with `aria-describedby` and summarised at the top on submit with links to each field.
- Moving between widget screens moves focus to the new question heading and announces "Question 4 of 9".
- `lang="am"` on Amharic text, `lang="en"` on English.
- 200% zoom and 400% reflow at 320 px wide with no horizontal scroll (except code and tables in their own box).
- Works with sound off: every audio cue has visible text.
- Reduced motion respected. High-contrast theme: pure black on white, 2 px borders everywhere.
- Run axe-core on every route: zero critical or serious issues.

## 8. Performance on cheap phones and 3G

- First load of the widget under 150 KB gzipped JavaScript; marketing pages may load more, but lazy-load the playground editor and docs search.
- Fonts: two families, the listed weights only, preloaded; Ethiopic subset where possible.
- Images: product screens are real HTML where possible, otherwise WebP with width and height set.
- No layout shift when fonts load or banners appear (reserve space).

## 9. Done means

1. `tokens.css` and `src/ui/` exist and every page uses them; no raw hex values in page files.
2. Every page and section in section 6 is rebuilt in the stated order and layout.
3. Every widget state in 6.2 exists and can be reached from the demo controls.
4. Nothing from section 1 remains anywhere.
5. Section 7 checks pass on every route, and section 8 budgets are met.
6. A short `UI_CHANGES.md` lists each page, what changed, and any logic touched.
