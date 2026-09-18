# Image credits

## Photography

All photographs are free stock images from **Pexels**, used under the
[Pexels licence](https://www.pexels.com/license/) — free for commercial use, no
attribution required. Source pages listed so the licence can be verified.

| File | Used in | Source |
|---|---|---|
| `hero/repair-bench-*` | Hero | https://www.pexels.com/photo/31862950/ |
| `accessories/accessories-hero-*` | Accessories section | https://www.pexels.com/photo/32912404/ |
| `services/screwdriver-*` | Closing call-to-action band | https://www.pexels.com/photo/6755075/ |

Each ships as AVIF with a WebP fallback at two or three widths, served via
`<picture>` and `srcset`.

### Deliberately avoided

- No manufacturer photography (Apple, Samsung or any other brand).
- No images taken from any other repair business.
- No stock photo showing a visible manufacturer logo, even where the Pexels
  licence would have allowed it.

## Artwork

The supplied `logo.png` is used **unchanged** — same charcoal, same red, same
grey. It was traced to vector so it stays sharp at any size; no colour was
altered, no reversed/white version is used anywhere, and the letter counters
(the holes in O, B, R, D, a, e) are properly transparent.

| File | Notes |
|---|---|
| `assets/logo/logo.svg` | Full lockup, vector trace of the supplied logo |
| `assets/logo/mw-mark.svg` | MW monogram alone, original colours |
| `assets/logo/og-image.jpg` | 1200×630 social preview |
| `assets/logo/icon-192.png` / `icon-512.png` | Web app manifest icons |
| `favicon.svg`, `apple-touch-icon.png` | The monogram in its original colours on a white tile |
| Inline SVG sprite in each page | ~40 interface and category icons, drawn for this site |

## Copy

Site wording is the business owner's own, carried across from their existing
Mobile World Alexandra site with the town and contact details changed to Hawera.
See README.md §2 for the three items that were handled differently (the Google
rating badge, the review attribution line, and the opening hours).

## Fonts

**Archivo** (headings) and **Inter** (body) — both SIL Open Font License 1.1,
free for commercial use. Self-hosted latin variable subsets in `assets/fonts/`,
so no request is made to any third-party font service.
