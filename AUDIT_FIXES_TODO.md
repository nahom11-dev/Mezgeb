# Hackathon audit fixes — remaining work

Fixes **7** and **8** are done in this repo. Full spec (items 7, 8, 10, 11, 12, 13):

`d:\Downloads\Mezgeb_Fix_Prompt_7-8-10-11-12-13.md`

## TODO — Fix 10 (pre-recorded read-aloud)

- [ ] Run `npx tsx scripts/generate-audio.ts` with `ADDIS_API_KEY` and `ELEVENLABS_API_KEY` in `.env`
- [ ] Commit `public/audio/**` and `public/audio/manifest.json` (not just empty manifest)
- [ ] Note total audio size in `README.md`
- [ ] Copy `public/audio` into embed/static output if production serving requires it (see `server.ts` `/audio/*`)
- [ ] Verify with all AI keys empty + no Amharic system voice on `learning-platform` template

Plumbing already in place: `scripts/generate-audio.ts`, `src/lib/audioHash.ts`, `src/lib/recordedAudio.ts`, widget + `ReadAloudButton`.

## TODO — Fixes 11 + 12 (host events + support split)

- [ ] `buildCompletedProfile` → `{ profile, support }`; no `support*` keys on profile
- [ ] `POST /v1/support`, `POST /v1/support/exchange`; reject support in `POST /v1/registrations`
- [ ] Widget: two requests, two tokens; outbox stores/flushes `profile` and `support` separately (align with Fix 8 flush)
- [ ] Embed events: `mezgeb:step`, `mezgeb:support`, `mezgeb:complete` (+ README / embed header)
- [ ] `openapi.yaml` + sample-site support exchange pages

## TODO — Fix 13 (embed edit mode)

- [ ] `<mezgeb-register mode="edit">` + `profile` / `support` setters (properties, not attributes)
- [ ] `profileToAnswers` + edit flow (Review screen, Save changes, `mezgeb:updated`)
- [ ] Autosave key `…:edit`; unit tests for round-trip

## After all six

Per the fix prompt: full `vitest` + `build:embed`, manual `sample-sites/blank-test.html` walkthrough, axe on key screens, short change summary.