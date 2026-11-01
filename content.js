/* =============================================================================
   DAIRY PARK — WEBSITE CONTENT (owner-editable)
   =============================================================================
   This is the ONLY file you normally need to edit. It is plain JavaScript so
   it can hold helpful comments. Rules:
     • Keep the quotes " " and the commas between items.
     • // marks a comment — the website ignores everything after it on that line.
     • After saving, refresh the website to see your changes.
     • Never add information you cannot verify.
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
    // The printed menu covers North Indian, Chinese and snacks — and the shop
    // sells dairy products and sweets too, hence the name.
    category: { en: "Family Restaurant", bn: "পারিবারিক রেস্তোরাঁ" },

    // The signboard outside reads "DAIRY PARK — PURE VEG RESTAURANT", and the
    // printed menu lists no non-vegetarian dishes. This powers the Pure Veg
    // seal and the vegetarian filter across the site.
    pureVeg: true,

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
      { id: "drive-through", en: "Drive-through", bn: "ড্রাইভ-থ্রু" },
      { id: "pure-veg", en: "Pure veg", bn: "নিরামিষ" }
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
     The order here is the order of the category chips on the Food & Menu
     page. A category is HIDDEN automatically until it has at least one item
     in the menu list below — so empty categories never appear.
     --------------------------------------------------------------------- */
  menuCategories: [
    { id: "special", name: { en: "Signature Plates", bn: "সিগনেচার প্লেট" } },
    { id: "chaat", name: { en: "Chaat & Chola", bn: "চাট ও ছোলা" } },
    { id: "momos", name: { en: "Momos", bn: "মোমো" } },
    { id: "south", name: { en: "Idli & Vada", bn: "ইডলি ও বড়া" } },
    { id: "snacks", name: { en: "Snacks & Fries", bn: "স্ন্যাকস ও ফ্রাই" } },
    { id: "chinese", name: { en: "Chinese", bn: "চাইনিজ" } },
    { id: "pizza", name: { en: "Pizza", bn: "পিজ্জা" } },
    { id: "moglai", name: { en: "Moglai & Rolls", bn: "মোগলাই ও রোল" } },
    { id: "paneer", name: { en: "Paneer & Veg", bn: "পনির ও ভেজ" } },
    { id: "dal", name: { en: "Dal & Tarka", bn: "ডাল ও তরকা" } },
    { id: "chana", name: { en: "Chana", bn: "ছানা" } },
    { id: "aloo", name: { en: "Aloo", bn: "আলু" } },
    { id: "rice", name: { en: "Rice & Biryani", bn: "ভাত ও বিরিয়ানি" } },
    { id: "roti", name: { en: "Roti & Paratha", bn: "রুটি ও পরোটা" } },
    { id: "salad", name: { en: "Salad & Raita", bn: "সালাদ ও রাইতা" } },
    { id: "papad", name: { en: "Papad", bn: "পাপড়" } },
    { id: "shakes", name: { en: "Shakes & Lassi", bn: "শেক ও লাস্যি" } },
    { id: "tea", name: { en: "Tea & Coffee", bn: "চা ও কফি" } },
    { id: "icecream", name: { en: "Ice Cream & Dairy", bn: "আইসক্রিম ও ডেইরি" } }
  ],

  /* ---------------------------------------------------------------------
     6. MENU ITEMS
     Every item and price below is copied from the printed Dairy Park menu
     card (the two photographs in the Gallery). Add, remove or edit items
     freely. Copy a block below and change it.

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
    /* ---- SIGNATURE PLATES (home-page highlights) ---- */
    {
      id: "dahi-vada",
      name: { en: "Dahi Vada", bn: "দই বড়া" },
      desc: { en: "", bn: "" },
      category: "special",
      price: "₹80",
      veg: true,
      available: true,
      highlight: true,
      tag: { en: "Signature", bn: "সিগনেচার" },
      badges: [],
      photo: "assets/img/photos/dahi-vada"
    },
    {
      id: "chola-bhatura",
      name: { en: "Chola Bhatura", bn: "ছোলা ভাটুরা" },
      desc: { en: "", bn: "" },
      category: "special",
      price: "₹120",
      veg: true,
      available: true,
      highlight: true,
      tag: { en: "Most ordered", bn: "সবচেয়ে জনপ্রিয়" },
      badges: []
    },
    {
      id: "steam-momo",
      name: { en: "Steam Momo", bn: "স্টিম মোমো" },
      desc: { en: "", bn: "" },
      category: "momos",
      price: null,
      veg: null,
      available: true,
      highlight: true,
      tag: { en: "Steamed", bn: "স্টিম করা" },
      badges: [],
      photo: "assets/img/photos/steam-momo"
    },
    {
      id: "paneer-butter-masala",
      name: { en: "Paneer Butter Masala", bn: "পনির বাটার মসলা" },
      desc: { en: "", bn: "" },
      category: "paneer",
      price: "₹180",
      veg: true,
      available: true,
      highlight: true,
      tag: { en: "Chef's pick", bn: "শেফের পছন্দ" },
      badges: []
    },
    {
      id: "veg-chowmein",
      name: { en: "Veg Chowmein", bn: "ভেজ চাউমিন" },
      desc: { en: "", bn: "" },
      category: "chinese",
      price: "₹70",
      veg: true,
      available: true,
      highlight: true,
      tag: { en: "Under ₹100", bn: "₹১০০র নিচে" },
      badges: []
    },
    {
      id: "cold-coffee-icecream",
      name: { en: "Cold Coffee with Ice Cream", bn: "কোল্ড কফি উইথ আইসক্রিম" },
      desc: { en: "", bn: "" },
      category: "shakes",
      price: "₹160",
      veg: true,
      available: true,
      highlight: true,
      tag: { en: "Chilled", bn: "ঠান্ডা" },
      badges: []
    },

    /* ---- CHAAT & CHOLA ---- */
    {
      id: "papdi-chaat",
      name: { en: "Papdi Chaat", bn: "পাপড়ি চাট" },
      desc: { en: "", bn: "" },
      category: "chaat",
      price: "₹90",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "chola-tikia",
      name: { en: "Chola Tikia", bn: "ছোলা টিকিয়া" },
      desc: { en: "", bn: "" },
      category: "chaat",
      price: "₹110",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "masala-dahi",
      name: { en: "Masala Dahi", bn: "মসলা দই" },
      desc: { en: "", bn: "" },
      category: "chaat",
      price: "₹50",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },

    /* ---- IDLI & VADA ---- */
    {
      id: "idli",
      name: { en: "Idli", bn: "ইডলি" },
      desc: { en: "", bn: "" },
      category: "south",
      price: "₹20",
      veg: true,
      available: true,
      tag: { en: "From ₹20", bn: "₹২০ থেকে" },
      badges: []
    },
    {
      id: "fried-idli",
      name: { en: "Fried Idli", bn: "ফ্রাইড ইডলি" },
      desc: { en: "", bn: "" },
      category: "south",
      price: "₹90",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "butter-fried-idli",
      name: { en: "Butter Fried Idli", bn: "বাটার ফ্রাইড ইডলি" },
      desc: { en: "", bn: "" },
      category: "south",
      price: "₹110",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "dahi-idli",
      name: { en: "Dahi Idli", bn: "দই ইডলি" },
      desc: { en: "", bn: "" },
      category: "south",
      price: "₹80",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "sambar-vada",
      name: { en: "Sambar Vada", bn: "সাম্বার বড়া" },
      desc: { en: "", bn: "" },
      category: "south",
      price: "₹40",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },

    /* ---- SNACKS & FRIES ---- */
    {
      id: "chinese-singara",
      name: { en: "Chinese Singara", bn: "চাইনিজ সিঙাড়া" },
      desc: { en: "", bn: "" },
      category: "snacks",
      price: "₹50",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "cutlet",
      name: { en: "Cutlet", bn: "কাটলেট" },
      desc: { en: "", bn: "" },
      category: "snacks",
      price: "₹60",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "veg-pakora",
      name: { en: "Veg Pakora", bn: "ভেজ পাকোড়া" },
      desc: { en: "", bn: "" },
      category: "snacks",
      price: "₹130",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "onion-pakora",
      name: { en: "Onion Pakora", bn: "পেঁয়াজ পাকোড়া" },
      desc: { en: "", bn: "" },
      category: "snacks",
      price: "₹130",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "paneer-pakora",
      name: { en: "Paneer Pakora", bn: "পনির পাকোড়া" },
      desc: { en: "", bn: "" },
      category: "snacks",
      price: "₹170",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "french-fries",
      name: { en: "French Fries", bn: "ফ্রেঞ্চ ফ্রাই" },
      desc: { en: "", bn: "" },
      category: "snacks",
      price: "₹100",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "cheese-fries",
      name: { en: "Cheese French Fries", bn: "চিজ ফ্রেঞ্চ ফ্রাই" },
      desc: { en: "", bn: "" },
      category: "snacks",
      price: "₹120",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },

    /* ---- CHINESE ---- */
    {
      id: "paneer-chowmein",
      name: { en: "Paneer Chowmein", bn: "পনির চাউমিন" },
      desc: { en: "", bn: "" },
      category: "chinese",
      price: "₹100",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "special-mix-chowmein",
      name: { en: "Special Mix Chowmein", bn: "স্পেশাল মিক্স চাউমিন" },
      desc: { en: "", bn: "" },
      category: "chinese",
      price: "₹160",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "potato-chilli",
      name: { en: "Potato Chilli", bn: "পটেটো চিলি" },
      desc: { en: "", bn: "" },
      category: "chinese",
      price: "₹110",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "chilli-paneer",
      name: { en: "Chilli Paneer", bn: "চিলি পনির" },
      desc: { en: "", bn: "" },
      category: "chinese",
      price: "₹190",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "chilli-babycorn",
      name: { en: "Chilli Babycorn", bn: "চিলি বেবিকর্ন" },
      desc: { en: "", bn: "" },
      category: "chinese",
      price: "₹230",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "chilli-mushroom",
      name: { en: "Chilli Mushroom", bn: "চিলি মাশরুম" },
      desc: { en: "", bn: "" },
      category: "chinese",
      price: "₹260",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },

    /* ---- PIZZA ---- */
    {
      id: "veg-pizza",
      name: { en: "Veg Pizza", bn: "ভেজ পিজ্জা" },
      desc: { en: "", bn: "" },
      category: "pizza",
      price: "₹210",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "double-cheese-pizza",
      name: { en: "Double Cheese Pizza", bn: "ডাবল চিজ পিজ্জা" },
      desc: { en: "", bn: "" },
      category: "pizza",
      price: "₹230",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "paneer-pizza",
      name: { en: "Paneer Pizza", bn: "পনির পিজ্জা" },
      desc: { en: "", bn: "" },
      category: "pizza",
      price: "₹260",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "double-cheese-paneer-pizza",
      name: { en: "Double Cheese Paneer Pizza", bn: "ডাবল চিজ পনির পিজ্জা" },
      desc: { en: "", bn: "" },
      category: "pizza",
      price: "₹310",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },

    /* ---- MOGLAI & ROLLS ---- */
    {
      id: "veg-moglai",
      name: { en: "Veg Moglai", bn: "ভেজ মোগলাই" },
      desc: { en: "", bn: "" },
      category: "moglai",
      price: "₹100",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "paneer-moglai",
      name: { en: "Paneer Moglai", bn: "পনির মোগলাই" },
      desc: { en: "", bn: "" },
      category: "moglai",
      price: "₹130",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "veg-roll",
      name: { en: "Veg Roll", bn: "ভেজ রোল" },
      desc: { en: "", bn: "" },
      category: "moglai",
      price: "₹60",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "paneer-roll",
      name: { en: "Paneer Roll", bn: "পনির রোল" },
      desc: { en: "", bn: "" },
      category: "moglai",
      price: "₹90",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },

    /* ---- PANEER & VEG ---- */
    {
      id: "paneer-masala",
      name: { en: "Paneer Masala", bn: "পনির মসলা" },
      desc: { en: "", bn: "" },
      category: "paneer",
      price: "₹190",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "shahi-paneer",
      name: { en: "Shahi Paneer", bn: "শাহি পনির" },
      desc: { en: "", bn: "" },
      category: "paneer",
      price: "₹220",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "kadai-paneer",
      name: { en: "Kadai Paneer", bn: "কড়াই পনির" },
      desc: { en: "", bn: "" },
      category: "paneer",
      price: "₹230",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "matar-paneer",
      name: { en: "Matar Paneer", bn: "মটর পনির" },
      desc: { en: "", bn: "" },
      category: "paneer",
      price: "₹190",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "paneer-do-pyasa",
      name: { en: "Paneer Do Pyasa", bn: "পনির দো পিয়াজা" },
      desc: { en: "", bn: "" },
      category: "paneer",
      price: "₹220",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "mix-veg",
      name: { en: "Mix Veg", bn: "মিক্স ভেজ" },
      desc: { en: "", bn: "" },
      category: "paneer",
      price: "₹140",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },

    /* ---- DAL & TARKA ---- */
    {
      id: "dal-fry",
      name: { en: "Dal Fry", bn: "ডাল ফ্রাই" },
      desc: { en: "", bn: "" },
      category: "dal",
      price: "₹80",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "butter-dal-fry",
      name: { en: "Butter Dal Fry", bn: "বাটার ডাল ফ্রাই" },
      desc: { en: "", bn: "" },
      category: "dal",
      price: "₹110",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "dal-makhani",
      name: { en: "Dal Makhani", bn: "ডাল মাখানি" },
      desc: { en: "", bn: "" },
      category: "dal",
      price: "₹160",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "plain-tarka",
      name: { en: "Plain Tarka", bn: "প্লেন তরকা" },
      desc: { en: "", bn: "" },
      category: "dal",
      price: "₹80",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "butter-tarka",
      name: { en: "Butter Tarka", bn: "বাটার তরকা" },
      desc: { en: "", bn: "" },
      category: "dal",
      price: "₹110",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "paneer-tarka",
      name: { en: "Paneer Tarka", bn: "পনির তরকা" },
      desc: { en: "", bn: "" },
      category: "dal",
      price: "₹140",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "chana-tarka",
      name: { en: "Chana Tarka", bn: "ছানা তরকা" },
      desc: { en: "", bn: "" },
      category: "dal",
      price: "₹120",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },

    /* ---- CHANA ---- */
    {
      id: "chana-masala",
      name: { en: "Chana Masala", bn: "ছানা মসলা" },
      desc: { en: "", bn: "" },
      category: "chana",
      price: "₹110",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "butter-chana-masala",
      name: { en: "Butter Chana Masala", bn: "বাটার ছানা মসলা" },
      desc: { en: "", bn: "" },
      category: "chana",
      price: "₹140",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "punjabi-chana-masala",
      name: { en: "Punjabi Chana Masala", bn: "পাঞ্জাবি ছানা মসলা" },
      desc: { en: "", bn: "" },
      category: "chana",
      price: "₹180",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },

    /* ---- ALOO ---- */
    {
      id: "aloo-dum",
      name: { en: "Aloo Dum", bn: "আলু দম" },
      desc: { en: "", bn: "" },
      category: "aloo",
      price: "₹90",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "butter-aloo-dum",
      name: { en: "Butter Aloo Dum", bn: "বাটার আলু দম" },
      desc: { en: "", bn: "" },
      category: "aloo",
      price: "₹110",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "kashmiri-aloo-dum",
      name: { en: "Kashmiri Aloo Dum", bn: "কাশ্মীরি আলু দম" },
      desc: { en: "", bn: "" },
      category: "aloo",
      price: "₹140",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },

    /* ---- RICE & BIRYANI ---- */
    {
      id: "plain-rice",
      name: { en: "Plain Rice", bn: "প্লেন ভাত" },
      desc: { en: "", bn: "" },
      category: "rice",
      price: "₹60",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "jeera-rice",
      name: { en: "Jeera Rice", bn: "জিরা ভাত" },
      desc: { en: "", bn: "" },
      category: "rice",
      price: "₹70",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "fried-rice",
      name: { en: "Fried Rice", bn: "ফ্রায়েড রাইস" },
      desc: { en: "", bn: "" },
      category: "rice",
      price: "₹110",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "veg-pulao",
      name: { en: "Veg Pulao", bn: "ভেজ পোলাও" },
      desc: { en: "", bn: "" },
      category: "rice",
      price: "₹110",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "paneer-pulao",
      name: { en: "Paneer Pulao", bn: "পনির পোলাও" },
      desc: { en: "", bn: "" },
      category: "rice",
      price: "₹140",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "aloo-biryani",
      name: { en: "Aloo Biryani", bn: "আলু বিরিয়ানি" },
      desc: { en: "", bn: "" },
      category: "rice",
      price: "₹110",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "veg-biryani",
      name: { en: "Veg Biryani", bn: "ভেজ বিরিয়ানি" },
      desc: { en: "", bn: "" },
      category: "rice",
      price: "₹140",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },

    /* ---- ROTI & PARATHA ---- */
    {
      id: "roti",
      name: { en: "Roti", bn: "রুটি" },
      desc: { en: "", bn: "" },
      category: "roti",
      price: "₹9",
      veg: true,
      available: true,
      tag: { en: "From ₹9", bn: "₹৯ থেকে" },
      badges: []
    },
    {
      id: "plain-paratha",
      name: { en: "Plain Paratha", bn: "প্লেন পরোটা" },
      desc: { en: "", bn: "" },
      category: "roti",
      price: "₹35",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "aloo-paratha",
      name: { en: "Aloo Paratha", bn: "আলু পরোটা" },
      desc: { en: "", bn: "" },
      category: "roti",
      price: "₹70",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "paneer-paratha",
      name: { en: "Paneer Paratha", bn: "পনির পরোটা" },
      desc: { en: "", bn: "" },
      category: "roti",
      price: "₹110",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "lachha-paratha",
      name: { en: "Lachha Paratha", bn: "লাচ্ছা পরোটা" },
      desc: { en: "", bn: "" },
      category: "roti",
      price: "₹70",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },

    /* ---- SALAD & RAITA ---- */
    {
      id: "onion-salad",
      name: { en: "Onion Salad", bn: "পেঁয়াজ সালাদ" },
      desc: { en: "", bn: "" },
      category: "salad",
      price: "₹50",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "green-salad",
      name: { en: "Green Salad", bn: "গ্রিন সালাদ" },
      desc: { en: "", bn: "" },
      category: "salad",
      price: "₹60",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "family-salad",
      name: { en: "Family Salad", bn: "ফ্যামিলি সালাদ" },
      desc: { en: "", bn: "" },
      category: "salad",
      price: "₹90",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "onion-raita",
      name: { en: "Onion Raita", bn: "পেঁয়াজ রাইতা" },
      desc: { en: "", bn: "" },
      category: "salad",
      price: "₹60",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "mix-raita",
      name: { en: "Mix Raita", bn: "মিক্স রাইতা" },
      desc: { en: "", bn: "" },
      category: "salad",
      price: "₹70",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "bundi-raita",
      name: { en: "Bundi Raita", bn: "বুন্দি রাইতা" },
      desc: { en: "", bn: "" },
      category: "salad",
      price: "₹70",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },

    /* ---- PAPAD ---- */
    {
      id: "roasted-papad",
      name: { en: "Roasted Papad", bn: "রোস্টেড পাপড়" },
      desc: { en: "", bn: "" },
      category: "papad",
      price: "₹40",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "fried-papad",
      name: { en: "Fried Papad", bn: "ফ্রায়েড পাপড়" },
      desc: { en: "", bn: "" },
      category: "papad",
      price: "₹45",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "masala-papad",
      name: { en: "Masala Papad", bn: "মসলা পাপড়" },
      desc: { en: "", bn: "" },
      category: "papad",
      price: "₹60",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },

    /* ---- SHAKES & LASSI ---- */
    {
      id: "vanilla-shake",
      name: { en: "Vanilla Shake", bn: "ভ্যানিলা শেক" },
      desc: { en: "", bn: "" },
      category: "shakes",
      price: "₹80",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "mango-shake",
      name: { en: "Mango Shake", bn: "ম্যাংগো শেক" },
      desc: { en: "", bn: "" },
      category: "shakes",
      price: "₹80",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "strawberry-shake",
      name: { en: "Strawberry Shake", bn: "স্ট্রবেরি শেক" },
      desc: { en: "", bn: "" },
      category: "shakes",
      price: "₹80",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "chocolate-shake",
      name: { en: "Chocolate Shake", bn: "চকোলেট শেক" },
      desc: { en: "", bn: "" },
      category: "shakes",
      price: "₹110",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "butterscotch-shake",
      name: { en: "Butterscotch Shake", bn: "বাটারস্কচ শেক" },
      desc: { en: "", bn: "" },
      category: "shakes",
      price: "₹110",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "plain-lassi",
      name: { en: "Plain Lassi", bn: "প্লেন লাস্যি" },
      desc: { en: "", bn: "" },
      category: "shakes",
      price: "₹50",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "special-lassi",
      name: { en: "Special Lassi", bn: "স্পেশাল লাস্যি" },
      desc: { en: "", bn: "" },
      category: "shakes",
      price: "₹70",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "lassi-chocolate",
      name: { en: "Lassi with Chocolate", bn: "চকোলেট লাস্যি" },
      desc: { en: "", bn: "" },
      category: "shakes",
      price: "₹110",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "soda-sikanji",
      name: { en: "Soda Sikanji", bn: "সোডা শিকাঞ্জি" },
      desc: { en: "", bn: "" },
      category: "shakes",
      price: "₹50",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "masala-cold-drinks",
      name: { en: "Masala Cold Drinks", bn: "মসলা কোল্ড ড্রিংকস" },
      desc: { en: "", bn: "" },
      category: "shakes",
      price: "₹50",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },

    /* ---- TEA & COFFEE ---- */
    {
      id: "tea",
      name: { en: "Tea", bn: "চা" },
      desc: { en: "", bn: "" },
      category: "tea",
      price: "₹15",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "masala-tea",
      name: { en: "Masala Tea", bn: "মসলা চা" },
      desc: { en: "", bn: "" },
      category: "tea",
      price: "₹25",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },
    {
      id: "coffee",
      name: { en: "Coffee", bn: "কফি" },
      desc: { en: "", bn: "" },
      category: "tea",
      price: "₹60",
      veg: true,
      available: true,
      tag: null,
      badges: []
    },

    /* ---- ICE CREAM & DAIRY (counter — ask at the shop) ---- */
    {
      id: "amul-ice-cream",
      name: { en: "Amul Ice Cream", bn: "আমুল আইসক্রিম" },
      desc: { en: "", bn: "" },
      category: "icecream",
      price: null,
      veg: true,
      available: true,
      tag: { en: "Counter", bn: "কাউন্টার" },
      badges: []
    },
    {
      id: "chocolates-snacks",
      name: { en: "Chocolates & Snacks", bn: "চকলেট ও স্ন্যাকস" },
      desc: { en: "", bn: "" },
      category: "icecream",
      price: null,
      veg: true,
      available: true,
      tag: { en: "Counter", bn: "কাউন্টার" },
      badges: []
    }
  ],

  /* ---------------------------------------------------------------------
     6b. THE "ORDER BOTH" STRIP (under the menu on the home page)
     A gentle nudge to try both highlights. No invented claims.
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
     Upload real photographs of Dairy Park into assets/img/photos/ and list
     them here. section: "exterior" | "interior" | "food" | "products".
     Slots without an uploaded file show a designed placeholder, never a
     fake photograph. The site picks up .webp, .avif, .jpg, .jpeg or .png
     automatically.

     Example:
     { section: "exterior", base: "assets/img/photos/exterior-1",
       alt: { en: "Dairy Park shop front on Kolaghat – Jashar Road",
              bn: "কোলাঘাট–যশোর রোডে ডেয়ারি পার্কের সামনের দৃশ্য" } }
     --------------------------------------------------------------------- */
  gallery: [
    /* ---- OUTSIDE THE SHOP ---- */
    { section: "exterior",
      base: "assets/img/photos/shop-front",
      alt: { en: "The Dairy Park shopfront on Kolaghat – Jashar Road, with its yellow and white signboard",
             bn: "কোলাঘাট–যশোর রোডে ডেয়ারি পার্কের সামনের অংশ, হলুদ-সাদা সাইনবোর্ড" } },

    /* ---- INSIDE THE DINING ROOM ---- */
    { section: "interior",
      base: "assets/img/photos/interior-room",
      alt: { en: "The dining room at Dairy Park: deep green walls, hand-painted arched murals, marble-look tables and green stools",
             bn: "ডেয়ারি পার্কের খাওয়ার ঘর: গাঢ় সবুজ দেওয়াল, হাতে আঁকা খিলান, মার্বেলের মতো টেবিল আর সবুজ স্টুল" } },
    { section: "interior",
      base: "assets/img/photos/interior-bench",
      alt: { en: "Green leather bench seating and long tables beside the mural wall at Dairy Park",
             bn: "ডেয়ারি পার্কে খিলানের দেওয়ালের পাশে সবুজ লেদার বেঞ্চ আর লম্বা টেবিল" } },
    { section: "interior",
      base: "assets/img/photos/interior-glass",
      alt: { en: "The lit dining room seen through the glass front of Dairy Park in the evening",
             bn: "সন্ধ্যায় ডেয়ারি পার্কের কাচের সামনের দিক দিয়ে দেখা আলোকিত খাওয়ার ঘর" } },
    { section: "interior",
      base: "assets/img/photos/interior-arches",
      alt: { en: "Three arched wall panels painted with palms and banana leaves inside Dairy Park",
             bn: "ডেয়ারি পার্কের ভিতরে তাল ও কলাপাতার আঁকা তিনটি খিলান" } },
    { section: "interior",
      base: "assets/img/photos/interior-booth",
      alt: { en: "Green leather bench seating and long tables at Dairy Park",
             bn: "ডেয়ারি পার্কে সবুজ লেদার বেঞ্চ আর লম্বা টেবিল" } },
    { section: "interior",
      base: "assets/img/photos/interior-green",
      alt: { en: "Corner tables and stools under an arched mural at Dairy Park",
             bn: "ডেয়ারি পার্কে খিলানের নিচে কোণের টেবিল ও স্টুল" } },
    { section: "interior",
      base: "assets/img/photos/interior-lounge",
      alt: { en: "Wide view of the Dairy Park dining lounge with booth sofas and arched murals",
             bn: "সোফা আর খিলানসহ ডেয়ারি পার্কের খাওয়ার ঘরের চওড়া দৃশ্য" } },
    { section: "interior",
      base: "assets/img/photos/interior-night",
      alt: { en: "The dining room at Dairy Park in the evening, seen through the glass front — cove lighting, painted arches and bench seating",
             bn: "সন্ধ্যায় ডেয়ারি পার্কের খাওয়ার ঘর, কাচের সামনের দিক দিয়ে দেখা — ছাদের আলো, আঁকা খিলান আর বেঞ্চ আসন" } },
    { section: "interior",
      base: "assets/img/photos/wall-art",
      alt: { en: "Framed pictures and small wall lights on the dark green wall at Dairy Park",
             bn: "ডেয়ারি পার্কের গাঢ় সবুজ দেওয়ালে ফ্রেমে বাঁধানো ছবি ও ছোট লাইট" } },
    { section: "interior",
      base: "assets/img/photos/table-setting",
      alt: { en: "A marble-look table at Dairy Park with the menu card, a steel jug and green stools around it",
             bn: "ডেয়ারি পার্কের মার্বেলের মতো টেবিলে মেনু কার্ড, স্টিলের জগ আর চারপাশে সবুজ স্টুল" } },

    /* ---- FOOD ---- */
    { section: "food",
      base: "assets/img/photos/dahi-vada",
      alt: { en: "A plate of dahi vada topped with curd, green chutney and chaat masala",
             bn: "দই, সবুজ চাটনি ও চাট মসলা দিয়ে সাজানো দই বড়ার প্লেট" } },
    { section: "food",
      base: "assets/img/photos/steam-momo",
      alt: { en: "A steel plate of steamed momos with a bowl of red chutney",
             bn: "লাল চাটনির বাটি সহ স্টিলের প্লেটে স্টিম মোমো" } },
    { section: "food",
      base: "assets/img/photos/menu-spread-1",
      alt: { en: "A page of the Dairy Park menu with prices for moglai, chat, chilli, pizza, rice, roti, dal and paneer dishes",
             bn: "ডেয়ারি পার্কের মেনুর পাতা — মোগলাই, চাট, চিলি, পিজ্জা, ভাত, রুটি, ডাল ও পনিরের দাম" } },
    { section: "food",
      base: "assets/img/photos/menu-spread-2",
      alt: { en: "A page of the Dairy Park menu with prices for rolls, salad, raita, papad, shakes, lassi, chai, snacks, fries, idli and vada",
             bn: "ডেয়ারি পার্কের মেনুর পাতা — রোল, সালাদ, রাইতা, পাপড়, শেক, লাস্যি, চা, স্ন্যাকস, ফ্রাই, ইডলি ও বড়ার দাম" } },
    { section: "food",
      base: "assets/img/photos/menu-drinks",
      alt: { en: "A page of the Dairy Park menu listing tea, coffee and cold drinks",
             bn: "ডেয়ারি পার্কের মেনুর পাতা — চা, কফি ও ঠান্ডা পানীয়" } },

    /* ---- PRODUCTS ---- */
    { section: "products",
      base: "assets/img/photos/counter-snacks",
      alt: { en: "Samosas on a steel tray at the Dairy Park counter",
             bn: "ডেয়ারি পার্ক কাউন্টারে স্টিলের ট্রেতে সিঙাড়া" } },
    { section: "products",
      base: "assets/img/photos/shop",
      alt: { en: "The shop floor at Dairy Park: shelves of chocolates and snacks, with the Amul and Cadbury freezers",
             bn: "ডেয়ারি পার্কের ভিতরের দোকান: চকলেট ও স্ন্যাকসের তাক, সাথে আমুল ও ক্যাডবেরি ফ্রিজার" } },
    { section: "products",
      base: "assets/img/photos/ice-cream-freezer",
      alt: { en: "A stocked freezer at Dairy Park with ice-cream and chocolate bars",
             bn: "ডেয়ারি পার্কের ভরা ফ্রিজারে আইসক্রিম ও চকলেট বার" } },
    { section: "products",
      base: "assets/img/photos/chocolate-freezer",
      alt: { en: "The Cadbury Dairy Milk freezer at Dairy Park",
             bn: "ডেয়ারি পার্কে ক্যাডবেরি ডেয়ারি মিল্কের ফ্রিজার" } }
  ],

  /* ---------------------------------------------------------------------
     9. PHOTOS (single-photo slots)
     Upload the real photos into assets/img/photos/ using these names.
     The site picks up .webp, .avif, .jpg, .jpeg or .png automatically.
     Until a photo is uploaded, a designed placeholder is shown instead.
     --------------------------------------------------------------------- */
  photos: {
    hero: "assets/img/photos/shop-front", // shopfront — full-screen homepage background
    owner: "assets/img/photos/owner", // real owner portrait — homepage hero
    shop: "assets/img/photos/interior-room", // dining room — About page
    shopAlt: "assets/img/photos/counter-snacks", // snacks at the counter
    dining: "assets/img/photos/interior-bench", // bench seating — dining band on the home page
    glass: "assets/img/photos/interior-glass", // evening room seen through the glass
    arches: "assets/img/photos/interior-arches", // painted arches
    freezer: "assets/img/photos/ice-cream-freezer",
    chocolate: "assets/img/photos/chocolate-freezer",
    shelves: "assets/img/photos/shop",
    counter: "assets/img/photos/counter-snacks"
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
     10b. WHATSAPP ENQUIRIES
     When a visitor fills the enquiry form on the Contact page, the website
     opens WhatsApp with the whole enquiry typed out and addressed to the
     number below. The visitor only has to tap Send in WhatsApp — the
     message then arrives on that phone like any other WhatsApp chat.

        number   country code + number, DIGITS ONLY (no +, no spaces).
                 India = 91 followed by the 10-digit number.
                 This is normally the owner's own WhatsApp number.
        enabled  false hides every WhatsApp link and button on the site.
        template the ready-made message. {name}, {phone} and {message} are
                 replaced with what the visitor typed — keep those
                 placeholders exactly as written.

     Note: the website never sends anything by itself and needs no server or
     internet service. WhatsApp opens on the visitor's own phone and they
     choose whether to tap Send.
     --------------------------------------------------------------------- */
  whatsapp: {
    enabled: true,
    number: "919932452124", // the owner's WhatsApp — country code first, digits only
    template: {
      en:
        "New enquiry from the Dairy Park website\n\n" +
        "Name: {name}\n" +
        "Phone: {phone}\n" +
        "Enquiry: {message}",
      bn:
        "ডেয়ারি পার্ক ওয়েবসাইট থেকে নতুন অনুসন্ধান\n\n" +
        "নাম: {name}\n" +
        "ফোন: {phone}\n" +
        "অনুসন্ধান: {message}"
    }
  },

  /* ---------------------------------------------------------------------
     11. SMALL NOTE SHOWN IN THE FOOTER
     --------------------------------------------------------------------- */
  footerNote: {
    en: "Menu prices are copied from our printed menu card and can change — please call to confirm. Facilities and rating are based on our Google Maps listing.",
    bn: "মেনুর দাম আমাদের ছাপা মেনু কার্ড থেকে নেওয়া, বদলাতে পারে — কল করে নিশ্চিত হয়ে নিন। সুবিধা ও রেটিং আমাদের গুগল ম্যাপ লিস্টিং অনুযায়ী।"
  }
};
