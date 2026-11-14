# Mezgeb: Template Builder Redo Prompt

Paste everything below the line into Google AI Studio with the current Mezgeb project (mezgeb_3) open. It rebuilds only the template builder (`/templates/builder`, `src/pages/TemplateBuilderPage.tsx`). Every other page stays as it is.

---

## 0. The job

The template builder works, but the screen is too busy. Rebuild its interface so a programme officer with no technical background can edit a template without feeling lost. Keep every capability. Change where things live and when they appear.

Rules:

1. **Do not change the data model or logic.** `MezgebTemplate`, `TemplateQuestion`, `src/templates/validate.ts`, `storage.ts`, the AI endpoints, undo/redo history, autosave, import/export, and keyboard shortcuts all stay. If a UI change needs a small logic change, make it and list it in `UI_CHANGES.md`.
2. **Do not remove features.** Move them, group them, or hide them behind "More options". The only removal is the placeholder fields (see 4.3).
3. **Use the existing design system**: the tokens in `tokens.css` and the components in `src/ui/`. No new colours, no new fonts, no gradients, no emoji, no sparkle icon for AI.
4. **Split the 4,378-line file.** Create `src/pages/builder/` with one file per part: `BuilderPage.tsx`, `StartScreen.tsx`, `TopBar.tsx`, `QuestionList.tsx`, `QuestionCanvas.tsx`, `QuestionPanel.tsx`, `SettingsView.tsx`, `TranslationsView.tsx`, `ChecksDrawer.tsx`, `AddQuestionDialog.tsx`, `TestRunDialog.tsx`, `ShareView.tsx`. Keep shared state in one hook, `useBuilderState.ts`.
5. Every new string gets an English and an Amharic entry in `src/i18n.ts`.

## 1. Why the current builder feels busy (fix each cause)

| Cause | What it does now | Fix |
|---|---|---|
| Too many controls at once | The Edit panel shows about 40 inputs in one long scroll: labels, hints, placeholders, validation, conditions, audio URLs, icon, maps_to, error help, sensitive, checks. | Show the 5 basic settings. Everything else goes under "More options", closed by default (section 4). |
| Every field appears twice | English and Amharic inputs sit side by side for every label, hint, placeholder, option and error. | Edit one language at a time with a switch. Fill missing Amharic in a separate Translations view (section 6). |
| Template settings mixed into question editing | "Template settings", "Look" and "Export" are tabs inside the question inspector. | Move them to top-level views in the top bar: Questions, Settings, Translations, Share (section 2). |
| Three panels plus a drawer | Outline, Edit and Preview are all visible, plus the checker drawer. | Two working areas. The middle shows the question as the learner sees it and is directly editable, so a separate preview panel is not needed. A full test run opens on demand (section 3). |
| Badges everywhere | Outline rows can show Required, Conditional, Missing, Must fix, Should fix and Tip together. | One status mark per row at most (section 3.1). |
| Checks in two places | A "Checks" section in the inspector and a checker drawer. | One place: the Checks drawer, opened from the top bar (section 7). |
| Crowded toolbar | Name, save status, Undo, Redo, Shortcuts, Check, Export, Preview, all at the same weight. | One primary action. The rest are icons or sit in a menu (section 2). |
| Repeated AI notices | AI availability and cloud notices appear in several panels. | AI actions sit in one small "Improve" menu per text field. The availability note appears once, inside that menu (section 5). |
| A crowded start screen | Four large options, a cloud notice and form fields all visible. | Three choices, each opening its own short step (section 8). |

## 2. Page structure

```
┌──────────────────────────────────────────────────────────────────────┐
│ ← Templates  Learning platform ✎   Saved ✓     [Questions][Settings][Translations][Share]   ↶ ↷  Checks 2   [Test as learner] │
├───────────────┬──────────────────────────────────────┬───────────────┤
│ QUESTION LIST │       QUESTION CANVAS                │ QUESTION PANEL│
│ 280 px        │  (the learner screen, editable)      │ 320 px        │
└───────────────┴──────────────────────────────────────┴───────────────┘
```

### 2.1 Top bar (56 px, one row, white, 1 px bottom line)

From left to right:

