#!/usr/bin/env node
/**
 * Static quality gate for the built multi-page site (dist/).
 * Checks SEO essentials, accessibility basics, security headers, active-nav
 * markers, bilingual wiring, and that every local link/asset actually exists.
 * Run after `npm run build`.
 */
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGES } from './pages.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

const problems = [];
const notes = [];
const fail = (msg) => problems.push(msg);

async function exists(p) {
  try {
    const info = await stat(p);
    return info.isFile();
  } catch {
    return false;
  }
}

/* Files or directories (links like "food/" resolve to a folder on Pages) */
async function existsAny(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

/* Load owner-editable data by evaluating it with a fake window */
globalThis.window = {};
await import(path.join(dist, 'content.js'));
await import(path.join(dist, 'assets/js/i18n.js'));
const C = globalThis.window.DP_CONTENT;
const I18N = globalThis.window.DP_I18N;

if (!C) fail('content.js did not define window.DP_CONTENT');
if (!I18N || !I18N.en || !I18N.bn) fail('i18n.js did not define window.DP_I18N.en/.bn');

const enKeys = Object.keys(I18N?.en || {});
const bnKeys = Object.keys(I18N?.bn || {});
for (const key of enKeys) if (!bnKeys.includes(key)) fail(`i18n key missing in bn: ${key}`);
for (const key of bnKeys) if (!enKeys.includes(key)) fail(`i18n key missing in en: ${key}`);

const allPagesHtml = {};
for (const page of PAGES) {
  const file = path.join(dist, page.out);
  if (!(await exists(file))) {
    fail(`missing page in dist: ${page.out}`);
    continue;
  }
  allPagesHtml[page.out] = await readFile(file, 'utf8');
}

/* --------------------------- per-page checks ------------------------------ */
const titles = new Map();
const descs = new Map();
const canonicals = new Set();

for (const page of PAGES) {
  const html = allPagesHtml[page.out];
  if (!html) continue;
  const tag = page.out;

  const must = [
    ['title', /<title>[^<]{20,120}<\/title>/],
    ['meta description', /<meta name="description" content="[^"]{60,320}">/],
    ['canonical', /<link rel="canonical" href="https:\/\/[^"]+">/],
    ['og:image', /<meta property="og:image" content="https:\/\/[^"]+\.png">/],
    ['og:title', /<meta property="og:title"/],
    ['og:url', /<meta property="og:url" content="https:\/\/[^"]+">/],
    ['twitter card', /<meta name="twitter:card" content="summary_large_image">/],
    ['viewport', /<meta name="viewport" content="width=device-width, initial-scale=1/],
    ['theme-color', /<meta name="theme-color"/],
    ['manifest', /<link rel="manifest" href="[^"]*manifest\.webmanifest">/],
    ['icon', /<link rel="icon"/],
    ['lang attribute', /<html lang="en"/],
    ['skip link', /class="skip-link"/],
    ['CSP', /http-equiv="Content-Security-Policy" content="[^"]*script-src 'self' 'sha256-[A-Za-z0-9+/=]+'/],
    ['CSP frame-src for maps', /frame-src https:\/\/www\.google\.com/],
    ['JSON-LD', /<script type="application\/ld\+json">/],
    ['preloaded font', /rel="preload" href="[^"]*assets\/fonts\/[^"]+\.woff2" as="font"/],
    ['versioned css', /assets\/css\/main\.min\.css\?v=[a-f0-9]{8}/],
    ['versioned js', /assets\/js\/app\.min\.js\?v=[a-f0-9]{8}/],
    ['tel link', /href="tel:\+919932452124"/],
    ['directions link', /google\.com\/maps\/dir\/\?api=1/],
    ['language switch', /data-lang="bn"/],
    ['main landmark', /<main id="main">/],
    ['footer', /<footer class="footer"/],
    ['sticky mobile bar', /class="sticky-bar"/],
    ['page marker', new RegExp(`data-page="${page.id}"`)]
  ];
  for (const [name, regex] of must) if (!regex.test(html)) fail(`${tag}: missing ${name}`);

  // Sub-pages in the navigation carry a breadcrumb; home and privacy don't
  if (page.nav && page.slug && !/class="crumbs"/.test(html)) fail(`${tag}: missing breadcrumb`);

  // Unique SEO values
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const desc = html.match(/<meta name="description" content="([^"]+)">/)?.[1];
  const canonical = html.match(/<link rel="canonical" href="([^"]+)">/)?.[1];
  if (title) {
    if (titles.has(title)) fail(`${tag}: duplicate <title> with ${titles.get(title)}`);
    titles.set(title, tag);
  }
  if (desc) {
    if (descs.has(desc)) fail(`${tag}: duplicate meta description with ${descs.get(desc)}`);
    descs.set(desc, tag);
  }
  if (canonical) {
    if (canonicals.has(canonical)) fail(`${tag}: duplicate canonical ${canonical}`);
    canonicals.add(canonical);
    if (page.slug && !canonical.endsWith('/' + page.slug)) fail(`${tag}: canonical does not match slug (${canonical})`);
    if (!page.slug && !canonical.endsWith('/Dairy_Park/')) fail(`${tag}: home canonical should end with /Dairy_Park/`);
  }

  // Active navigation marker — exactly one per nav slot on the page
  if (page.nav) {
    const activeMarkers = html.match(/data-nav="[^"]+" aria-current="page" data-active="1"/g) || [];
    if (activeMarkers.length < 2) fail(`${tag}: active nav marker missing (header + drawer expected)`);
    const own = html.match(new RegExp(`data-nav="${page.nav}" aria-current="page"`, 'g')) || [];
    if (own.length < 2) fail(`${tag}: current page not marked in header and drawer nav`);
  }

  // Security hygiene
  if (/__JSONLD_HASH__|main\.min\.css"|app\.min\.js"/.test(html)) fail(`${tag}: build placeholders left behind`);
  if (/<script(?![^>]*\bsrc=)[^>]*>/.test(html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, ''))) {
    fail(`${tag}: contains an inline <script> without a CSP hash`);
  }
  if (/\son[a-z]+=/i.test(html)) fail(`${tag}: uses an inline event handler (blocked by CSP)`);
  if (/style="/.test(html)) fail(`${tag}: uses a style attribute (blocked by CSP)`);
  if (/http:\/\//.test(html)) fail(`${tag}: references an insecure http:// URL`);
  if (/\b(WhatsApp|whatsapp)\b/.test(html)) fail(`${tag}: WhatsApp ordering must not be advertised unless confirmed`);

  // JSON-LD sanity: valid JSON, Restaurant present, no unverified data
  const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (ld) {
    try {
      const data = JSON.parse(ld[1]);
      const nodes = data['@graph'] || [data];
      const restaurant = nodes.find((n) => n['@type'] === 'Restaurant');
      if (!restaurant) fail(`${tag}: JSON-LD Restaurant node missing`);
      else {
        const raw = JSON.stringify(restaurant);
        if (/aggregateRating|reviewRating/.test(raw)) fail(`${tag}: JSON-LD must not publish unverified ratings`);
        if (/openingHours/.test(raw)) fail(`${tag}: JSON-LD must not publish unverified opening hours`);
        if (!restaurant.telephone) fail(`${tag}: JSON-LD telephone missing`);
        if (!restaurant.address?.postalCode) fail(`${tag}: JSON-LD address missing`);
        if (restaurant.hasMenu !== C.site.url + 'food/') fail(`${tag}: JSON-LD hasMenu should point at the food page`);
      }
      if (page.slug) {
        const crumbs = nodes.filter((n) => n['@type'] === 'BreadcrumbList');
        if (!crumbs.length) fail(`${tag}: JSON-LD breadcrumb missing on sub-page`);
      }
    } catch (error) {
      fail(`${tag}: JSON-LD is not valid JSON: ${error.message}`);
    }
  }

  // Structure basics
  const h1s = html.match(/<h1[\s>]/g) || [];
  if (h1s.length !== 1) fail(`${tag}: expected exactly 1 <h1>, found ${h1s.length}`);

  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length) fail(`${tag}: duplicate ids: ${[...new Set(dupes)].join(', ')}`);

  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt="/.test(match[0])) fail(`${tag}: image without alt: ${match[0].slice(0, 70)}…`);
  }
  for (const match of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
    if (!/rel="[^"]*noopener/.test(match[0])) fail(`${tag}: external link without rel=noopener: ${match[0].slice(0, 70)}…`);
  }

  /* i18n keys referenced in HTML must exist */
  const usedKeys = [
    ...html.matchAll(/data-i18n(?:-aria|-alt)?="([^"]+)"/g),
    ...[...html.matchAll(/data-i18n-attr="[^|]+\|([^"]+)"/g)]
  ].map((m) => m[1]);
  for (const key of new Set(usedKeys)) {
    if (!(key in I18N.en)) fail(`${tag}: i18n key not translated: ${key}`);
  }

  /* Hours must never be invented */
  if (/openingHours/.test(html)) fail(`${tag}: opening hours appear in the markup without verification`);
}

