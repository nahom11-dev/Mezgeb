# Mezgeb test sites

Three made-up websites for testing the Mezgeb sign-up component. Each is a single `index.html` with no build step and no outside files.

| Folder | Site | Type | Mezgeb template |
|---|---|---|---|
| `learning-site/` | Kelem Learn | Online course platform | `learning-platform` |
| `jobs-site/` | Sira Board | Job board | `job-seeker` |
| `programme-site/` | Meskot Skills Programme | NGO training programme intake | `programme-intake` |

## Run with Mezgeb (integrated)

1. Build the embed once: `npm run build:embed` (from the Mezgeb repo root).
2. Start Mezgeb: `npm run dev` (port 3000).
3. Open a sample site onboarding page, for example:
   - http://localhost:3000/sample-sites/learning-site/onboarding.html
   - http://localhost:3000/sample-sites/jobs-site/onboarding.html
   - http://localhost:3000/sample-sites/programme-site/onboarding.html

Only `onboarding.html` in each folder loads `<mezgeb-register>`. After registration, the page exchanges the one-time token with Mezgeb (`POST /api/sample/registrations/exchange`) and saves the profile to the same `localStorage` keys as the legacy forms, then redirects to the account/applications view on `index.html`.

Site keys (publishable): `pk_sample_kelem`, `pk_sample_sira`, `pk_sample_meskot` — secrets live in Mezgeb `.env` as `MEZGEB_SITE_KEYS`.

## Alternative: static server on another port

```
npx serve sample-sites
```

Then set `api-base` and the script `src` in each `onboarding.html` to your Mezgeb URL (default `http://localhost:3000`) and add that origin to `MEZGEB_ALLOWED_ORIGINS`.

## Files in each site

- `index.html`: unchanged host site (home, listings, legacy forms in footer).
- `onboarding.html`: header/footer unchanged; Mezgeb widget in `#mezgeb-root`.