- "← Templates": a quiet link back to the gallery.
- **Template name**: plain text that becomes an input when clicked or focused (with a visible pencil icon and `aria-label="Rename template"`). It edits the name in the current editing language only.
- **Save status**: one of "Saved ✓", "Saving…", or "Not saved: Retry". Muted text, no box.
- **View switch**: a segmented control with four options: **Questions**, **Settings**, **Translations**, **Share**. It is a real tablist with arrow-key support. Translations shows a small count when items are missing, for example "Translations 4".
- **Undo** and **Redo**: 40 px icon buttons with `aria-label` and a tooltip showing the shortcut.
- **Checks**: a secondary button showing the number of "Must fix" items, for example "Checks 2". When there are none it reads "Checks ✓".
- **Test as learner**: the only primary (black) button on the screen.
- A "⋯" menu holds the less-used actions: Keyboard shortcuts, Duplicate template, Import JSON, Delete template.

Under 1024 px the view switch moves to a second row. Under 768 px the Undo and Redo buttons move into the "⋯" menu.

### 2.2 Editing language switch

Directly under the top bar on the Questions view, left-aligned, sits a slim row: "Editing in: **English** | አማርኛ". It sets which language every text field shows and edits across the builder, and it is remembered per user. When editing in Amharic, any field with no Amharic text shows the English text greyed above the empty input, labelled "English: …", so the person can translate in place.

## 3. Questions view

### 3.1 Question list (left, 280 px)

