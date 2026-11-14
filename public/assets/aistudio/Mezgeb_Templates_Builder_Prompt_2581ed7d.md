# Mezgeb: Templates and Template Builder Upgrade (prompt for Google AI Studio)

## What is wrong with the current version

I checked `src/pages/TemplatesPage.tsx` and `src/templates/types.ts`. The current builder only lets you:

- edit a question's label, in **one language only** (the current interface language)
- move a question up or down, or delete it
- add a new question, which is always a **plain text question** called "New question"

You **cannot** change a question's type, edit its options, edit hints, mark it required or optional, pick an icon, set where the answer goes (`maps_to`), edit both languages, choose ID routes, edit the support list or consent text, set the look, save your work, or export it.

The gallery cards are plain: they show raw ids such as `fayda, refugee_id`, and their icon is simply taken from the second question.

## What this prompt changes

1. **Template gallery:** richer cards with a mini preview, readable chips, an estimated completion time, what each template collects, filters, a better preview dialog and a "Customize" button.
2. **Template builder:** a proper three-panel editor:
   - **Outline:** the list of questions, sections, and a question library.
   - **Inspector:** every setting for the selected question, in both languages.
   - **Live preview:** in a phone or desktop frame.

   Plus settings, look, checker and export tabs, saved templates, undo and redo, import and export.
3. **New question types:** yes/no, email, number, information screen and consent, plus "show this question only if…" rules.
4. **More AI tools,** all optional and with fallbacks: draft from a description, improve wording, translate missing text, and check a question.

Paste the prompt below into the **same** AI Studio project.

---

## PROMPT STARTS

