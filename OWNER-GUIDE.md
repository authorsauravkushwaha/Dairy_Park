# Owner guide — Dairy Park website

Everything routine can be changed without touching the design code.
You only edit two plain files, and upload photos. Then the website rebuilds
itself automatically (about a minute).

---

## 1. Add the owner + shop photos (do this first)

1. Open the folder `assets/img/photos/`.
2. Upload your real photos with these exact names:

| File name | Where it shows |
| --- | --- |
| `owner.jpg` (or `.webp` / `.png`) | Full-screen background of the homepage |
| `shop.jpeg` | “Inside Dairy Park” gallery |
| `counter-snacks.jpeg`, `ice-cream-freezer.jpeg`, `chocolate-freezer.jpeg` | Other owner-supplied gallery photos |
| `dahi-vada.jpg` | Dahi Vada menu card |
| `steam-momo.jpg` | Steam Momo menu card |

The site detects the file automatically — `.jpg`, `.jpeg`, `.png`, `.webp` and
`.avif` all work. Until a photo exists, a designed placeholder is shown, so
nothing ever breaks.

**Tip:** the supplied owner portrait is already used as the home-page background.
For replacements, keep images compressed (around 400 kB or less) so phones load
quickly; portrait orientation works well on mobile.

---

## 2. Change the menu (`content.js`)

Open `content.js` and find the `menu: [` list. Each item looks like this:

```js
{
  id: "dahi-vada",
  name: { en: "Dahi Vada", bn: "দই বড়া" },
  desc: { en: "Short description", bn: "সংক্ষিপ্ত বিবরণ" },
  price: null,          // "₹40" once a price is confirmed
  veg: null,            // true = Veg, false = Non-veg, null = no label
  available: true,      // false shows "Not available right now"
  highlight: true,      // shows the "Menu highlight" tag
  photo: "assets/img/photos/dahi-vada"
}
```

- **Add an item:** copy a block (from `{` to `},`) and paste it after the last
  one, then change the values. Keep the commas!
- **Remove an item:** delete its whole block, again keeping commas valid.
- **Price:** leave `null` until you have confirmed the price. The site shows
  “Ask for today’s price” — it never invents a number.
- The last item must not have a comma after its closing `}`.

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

While `promos: []` is empty, the offers section and its menu links are hidden
completely. To publish a genuine, currently-running offer, add a block from the
comment inside `content.js` and set `active: true`.

Rules: no fake discounts, no fake countdowns, no “limited time” unless it is
true. When the offer ends, set `active: false` or delete the block.

## 5. Reviews (`content.js → reviews`)

The rating and review count are hidden by default because the live listing has
not yet been re-checked. **Check the live Google listing before publishing**
and update:

```js
reviews: { show: true, rating: 4.0, count: 204, sourceLabel: "Google Maps" }
```

Leave `show: false` until verified. Once confirmed, set `show: true`; setting it
back to `false` hides the entire reviews block, summaries and navigation links. Ratings are deliberately **not** put into the structured data
(machine-readable SEO) because Google requires verified review data there.

## 6. Contact details (`content.js → business`)

Update the phone, address, Maps listing link or directions link in one place.
The call buttons, footer, map and structured data all use those values.
If you change the domain (for example to `dairypark.com`), also update
`site.url`, the canonical/Open Graph URLs in `index.html`, and
`sitemap.xml` + `robots.txt`.

## 7. Wording and Bengali translation (`assets/js/i18n.js`)

Every label exists twice: `en` (English) and `bn` (Bengali). Keep both sides in
sync — the build checks that every key exists in both languages. Business facts
(menu, prices, hours, offers) live in `content.js`, not here.

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
- [ ] Confirm the Google rating is still 4.0 from 204 reviews (or update it).
- [ ] Confirm the full opening hours and set `hours.verified = true` only then.
- [ ] Confirm the phone number is still +91 99324 52124.
- [ ] Add prices only if you want them public.
- [ ] Add an offer only if it is genuinely running now.
- [ ] Confirm the Google listing still shows dine-in + drive-through.
- [ ] Never add WhatsApp ordering, delivery or online payment here unless those
      services really exist.

## What the site deliberately does not do

- It does not invent food prices, ratings, reviews, awards or hygiene claims.
- It does not offer online ordering, WhatsApp ordering, delivery or payments.
- It does not show fake urgency or countdown timers.
- It does not track visitors without permission.
