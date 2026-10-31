# Dairy Park — website

Marketing website for **Dairy Park (ডেয়ারি পার্ক)**, a fast-food restaurant on
Kolaghat – Jashar Road, Kolaghat, West Bengal 721134.

- Live site: **https://authorsauravkushwaha.github.io/Dairy_Park/**
- Phone: +91 99324 52124 · Google rating is hidden until the live listing is re-checked
- Facilities: dine-in, drive-through · Typical spend ₹1–200 per person

The site is a **hand-built static site** (HTML + one CSS file + vanilla JS) with
no runtime framework, a small build step for bundling/minifying, and everything
the owner needs to edit in plain, commented files.

---

## What is on the site

| Section | Purpose | Conversion goal |
| --- | --- | --- |
| Hero with owner photo | Brand, headline, Dahi Vada / Steam Momo | “Get Directions”, “Call Now” |
| Marquee strip | Verified facts repeated on scroll | Recall |
| Menu highlights | Dahi Vada, Steam Momo (editable) | “Ask About Our Menu” (call) |
| Why visit | Dine-in, drive-through, location, spend | Trust |
| Shop gallery | Owner-supplied shop and product photos | Trust |
| Reviews | Hidden pending a current Google listing check | Google Maps link remains available |
| Offers | Hidden until a real offer is added | Repeat visits |
| Location | Map, address, phone, facilities | Directions / call |
| Sticky mobile bar | Always-visible call + directions | Enquiries |
| Footer | NAP details, links, privacy note | Local SEO |

Bilingual (English / বাংলা) with one tap switching, remembered on the device.
Animations run on scroll **in both directions** and respect `prefers-reduced-motion`.

## Project structure

```
index.html              the page (semantic markup, i18n hooks, JSON-LD)
privacy.html, 404.html  secondary pages
content.js              ⭐ owner-editable content: menu, hours, offers, photos, analytics
assets/js/i18n.js       ⭐ owner-editable wording, English + Bengali
assets/css/main.css     styles (design tokens at the top)
assets/js/app.js        behaviour: i18n, rendering, 3D, tracking
assets/img/             logo, placeholders, social image, photos/
scripts/                build / serve / check / smoke scripts
.github/workflows/      build → check → deploy to GitHub Pages
```

## Local development

```bash
npm install
npm run build     # → dist/
npm run dev       # serves dist/ on http://localhost:4173
npm test          # build + static checks + headless smoke test
```

`npm run check` verifies SEO tags, the CSP hash, local links, alt text,
duplicate IDs, sitemap/robots/manifest, and that no unverified hours or ratings
leak into structured data. `npm run smoke` boots the built page in jsdom and
tests rendering, the Bengali switch, phone links and the mobile menu.

## Deployment

Pushes to `main` run `.github/workflows/deploy.yml`, which builds `dist/`,
runs both test suites, and publishes the artifact with GitHub Pages
(Settings → Pages → Source: **GitHub Actions**). The active Arena delivery
branch is also enabled for a deployment run so this update can be published
without changing branches.

Because the repository is named `Dairy_Park`, GitHub serves it from a
sub-path: `https://authorsauravkushwaha.github.io/Dairy_Park/`. All asset URLs
are relative, so the site also works on a custom domain (`dairypark.com`) or on
a user-root repository without code changes — only `content.js → site.url`, the
canonical/Open Graph tags and `sitemap.xml`/`robots.txt` need the new address.

See `OWNER-GUIDE.md` for routine content edits and `SECURITY.md` for the
security posture.

## Content rules

Only verified information is published. Prices, full opening hours, offers and
customer quotes are **not** invented — they are either absent, marked “call to
confirm”, or kept in `content.js` for the owner to fill in once confirmed.
