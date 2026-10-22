# Config-driven small-business demo site

One Next.js 14 codebase, three industries. All branding lives in JSON:

| URL | Config | Business |
|---|---|---|
| `/` | `config/client.json` | Smile Craft Dental Clinic (default) |
| `/?theme=coaching` | `config/themes/coaching.json` | Bright Minds Coaching Classes |
| `/?theme=property` | `config/themes/property.json` | Fort Heritage Realty |

Presenter shortcut: tap the logo 5 times quickly to cycle through the themes.
`/admin` (and `/admin?theme=coaching`) is the owner view: live booking list with Confirm / Cancel.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Supabase (optional)

Without env vars the site runs in **demo mode**: bookings are stored in the browser (localStorage) and sync between tabs.
To go live:

1. Create a free Supabase project and run `supabase/schema.sql` in the SQL editor.
2. Copy `.env.example` to `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Deploy to Vercel with the same env vars.

Bookings then persist, taken slots disappear for everyone in realtime, and `/admin` updates instantly.

**Before selling to a real client:** the SQL ships with open demo policies so `/admin` works without login. Remove the `select`/`update` policies and protect `/admin` with Supabase Auth.

## Re-skinning for a new client

1. Copy a theme JSON and edit the copy (colours, fonts, copy, `hours`, services, FAQs, `ui` labels).
2. Register it in `lib/theme.ts`.
3. Fonts: add the Google font to `lib/fonts.ts` if it is new.
4. Gallery art: tweak `scripts/gen-images.mjs` and run `npm run images`, or drop your own images in `public/img/<slug>/`.
5. Set `NEXT_PUBLIC_SITE_URL`, and in `app/page.tsx` / `app/robots.ts` allow indexing (demo ships with `noindex`).

## What is where

- `components/Illustration.tsx` – three animated inline-SVG hero scenes (CSS keyframes, no libraries)
- `components/Booking.tsx` – day/slot picker from `hours`, live taken slots, validation, WhatsApp confirm, `.ics` download
- `lib/bookings.ts` – Supabase + realtime, or localStorage demo mode
- `app/og/route.tsx` – per-theme social share image
