# Owner guide — Dairy Park website

Everything routine can be changed without touching the design code.
You only edit two plain files, and upload photos. Then the website rebuilds
itself automatically (about a minute).

---

## 1. Add the restaurant photos (do this first)

Upload your real photos into `assets/img/photos/` (single-photo slots) and
`assets/img/photos/gallery/` (gallery slots). The site picks up `.jpg`,
`.jpeg`, `.png`, `.webp` and `.avif` automatically. Until a photo exists, a
designed placeholder is shown — nothing ever breaks, and no fake photograph is
ever used.

| File name | Where it shows |
| --- | --- |
| `photos/owner.*` | Homepage hero background + About page inset |
| `photos/shop.*` | About page main photo |
| `photos/shop-2.*` | (optional, spare slot) |
| `photos/dahi-vada.*` | Dahi Vada cards on Home + Food & Menu |
| `photos/steam-momo.*` | Steam Momo cards on Home + Food & Menu |
| `photos/offer-combo.*` | Offer cards (when you add a promo with a photo) |

Gallery photographs live in `assets/img/photos/gallery/` and are listed in
`content.js → gallery`. Add a line for each uploaded file:

```js
gallery: [
  { section: "exterior",
    base: "assets/img/photos/gallery/exterior-1",
    alt: { en: "Dairy Park shop front on Kolaghat – Jashar Road",
           bn: "কোলাঘাট–যশোর রোডে ডেয়ারি পার্কের সামনের দৃশ্য" } }
]
```

`section` can be `exterior`, `interior`, `food` or `products` — those are the
four headings on the Gallery page. Sections without photos show a designed
“photograph coming soon” tile.

**Tip:** crop photos landscape (at least 1200 px wide, 1600 px for the hero)
and keep each file under ~400 kB so phones load them quickly.

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
  one item. Proposed categories (Snacks, Chaat, Beverages, Ice Cream, Other…)
  stay hidden until you add an item that uses them — so never add an empty one
  to the website by accident. Category ids: `special`, `snacks`, `momos`,
  `chaat`, `beverages`, `icecream`, `other`.
- **Price:** leave `null` until you have confirmed the price. The site shows
  “Ask for today’s price” — it never invents a number.
- **Search & filters:** visitors can filter by category and search by name in
  either language — all driven by this same list.

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

The rating and review count came from the supplied Google listing. **Check the
live Google listing before publishing** and update:

```js
reviews: { show: true, rating: 4.0, count: 204, sourceLabel: "Google Maps" }
```

If you would rather not display a rating, set `show: false` — the rating
blocks disappear. The Reviews page never copies customer quotes; it links to
the real reviews on Google. Ratings are deliberately **not** put into the
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

- [ ] Upload `owner.jpg` (homepage background) and `shop.jpg`.
- [ ] Add real Gallery photographs to `assets/img/photos/gallery/` and list
      them in `content.js → gallery` (exterior, interior, food, products).
- [ ] Confirm the Google rating is still 4.0 from 204 reviews (or update it).
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
