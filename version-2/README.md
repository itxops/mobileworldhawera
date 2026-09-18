# Version 2 — "Workshop"

A second design for the same website, built so there is a real choice to make
rather than one option to approve.

**Nothing about the business changes between the two versions.** Same copy, same
17 photographs, same logo, same phone numbers, same opening hours, same legal
pages. The differences are layout, colour and interaction — which is what makes
them comparable.

---

## 1. Looking at both

From the project root:

```
node preview.mjs
```

Then open <http://localhost:5173>:

| URL | What it is |
|---|---|
| `/` | a chooser page |
| `/v1/` | version 1 — the light design already on GitHub Pages |
| `/v2/` | version 2 — this one |
| `/compare` | both in side-by-side frames, with a draggable divider and 390 / 768 / fill width presets |

`preview.mjs` uses only Node's built-in modules — nothing to install, and it
never touches the network. Stop it with `Ctrl + C`.

---

## 2. What is actually different

### The obvious one: it is dark for the first half

Version 1 is light from top to bottom. Version 2 runs dark from the hero down
through Why Choose Us, then switches to light for Accessories, Reviews, FAQ and
Contact, and closes dark again. Two halves: a technical top and an approachable
bottom.

Every section declares which ground it is on (`.on-dark` / `.on-light`) and each
component reads its colours from four variables rather than hard-coding them —
so the same review card works on either ground without a second copy of the CSS.

### Services are one interactive list, not a grid of cards

This is the section worth looking at first, and the main reason to consider this
version.

On a desktop the six repairs are a numbered list down the left, and a **sticky
image stage** on the right cross-fades to whatever row you are pointing at. Each
row is a link that opens WhatsApp with that repair already written into the
message, so the section is a conversion path rather than a description.

Below 960px the stage is dropped entirely and each row carries its own
thumbnail. The hidden images are lazy-loaded, so a phone never downloads the
desktop set.

### Other layout changes

| Section | Version 1 | Version 2 |
|---|---|---|
| Hero | split — text beside a photo card | full-bleed photograph, headline over it, details bar on the bottom edge |
| What we repair | icon cards | three tall photo panels with the label overlaid |
| How it works | four cards | a horizontal run with a rule threaded through the numbers |
| Why choose us | photo beside six benefits | a bento grid — one tall photo tile plus six |
| Accessories | grid of five | a horizontal snap rail, fifth card half-visible to signal the scroll |
| Reviews | sliding row on light | sliding row on light (unchanged — it worked) |
| FAQ | single column | two columns |

### The logo is not touched

The supplied artwork has a charcoal "M" and "MOBILE" that would disappear on a
dark header. Rather than recolour a mark that is not ours to change, it sits on
a **white plate** in the header, drawer and footer. The SVG is byte-identical to
version 1's.

---

## 3. What is the same

- **Tech.** HTML5, CSS3 and vanilla JavaScript. No framework, no build step, no
  backend. What is in `public/` is what gets served.
- **Cost.** Still free on Firebase Spark or GitHub Pages. No server, no
  database, no paid API. The Google Map is the standard free embed.
- **Images.** The same 17 Pexels photographs, byte-for-byte, so
  `LICENCE-RECORD.pdf` in the project root covers this version without a single
  edit.
- **Fonts.** The same two self-hosted subsets, so version 2 adds no extra
  download and makes no third-party request.
- **Content.** Both versions are generated from the same content arrays. Nothing
  was reworded, and no claim was added.
- **Legal pages.** `privacy.html` and `terms.html` are lifted from version 1 at
  build time, so the two cannot drift apart on anything that matters legally.

---

## 4. Measured, not assumed

Both versions go through the same harness: four pages at twelve widths from
320px to 1920px, checking horizontal overflow, tap target sizes, heading order,
alt text and image dimensions, dead anchors, missing files, rendered WCAG AA
contrast (compositing every translucent layer), whether the reveal animations
actually fire, marquee integrity, the drawer's focus trap, the reduced-motion
fallback, and console errors.

Version 2 passes all of them. Five things it caught along the way:

- the site chrome inherited the light pages' text colour, painting the footer's
  outline button at **1.03:1** on its own background
- the header's translucency composited against white on those pages, dropping
  the nav links to 3.31:1
- a sideways reveal offset made the page 7px wider than a 320px phone
- the hero and contact labels ran inline — "ADDRESS 184 High Street Hawera
  4610" on one line
- the bento grid left an empty cell in its last row

Current first-load weight, gzipped where it applies:

```
index.html                     15.5 KB  (gzip)
css/style.css                  10.1 KB  (gzip)
css/responsive.css              2.4 KB  (gzip)
js/main.js                      2.9 KB  (gzip)
archivo-latin-var.woff2        34.1 KB
inter-latin-var.woff2          47.1 KB
hero/repair-bench-1280.avif    36.8 KB
                        TOTAL  149.0 KB
```

Accessibility carried over from version 1: skip link, visible focus rings, a
drawer that traps Tab and returns focus on close, `aria-expanded` on the FAQ,
decorative images marked `aria-hidden`, and a `prefers-reduced-motion` path
where both marquees become manually scrollable rows instead of vanishing.

---

## 5. If you pick this version

Nothing is wired up to deploy yet — this folder is a local proposal. To go live
with it, do **one** of these:

**Firebase.** From `version-2/`, run `firebase deploy`. The `firebase.json` here
is the same config version 1 uses, and its hosting root already points at this
folder's `public/`.

**GitHub Pages.** Edit `.github/workflows/pages.yml` in the project root and
change the upload path from `public` to `version-2/public`.

**Make it the only version.** Replace the root `public/` with `version-2/public`
and delete this folder. Cleanest long term, and nothing else needs touching.

Either way the outstanding items from the main README still apply to this
version too: the real shopfront photo, the Google Business Profile and Facebook
URLs, the "To complete:" boxes in the legal pages, and the GA4 ID if you want
analytics.

---

## 6. Files

```
version-2/
├── firebase.json            hosting config (same as version 1)
└── public/                  everything that gets deployed
    ├── index.html           the whole single-page site
    ├── privacy.html         built from version 1's copy
    ├── terms.html           built from version 1's copy
    ├── 404.html
    ├── css/style.css        design system, components, motion
    ├── css/responsive.css   every media query, breakpoints 1200 → 380
    ├── js/main.js           header · drawer · reveal · services · faq · marquees · rail
    ├── images/              the same 17 photographs, unchanged
    └── assets/              the same fonts and logo, unchanged
```
