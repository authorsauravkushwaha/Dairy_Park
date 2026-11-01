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
| `photos/owner.*` | **Supplied** — large portrait in the homepage hero + About page inset |
| `photos/shop.*` | **Supplied** — shop interior (About page + Gallery) |
| `photos/counter-snacks.*` | **Supplied** — snacks at the counter (Gallery) |
| `photos/ice-cream-freezer.*` | **Supplied** — ice-cream freezer (Gallery) |
| `photos/chocolate-freezer.*` | **Supplied** — chocolate selection (Gallery) |
| `photos/menu-spread-1.*`, `menu-spread-2.*` | **Supplied** — menu-counter shots (Gallery) |
| `photos/menu-drinks.*` | **Supplied** — drinks (Gallery) |
| `photos/dahi-vada.*` | Dahi Vada cards on Home + Food & Menu (not yet supplied) |
| `photos/steam-momo.*` | Steam Momo cards on Home + Food & Menu (not yet supplied) |
| `photos/offer-combo.*` | Offer cards (when you add a promo with a photo) |

The seven supplied photographs are already wired up in `content.js → gallery`,
so the About page and Gallery show real photos today. For **new** gallery
photos, drop the file into `assets/img/photos/gallery/` (any name) and add a
line in `content.js → gallery`:

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

**Tip:** the supplied owner portrait works as the hero backdrop and the large
portrait frame (portrait orientation suits it). For replacements, keep files
around ~400 kB or less so phones load them quickly.

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

## 7. Enquiries on WhatsApp (`content.js → whatsapp`)

When a visitor fills the enquiry form on the Contact page, the website does
two things: it opens WhatsApp on the visitor's own phone, and it types the
whole enquiry into a chat addressed to **your** WhatsApp number — name, phone
number and the question. The visitor only has to tap **Send** in WhatsApp, and
the enquiry then arrives on your phone like any other WhatsApp message.

The website never sends anything by itself and needs no server, no API key and
no monthly service.

```js
whatsapp: {
  enabled: true,             // false hides every WhatsApp button on the site
  number: "919932452124",    // country code + number, DIGITS ONLY
  template: {
    en: "New enquiry from the Dairy Park website\n\nName: {name}\nPhone: {phone}\nEnquiry: {message}",
    bn: "…Bengali version…"
  }
}
```

- **Put your own WhatsApp number in `number`** — country code first, no `+`,
  no spaces, no dashes (India: `91` + the 10-digit number). It is currently the
  same number as the shop phone.
- If your WhatsApp is on a different number than the shop phone, change only
  this line — the contact card, the form's status panel and the prefilled
  enquiry all follow it.
- The wording of the ready-made message is in `template`. Keep the
  `{name}`, `{phone}` and `{message}` placeholders exactly as they are — they
  are replaced with what the visitor typed. The English text is used when the
  visitor reads the site in English, the Bengali text when they switch to
  বাংলা.
- Set `enabled: false` and the WhatsApp card, buttons and wording disappear and
  the form goes back to pointing visitors at your phone number.

The site never claims a message was delivered before the visitor taps Send, and
it does not advertise WhatsApp ordering, delivery or payment — only enquiries.

## 8. Wording and Bengali translation (`assets/js/i18n.js`)

Every label exists twice: `en` (English) and `bn` (Bengali). Keep both sides in
sync — the build checks that every key exists in both languages. Business facts
(menu, prices, hours, offers, photos) live in `content.js`, not here.

## 9. Analytics (optional)

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

## 10. Publishing changes

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
- [ ] Check `whatsapp.number` is the phone that has WhatsApp installed — send
      yourself a test enquiry from the live Contact page.
- [ ] Add prices only if you want them public.
- [ ] Add an offer only if it is genuinely running now.
- [ ] Confirm the Google listing still shows dine-in + drive-through.
- [ ] Never advertise WhatsApp ordering, delivery or online payment here unless
      those services really exist. (WhatsApp *enquiries* are fine — that is what
      the contact form does.)

## What the site deliberately does not do

- It does not invent food prices, ratings, reviews, photographs, awards or
  hygiene claims.
- It does not offer online ordering, delivery or payments, and it never
  advertises WhatsApp ordering.
- It does not pretend an enquiry was delivered. The enquiry form writes the
  message into WhatsApp addressed to your number; the visitor taps Send, and
  the site says plainly that nothing reaches you until they do.
- It does not show fake urgency or countdown timers.
- It does not track visitors without permission.
