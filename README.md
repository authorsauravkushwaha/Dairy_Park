# Dairy Park — website

Marketing website for **Dairy Park (ডেয়ারি পার্ক)**, a 100% pure veg family
restaurant on Kolaghat – Jashar Road, Kolaghat, West Bengal 721134, with a
green-walled dining room of hand-painted arches, a dairy counter (ice cream,
sweets and snacks) and a printed menu card of about ninety dishes — every price
of which is on the site.

- Live site: **https://authorsauravkushwaha.github.io/Dairy_Park/**
- Phone: +91 99324 52124 · Google rating is hidden until the live listing is re-checked
- Facilities: dine-in, drive-through · Typical spend ₹1–200 per person

The site is a **hand-built multi-page static site** (HTML + one CSS file +
vanilla JS) with no runtime framework, a small build step that assembles the
pages from shared templates, and everything the owner needs to edit in plain,
commented files.

---

## Pages

| Route | Page | Purpose |
| --- | --- | --- |
| `/` | Home | Hero with pure-veg seal + price ribbon, trust figures, welcome, six priced highlights, dining-room band, dairy-counter band, why visit, gallery + reviews preview, location, closing CTA |
| `/food/` | Food & Menu | The whole menu card with prices: category chips, search, dotted price list grouped by category, featured row, detail popups, printed-card photographs, call-to-enquire |
| `/about/` | About Us | Restaurant introduction, facilities, what to explore |
| `/gallery/` | Gallery | Exterior / interior / food / products sections with lightbox |
| `/offers/` | Special Offers | Owner-approved promos, or a friendly empty state |
| `/reviews/` | Customer Reviews | Verified Google rating + links to the original reviews |
| `/visit/` | Visit Us | Address, embedded map, directions, hours, first-visit tips |
| `/contact/` | Contact Us | Click-to-call, address, map, enquiry form that hands off to the owner's WhatsApp |
| `/privacy.html` | Privacy note | Plain-language privacy summary |

Every page has its own SEO title/description/canonical, Open Graph tags and
JSON-LD (Restaurant + WebSite + breadcrumbs), all generated at build time from
`content.js`. Bilingual (English / বাংলা) with one-tap switching that keeps the
visitor on the current page.

## Project structure

```
index.html              the source templates for the pages
404.html                standalone error page
content.js              ⭐ owner-editable content: menu, categories, hours,
                        offers, gallery slots, analytics, WhatsApp number
templates/layout.html   shared page shell (head, chrome)
templates/partials/     header, drawer, footer, sticky bar, consent banner
templates/pages/        the body of each page + its meta block
scripts/pages.mjs       ⭐ page registry (routes, nav, priorities)
scripts/build.mjs       assembles dist/: templates → HTML, bundle, minify,
                        CSP hashes, JSON-LD, sitemap.xml
scripts/check.mjs       static quality gate (SEO, links, CSP, a11y, i18n)
scripts/smoke.mjs       headless jsdom tests for every page
assets/js/i18n.js       ⭐ owner-editable wording, English + Bengali
assets/css/main.css     styles (design tokens at the top)
assets/js/app.js        behaviour: i18n, rendering, filters, lightbox, 3D
assets/img/             logo, placeholders, social image, photos/
.github/workflows/      build → check → deploy to GitHub Pages
```

## Local development

```bash
npm install
npm run build     # → dist/
npm run dev       # serves dist/ on http://localhost:4173
npm test          # build + static checks + headless smoke tests
```

`npm run check` verifies every page: SEO tags, unique titles, canonical URLs,
the per-page CSP hash, local links (including `../` references from sub-page
folders), alt text, duplicate IDs, active-nav markers, sitemap/robots/manifest,
and that no unverified hours or ratings leak into structured data.
`npm run smoke` boots each built page in jsdom and tests rendering, the Bengali
switch, phone links, the mobile drawer, menu filters/search/dialog, the gallery
lightbox, the offers empty state, and the enquiry form's hand-off to WhatsApp
(addressing, prefilled name/phone/message, the English and Bengali templates,
and the call-only fallback when the feature is switched off).

## Deployment

Pushes to `main` run `.github/workflows/deploy.yml`, which builds `dist/`,
runs both test suites, and publishes the artifact with GitHub Pages
(Settings → Pages → Source: **GitHub Actions**).

Pages live in folders (`food/index.html` → `/food/`) so direct page visits and
browser refreshes work on GitHub Pages. All asset URLs are relative, so the
site also works on a custom domain (`dairypark.com`) or a user-root repository
without code changes — only `content.js → site.url` needs the new address
(canonicals, Open Graph URLs and the generated `sitemap.xml` follow it).

See `OWNER-GUIDE.md` for routine content edits and `SECURITY.md` for the
security posture.

## Content rules

Only verified information is published. Prices, full opening hours, offers,
gallery photographs and customer quotes are **not** invented — they are either
absent, marked “call to confirm”, or kept in `content.js` for the owner to fill
in once confirmed. Every price on the site is copied from the printed menu card
in the Gallery photographs, and the pure-veg claim comes from the signboard
outside; the footer asks visitors to confirm prices by phone because they can
change. The Google rating is **hidden by default** (`reviews.show`)
until the owner re-checks the live listing; menu descriptions stay blank until
ingredients are confirmed. Empty menu categories and the offers page degrade to
honest designed states rather than fake content.

## WhatsApp enquiries

There is no backend and no third-party form service. The Contact page's
enquiry form packages the visitor's name, phone number and question into a
`https://wa.me/<number>?text=…` link addressed to the owner's own WhatsApp
number (`content.js → whatsapp.number`) and opens it. The visitor taps Send
inside WhatsApp; the site itself transmits nothing, never claims delivery, and
does not advertise WhatsApp ordering or payment. Setting
`content.js → whatsapp.enabled: false` removes every WhatsApp block and the
form falls back to the call-first wording.

Genuine owner-supplied photographs are included: the owner portrait (hero +
About), shop interior, counter snacks, ice-cream and chocolate freezers, and
three menu-counter shots wired into the Gallery page.