- The heading "Questions" with the count in muted text, for example "9".
- Questions are grouped under section titles, if sections exist. A section title is plain 13 px muted text with a "⋯" menu (Rename, Delete section). There are no boxes around sections.
- Each row is 48 px tall and contains:
  - the number,
  - a 20 px type icon,
  - the label (one line, truncated with an ellipsis; the full label is in the row's accessible name),
  - **at most one status mark** on the right, chosen in this order: a red dot with hidden text "Needs a fix" → an outline circle with hidden text "Missing Amharic" → a branch icon with hidden text "Shown only sometimes" → nothing. Do not show a "Required" badge; most questions are required. Show the word "Optional" in muted text only on optional ones.
- The selected row has a 2 px accent border. Hovering or focusing a row reveals a drag handle and a "⋯" menu (Move up, Move down, Move to section, Duplicate, Delete). The buttons are not visible all the time.
- Keyboard: arrow keys move the selection; Alt+Up and Alt+Down reorder; the existing shortcuts stay. Reordering announces "Phone moved to position 3".
- At the bottom: "Add question" (secondary, full width) and a quiet link "Add section".
- Deleting shows a toast "Question deleted" with "Undo". Do not use a confirm dialog.

### 3.2 Question canvas (middle, flexible)

This replaces the separate Preview panel.

- A stone background with the real widget screen centred at 390 px wide, using the same component the learner sees (`MezgebWidget` rendering a single question). It shows the progress line, question text, hint, the answer area, Read aloud and Help, and the Back and Save buttons.
- **The question text and the hint are edited directly on this screen.** Clicking them turns them into inputs with the same font size, with a 1 px dashed outline on hover and a 2 px accent outline when editing. An empty hint shows "Add a hint (optional)" in muted text as a button, not as a placeholder.
- **Choice options are edited directly too**: each option row becomes an input with a remove button on hover or focus, and there is an "Add option" row at the end. "Paste options", "Add 'Other'" and "Add 'Prefer not to say'" sit in a small "⋯" menu beside "Add option".
- Above the screen, a slim row shows: "Question 3 of 9" on the left, and on the right two small switches for testing the look of this screen: "Simple words" and "Offline". Nothing else goes here.
- The Back and Save buttons on the canvas are visible but not active (`aria-disabled`, with the title "Use Test as learner to try the full flow").
- Under 1024 px the canvas becomes full width; under 768 px it is one of three tabs (see 3.4).

### 3.3 Question panel (right, 320 px)

Only five things are visible by default. Each is a normal `Field` with a visible label.

1. **Question type**: a select showing the icon and name. Changing it to a type that loses data opens a small dialog: "Changing to Phone will remove the 4 answer options. Change type?" with "Change type" and "Cancel".
2. **Required**: a switch. When it is off, a second switch appears under it: "Show a Skip button".
3. **Voice answers**: a switch, shown only for types that accept voice.
4. **Show this question only if…**: collapsed into one plain sentence when set, for example "Only if *Do you have a Fayda ID?* is *No*", with "Change" and "Remove" links. When not set: a quiet button "Add a condition". Editing it opens two selects inline: the earlier question, then the answer.
5. **Sensitive answer**: a switch with one line of muted text: "Never sent to AI. Hidden from partners." It is on and locked for Support needs and ID questions, with the explanation "Always on for this question type."

Then a single disclosure, closed by default:

**More options** (shows a count of what is set, for example "More options · 2 set"):
- Answer rules: validation preset; minimum and maximum (only the ones that apply to the type).
- Error message in plain words.
- Read-aloud audio: the audio file URL with a "Play" button.
- Icon (for simple-words mode).
- Saves to field (`maps_to`), with a duplicate warning.

If this question has check issues, one line appears at the very top of the panel: a red dot plus "1 thing to fix", followed by a link "See it". The link opens the Checks drawer filtered to this question. The issues themselves are not listed in the panel.

### 3.4 Small screens

- Under 1024 px: the question list collapses into a "Questions (9)" button that opens it as a left drawer. The canvas and panel stay side by side.
- Under 768 px: three tabs, "List", "Edit" and "Panel". Selecting a question switches to "Edit" automatically.

## 4. Field-level decisions

1. **One language at a time** everywhere (see 2.2). The only place both languages show together is the Translations view.
2. **Character count** appears only when the person is typing and the label is over 60 characters: "72 characters. Shorter questions are easier to hear and read."
3. **Remove the placeholder fields** (`placeholder` in English and Amharic) from the UI. Placeholder text disappears when typing and screen readers handle it inconsistently, so the widget should rely on the label and the hint. Keep the data field so old templates still load, and ignore it when rendering. Note this in `UI_CHANGES.md`.
4. **No raw technical words** in the main view: "maps_to" becomes "Saves to field", "showIf" becomes "Show this question only if", and "preset" becomes "Answer rule".

## 5. AI actions

- Every question text, hint and error field gets one small icon button on its right: "Improve" (a pencil-line icon, not a sparkle). It opens a menu:
  - "Use simpler words"
  - "Translate to Amharic" (or "Translate to English" when editing in Amharic)
  - "Check this question"
- When AI is off or offline, the menu items are disabled and the menu shows one line at the top: "AI is off. You can still edit everything by hand." This is the only place the notice appears.
- A suggestion appears directly under the field as a stone box: "Suggestion" label, the suggested text, and the buttons "Use this" (primary, small) and "Dismiss" (quiet). Nothing changes until "Use this" is pressed, and "Use this" is one undo step.
- Remove the cloud AI notice from the builder. It already appears on the start screen (section 8).

## 6. Translations view

This is a single table for filling in both languages quickly.

- A filter row with: "Show: Missing only | All", and a search box.
- Columns: Where (question number and part, for example "3 · Hint"), English, Amharic. Each cell is an inline editable text area. Missing cells have an outline circle and the hidden text "Missing".
- Rows cover every translatable string: the template name, description, question labels, hints, options, error messages, section titles, support options and consent.
- An "Improve" button on each Amharic cell offers "Translate from English". At the top, "Translate all missing" runs the AI on every missing cell and shows the results as suggestions to accept row by row, or with "Accept all". It is disabled when AI is off.
- The table scrolls inside its own box on small screens. On phones, the rows become stacked cards.

## 7. Checks drawer

- A right-side drawer, 400 px wide, opened by the Checks button or by pressing Alt+C. Focus moves to its heading, Esc closes it, and focus returns to the button.
- At the top: a summary line ("2 must fix · 1 should fix · 3 tips") and the button "Run AI check" (secondary, disabled when AI is off).
- Issues are grouped under the headings Must fix, Should fix and Tips. Each issue shows one sentence of what is wrong, one sentence of how to fix it, the question it belongs to, and the buttons "Go to question" and, where an automatic fix exists, "Fix it". AI findings carry the plain text tag "From AI".
- When there are no issues: "Everything passes. This template is ready to share." with a link to the Share view.

## 8. Start screen (`/templates/builder` with no template)

- Heading: "Create a template". One sentence under it.
- Three choices in a row, as `ChoiceList`-style large rows on phones and three equal blocks on desktop. There is no icon above each title. Each block has a title, one sentence, and a single button:
  1. **Start from a template**: opens a list of the four built-in templates (name, who it is for, question count) with a "Use this template" button on each.
  2. **Describe it**: opens one text area, "Who is signing up, and what do you need to know about them?", plus a language choice and "Draft template". Under the button: "Uses AI. The draft opens in the builder for you to review." The cloud notice line goes here. When AI is off, this block shows "Needs AI. Use one of the other two options." and its button is disabled with that reason shown.
  3. **Paste your current form**: opens a text area for field names, one per line, and the button "Turn into questions". This works offline. After conversion, an optional "Improve with AI" suggestion appears inside the builder, not here.
- "Import JSON" is a quiet link under the three blocks. It opens the existing import dialog.

## 9. Settings view (template-level)

This is one page, max width 720 px, centred in the work area, with clear section headings. Each section is a group of `Field`s with no cards around them. Sections are separated by 1 px lines and 48 px of space.

1. **About this template**: category, best for, and description (in the current editing language).
2. **Ways to confirm identity**: four checkboxes for the ID routes. Show an error if none is chosen. If only Fayda is chosen, show the warning "People without a Fayda ID will not be able to finish."
3. **Support options**: an editable list, with "Restore defaults" as a quiet link.
4. **Features**: seven rows. Each has a switch, a name and one sentence: Voice, Read aloud, Help, Partner sign-up, Continue later by text message, Offline saving, Simple words.
5. **Consent statement**: one text area, plus a quiet link "Use recommended wording".
6. **Look**: platform name, logo letter, and accent colour. The contrast result appears next to the colour as "Passes (5.2:1)" or "Too light (3.1:1). Choose a darker colour." Saving is blocked only by a failing colour, and the reason appears at the save status.

## 10. Share view (was Export)

- One page, max width 720 px, with these sections:
  - **Add to your site**: the embed `CodeBlock` with "Copy code".
  - **Try it**: the button "Open in playground".
  - **Save**: the button "Save to My templates".
  - **Download**: the buttons "Copy JSON" and "Download JSON".
- If there are "Must fix" issues, a warning `Banner` at the top says: "2 things need fixing before you share. See checks." The actions still work. The banner does not block them.

## 11. Test as learner

- This opens a full-screen dialog with the complete widget running the current template, with a close button at the top right labelled "Close test".
- Above the widget there is one row: a language switch, the "Simple words", "AI off" and "Offline" switches, and "Restart".
- One muted line at the bottom: "Answers in a test run are never saved."
- Closing the dialog returns focus to the "Test as learner" button.

## 12. Add question dialog

- A native `<dialog>`, 640 px wide, titled "Add a question".
- Two tabs: **Ready-made** (questions from the library, such as Full name, Phone, Region, Education level, Fayda ID and Support needs) and **Blank** (the question types).
- Each item is one row with an icon, a name, one line describing what it asks, and a "Sensitive" tag where it applies. Activating a row adds the question after the selected one, selects it, closes the dialog, and moves focus to the question text on the canvas.
- A search box at the top filters both tabs.

## 13. Visual rules for this page

- Exactly one primary button visible at a time: "Test as learner" (or the button inside an open dialog).
- The default Question panel has no more than five controls visible, plus "More options".
- No boxes inside boxes. Panels are separated by 1 px lines. Groups are separated by space and a heading, not by bordered cards.
- Text sizes: panel labels 15 px/500, help text 14 px muted, list rows 15 px, and canvas text at the widget's real sizes.
- Icons are 20 px with a stroke of 1.75, and only where they carry meaning (type icons, status marks, icon buttons).
- Use only the token colours. Red is used only for "Needs a fix" and errors. The accent is used only for selection and focus.
- Motion is limited to 150–200 ms fades and slides for drawers and dialogs, and is off when reduced motion is set.

## 14. Accessibility checks for the builder

- Every control has a visible label or an `aria-label`. Status marks have hidden text.
- Inline editing on the canvas uses real `<input>` and `<textarea>` elements with labels such as "Question text (English)". Enter saves, Esc cancels, and focus stays on the edited text.
- The question list is a `listbox`-style list with arrow keys, or plain buttons in a list. Reordering works without dragging (WCAG 2.5.7).
- Drawers and dialogs trap focus, close with Esc, and return focus to where it was.
- Status changes are announced through the existing live announcer: "Saved", "Question added", "Suggestion applied", "2 issues remaining".
- Check with keyboard only, NVDA, 200% zoom and a 360 px wide screen. axe-core should report zero critical or serious issues on `/templates/builder`.

## 15. Done means

1. The builder is split into the files listed in rule 4, and `TemplateBuilderPage.tsx` only re-exports `BuilderPage`.
2. The top bar has the four views. The question inspector no longer has Template settings, Look or Export tabs.
3. The default Question panel shows five controls plus "More options". Placeholder inputs are gone from the UI.
4. English and Amharic are never side by side, except in the Translations view.
5. Checks appear only in the Checks drawer, plus the one-line hint in the panel.
6. The canvas edits the real widget screen inline, and the separate Preview panel is gone. "Test as learner" runs the full flow.
7. All existing features still work: undo/redo, autosave, sections, conditions, validation, audio, icons, sensitive, import/export, AI suggestions, keyboard shortcuts, the checker and the contrast check.
8. Every new string is in both languages in `i18n.ts`.
9. `UI_CHANGES.md` has a "Template builder" section listing what moved where, and any logic that was touched.