/* --------------------------- cross-page checks ---------------------------- */

/* Local links and assets resolve inside dist/ — relative to each page */
const localRefs = new Set();
for (const page of PAGES) {
  const html = allPagesHtml[page.out];
  if (!html) continue;
  const pageDir = path.dirname(path.join(dist, page.out));
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = match[1];
    if (/^(https?:|tel:|mailto:|#|data:)/.test(url)) continue;
    const ref = url.split('?')[0];
    localRefs.add(ref);
    const resolved = path.normalize(path.join(pageDir, ref));
    if (!resolved.startsWith(dist)) {
      fail(`${tagOf(page)}: local reference escapes dist/: ${ref}`);
      continue;
    }
    if (!(await existsAny(resolved))) fail(`${tagOf(page)}: broken local reference: ${ref}`);
  }
}
function tagOf(page) { return page.out; }

/* Pages are reachable from the home navigation */
const homeHtml = allPagesHtml['index.html'] || '';
for (const page of PAGES) {
  if (!page.slug || page.id === 'privacy') continue;
  if (!homeHtml.includes(`href="${page.slug}"`)) fail(`home nav does not link to /${page.slug}`);
}

/* Offers page keeps its honest empty state until a promo exists */
const offersHtml = allPagesHtml['offers/index.html'] || '';
if (!/id="offersEmpty"/.test(offersHtml)) fail('offers page: empty state container missing');
if (!/id="offersActive"[^>]*hidden/.test(offersHtml)) fail('offers page: active-offers section must start hidden without a promotion');
if (Array.isArray(C.promos) && C.promos.length === 0 && !/id="offersActive"[^>]*hidden/.test(offersHtml)) {
  fail('offers page: no promos configured but active section is not hidden');
}

/* Contact form must not claim a message was sent (no backend exists) */
const contactHtml = allPagesHtml['contact/index.html'] || '';
if (/sent (successfully|your message)|message (has been )?sent/i.test(contactHtml)) {
  fail('contact page: must not claim messages are sent — there is no backend');
}
if (!/id="enquiryForm"/.test(contactHtml)) fail('contact page: enquiry form missing');

/* Hours must never be invented */
if (!C.hours?.verified && C.hours?.schedule?.length) fail('hours marked unverified but a schedule is present');

/* Analytics must stay off until configured */
if (C.analytics?.enabled && !/^G-[A-Z0-9]+$/.test(C.analytics.ga4Id || '')) {
  fail('analytics.enabled is true but ga4Id is not a valid measurement id');
}

/* Menu integrity: categories resolve, no invented prices */
const categoryIds = new Set((C.menuCategories || []).map((c) => c.id));
for (const item of C.menu || []) {
  if (item.category && !categoryIds.has(item.category)) fail(`menu item "${item.id}" uses unknown category "${item.category}"`);
  if (item.price !== null && item.price !== undefined && item.price !== '' && !/^[₹$€]\s?\d/.test(String(item.price))) {
    fail(`menu item "${item.id}" price should be a display string like "₹40"`);
  }
}

/* SEO files */
const sitemap = await readFile(path.join(dist, 'sitemap.xml'), 'utf8').catch(() => '');
if (!sitemap.includes('<urlset')) fail('sitemap.xml missing or malformed');
for (const page of PAGES) {
  const loc = C.site.url + page.slug;
  if (!sitemap.includes(`<loc>${loc}</loc>`)) fail(`sitemap.xml does not list ${loc}`);
}
const robots = await readFile(path.join(dist, 'robots.txt'), 'utf8').catch(() => '');
if (!/Sitemap:\s*https:\/\//.test(robots)) fail('robots.txt missing Sitemap line');

const manifest = JSON.parse(await readFile(path.join(dist, 'manifest.webmanifest'), 'utf8').catch(() => '{}'));
if (!manifest.icons?.length) fail('manifest.webmanifest has no icons');
for (const icon of manifest.icons || []) {
  if (!(await exists(path.join(dist, icon.src)))) fail(`manifest icon missing: ${icon.src}`);
}

/* Photos: placeholders must exist for graceful fallback */
for (const file of ['placeholder-hero.svg', 'placeholder-dish.svg', 'placeholder-shop.svg']) {
  if (!(await exists(path.join(dist, 'assets/img', file)))) fail(`missing fallback image ${file}`);
}

const photos = await readdir(path.join(dist, 'assets/img/photos')).catch(() => []);
const realPhotos = photos.filter((f) => /\.(webp|avif|jpe?g|png)$/i.test(f));
if (!realPhotos.length) notes.push('no owner photos uploaded yet — designed placeholders are in use');

/* Every photo referenced from content.js must actually exist — otherwise the
   site silently falls back to a placeholder where a real photo was intended. */
const referenced = [];
for (const value of Object.values(C.photos || {})) if (typeof value === 'string') referenced.push(value);
for (const item of C.menu || []) if (item && item.photo) referenced.push(item.photo);
for (const shot of C.gallery || []) if (shot && shot.base) referenced.push(shot.base);
for (const promo of C.promos || []) if (promo && promo.photo) referenced.push(promo.photo);
for (const base of new Set(referenced)) {
  const found = realPhotos.some((file) => file.replace(/\.(webp|avif|jpe?g|png)$/i, '') === path.basename(base));
  if (!found) fail(`content.js points at a photo that is not in assets/img/photos/: ${base}`);
}

/* Gallery captions/alts must be translated like every other string */
for (const shot of C.gallery || []) {
  if (!shot) continue;
  if (shot.alt && (typeof shot.alt.en !== 'string' || typeof shot.alt.bn !== 'string')) {
    fail('gallery entry has an alt that is not translated into both languages');
  }
}

/* Report */
for (const note of notes) console.log(`• ${note}`);
if (problems.length) {
  console.error(`\n✗ ${problems.length} problem(s):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}
console.log(`✓ checks passed (${PAGES.length} pages, ${localRefs.size} local references)`);