```
Upgrade the Templates page and the Template Builder in the existing Mezgeb app. Keep the existing design system (colours, Inter and Noto Sans Ethiopic, 14px card corners, black primary buttons, 3px #6A4FC4 focus outline), the routes, and everything outside the Templates page unless listed below. Everything must stay accessible (WCAG 2.2 AA), work by keyboard only, and have every visible string in both languages in src/i18n.ts.

==================================================
1. DATA MODEL (src/templates/types.ts) — extend, stay backward compatible
==================================================

Add to TemplateQuestion (all new fields optional):
- placeholder?: LocalizedText
- section?: string                      // id of a section (see below)
- validation?: { minLength?: number; maxLength?: number; min?: number; max?: number; preset?: "none" | "ethiopian-phone" | "email" | "digits-only" | "letters-only" }
- allowVoice?: boolean                  // default true for text, phone, choice, multichoice, number, yes-no, work-story
- audio?: { am?: string; en?: string }  // optional pre-recorded question audio URLs
- sensitive?: boolean                   // marks personal or sensitive data; shown with a lock badge
- showIf?: { questionId: string; equals: string | string[] }   // show only if another answer matches
- errorHelp?: LocalizedText             // plain explanation shown by Help when this question has an error
- skippable?: boolean                   // shows "Skip this question" (only allowed when required is false)

Extend QuestionType with: "yes-no", "email", "number", "info", "consent".
- "info": a screen with a title and text, no input (for explanations such as "Why we ask this").
- "consent": a checkbox with consent text; required means the learner must tick it.

Add to MezgebTemplate (all optional, with defaults):
- category?: "learning" | "jobs" | "employer" | "ngo" | "custom"
- bestFor?: LocalizedText
- sections?: { id: string; title: LocalizedText }[]
- settings?: { voice: boolean; readAloud: boolean; smartHelp: boolean; partnerReferral: boolean; smsResume: boolean; offline: boolean; sayItSimply: boolean }   // defaults all true except smsResume false
- theme?: { accent: string; platformName: string; logoLetter: string }
- version?: number
- updatedAt?: string (ISO)

Update the four built-in templates with category, bestFor, sections, settings and theme.
Update src/templates/validate.ts to check the new fields: showIf must point to an EARLIER question that exists; choice/multichoice need 2+ options with unique values and both labels; skippable only when not required; at most one "support" question; accent colour must reach 4.5:1 contrast with white text; maps_to values unique (except "custom_*").

==================================================
2. WIDGET SUPPORT (src/components/MezgebWidget.tsx)
==================================================
- Render the new types: yes-no (two large buttons "Yes"/"No" with aria-pressed), email (type="email", optional by default), number (text input with inputMode="numeric" and min/max checks), info (title, text, Read aloud, Continue), consent (checkbox with consent text).
- Apply validation presets and min/max rules, with plain error messages in both languages.
- Respect showIf: skip hidden questions in navigation, the step counter and the review screen.
- Respect template.settings: hide voice, read-aloud, smart help, partner route, SMS resume or "say it more simply" when switched off.
- Respect skippable: show a secondary "Skip this question" button.
- Use errorHelp in the Help panel when present, before any AI.
- Use theme.accent for the progress bar and selected states, and theme.platformName in the header.

==================================================
3. TEMPLATE GALLERY (top of /templates)
==================================================

Header: title, one-line subtitle, a search box ("Search templates") and filter chips: All, Learning, Jobs, Employers, NGOs, My templates. Chips are buttons with aria-pressed. Show the result count in an aria-live region ("4 templates").

Cards (grid: 2 columns desktop, 1 mobile), each a white card with 14px corners:
- Top: a mini phone preview (about 140px wide) rendering the template's first real question in miniature: platform name, "Step 1 of N", the question label, and one input or the first two options. Decorative: aria-hidden="true".
- Category chip (e.g. "Learning") and, for built-in templates, a small "Tested wording" label only if the template has `tested: true` (default false; do not claim testing that has not happened).
- Name (20px semibold) and description.
- "Best for" line.
- A row of facts with small icons: "{N} questions", "About {M} min" (estimate = number of input questions × 20 seconds, rounded up to whole minutes; show the word "About"), "Amharic and English".
- ID route chips with readable names: "Fayda", "Refugee ID", "Other document", "Partner referral".
- Feature chips from settings: "Voice", "Read aloud", "Help", "Partner", "Offline".
- "Collects" line listing the maps_to fields in plain words (e.g. "Name, phone, area, date of birth"), and a "Sensitive" lock badge if any question is sensitive.
- Buttons: "Preview" (secondary), "Customize" (secondary, opens the builder with this template loaded), "Use in playground" (primary).
Cards for user-saved templates show "Edited {date}" and a "…" menu with Duplicate, Rename, Export JSON, Delete (Delete asks for confirmation in an accessible dialog).

Below the grid, a "Compare templates" disclosure button that opens a table: rows = built-in templates; columns = questions, estimated time, ID routes, voice, partner referral, collects sensitive data.

Preview dialog (replace the current one):
- Two panes: left, the numbered question list (click to jump); right, the live widget in a phone frame with an EN/አማ toggle and "Phone / Desktop" toggle.
- Tabs at the top: "Preview", "Questions", "JSON".
- Footer buttons: "Customize" and "Use in playground".

==================================================
4. TEMPLATE BUILDER (/templates/builder, linked from the gallery and the header of /templates)
==================================================

Move the builder to its own route so it has room. Keep "Build a template with AI" as an entry point on /templates that opens the builder.

4.1 TOP BAR (sticky)
- Editable template name (both languages via a small language switch next to it).
- Status text: "Saved" / "Saving…" / "Unsaved changes" (aria-live polite).
- Buttons: Undo, Redo (keyboard: Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z), "Check template", "Preview", "Export", "Use in playground" (primary).
- Autosave the draft to localStorage (in try/catch) every change; keep the last 30 changes for undo/redo in memory.

4.2 START SCREEN (when opening the builder with nothing loaded)
Three large choices:
- "Start from a template" (shows the four built-in templates as small cards).
- "Describe what you need" (AI draft; text area with examples; language choice). Without AI, this choice explains it needs a connection and suggests starting from a template.
- "Paste your current form" (paste a list of field names, one per line, or CSV; turn each line into a question with a guessed type using simple rules: "phone"→phone, "email"→email, "date"/"birth"→date, "gender", "region", "level" → choice with empty options to fill; then run the checker). Works without AI; with AI on, offer "Improve with AI".
- Plus "Import JSON" as a text link (validates and reports errors clearly).

4.3 MAIN LAYOUT: three panels (desktop), stacked with tabs on mobile ("Outline", "Edit", "Preview")

LEFT — OUTLINE (about 26% width)
- Sections as collapsible groups (default sections: "About you", "Identity", "Support", "Work and learning", "Review"). Buttons: "Add section", rename and delete section (deleting moves its questions to "Unsorted").
- Each question row: drag handle (decorative), type icon, label (current language), small badges: "Required", lock for sensitive, a branch icon if it has showIf, and a coloured dot if the checker has an issue (red = must fix, amber = should fix). Clicking selects it.
- Reorder: drag and drop AND keyboard (select a row, then Alt+Up / Alt+Down; also "Move up", "Move down", "Move to section…" in a row "…" menu). Announce moves: "Phone moved to position 3".
- Row "…" menu: Duplicate, Move to section…, Delete (with Undo toast instead of a confirm dialog).
- "Add question" button opens the QUESTION LIBRARY (accessible dialog):
  * Tab "Ready-made": Full name, Phone, Area (Addis Ababa sub-cities), Region (Ethiopian regions), Date of birth, ID routes, Support I need, Work story and skills, Education level, Preferred training centre, Preferred language, Email (optional), Emergency contact phone, How did you hear about us, Consent, Information screen. Each shows its type and both labels; "Add" inserts it after the selected question with sensible defaults (icon, maps_to, validation, sensitive flag).
  * Tab "Blank question": choose a type from a list with an icon, a one-line explanation and an example for each type.

MIDDLE — INSPECTOR (about 38% width), for the selected question, in grouped panels (each a collapsible section with a heading):
- "Question": type selector (changing type keeps labels and warns if options will be lost); label in English and Amharic side by side (two text areas with character counts; show "Missing" in amber if empty); hint in both languages; placeholder in both languages; a "Read aloud" preview button for each language.
- "Answer options" (choice, multichoice, yes-no labels): list of options with both labels and a value; add, delete, reorder (buttons and Alt+Up/Down); "Paste options" (one per line); "Add 'Other'" and "Add 'Prefer not to say'" quick buttons; value auto-generated from the English label (editable).
- "Rules": Required toggle; Skippable toggle (disabled with an explanation when required); validation preset dropdown; min/max length or value fields shown only when relevant.
- "Show this question only if…": choose an earlier question, then the answer(s) that make it appear (for choice/yes-no, pick from its options; otherwise a text value). Shows a plain sentence: "Shown only if 'Do you have a Fayda ID?' is 'No'." Button "Remove condition".
- "Accessibility and voice": Allow voice answers toggle; audio file URL for Amharic and English (optional, with a play test button); icon picker (grid of the available icons with names, radio-group semantics); help text shown when this question has an error (both languages).
- "Data and privacy": "Saves to field" (maps_to) with suggestions from a list of common fields and a check for duplicates; "Sensitive" toggle with an explanation ("Sensitive answers are never sent to AI and are hidden from partners").
- "AI tools" (only when AI is on and online; each result labelled with the cloud-AI notice and shown as a suggestion to Accept or Discard, never applied automatically):
  * "Improve wording" — simpler, shorter, one question only, in the chosen language.
  * "Translate missing language" — fills the empty English or Amharic text; marked "AI translation, needs review" until the user edits or ticks "Reviewed".
  * "Check this question" — returns issues and suggestions for this question.

RIGHT — LIVE PREVIEW (about 36% width)
- The real MezgebWidget rendering the draft, in a phone frame (390px) or desktop frame (toggle).
- Toggles above it: EN / አማ, "AI off", "Offline". When a question is selected in the outline, the preview jumps to it (if it is currently shown by its showIf rule; otherwise display a note "This question is hidden by its rule").
- "Restart preview" button. Preview answers are never saved.

4.4 TABS ABOVE THE INSPECTOR: "Question" (above), "Template settings", "Look", "Checker", "Export"

"Template settings":
- Category, Best for (both languages), description (both languages).
- ID routes: four checkboxes (at least one required; warning if only Fayda is on: "Learners without a Fayda ID will be blocked").
- Support options: editable list (both languages), with "Restore defaults".
- Features: toggles for voice, read aloud, smart help, partner referral, SMS resume, offline, "say it more simply", each with a one-line explanation.
- Consent text (both languages) with a "Use recommended wording" button.

"Look":
- Platform name, logo letter, accent colour (colour input plus 6 suggested swatches). Show a live contrast result ("Passes AA" / "Too light for white text — choose a darker colour") and block saving a failing colour. Preview updates live.

"Checker" (runs automatically on every change; rule-based, works offline; AI deep check optional):
- Summary line: "{n} must fix · {m} should fix · {k} tips".
- Rules (each with the question it applies to, a plain explanation, and a "Go to question" button; plus "Fix" only when an automatic fix exists):
  * Must fix: missing label in either language; choice with fewer than 2 options; duplicate maps_to; showIf pointing to a later or missing question; failing accent contrast; no ID route; more than one support question; required consent missing when sensitive questions exist.
  * Should fix: label longer than 14 words; label contains " and " or " or " joining two questions; jargon (list: "credentials", "verification", "residence", "nationality status", "submit", "authenticate", "beneficiary"); medical words ("diagnosis", "disability type", "medical", "condition", "impairment") anywhere except the support step's privacy note; email required; a sensitive question that is required; more than 12 input questions; no hint on date or phone.
  * Tips: missing audio files; no "Prefer not to say" option on optional sensitive choices; no information screen explaining why ID is asked.
- "Run AI check" button (optional) adds AI findings in the same format, labelled as AI.

"Export":
- Embed code for this template (same as the playground), "Copy JSON", "Download JSON", "Open in playground".
- "Save to My templates" (stores in localStorage under "mezgeb_my_templates", in try/catch; if storage is blocked, say so and offer Download JSON instead).

4.5 KEYBOARD AND ACCESSIBILITY FOR THE BUILDER
- All three panels are landmarks with headings ("Outline", "Edit question", "Preview").
- Shortcuts listed in a "Keyboard shortcuts" dialog (opened with "?"): Alt+Up/Down move question, Ctrl/Cmd+D duplicate, Delete removes the selected question (with undo), Ctrl/Cmd+Z undo, Ctrl/Cmd+Shift+Z redo, Ctrl/Cmd+Enter run checker.
- Drag and drop is never the only way to do anything.
- Every change that is not visible near the focus (moves, deletes, autosave, checker counts) is announced via the live announcer.
- On mobile (below 900px), the three panels become tabs; the selected question stays selected across tabs.

==================================================
5. AI ENDPOINTS (server.ts and src/ai.ts)
==================================================
Add, each with the same 8-second timeout, input size limits, structured JSON output, and a non-AI fallback in the UI:
- POST /api/ai/improve-question { question, lang } → { label: LocalizedText, hint?: LocalizedText, reason: string }
- POST /api/ai/translate { texts: { key: string; text: string }[], from: "am"|"en", to: "am"|"en" } → { texts: { key, text }[] }
- POST /api/ai/check-question { question } → { issues: { severity: "must"|"should"|"tip", issue: string, suggestion: string }[] }
Keep /api/ai/template-draft and make its output pass through validate.ts; show validation problems in the Checker instead of failing silently.
Never send learner answers to these endpoints (they only receive template text).

==================================================
6. FINAL CHECK
==================================================
- Build a template from scratch by keyboard only: add 6 questions from the library, add one blank choice question with 3 options in both languages, add a showIf rule, reorder with Alt+Up/Down, change the accent colour, fix every "must fix" issue, save to My templates, export JSON, re-import it, and open it in the playground.
- Repeat with AI off and with the browser offline: everything except the AI tools must work.
- The gallery shows the saved template under "My templates" with Duplicate, Rename, Export and Delete.
- No invented claims: no "tested" label unless tested: true; time estimates always say "About".
```

## PROMPT ENDS

---

## After running it, check

- [ ] Change a question's type, edit options in both languages, and add a "show only if" rule. The preview should follow each change immediately.
- [ ] With AI off, the "Paste your current form" start still turns a field list into questions.
- [ ] The checker flags a long label, a medical word and a duplicate "Saves to field".
- [ ] A saved template appears under "My templates" in the gallery and opens in the playground.
- [ ] Have a native speaker review the Amharic for the new question library items.
