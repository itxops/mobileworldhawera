# Version 5

**Live demo:** <https://itxops.github.io/mwh-v5/>

Built after the client rejected version 4 as **"very cluttered"**, **not
readable**, and with a **"very cheap" font family** — and named
[phonezone.co.nz](https://phonezone.co.nz/) as the look he wants, "with space".

Preview: `node preview.mjs` from the project root, then
<http://localhost:5173/v5/>.

---

## What changed, against each thing he said

**"Very cluttered."** The boxes are gone. There are no cards, no gradient
tiles, no coloured chips, no shadows, and one border colour used sparingly as
a hairline. Most sections are now a heading, a line of italic, and one
photograph. The six repairs are alternating rows — photograph one side, words
the other — which is the reference site's one structural idea and the reason
it does not read as a grid of boxes.

**"Should look readable."** Body text is **18px on a 1.8 line height with a
60-character measure**. Nothing on the page is under 14px. Headings are large
and set in a single regular weight; the size and the space do the work rather
than boldness.

**"Font family is very cheap."** Two new typefaces, neither used in any
earlier version:

| | | |
|---|---|---|
| **Instrument Serif** | headings, and the italic line under each | 21 KB + 22 KB |
| **Manrope** | body and interface | 24 KB |

Both self-hosted, both SIL Open Font Licence.

**"Change the images."** **15 of the 17 photographs are new.** Every candidate
was downloaded and looked at on a contact sheet first, because the Pexels
licence covers copyright but a trademark inside a photograph is a separate
problem and the only way to catch one is to look. Rejected on that pass:

> Xiaomi logo · "realme" wordmark · Audio-Technica · Marshall (×3) · JBL ·
> Bose · Sony · "hoco" · AirPods (×4) · Apple logo on phone cases (×2) ·
> an Apple 30-pin connector · an iPhone notch silhouette · Apple keyboard
> and iPhone internals

Two are carried over — `accessories/cases` and `accessories/earbuds` — because
every alternative found for those two categories carried a visible trademark.
Both were checked and cleared when first used. Full list in
`public/images/CREDITS.md`.

---

## Measured on the built page

| | |
|---|---|
| First load | **88 KB** (HTML 8 KB + CSS 6 KB gzipped, fonts 66 KB, hero photo 8 KB) |
| JavaScript | **0 bytes** — no `.js` file exists |
| Page height at 390px | 14,275px, **16.9 phone screens** |

**On that last number, honestly:** phonezone.co.nz — the site he chose — is
**17.4 screens** on the same measurement, and irepair was 17.4 too. Length was
never the complaint; clutter was. So the generous spacing stays, and I only
trimmed where it cost nothing (the footer goes two-up, the photo blocks stop
being tall portraits of themselves). If he does want it shorter, the lever is
the repair rows, and that trades away the air he asked for.

Passes the full harness across four pages and thirteen widths: no script, no
console errors, no sideways scroll, every tap target 44px or more, one `<h1>`
per page with no heading-level jumps, every image with alt text and
dimensions, every text node meeting WCAG AA, and nothing under 13px.

Three things it caught: the repair numerals were 4.09:1 where 4.5 was needed,
the 404 page jumped `<h1>` to `<h3>`, and the "Home" link on the legal pages
was 19px tall.

---

## Still HTML and CSS only, still free on Spark

No JavaScript file. The menu and the FAQ are `<details>`/`<summary>`; the
header is `position: sticky`. `firebase.json` declares hosting only — no SDK,
no backend. Fonts are self-hosted, so the Google Maps iframe is the single
external request on the page.
