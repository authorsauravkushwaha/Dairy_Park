# Owner guide — Dairy Park website

Everything routine can be changed without touching the design code.
You only edit two plain files, and upload photos. Then the website rebuilds
itself automatically (about a minute).

---

## 1. Restaurant photos (already supplied)

The genuine photographs you sent over WhatsApp are in `assets/img/photos/` and
are already wired up — the homepage hero, the About page and all four Gallery
sections show real photos today. The site picks up `.jpg`, `.jpeg`, `.png`,
`.webp` and `.avif` automatically. If a photo file is ever missing, a designed
placeholder is shown instead — nothing breaks, and no fake photograph is used.

| File name | Where it shows |
| --- | --- |
| `photos/shop-front.*` | **Supplied** — full-screen homepage hero backdrop |
| `photos/owner.*` | **Supplied** — owner portrait in the hero frame + About page inset |
| `photos/interior-room.*` | **Supplied** — dining room (About page + Gallery) |
| `photos/interior-arches.*`, `interior-booth.*`, `interior-green.*`, `interior-lounge.*`, `interior-night.*` | **Supplied** — dining room, arches and evening frontage (Gallery) |
| `photos/table-setting.*`, `wall-art.*`, `shop.*` | **Supplied** — tables, framed art and snacks counter (Gallery) |
| `photos/dahi-vada.*` | **Supplied** — Dahi Vada cards on Home + Food & Menu, “order both” strip, Gallery |
| `photos/steam-momo.*` | **Supplied** — Steam Momo cards on Home + Food & Menu, “order both” strip, Gallery |
| `photos/menu-spread-1.*`, `menu-spread-2.*`, `menu-drinks.*` | **Supplied** — printed menu boards (Gallery) |
| `photos/counter-snacks.*` | **Supplied** — samosas at the counter (Gallery) |
| `photos/ice-cream-freezer.*`, `chocolate-freezer.*` | **Supplied** — freezers (Gallery) |
| `photos/interior-bench.*` | **Supplied** — “Inside the dining room” band on the home page + Gallery |
| `photos/interior-glass.*` | **Supplied** — evening room seen through the glass, home page + Gallery |
| `photos/shop.*` | **Supplied** — snack shelves, used in the dairy-counter band |
| `photos/offer-combo.*` | Offer cards (when you add a promo with a photo) |

The home page also has a **dairy-counter band** (ice cream, snacks, samosas).
Those three photos are named in `content.js → photos` as `freezer`, `shelves`
and `counter` — change the file name there and the band follows.

Every photo is listed in `content.js → gallery` with its `section` and
bilingual alt text, so the Gallery page renders itself. `section` can be
`exterior`, `interior`, `food` or `products` — those are the four headings, and
the outside/inside sets are framed in arches to echo the murals in the dining
room.

For **new** photos, drop the file into `assets/img/photos/` (any name) and add a
line in `content.js → gallery`:

```js
gallery: [
  { section: "interior",
    base: "assets/img/photos/interior-new",
    alt: { en: "Booth seating at Dairy Park",
           bn: "ডেয়ারি পার্কে বেঞ্চ আসন" } }
]
```

Keep alt text short and factual — it is read out by screen readers and is what
search engines index. Sections without photos show a designed “photograph
coming soon” tile.

**Tip:** export replacements as **WebP**, about 1400–1600 px on the long edge,
quality 75–82. That keeps the whole photo folder around 2–3 MB, so the site is
still quick on a phone.

## 2. Change the menu (`content.js`)

Menu items live in `content.js → menu`. Each item looks like this:

```js
{
  id: "dahi-vada",
  name: { en: "Dahi Vada", bn: "দই বড়া" },
  desc: { en: "Short description", bn: "সংক্ষিপ্ত বিবরণ" },
  category: "special",    // one of the ids in menuCategories below
  price: null,            // "₹40" once a price is confirmed
  veg: null,              // true = Veg, false = Non-veg, null = no label
  available: true,        // false shows "Not available right now"
  highlight: true,        // shows on the home page + featured row
  photo: "assets/img/photos/dahi-vada"
}
```

- **Add an item:** copy a block (from `{` to `},`) and paste it after the last
  one, then change the values. Keep the commas!
- **Categories:** the Food & Menu page shows only categories that have at least
  one item — an empty category never appears. Current ids: `special`, `chaat`,
  `momos`, `south`, `snacks`, `chinese`, `pizza`, `moglai`, `paneer`, `dal`,
  `chana`, `aloo`, `rice`, `roti`, `salad`, `papad`, `shakes`, `tea`,
  `icecream`. Rename the English + Bengali labels freely; keep the ids.
- **Price:** leave `null` until you have confirmed the price. The site shows
  “Ask for today’s price” — it never invents a number. Every price currently on
  the site is copied from the printed menu card in the Gallery, so when the
  card changes, change it here too.
- **Pure veg:** `business.pureVeg: true` turns on the “100% Pure Veg” seal and
  the ribbon in the hero, the pure-veg card on the home page and the 100% stat
  on the Food & Menu page. If the kitchen ever serves non-veg dishes, set it to
  `false` — the seal and the stat disappear and each dish shows its own
  Veg / Non-veg pill again.
