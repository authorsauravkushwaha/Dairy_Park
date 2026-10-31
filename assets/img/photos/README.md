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
| `owner.*`        | **Supplied** — hero portrait frame + blurred hero backdrop + About inset |
| `shop.*`         | **Supplied** — shop interior (About + Gallery)    |
| `counter-snacks.*` | **Supplied** — snacks at the counter (Gallery)  |
| `ice-cream-freezer.*` | **Supplied** — ice-cream freezer (Gallery)    |
| `chocolate-freezer.*` | **Supplied** — chocolate selection (Gallery)  |
| `menu-spread-1.*`, `menu-spread-2.*` | **Supplied** — menu-counter shots (Gallery) |
| `menu-drinks.*`  | **Supplied** — drinks (Gallery)                   |
| `dahi-vada.*`    | **Supplied** — Dahi Vada menu card + hero peek + "order both" strip |
| `steam-momo.*`   | **Supplied** — Steam Momo menu card + hero peek + "order both" strip |

## New gallery photographs

Create a `gallery/` sub-folder, drop the file in with any name, then list it in
`content.js → gallery` with its section (`exterior`, `interior`, `food`,
`products`) and bilingual alt text — see OWNER-GUIDE.md for the exact snippet.

If a file is missing, the site shows a designed placeholder instead — nothing
breaks, and no fake photograph of Dairy Park is ever used. `npm run check`
fails the build if `content.js` points at a photograph that is not here, so a
typo in a file name is caught before the site goes live.

For replacements, export **WebP** at about 1000 px on the long edge and
quality 68–80 — that lands each photo around 100–180 kB, so the whole page
stays quick on a phone. The two menu-card photos are also preloaded in the
hero, so keeping them small matters most.

Please upload only genuine photos of the restaurant, the owner and the food.
