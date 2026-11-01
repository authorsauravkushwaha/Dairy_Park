# Owner photos

The genuine Dairy Park photographs below are **already uploaded and wired up**
(hero, About page, Gallery) — the website picks them up automatically.

## Single-photo slots (`assets/img/photos/`)

File names must match exactly. The photographs currently shipped are **WebP**
(`.webp`) — the lightest format that every modern phone and browser supports,
which keeps the whole gallery under a megabyte. A `.avif`, `.jpg`, `.jpeg` or
`.png` file with the same name works too; the site probes for them in that
order, so if you re-export as WebP it is picked up automatically.

| File name        | Where it appears                                  |
| ---------------- | ------------------------------------------------- |
| `shop-front.*`   | **Supplied** — full-screen homepage hero backdrop |
| `owner.*`        | **Supplied** — hero portrait frame + About inset   |
| `interior-room.*` | **Supplied** — dining room (About + Gallery)      |
| `interior-arches.*`, `interior-booth.*`, `interior-green.*`, `interior-lounge.*`, `interior-night.*` | **Supplied** — murals, booths and evening frontage (Gallery) |
| `table-setting.*`, `wall-art.*`, `shop.*` | **Supplied** — tables, framed art and the snacks counter (Gallery) |
| `menu-spread-1.*`, `menu-spread-2.*` | **Supplied** — menu boards (Gallery) |
| `menu-drinks.*`  | **Supplied** — drinks (Gallery)                   |
| `counter-snacks.*` | **Supplied** — samosas at the counter (Gallery) |
| `ice-cream-freezer.*` | **Supplied** — ice-cream freezer (Gallery)    |
| `chocolate-freezer.*` | **Supplied** — chocolate selection (Gallery)  |
| `dahi-vada.*`    | **Supplied** — Dahi Vada cards + hero peek + "order both" strip + Gallery |
| `steam-momo.*`   | **Supplied** — Steam Momo cards + hero peek + "order both" strip + Gallery |

## New gallery photographs

Drop the file in this folder with any name, then list it in `content.js →
gallery` with its section (`exterior`, `interior`, `food`, `products`) and
bilingual alt text — see OWNER-GUIDE.md for the exact snippet. The outside and
inside sets are framed in arches on the Gallery page.

If a file is missing, the site shows a designed placeholder instead — nothing
breaks, and no fake photograph of Dairy Park is ever used. `npm run check`
fails the build if `content.js` points at a photograph that is not here, so a
typo in a file name is caught before the site goes live.

For replacements, export **WebP** at about 1400–1600 px on the long edge and
quality 75–82. The current set is 19 files and about 2.4 MB in total. The
shopfront is the hero backdrop, so keeping it under ~250 kB matters most.

Please upload only genuine photos of the restaurant, the owner and the food.
