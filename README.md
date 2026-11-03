# Dairy Park — website

Marketing and order-request website for **Dairy Park (ডেয়ারি পার্ক)**, a 100% pure veg
family restaurant on Kolaghat – Jashar Road, Kolaghat, West Bengal 721134.

- Live site: **https://authorsauravkushwaha.github.io/Dairy_Park/**
- Phone / WhatsApp: **+91 99324 52124**
- Menu: **112 unique dishes** transcribed from the four printed-menu photographs
  supplied on 2026-11-03. Every menu item has a printed price.
- Facilities: dine-in, drive-through, pure veg.
- Ordering: visitors can build a draft order on the Food & Menu page and hand it
  to WhatsApp, or call the restaurant. **The website does not take payment,
  guarantee availability, or confirm pickup times.** The restaurant must reply
  to confirm the order.

The site is a hand-built multi-page static site (HTML + one CSS file + vanilla
JS) with a small build step that assembles pages from shared templates.

---

## What changed in the 2026 menu refresh

- Replaced the old menu with the new printed menu: dosa, uttapam, momo,
  chowmein/noodles, rolls, salad, raita/dahi, papad, beverages, moglai, chaat,
  chilli, pizza, rice/biryani, roti/paratha, aloo, dal, tarka, chana,
  paneer/veg, tea/coffee, snacks, puri/bhatura, pakora, fries, idli and vada.
- Normalised obvious printed typos for readability (for example `PLAN DOSA` →
  `Plain Dosa`, `STRAWERY SHAKE` → `Strawberry Shake`). Unusual printed names
  such as `Gavy Momo` and `Kachari Sabji` are kept and tagged “As printed”.
- Removed outdated unpriced dosas, the old ice-cream/dairy menu category, and
  the unverified ₹1–200 per-person spend figure.
- Added a direct order builder: add dishes → review quantities and menu total →
  send the request on WhatsApp or call. The message explicitly asks the
  restaurant to confirm availability, final price and pickup time.
- Demoted the generic Delico link to an optional external app. The site no
  longer claims that the full Dairy Park menu or pickup is available there
  unless the owner supplies a verified restaurant-specific link.
- Added dish imagery. Images are labelled:
  - **Photo from Dairy Park** — supplied restaurant photographs.
  - **Serving inspiration** — AI-generated illustrations or licensed reference
    photos. These are not photographs of the exact dish prepared at Dairy Park.
- Replaced the printed-menu gallery with all four new menu photographs.
- Updated SEO, structured data, Open Graph image, privacy note and image credits.

## Pages

| Route | Page | Purpose |
| --- | --- | --- |
| `/` | Home | Food-first hero, order CTA, highlights, pairing, dining room, counter, location |
| `/food/` | Food & Menu | Full 112-item menu, search, category chips, dish details, add-to-order, WhatsApp order dialog, printed menu photos |
| `/about/` | About Us | Restaurant introduction and facilities |
| `/gallery/` | Gallery | Supplied restaurant / food / product photographs |
| `/offers/` | Special Offers | Owner-approved promos, or an honest empty state |
| `/reviews/` | Customer Reviews | Hidden until the live Google rating is re-checked |
| `/visit/` | Visit Us | Address, map, directions, hours-to-confirm |
| `/contact/` | Contact Us | Call, WhatsApp enquiry form, map |
| `/privacy.html` | Privacy note | Privacy summary and image credits |

## Project structure

```text
content.js              ⭐ owner-editable menu, business details, photos, WhatsApp
assets/js/i18n.js       ⭐ English + Bengali interface strings
assets/js/app.js        rendering, filters, dialogs, order builder, WhatsApp hand-off
assets/css/main.css     styles
assets/img/photos/      restaurant photos, dish illustrations/reference photos, menu cards
assets/menu-source/     original supplied menu photographs (provenance)
templates/layout.html   shared page shell
templates/partials/     header, drawer, footer, sticky bar, consent banner
templates/pages/        page bodies + meta blocks
scripts/build.mjs       assembles dist/, bundles JS/CSS, JSON-LD, sitemap
scripts/check.mjs       static quality gate
scripts/smoke.mjs       headless jsdom tests
```

## Local development

```bash
npm install
npm run build     # → dist/
npm run dev       # serves dist/ on http://localhost:4173
npm test          # build + static checks + headless smoke tests
```

## Content rules

Only verified information is published. Prices come from the supplied printed
menu. Hours, ratings, offers and per-person spend are not invented. Dish images
that are not supplied by the restaurant are labelled as serving inspiration.
Image credits and licences are listed in `/privacy.html#image-credits`.

## WhatsApp order requests and enquiries

There is no backend and no third-party form service. The order builder and the
contact form package the visitor’s input into a `https://wa.me/<number>?text=…`
link addressed to the owner’s WhatsApp number (`content.js → whatsapp.number`).
The visitor taps **Send** inside WhatsApp. The site itself transmits nothing,
never claims delivery, and does not take payment. Setting
`content.js → whatsapp.enabled: false` hides WhatsApp blocks and leaves the
call-first flow.

## Deployment

Pushes to `main` run `.github/workflows/deploy.yml`, which builds `dist/`, runs
both test suites, and publishes the artifact with GitHub Pages. All asset URLs
are relative, so the site also works under a custom domain or user-root
repository by changing `content.js → site.url`.
