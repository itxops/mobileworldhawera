# Mobile World Hawera — website

Single-page website for **Mobile World Hawera**, 184 High Street, Hawera 4610, New Zealand.

Plain HTML5, CSS3 and vanilla JavaScript. No framework, no build step, no backend —
ready to deploy to Firebase Hosting on the free **Spark** plan exactly as it is.

---

## 1. Project layout

```
MobileworldHawera/
├── firebase.json              Hosting config: error page, caching, security headers
├── logo.png                   Original logo supplied by the business (source file)
├── README.md                  This file
└── public/                    ← everything in here is what gets deployed
    ├── index.html             The whole site: one page, anchor navigation
    ├── privacy.html           Privacy policy
    ├── terms.html             Terms & conditions
    ├── 404.html               Error page (wired up in firebase.json)
    ├── favicon.svg
    ├── apple-touch-icon.png
    ├── site.webmanifest
    ├── robots.txt
    ├── sitemap.xml
    ├── css/
    │   ├── style.css          Design tokens + all components (mobile-first)
    │   └── responsive.css     Every media query lives here
    ├── js/
    │   └── main.js            Header, drawer, scroll reveal, card spotlight, quote form
    ├── assets/
    │   ├── fonts/             Self-hosted Archivo + Inter (latin variable subsets)
    │   └── logo/              logo.svg, mw-mark.svg, og-image.jpg, PNG app icons
    └── images/
        ├── hero/  services/  accessories/  store/
        └── CREDITS.md         Image sources and licence
```

`public/` is the hosting root — the standard Firebase layout, and it keeps
`firebase.json` and this README from ever being served to visitors.

### Page sections, in order

Each block in `index.html` is marked with a `<!-- ============ N. NAME ============ -->`
comment:

1. Hero
2. Brands we repair (scrolling marquee)
3. What We Repair — 3 device categories + 6 repair services (`id="services"`)
4. How It Works — 4 steps (`id="how-it-works"`)
5. Why Choose MW Hawera — 6 benefits (`id="why"`)
6. Testimonials (`id="reviews"`)
7. Accessories (`id="accessories"`)
8. Come see us in Hawera — map, details, hours, quote form (`id="contact"`, form at `id="quote"`)
9. Closing call-to-action

Each of the six repairs also has its own id (`#phone-screen-repair`,
`#battery-replacement`, …), so you can link straight to one from a Google post
or a Facebook update.

---

## 2. Where the content came from

The wording is carried across from your existing **Mobile World Alexandra**
site, at your request, with the town, address and phone numbers changed to
Hawera. That covers the hero, the service descriptions, the four process steps,
the six "why choose us" benefits, the accessory categories and the closing CTA.

Three things were handled differently, and you should know why:

| Item | What was done | Why |
|---|---|---|
| **"5.0 rating on Google"** | Replaced with a **"Read our Google reviews"** pill that links to your Google listing. | A star rating is a verifiable claim about a specific location. Until the Hawera listing has that rating, publishing it would be inaccurate and Google can penalise it. Once Hawera has its own rating, change the pill text back — it is one line in `index.html`. |
| **Customer reviews** | All nine are reproduced word for word, under the line *"Reviews left for our Mobile World stores on Google."* | They are genuine reviews of your business, so they are yours to show — but they were left for Alexandra, so the page says "our Mobile World stores" rather than implying they are Hawera reviews. |
| **Opening hours** | Carried across as **Open daily, 9:30am – 5:30pm, 7 days**. | These are Alexandra's hours. **Please confirm they are right for Hawera before going live** — see below. |

### Confirm the opening hours

In `index.html`, find:

```html
<ul class="hours-list">
  <li><span>Open daily</span><span>9:30am – 5:30pm</span></li>
  <li><span>Open 7 days a week</span><span></span></li>
</ul>
```

Adjust if Hawera differs. Then add the matching `openingHoursSpecification` to
the `LocalBusiness` structured data in the `<head>` so Google shows the hours in
search results:

```json
"openingHoursSpecification": [
  { "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    "opens": "09:30", "closes": "17:30" }
]
```

**Do not** add `aggregateRating` or `review` markup unless the numbers are real
for this store — Google treats invented review markup as a structured-data
violation and can suppress the whole listing.

---

## 3. Branding

Your supplied `logo.png` is used **unchanged**. It was traced to vector
(`assets/logo/logo.svg`) so it stays sharp at any size including print, but
every colour is exactly as given: charcoal `M` and `MOBILE`, red `W` and
`WORLD`, grey `Hawera` — and the counters (the holes in O, B, R, D, a, e) are
genuinely transparent, so the logo sits correctly on any background.

