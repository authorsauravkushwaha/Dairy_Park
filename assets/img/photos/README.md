# Owner photos

Upload the real photographs here. The website picks them up automatically —
no code changes needed for the single-photo slots. File names must match
exactly (the extension can be `.webp`, `.avif`, `.jpg`, `.jpeg` or `.png`):

| File name        | Where it appears                                  |
| ---------------- | ------------------------------------------------- |
| `owner.*`        | Homepage hero background + About page inset       |
| `shop.*`         | About page main photograph                        |
| `shop-2.*`       | Spare second shop slot (optional)                 |
| `dahi-vada.*`    | Dahi Vada menu cards                              |
| `steam-momo.*`   | Steam Momo menu cards                             |
| `offer-combo.*`  | Offer cards (when a promo references this name)   |

## Gallery photographs

Create a `gallery/` sub-folder for the Gallery page:

```
photos/gallery/exterior-1.jpg
photos/gallery/interior-1.jpg
photos/gallery/food-1.jpg
photos/gallery/products-1.jpg
```

Then list each file in `content.js → gallery` with its section
(`exterior`, `interior`, `food`, `products`) and bilingual alt text — see
OWNER-GUIDE.md for the exact snippet. Gallery entries only appear once listed
in `content.js`; single-photo slots appear as soon as the file exists.

If a file is missing, the site shows a designed placeholder instead — nothing
breaks, and no fake photograph of Dairy Park is ever used. Recommended: at
least 1600 px wide for `owner.*`, 1200 px for the rest, and compress to under
~400 kB each (squoosh.app or similar).

Please upload only genuine photos of the restaurant, the owner and the food.
