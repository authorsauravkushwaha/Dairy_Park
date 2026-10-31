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
    show: true,
    rating: 4.0,
    count: 204,
    sourceLabel: "Google Maps"
  },

  /* ---------------------------------------------------------------------
     5. MENU
     Add, remove or edit items freely. Copy a block below and change it.
     price:  null      -> shows "Ask for today's price" (never invent a price)
             "₹40"     -> shows that price
     veg:    null      -> no vegetarian label shown
             true/false -> green "Veg" / red "Non-veg" label
     photo:  put an image in assets/img/photos/ and change the name here
             (no file extension — .webp, .jpg or .png all work)
     --------------------------------------------------------------------- */
  menu: [
    {
      id: "dahi-vada",
      name: { en: "Dahi Vada", bn: "দই বড়া" },
      desc: {
        en: "A classic Indian chaat — soft lentil dumplings served in whisked curd.",
        bn: "ক্লাসিক ভারতীয় চাট — নরম ডালের বড়া, ফেটানো দইয়ের সঙ্গে।"
      },
      price: null,
      veg: null,
      available: true,
      highlight: true,
      photo: "assets/img/photos/dahi-vada"
    },
    {
      id: "steam-momo",
      name: { en: "Steam Momo", bn: "স্টিম মোমো" },
      desc: {
        en: "Steamed dumplings served hot — a favourite street-food snack.",
        bn: "গরম গরম স্টিম করা মোমো — জনপ্রিয় স্ট্রিট-ফুড।"
      },
      price: null,
      veg: null,
      available: true,
      highlight: true,
      photo: "assets/img/photos/steam-momo"
    }
  ],

  /* ---------------------------------------------------------------------
     6. SPECIAL OFFERS  (hidden automatically while this list is empty)
     Only add a real, approved offer. No fake discounts, no fake deadlines.

     Example:
     promos: [
       {
         id: "combo-1",
         active: true,
         badge: { en: "Combo", bn: "কম্বো" },
         title: { en: "Dahi Vada + Momo combo", bn: "দই বড়া + মোমো কম্বো" },
         desc:  { en: "Ask for the combo price at the counter.", bn: "কাউন্টারে কম্বোর দাম জেনে নিন।" },
         cta:   { en: "Call to ask", bn: "কল করে জিজ্ঞাসা করুন" }
       }
     ],
     --------------------------------------------------------------------- */
  promos: [],

  /* ---------------------------------------------------------------------
     7. PHOTOS
     Upload the real photos into assets/img/photos/ using these names.
     The site picks up .webp, .avif, .jpg, .jpeg or .png automatically.
     Until a photo is uploaded, a designed placeholder is shown instead.
     --------------------------------------------------------------------- */
  photos: {
    owner: "assets/img/photos/owner", // owner photo — prominent hero portrait
    shop: "assets/img/photos/shop", // shop / storefront photo
    shopAlt: "assets/img/photos/shop-2" // optional second shop photo
  },

  /* ---------------------------------------------------------------------
     8. ANALYTICS (optional)
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
     9. SMALL NOTE SHOWN IN THE FOOTER
     --------------------------------------------------------------------- */
  footerNote: {
    en: "Menu highlights, facilities and rating are based on our Google Maps listing. Prices and timings can change — please call to confirm.",
    bn: "মেনুর উল্লেখযোগ্য পদ, সুবিধা ও রেটিং আমাদের গুগল ম্যাপ লিস্টিং অনুযায়ী। দাম ও সময় বদলাতে পারে — কল করে নিশ্চিত হয়ে নিন।"
  }
};