Because the dark half of the logo is on a transparent background, the header,
footer and mobile menu are **light** — the artwork reads at full contrast
without being recoloured. The favicon and app icons place the same
charcoal-and-red monogram on a white tile, so nothing is reversed there either.

Dark bands are used for page *content* only (hero, brands, how it works,
testimonials, closing CTA), where the red accent has the most impact.

**One deliberate colour note.** Red button fills use `#dd312d` and a gradient
down to `#b81e1b`, not the logo's `#e53935`. White text on `#e53935` measures
4.23:1 — under the WCAG AA minimum of 4.5:1 — while `#dd312d` measures 4.61:1.
The brighter `#ff4a3d` is used only for decoration (the gradient headline word,
the glows), never behind white text, where it would be 3.33:1. The logo artwork
itself is untouched.

---

## 4. Animation

All motion is CSS transforms and opacity, which the browser runs on the GPU.
Nothing is JavaScript-driven except a cursor-position variable, so there is no
scroll-jank and no library to download.

| Effect | How |
|---|---|
| Drifting red blooms behind the hero | Two blurred radials, `@keyframes` on `transform` |
| Brand + testimonial marquees | One track containing two identical halves, translated `-50%` on a loop. Pauses on hover/focus. |
| Scroll reveals | `IntersectionObserver`, staggered per group |
| Card hover | Lift, gradient-border brighten, icon rotate/scale, and a spotlight that follows the cursor |
| Buttons | A light sweep passes across on hover |
| WhatsApp button | A slow expanding ring |
| Drawer | Fade in with the links cascading |

**Reduced motion is fully respected.** With `prefers-reduced-motion: reduce`,
every animation and transition stops, the marquees become static wrapped rows
(the duplicate cards hide themselves, so nothing is shown twice), and all
reveal-on-scroll content is shown immediately — nothing can get stuck invisible.

---

## 5. Everything is free on the Spark plan

Nothing on this site costs money to run:

- **No backend, no Cloud Functions, no database.** Static files only.
- **No paid APIs.** The map uses Google's keyless embed
  (`google.com/maps?q=…&output=embed`) — no API key, no billing account.
- **No third-party fonts or CDNs.** Archivo and Inter are self-hosted, so there
  is no request to Google Fonts.
- **No analytics or tracking scripts.**
- **The form needs no server** — see §7.

The whole site is ~770 KB across 38 files, far inside Spark's 10 GB storage and
360 MB/day transfer.

---

## 6. Deploying

```bash
npm install -g firebase-tools
firebase login
firebase use --add              # pick your Firebase project
firebase deploy --only hosting
```

Preview first with `firebase hosting:channel:deploy preview`, or run it locally
with `firebase emulators:start --only hosting`. You can also just double-click
`public/index.html` — every path is relative, so it works straight off disk.

### Connecting mobileworldhawera.co.nz

1. Firebase console → Hosting → **Add custom domain** → `mobileworldhawera.co.nz`
2. Add the TXT record it gives you at your registrar to verify ownership.
3. Add the two A records. Repeat for `www` if you want it.
4. Firebase issues the SSL certificate automatically (up to 24 hours).

The site already points at `https://mobileworldhawera.co.nz` in its canonical
tags, Open Graph tags and `sitemap.xml`. Deploying elsewhere means
search-and-replacing that URL in `public/*.html`, `robots.txt` and `sitemap.xml`.

---

## 7. The quote form

Spark serves static files only, so the form has two working paths and no backend:

1. **Send via WhatsApp** — validates the fields, then opens WhatsApp with the
   whole enquiry already written out. This is the primary path.
2. **Request a Quote** — opens the visitor's email app with the enquiry
   pre-filled as a `mailto:` to the shop address.

Neither can silently fail.

To have submissions arrive as email instead, sign up for a form service
(Formspree, Web3Forms, Basin — all free tiers) and add its endpoint:

```html
<form id="quote-form" novalidate data-endpoint="https://formspree.io/f/YOUR_FORM_ID">
```

`js/main.js` detects `data-endpoint` and POSTs JSON to it instead, showing a
success or failure message in place. Nothing else changes.

**On keys:** only ever put a *public* form ID here — anything in `public/` is
readable by anyone. Never paste a private API key, SMTP password or Firebase
service-account credential into the HTML or JavaScript.

