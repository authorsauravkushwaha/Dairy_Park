/* =============================================================================
   DAIRY PARK — WEBSITE CONTENT (owner-editable)
   =============================================================================
   This is the ONLY file you normally need to edit. It is plain JavaScript so
   it can hold helpful comments. Rules:
     • Keep the quotes " " and the commas between items.
     • // marks a comment — the website ignores everything after it on that line.
     • After saving, refresh the website to see your changes.
     • Never add information you cannot verify (prices, hours, offers, claims).
   More help: OWNER-GUIDE.md
   ============================================================================= */

window.DP_CONTENT = {
  /* ---------------------------------------------------------------------
     1. SITE
     Change site.url if the address of the website changes (for example when
     dairypark.com is connected to it). Keep the trailing slash.
     --------------------------------------------------------------------- */
  site: {
    url: "https://authorsauravkushwaha.github.io/Dairy_Park/",
    defaultLang: "en" // "en" or "bn"
  },

  /* ---------------------------------------------------------------------
     2. BUSINESS DETAILS (verified)
     --------------------------------------------------------------------- */
  business: {
    name: "Dairy Park",
    nameBn: "ডেয়ারি পার্ক",
    category: { en: "Fast Food Restaurant", bn: "ফাস্ট-ফুড রেস্তোরাঁ" },

    // Address lines, as shown on the website and in the footer
    addressLines: {
      en: ["Kolaghat – Jashar Road", "Kolaghat, West Bengal 721134"],
      bn: ["কোলাঘাট – যশোর রোড", "কোলাঘাট, পশ্চিমবঙ্গ ৭২১১৩৪"]
    },

    // Structured address used for SEO (search engines read this English form)
    schemaAddress: {
      streetAddress: "Kolaghat - Jashar Road",
      addressLocality: "Kolaghat",
      addressRegion: "West Bengal",
      postalCode: "721134",
      addressCountry: "IN"
    },

    // Phone: "display" is what visitors see, "tel" is the number the phone dials
    phone: {
      display: "+91 99324 52124",
      tel: "+919932452124"
    },

    // Google Maps listing
    mapsUrl:
      "https://www.google.com/maps/place/Dairy+Park/@22.441782,87.8743655,17z/data=!3m1!4b1!4m6!3m5!1s0x3a0298420419a7f9:0x7076d2125261a325!8m2!3d22.441782!4d87.8769404",

    // One-tap directions straight to the exact pin on the Google listing
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=22.441782%2C87.8769404",

    mapEmbedUrl:
      "https://www.google.com/maps?q=Dairy+Park%2C+Kolaghat+-+Jashar+Rd%2C+Kolaghat%2C+West+Bengal+721134&z=16&hl=en&output=embed",

    // Exact pin from the Google Maps listing
    lat: 22.441782,
    lng: 87.8769404,

    // Spend range shown on the Google listing, in Indian Rupees per person
    spend: { min: 1, max: 200, currency: "₹" },

    // Facilities listed on Google. Remove a line only if the facility is gone.
    facilities: [
      { id: "dine-in", en: "Dine-in", bn: "ডাইন-ইন" },
      { id: "drive-through", en: "Drive-through", bn: "ড্রাইভ-থ্রু" }
    ]
  },

  /* ---------------------------------------------------------------------
     3. OPENING HOURS
     Only verified hours are shown. The Google listing shows a 10:30 PM
     closing time, but not the full weekly schedule — so the site currently
     asks visitors to call and confirm.

     Once YOU have confirmed the real timings, fill in the schedule like this
     and set verified to true:

     verified: true,
     schedule: [
       { days: { en: "Mon – Sun", bn: "সোম – রবি" }, open: "11:00 AM", close: "10:30 PM" }
     ],
     --------------------------------------------------------------------- */
  hours: {
    verified: false,
    closingTime: "10:30 PM", // shown only as "as listed on Google"
    schedule: [] // example above
  },

  /* ---------------------------------------------------------------------
     4. GOOGLE REVIEWS
     Figures supplied by the owner from the Google Maps listing.
     Re-check the listing before publishing, and update the numbers here if
     they have changed. Set show:false to hide the rating block entirely.
     --------------------------------------------------------------------- */
  reviews: {
    // Disabled until the live Google listing has been checked by the owner.
    // Set show: true only after verifying the rating and review count.
    show: false,
    rating: 4.0,
    count: 204,
    sourceLabel: "Google Maps"
  },

  /* ---------------------------------------------------------------------
     5. MENU CATEGORIES
     Proposed categories for the Food & Menu page. A category is HIDDEN
     automatically until it has at least one item in the menu list below —
     so empty categories never appear on the website.
     --------------------------------------------------------------------- */
  menuCategories: [
    { id: "special", name: { en: "Special Items", bn: "স্পেশাল আইটেম" } },
    { id: "snacks", name: { en: "Snacks", bn: "স্ন্যাকস" } },
    { id: "momos", name: { en: "Momos", bn: "মোমো" } },
    { id: "chaat", name: { en: "Chaat", bn: "চাট" } },
    { id: "beverages", name: { en: "Beverages", bn: "পানীয়" } },
    { id: "icecream", name: { en: "Ice Cream", bn: "আইসক্রিম" } },
    { id: "other", name: { en: "Other Items", bn: "অন্যান্য পণ্য" } }
  ],

  /* ---------------------------------------------------------------------
     6. MENU ITEMS
     Add, remove or edit items freely. Copy a block below and change it.
     category:   must be one of the category ids above. Categories with no
                 items stay hidden.
     price:      null      -> shows "Ask for today's price" (never invent a price)
                 "₹40"     -> shows that price
     veg:        null      -> no vegetarian label shown
                 true/false -> green "Veg" / red "Non-veg" label
     available:  false     -> shows "Not available right now"
     highlight:  true      -> shown as a menu highlight on the home page
                 and the featured row of the Food & Menu page
     photo:      put an image in assets/img/photos/ and change the name here
                 (no file extension — .webp, .jpg or .png all work)
     tag:        short gold ribbon on the photo, e.g. "Signature".
                 Set to null (or delete the line) for no ribbon.
     badges:     optional ticked lines under the name, e.g.
                 [ { en: "Served with chutney", bn: "চাটনি সঙ্গে" } ]
                 Leave empty until you have confirmed each line — the site
                 shows nothing at all while the list is empty.
     --------------------------------------------------------------------- */
  menu: [
    {
      id: "dahi-vada",
      name: { en: "Dahi Vada", bn: "দই বড়া" },
      // Keep descriptions blank until the owner confirms ingredients/details.
      desc: { en: "", bn: "" },
      category: "special",
      price: null,
      veg: null,
      available: true,
      highlight: true,
      tag: { en: "Signature", bn: "সিগনেচার" },
      badges: [],
      photo: "assets/img/photos/dahi-vada"
    },
    {
      id: "steam-momo",
      name: { en: "Steam Momo", bn: "স্টিম মোমো" },
      // Keep descriptions blank until the owner confirms ingredients/details.
      desc: { en: "", bn: "" },
      category: "momos",
      price: null,
      veg: null,
      available: true,
      highlight: true,
      tag: { en: "Steamed", bn: "স্টিম করা" },
      badges: [],
      photo: "assets/img/photos/steam-momo"
    }
  ],

  /* ---------------------------------------------------------------------
     6b. THE "ORDER BOTH" STRIP (under the menu on the home page)
     A gentle nudge to try both highlights. No prices, no invented claims.
     Set show: false to hide the whole strip.
     --------------------------------------------------------------------- */
  pairing: {
    show: true,
    eyebrow: { en: "The regular's order", bn: "নিয়মিতদের অর্ডার" },
    title: { en: "One plate each. Share the table.", bn: "একটি করে প্লেট। টেবিল ভাগ করে নিন।" },
    desc: {
      en: "Dahi Vada for the cool bite, Steam Momo for the hot one. Plenty of people order both — ask for them together at the counter.",
      bn: "ঠান্ডা স্বাদের জন্য দই বড়া, গরম স্বাদের জন্য স্টিম মোমো। অনেকেই দুটোই নেন — কাউন্টারে একসঙ্গে চেয়ে নিন।"
    },
    cta: { en: "Call to order both", bn: "দুটোই অর্ডার করতে কল করুন" }
  },

  /* ---------------------------------------------------------------------
     7. SPECIAL OFFERS
     The Special Offers page shows a friendly empty state while this list
     is empty. Only add a real, approved offer — no fake discounts, no fake
     deadlines.

     Example:
     promos: [
       {
         id: "combo-1",
         active: true,
         badge: { en: "Combo", bn: "কম্বো" },
         title: { en: "Dahi Vada + Momo combo", bn: "দই বড়া + মোমো কম্বো" },
         desc:  { en: "Ask for the combo price at the counter.", bn: "কাউন্টারে কম্বোর দাম জেনে নিন।" },
         validity: { en: "Runs until further notice", bn: "পরবর্তী ঘোষণা পর্যন্ত" },
         conditions: { en: "Available at the counter only.", bn: "শুধু কাউন্টারে।" },
         photo: "assets/img/photos/offer-combo",   // optional, same rules as menu photos
         cta:   { en: "Call to ask", bn: "কল করে জিজ্ঞাসা করুন" }
       }
     ],
     --------------------------------------------------------------------- */
  promos: [],

  /* ---------------------------------------------------------------------
     8. GALLERY PHOTOGRAPHS
     Upload real photographs of Dairy Park into assets/img/photos/gallery/
     and list them here. section: "exterior" | "interior" | "food" |
     "products". Slots without an uploaded file show a designed placeholder,
     never a fake photograph. The site picks up .webp, .avif, .jpg, .jpeg
     or .png automatically.

     Example:
     { section: "exterior", base: "assets/img/photos/gallery/exterior-1",
       alt: { en: "Dairy Park shop front on Kolaghat – Jashar Road",
              bn: "কোলাঘাট–যশোর রোডে ডেয়ারি পার্কের সামনের দৃশ্য" } }
     --------------------------------------------------------------------- */
  gallery: [
    { section: "interior",
      base: "assets/img/photos/shop",
      alt: { en: "Dairy Park shop interior", bn: "ডেয়ারি পার্কের দোকানের ভিতর" } },
    { section: "food",
      base: "assets/img/photos/menu-spread-1",
      alt: { en: "A spread from the Dairy Park counter", bn: "ডেয়ারি পার্ক কাউন্টারের খাবারের ছড়া" } },
    { section: "food",
      base: "assets/img/photos/menu-spread-2",
      alt: { en: "More from the Dairy Park menu counter", bn: "ডেয়ারি পার্কের মেনু কাউন্টার থেকে আরও" } },
    { section: "food",
      base: "assets/img/photos/menu-drinks",
      alt: { en: "Drinks at Dairy Park", bn: "ডেয়ারি পার্কের পানীয়" } },
    { section: "products",
      base: "assets/img/photos/counter-snacks",
      alt: { en: "Snacks at the counter", bn: "কাউন্টারের স্ন্যাকস" } },
    { section: "products",
      base: "assets/img/photos/ice-cream-freezer",
      alt: { en: "Ice-cream freezer", bn: "আইসক্রিমের ফ্রিজার" } },
    { section: "products",
      base: "assets/img/photos/chocolate-freezer",
      alt: { en: "Chocolate selection", bn: "চকলেটের সংগ্রহ" } }
  ],

  /* ---------------------------------------------------------------------
     9. PHOTOS (single-photo slots)
     Upload the real photos into assets/img/photos/ using these names.
     The site picks up .webp, .avif, .jpg, .jpeg or .png automatically.
     Until a photo is uploaded, a designed placeholder is shown instead.
     --------------------------------------------------------------------- */
  photos: {
    owner: "assets/img/photos/owner", // real owner portrait — homepage hero
    shop: "assets/img/photos/shop", // real shop interior — About page
    shopAlt: "assets/img/photos/counter-snacks", // snacks at the counter
    freezer: "assets/img/photos/ice-cream-freezer",
    chocolate: "assets/img/photos/chocolate-freezer"
  },

  /* ---------------------------------------------------------------------
     10. ANALYTICS (optional)
     The site already records clicks (call, directions, menu, language) as
     events. To send them to Google Analytics 4, paste your Measurement ID
     and set enabled: true. A consent banner appears automatically and no
     analytics loads until the visitor agrees.
     --------------------------------------------------------------------- */
  analytics: {
    enabled: false,
    ga4Id: "" // e.g. "G-XXXXXXXXXX"
  },

  /* ---------------------------------------------------------------------
     11. SMALL NOTE SHOWN IN THE FOOTER
     --------------------------------------------------------------------- */
  footerNote: {
    en: "Menu highlights, facilities and rating are based on our Google Maps listing. Prices and timings can change — please call to confirm.",
    bn: "মেনুর উল্লেখযোগ্য পদ, সুবিধা ও রেটিং আমাদের গুগল ম্যাপ লিস্টিং অনুযায়ী। দাম ও সময় বদলাতে পারে — কল করে নিশ্চিত হয়ে নিন।"
  }
};
