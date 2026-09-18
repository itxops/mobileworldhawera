# Version 3 — "High Street Counter"

A third design, built from scratch after versions 1 and 2 were both rejected.

**Two files make the whole site: `index.html` and `css/style.css`.**
There is no JavaScript. Not a little — none. There is no `.js` file anywhere in
this folder, and the only `<script>` tags on the page hold structured data for
Google, which is data rather than code.

---

## 1. Looking at it

From the project root:

```
node preview.mjs
```

| URL | |
|---|---|
| <http://localhost:5173/v3/> | version 3 |
| <http://localhost:5173/compare> | any two versions side by side — each pane has a dropdown |
| <http://localhost:5173/> | chooser |

---

## 2. How it was designed

Rather than guess at a third direction, four were explored independently from
four different angles — warm retail, precision utility, bold graphic, and
app-native — and each was judged twice: once by a hard-to-please client persona
and once by a mobile UX specialist. Three tied at 7/10.

The judges agreed on something that changed the brief: **every one of the four
directions hit its short-page target by stripping photographs off the phone**,
when more images had specifically been asked for. One judge put it plainly —
*"it buys its 4,940px almost entirely by taking my photographs off the page."*

So the rule became: keep the photographs, and buy the height back from
component shape instead. **All 17 photographs appear on a 390px phone.** None is
behind a tap, a tab, a sheet or a hover.

---

## 3. Everything interactive, and what drives it

| Thing | Mechanism | JavaScript |
|---|---|---|
| The 8 FAQ answers | `<details>` / `<summary>` | none — built into the browser |
| Reviews and accessories rows | `overflow-x` + CSS `scroll-snap` | none |
| Contents strip under the hero | same | none |
| Smooth jumps to sections | `scroll-behavior: smooth` | none |
| Bottom action bar | `position: fixed` | none |
| Desktop header | `position: sticky` | none |
| Opening hours | written as text — they are fixed at Mon–Sun 9:30–5:30 | none |

Each FAQ row opens and closes **independently**. The native exclusive-accordion
behaviour (`<details name="...">`) was deliberately not used: it collapses a row
above your thumb and yanks the page up mid-read.

Things that were dropped rather than rebuilt: scroll-reveal animation, the brand
marquee, the cursor-following image stage, the hamburger drawer, and a live
"Open now" chip. The chip is worth a note — it was the judges' favourite idea,
but it would have needed JavaScript *and* it would have lied on Good Friday and
on any sick day. The shop keeps the same hours seven days a week, so a static
sign answers the same question and can never be wrong.

---

## 4. The numbers, measured on the built page

| | v1 | v2 | **v3** |
|---|---|---|---|
| Page height at 390px | 15,082px | 9,110px | **6,373px** |
| Phone screens of scrolling | 17.9 | 10.8 | **7.6** |
| First load (gzipped where it applies) | ~148 KB | ~149 KB | **69 KB** |
| JavaScript shipped | ~9 KB | ~9 KB | **0 bytes** |
| Photographs visible on a phone | most | most | **all 17** |

First load breaks down as: HTML 12.4 KB gzipped, CSS 8.1 KB gzipped, the font
33.9 KB, and the hero photograph 14.3 KB.

**An honest note on the height.** 6,373px is 7.6 "screens" against an 844px
viewport, but a real iPhone shows about 640px of content once Safari's chrome
and our bottom bar are accounted for — so it is closer to **10 real swipes**.
That correction applies to every design; it is quoted here because the figure
flatters itself by about 30% and you should have the real number.

---

## 5. Still free on Firebase Spark

Nothing here costs anything to run, and this was verified rather than assumed:

- `firebase.json` declares **only `hosting`** — no Firestore, Functions, Storage
  or Auth
- no Firebase SDK, no `fetch`, no database, no backend
- the **only** external request the page makes is the Google Maps iframe
- the whole folder is ~1.4 MB against Spark's 10 GB storage and 360 MB/day
- the font is self-hosted, so not even Google Fonts is contacted

Same story on GitHub Pages.

---

## 6. The design, briefly

**One warm cream ground** (`#FBF7F1`) runs from the header to the footer. There
is no band switching — v2's dark-then-light split is what made it announce a new
section every time you scrolled.

**The red is paint, never type.** The brand red `#EF3B36` is a 6px bar under one
headline word, a 3px tick, a 4px edge on an open answer, and the logo. It never
sets a word, because white on that red measures 3.93:1 — unreadable to roughly
one person in twelve. Where red has to carry text it is `#B3221D`, which is
6.22:1 on cream. The stylesheet has that list written into a comment so it does
not get undone later.

**One shadow and one gradient in the entire stylesheet** — the bottom bar's
hairline lift, and the headline underline. Stacked glows and gradient fills were
the "cheap" signal in v1.

**The signature is the repairs index.** Six full-bleed rows, the photograph
alternating between the left and right screen edge, a red numbered square, the
title, the full description always visible, and "Ask →". Each row is a WhatsApp
link with that exact repair already written into the message — so a customer
with a cracked screen taps once and is mid-conversation.

**One typeface**, Hanken Grotesk (SIL OFL 1.1, self-hosted, 34 KB). Chosen for
legibility at 15–17px by older eyes rather than for a headline effect. Body text
is 17px, not 16, for the same reason. Nothing on the page is under 13px.

---

## 7. Two disclosed trade-offs

Neither is hidden, because both were things the judges said should not be
slipped past you:

1. **The six "why choose us" descriptions are hidden below 1040px.** The names
   — Free Diagnostics, Genuine Parts, Same-Day Service — carry the meaning on
   their own, and showing the sentences costs about 220px on a phone. The text
   is in the HTML, so un-hiding it is deleting one `display: none`. Look at it
   on a phone and a laptop side by side and tell me which you prefer.
2. **The nine reviews are on a sliding row.** All nine are on the page, but
   realistically three or four get read. That is true of any treatment of nine
   reviews on a phone; the alternative is a much longer page.

**One thing to check before this goes live:** each review card shows five stars.
Those must all be genuine five-star reviews. If any one of the nine was not,
delete the `<span class="stars">` line from that card. No rating average, review
count or aggregate is claimed anywhere on the site, and there is no
`aggregateRating` in the structured data.

---

## 8. Files

```
version-3/
├── .github/workflows/pages.yml   publishes public/ if you want a demo URL
├── firebase.json                 hosting config — hosting only
└── public/
    ├── index.html                the whole site
    ├── css/style.css             the only stylesheet, 24 numbered sections
    ├── privacy.html  terms.html  built from version 1's wording
    ├── 404.html  sitemap.xml  robots.txt  site.webmanifest
    ├── assets/fonts/             one font file
    ├── assets/logo/              unchanged
    └── images/                   the same 17 photographs, unchanged
```

The stylesheet has a numbered table of contents at the top and two breakpoints
(720px and 1040px). Every media query lives at the bottom of the file. It is
meant to be opened and read.

---

## 9. Checked, not assumed

Every claim above was measured on the built page by an automated harness — four
pages across thirteen widths from 320px to 1920px:

- no `.js` file, no script tag other than JSON-LD, no inline event handlers
- no console errors
- no sideways scroll at any width
- every tap target 44px or larger
- one `<h1>` per page, no heading-level jumps, every image with alt text and
  explicit dimensions, every iframe titled
- every text node meets WCAG AA contrast, measured on the rendered page with
  translucent layers composited
- the `<details>` FAQ opens two rows independently without JavaScript
- all three snap rails genuinely scroll
- nothing on the page is smaller than 13px
- no invented claims, no aggregate rating, no credentials