---

## 8. Editing

No build step — edit the HTML directly.

**Contact details** appear in the header, drawer, hero, contact section, footer
and mobile action bar. To change one, search and replace across `public/*.html`:

| Value | Shown as | Link uses |
|---|---|---|
| Landline | `+64 3 927 2313` | `tel:+6439272313` |
| WhatsApp | `+64 22 086 3000` | `wa.me/64220863000` |
| Email | `mobileworldhawera@gmail.com` | `mailto:…` |
| Address | `184 High Street` / `Hawera 4610` | Google Maps directions link |

Numbers are shown in international format and the `tel:` links carry `+64`, so
they dial correctly from any country. The `<wbr>` inside the email address is
intentional — it lets the address wrap after the `@` instead of splitting
`gmail.com` in half on a narrow screen.

**Removing a brand** — each appears **twice** in the marquee, once normally and
once as the `data-mq-clone` copy that makes the loop seamless. Delete both:

```html
<li class="brand-chip">Huawei</li>
<li class="brand-chip" data-mq-clone aria-hidden="true">Huawei</li>
```

The same applies to testimonial cards.

**Adding a service or accessory** — copy an existing `<article class="gcard …">`
and change the icon name, heading and text. Icon names are the `id` values in
the inline `<svg>` sprite near the top of the page (`i-screen`, `i-battery`,
`i-droplet`, `i-speaker`, `i-signal`, `i-code`, `i-case`, `i-cable`,
`i-headphones`, `i-earbuds`, and so on).

**Colours, spacing and type** are CSS custom properties at the top of
`css/style.css` under `:root`. Change one and it updates everywhere.

---

## 9. Performance

| | |
|---|---|
| First load (HTML + CSS + JS gzipped, both fonts, hero image) | **~150 KB** |
| Whole deployed folder | ~770 KB across 38 files |
| Hero image at 1280px | 39 KB (AVIF) |
| JavaScript | ~5 KB gzipped, deferred, no dependencies |

- **Images** are AVIF with a WebP fallback at two or three widths, served through
  `<picture>` + `srcset`. Every `<img>` carries `width`/`height`, so nothing
  shifts as the page loads.
- The hero image is preloaded and `fetchpriority="high"`; everything below is
  `loading="lazy"`.
- **Fonts** are self-hosted latin variable subsets (Archivo 35 KB, Inter 47 KB),
  preloaded with `font-display: swap`.
- **Icons** are one inline SVG sprite — no icon font, no extra request, and they
  recolour with the section theme via `currentColor`.
- **Caching** is set per file type in `firebase.json`: fonts a year, images a
  week, CSS/JS ten minutes, HTML always revalidated. Page edits go live at once
  while the heavy assets stay cached.

Replacing an image: keep the same filenames and the markup keeps working. Aim
for the hero under ~300 KB and card images 50–150 KB, export AVIF and WebP at
the widths already in the folder, and update `width`/`height` if the aspect
ratio changes.

---

## 10. Accessibility

- Semantic landmarks, one `<h1>`, no skipped heading levels.
- Skip-to-content link, visible focus rings, full keyboard operation.
- The mobile drawer traps focus, closes on `Esc`, and returns focus to the button
  that opened it.
- Decorative images and icons are hidden from screen readers; meaningful images
  have real alt text. Marquee duplicates are `aria-hidden`, so nothing is read twice.
- Touch targets are at least 44px on the action bar and buttons, checked at nine
  viewport widths from 320px up.
- Every text/background pair was measured against WCAG 2.1 AA **as rendered**,
  including gradient fills and translucent layers.
- `prefers-reduced-motion` is honoured completely — see §4.

---

## 11. Images and licensing

Photographs are free stock images from Pexels, used under the Pexels licence
(free for commercial use, no attribution required). Source URLs for every file
are in `public/images/CREDITS.md`.

No manufacturer photography, no competitor content, and no stock photo showing a
visible manufacturer logo. Brand names in the marquee are text only, with a note
stating that Mobile World Hawera is an independent repair store and not an
authorised service centre for any manufacturer.

---

## 12. Clean URLs (optional)

Links keep the `.html` extension so the site works opened straight from disk and
never triggers a redirect. The home page is `/` either way.

For `/privacy` instead of `/privacy.html`, set `"cleanUrls": true` in
`firebase.json` — but then also drop `.html` from the links to the legal pages,
from their `<link rel="canonical">` tags and from `sitemap.xml`, or every click
costs a 301.
