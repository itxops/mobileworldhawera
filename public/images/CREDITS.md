# Image credits

## Licence

Every photograph on this site is a free stock image from **Pexels**, used under the
[Pexels licence](https://www.pexels.com/license/):

- Free for **commercial use**
- **No attribution required**
- No sign-up, no fee, no expiry

Source pages are listed below so the licence can be verified for each one.

| File | Used in | Source |
|---|---|---|
| `hero/repair-bench-*` | Hero | https://www.pexels.com/photo/31862950/ |
| `devices/smartphones-*` | What We Repair — Smartphones | https://www.pexels.com/photo/31862953/ |
| `devices/tablets-*` | What We Repair — Tablets & iPads | https://www.pexels.com/photo/6373027/ |
| `devices/laptops-*` | What We Repair — Laptops & Ultrabooks | https://www.pexels.com/photo/33531806/ |
| `services/screen-*` | Phone Screen Repair | https://www.pexels.com/photo/288479/ |
| `services/water-*` | Water Damage Repair | https://www.pexels.com/photo/8481931/ |
| `services/battery-*` | Battery Replacement | https://www.pexels.com/photo/10366330/ |
| `services/audio-*` | Speaker & Audio Repair | https://www.pexels.com/photo/6755138/ |
| `services/signal-*` | Signal & Connectivity Fixes | https://www.pexels.com/photo/33277478/ |
| `services/software-*` | Software & Performance Issues | https://www.pexels.com/photo/8947766/ |
| `store/workshop-*` | Why Choose MW Hawera | https://www.pexels.com/photo/31718639/ |
| `accessories/headphones-*` | Accessories — Headphones | https://www.pexels.com/photo/7772548/ |
| `accessories/earbuds-*` | Accessories — Earbuds | https://www.pexels.com/photo/33797659/ |
| `accessories/cases-*` | Accessories — Mobile Cases | https://www.pexels.com/photo/374117/ |
| `accessories/speaker-*` | Accessories — Bluetooth Speaker | https://www.pexels.com/photo/13465232/ |
| `accessories/cables-*` | Accessories — Charging Cables | https://www.pexels.com/photo/6081231/ |
| `cta/screwdriver-*` | Closing call-to-action band | https://www.pexels.com/photo/6755075/ |

That is **17 photographs**, each shipped as AVIF with a WebP fallback at two or
three widths through `<picture>` and `srcset`. The browser downloads one size
per image, and everything below the fold is lazy-loaded.

## What was deliberately avoided

The Pexels licence covers copyright. **Trademarks are a separate matter**, so
every candidate was opened and checked by eye before use, and anything showing a
manufacturer's name or logo was rejected:

- Speakers: JBL, Bose, Marshall, Sony, MIVI
- Earbuds and cases: Apple-branded
- Phone screens showing app icons: Chrome, WhatsApp, Facebook, Instagram and the like
- A battery shot was swapped out because a laptop with visible app icons crept
  into the frame

Also avoided: any manufacturer's own product photography, and any image taken
from another repair business.

## Brand marks

The six logos in the "Brands we repair" marquee come from
[Simple Icons](https://simpleicons.org), released under **CC0-1.0** — the icon
files themselves are public domain, so there is no copyright question.

The **trademarks remain the property of each manufacturer.** They appear here
only to identify which devices the shop repairs — ordinary nominative use, the
same thing every independent repair shop does — and the marquee carries a note
directly beneath it:

> Brand names and logos are shown only to help you identify your device. Mobile
> World Hawera is an independent repair store and is not an authorised service
> centre for, or affiliated with, any of these manufacturers.

They are rendered in a single flat colour rather than each brand's official
colours, which keeps clear of brand style guidelines and looks tidier in the row.

If any manufacturer ever objects, deleting a logo is one line in `index.html`
(remove both the visible `<li>` and its `data-mq-clone` twin).

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
| Inline SVG sprite in each page | 26 interface icons drawn for this site, plus the 6 CC0 brand marks |

## Copy

Site wording is the business owner's own, carried across from their existing
Mobile World Alexandra site with the town and contact details changed to Hawera.
See README.md §2.

## Fonts

**Archivo** (headings) and **Inter** (body) — both SIL Open Font License 1.1,
free for commercial use. Self-hosted latin variable subsets in `assets/fonts/`,
so no request is made to any third-party font service.
