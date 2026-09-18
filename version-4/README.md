# Version 4 — the irepair look

**The UI follows [irepair.co.nz](https://irepair.co.nz), which you picked. The
content is your own, carried across from your Alexandra site.**

Preview it with `node preview.mjs` from the project root, then
<http://localhost:5173/v4/> — or <http://localhost:5173/compare> to put it
beside any other version.

---

## 1. What was copied, and what was not

The reference was **measured**, not eyeballed — a script read its computed
styles and section order, and captured it at desktop and phone widths. What
came across:

| | irepair.co.nz | version 4 |
|---|---|---|
| Heading face | Space Grotesk 600–700 | same, self-hosted |
| Body face | DM Sans 400–700 | same, self-hosted |
| Card radius | 12 / 16 / 20px | same |
| Buttons | 50px pills | same |
| Shadows | soft, generous, one tinted with the brand colour | same |
| Hero | pale wash, pill badge, big headline with a coloured phrase, two pills, three figures, photo in a white frame with small cards floating over it | same |
| Cards | white, rounded, gradient icon tile | same, with the tile lifted over the photo |
| Section heads | small tracked coloured eyebrow, centred heading, centred lead | same |

**What was not copied:** none of their code, none of their images, none of
their words, and nothing about their business. Their layout language is the
reference; everything inside it is yours.

### One deliberate difference: red, not blue

irepair is blue. Your logo is red, and a blue site behind a red logo fights
itself — so the red takes every place irepair uses blue. If you would rather
have the blue, it is three values at the top of the stylesheet.

Your red needed splitting into three shades, because `#E0473D` is 4.08:1
against white — fine for big headline text, but below the accessibility
minimum for ordinary text and for white-on-red buttons:

| | | Used for |
|---|---|---|
| `#E0473D` | 4.08:1 | headline phrases, gradient tiles, decoration |
| `#D0392F` | 4.88:1 | buttons, anything with white text on it |
| `#BE3227` | 5.67:1 | eyebrows, links, any red word at body size |

Side by side you will not see the difference.

---

## 2. Content — nothing invented

Every word is yours, generated from the same content file all four versions
share, so the wording cannot drift between them. Section headings follow your
Alexandra site: *Our repairing services* · *Repairs we handle every day* ·
*Quick & easy process* · *Why choose MW Hawera?* · *What our happy customers
say* · *Premium mobile accessories await* · *Come see us in Hawera* · *Phone
playing up? Fix it today.*

**Two honest departures from the reference sites**, both because the claim
would not be true for Hawera:

- irepair's hero shows "10+ Years Experience / 45min Average Repair / 90 Day
  Warranty". Yours shows **7 days · Same day · Free** — open every week, most
  repairs, diagnostics and quote. All three are your own existing claims.
- Neither the "5.0 rating on Google" from Alexandra nor irepair's "4.9 Google
  Reviews" badge appears. The Hawera store has no rating yet, and inventing
  one is the kind of thing Google penalises. The reviews are still there,
  labelled as reviews of your Mobile World stores.

---

## 3. Still HTML and CSS only

No JavaScript file exists in this build. The only `<script>` tags hold
structured data for Google.

| | |
|---|---|
| Mobile menu | `<details>` / `<summary>` |
| FAQ | `<details>` / `<summary>`, each row independent |
| Review row, device and accessory rails | CSS `scroll-snap` |
| Sticky header | `position: sticky` |

---

## 4. Measured on the built page

| | |
|---|---|
| First load | **92 KB** (HTML 13 KB + CSS 7 KB gzipped, two fonts 59 KB, hero photo 14 KB) |
| JavaScript | **0 bytes** |
| Page height at 390px | **10,632px** — the reference site is 14,664px |
| Photographs | 17, all of them |

The phone layout is shorter than the reference because the image-led rows
(devices, accessories) scroll sideways instead of stacking, and the six
reasons sit two-up. Nothing is hidden to achieve it.

**Passes the full harness** — four pages across thirteen widths from 320px to
1920px: no script, no console errors, no sideways scroll, every tap target
44px or more, one `<h1>` per page with no heading-level jumps, every image with
alt text and dimensions, every text node meeting WCAG AA, the `<details>` FAQ
opening rows independently, and nothing on the page under 13px.

Four bugs it caught, all invisible in the source:

- `.float-card span` also matched the gradient tile inside it, so the tile
  inherited grey body colour and its white icon vanished
- `white-space: nowrap` on the hero figures made the page 23px wider than a
  320px phone
- the footer's legal links measured 38px tall and the "Home" link 17px
- the 404 page jumped from `<h1>` straight to `<h3>`

---

## 5. Still free on Firebase Spark

`firebase.json` declares hosting only — no Firestore, Functions, Storage or
Auth. No SDK, no `fetch`, no backend. Both fonts are self-hosted, so not even
Google Fonts is contacted. The Google Maps iframe is the single external
request on the page.