- **Search & filters:** visitors can filter by category and search by name in
  either language — all driven by this same list. On the Food & Menu page the
  menu is printed as a dotted price list grouped by category, so a long card
  stays readable.
- **Highlights:** only items with `highlight: true` appear on the home page
  (six of them) and in the “Guest favourites” row. Keep that list short — it is
  the shop window, not the whole menu.

## 3. Opening hours (`content.js → hours`)

The Google listing only confirms a **10:30 PM closing time**, so the site
currently asks visitors to call. Once you have confirmed the full schedule:

```js
hours: {
  verified: true,
  closingTime: "10:30 PM",
  schedule: [
    { days: { en: "Mon – Sun", bn: "সোম – রবি" }, open: "11:00 AM", close: "10:30 PM" }
  ]
}
```

Set `verified: false` again if the timings change and you are not sure — the
“call to confirm” message comes back automatically.
Never enable `verified` for hours you have not checked.

## 4. Offers (`content.js → promos`)

The Special Offers page shows a friendly empty state while `promos: []` is
empty. To publish a genuine, currently-running offer:

```js
promos: [
  {
    id: "combo-1",
    active: true,
    badge: { en: "Combo", bn: "কম্বো" },
    title: { en: "Dahi Vada + Momo combo", bn: "দই বড়া + মোমো কম্বো" },
    desc:  { en: "Ask for the combo price at the counter.", bn: "কাউন্টারে কম্বোর দাম জেনে নিন।" },
    validity: { en: "Runs until further notice", bn: "পরবর্তী ঘোষণা পর্যন্ত" },
    conditions: { en: "Available at the counter only.", bn: "শুধু কাউন্টারে।" },
    photo: "assets/img/photos/offer-combo",   // optional
    cta:   { en: "Call to ask", bn: "কল করে জিজ্ঞাসা করুন" }
  }
]
```

Rules: no fake discounts, no fake countdowns, no “limited time” unless it is
true. When the offer ends, set `active: false` or delete the block.

## 5. Reviews (`content.js → reviews`)

The rating and review count are **hidden by default** because the live Google
listing has not yet been re-checked. **Check the live Google listing before
publishing** and update:

```js
reviews: { show: true, rating: 4.0, count: 204, sourceLabel: "Google Maps" }
```

Leave `show: false` until verified. Once confirmed, set `show: true` — the
rating cards, hero chips and the Reviews navigation links all appear
automatically. Setting it back to `false` hides every rating block, summary
and review link again. The Reviews page never copies customer quotes; it links
to the real reviews on Google. Ratings are deliberately **not** put into the
structured data (machine-readable SEO) because Google requires verified review
data there.

## 6. Contact details (`content.js → business`)

Update the phone, address, Maps listing link or directions link in one place.
The call buttons, footer, map and structured data all use those values.
If you change the domain (for example to `dairypark.com`), also update
`site.url` in `content.js` — canonicals, Open Graph URLs, structured data and
the generated `sitemap.xml` all follow it automatically.

## 7. Wording and Bengali translation (`assets/js/i18n.js`)

Every label exists twice: `en` (English) and `bn` (Bengali). Keep both sides in
sync — the build checks that every key exists in both languages. Business facts
(menu, prices, hours, offers, photos) live in `content.js`, not here.

## 8. Analytics (optional)

The site records clicks on call, directions, menu cards, promo links and the
language switch as first-party events (`window.dataLayer`). Nothing is sent
anywhere and no cookies are set until analytics is configured **and** a visitor
agrees:

```js
analytics: { enabled: true, ga4Id: "G-XXXXXXXXXX" }
```

A consent banner then appears. Visitors who decline load no analytics at all.
Measure only what you will act on — calls and direction taps are the useful
numbers for a restaurant.

## 9. Publishing changes

1. Edit the file on GitHub (pencil icon) or upload the photo directly.
2. Commit the change.
3. The “Build and deploy website” action runs automatically and publishes in
   about a minute. Check the **Actions** tab if something fails.

Run `npm test` locally if you want to see the same checks before publishing.

---

## Before you go live — owner checklist

- [ ] The owner portrait and six gallery photographs are already supplied —
      add an exterior photo when one is taken (`gallery/` section `exterior`).
- [ ] Confirm the Google rating and review count on the live listing, then set
      `reviews.show = true` only after checking (currently hidden).
- [ ] Add Dahi Vada / Steam Momo photographs (`photos/dahi-vada.*`,
      `photos/steam-momo.*`) and their confirmed descriptions.
- [ ] Confirm the full opening hours and set `hours.verified = true` only then.
- [ ] Confirm the phone number is still +91 99324 52124.
- [ ] Add prices only if you want them public.
- [ ] Add an offer only if it is genuinely running now.
- [ ] Confirm the Google listing still shows dine-in + drive-through.
- [ ] Never add WhatsApp ordering, delivery or online payment here unless those
      services really exist.

## What the site deliberately does not do

- It does not invent food prices, ratings, reviews, photographs, awards or
  hygiene claims.
- It does not offer online ordering, WhatsApp ordering, delivery or payments.
- It does not pretend the enquiry form sends messages — there is no backend;
  the form points visitors to your phone number instead.
- It does not show fake urgency or countdown timers.
- It does not track visitors without permission.
