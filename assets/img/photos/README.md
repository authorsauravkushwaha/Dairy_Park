# Dairy Park photos

This folder contains three kinds of images:

1. **Owner-supplied restaurant photographs** — shopfront, interior, counter,
   freezers, six dish photos, and the four new printed-menu pages. These are
   real Dairy Park photographs.
2. **`inspiration-*.webp`** — AI-generated serving illustrations created for
   this website. They are labelled “Serving inspiration” in the UI and are not
   photographs of the exact dish prepared at Dairy Park.
3. **`reference-*.webp`** — licensed reference photographs (Pexels and two
   Wikimedia Commons CC BY-SA images). They are also labelled “Serving
   inspiration”. Credits and licences are published in
   `/privacy.html#image-credits`.

## Printed menu pages (supplied 2026-11-03)

| File | Contents |
| --- | --- |
| `menu-dosa.webp` | Dosa, uttapam, momo, chowmein/noodles |
| `menu-spread-1.webp` | Moglai, chaat, chilli, pizza, rice, roti, aloo, dal, tarka, chana, paneer |
| `menu-spread-2.webp` | Rolls, salad, raita/dahi, papad, beverages |
| `menu-snacks.webp` | Tea, snacks, puri, pakora, fries, rolls, idli, vada |

Original uploads are kept in `assets/menu-source/` for provenance.

## Replacing a dish image

1. Export a real Dairy Park photo as WebP, about 900×675 or 900×900, quality 80.
2. Put it in this folder.
3. In `content.js`, point the dish’s `photo` at the new base name and set
   `photoKind: "owner"`.
4. Run `npm run build && npm test`.

The build fails if `content.js` points at a photo that does not exist.
