#!/usr/bin/env node
/**
 * Static quality gate for the built site (dist/).
 * Checks SEO essentials, accessibility basics, security headers and that every
 * local link/asset actually exists. Run after `npm run build`.
 */
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const pages = ['index.html', '404.html', 'privacy.html'];

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
for (const page of pages) {
  const file = path.join(dist, page);
  if (!(await exists(file))) {
    fail(`missing page in dist: ${page}`);
    continue;
  }
  allPagesHtml[page] = await readFile(file, 'utf8');
}

/* ---------------------------------- index --------------------------------- */
const html = allPagesHtml['index.html'] || '';

const must = [
  ['title', /<title>[^<]{20,120}<\/title>/],
  ['meta description', /<meta name="description" content="[^"]{60,320}">/],
  ['canonical', /<link rel="canonical" href="https:\/\/[^"]+">/],
  ['og:image', /<meta property="og:image" content="https:\/\/[^"]+\.png">/],
  ['og:title', /<meta property="og:title"/],
  ['twitter card', /<meta name="twitter:card" content="summary_large_image">/],
  ['viewport', /<meta name="viewport" content="width=device-width, initial-scale=1/],
  ['theme-color', /<meta name="theme-color"/],
  ['manifest', /<link rel="manifest" href="manifest\.webmanifest">/],
  ['icon', /<link rel="icon"/],
  ['lang attribute', /<html lang="en"/],
  ['skip link', /class="skip-link"/],
  ['CSP', /http-equiv="Content-Security-Policy" content="[^"]*script-src 'self' 'sha256-[A-Za-z0-9+/=]+'/],
  ['CSP frame-src for maps', /frame-src https:\/\/www\.google\.com/],
  ['JSON-LD', /<script type="application\/ld\+json">/],
  ['preloaded font', /rel="preload" href="assets\/fonts\/[^"]+\.woff2" as="font"/],
  ['versioned css', /assets\/css\/main\.min\.css\?v=[a-f0-9]{8}/],
  ['versioned js', /assets\/js\/app\.min\.js\?v=[a-f0-9]{8}/],
  ['tel link', /href="tel:\+919932452124"/],
  ['directions link', /google\.com\/maps\/dir\/\?api=1/],
  ['call tracking', /data-track="call_click"/],
  ['language switch', /data-lang="bn"/],
  ['hero heading', /<h1 class="hero__title"/],
  ['section: menu', /id="menu"/],
  ['section: reviews', /id="reviews"/],
  ['section: location', /id="location"/]
];
for (const [name, regex] of must) if (!regex.test(html)) fail(`index.html: missing ${name}`);

if (/__JSONLD_HASH__|main\.min\.css"|app\.min\.js"/.test(html)) fail('build placeholders left in index.html');
if (/<script(?![^>]*\bsrc=)[^>]*>/.test(html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, ''))) {
  fail('index.html contains an inline <script> without a CSP hash');
}
if (/\son[a-z]+=/i.test(html)) fail('index.html uses an inline event handler (blocked by CSP)');
if (/style="/.test(html)) fail('index.html uses a style attribute (blocked by CSP)');
if (/http:\/\//.test(html)) fail('index.html references an insecure http:// URL');
if (/\b(WhatsApp|whatsapp)\b/.test(html)) fail('WhatsApp ordering must not be advertised unless confirmed');

/* JSON-LD sanity: no unverified hours or ratings */
const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
if (ld) {
  try {
    const data = JSON.parse(ld[1]);
    const nodes = data['@graph'] || [data];
    const restaurant = nodes.find((n) => n['@type'] === 'Restaurant');
    if (!restaurant) fail('JSON-LD: Restaurant node missing');
    else {
      const raw = JSON.stringify(restaurant);
      if (/aggregateRating|reviewRating/.test(raw)) fail('JSON-LD: unverified ratings must not be published');
      if (/openingHours/.test(raw)) fail('JSON-LD: unverified opening hours must not be published');
      if (!restaurant.telephone) fail('JSON-LD: telephone missing');
      if (!restaurant.address?.postalCode) fail('JSON-LD: address missing');
    }
  } catch (error) {
    fail(`JSON-LD is not valid JSON: ${error.message}`);
  }
}

/* ------------------------- links, assets, a11y basics ---------------------- */
const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
if (dupes.length) fail(`duplicate ids: ${[...new Set(dupes)].join(', ')}`);

const localRefs = new Set();
for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
  const url = match[1];
  if (/^(https?:|tel:|mailto:|#|data:)/.test(url)) continue;
  localRefs.add(url.split('?')[0]);
}
for (const ref of localRefs) {
  if (!(await exists(path.join(dist, ref)))) fail(`broken local reference: ${ref}`);
}

for (const match of html.matchAll(/<img\b[^>]*>/g)) {
  if (!/\balt="/.test(match[0])) fail(`image without alt: ${match[0].slice(0, 70)}…`);
}
for (const match of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
  if (!/rel="[^"]*noopener/.test(match[0])) fail(`external link without rel=noopener: ${match[0].slice(0, 70)}…`);
}

/* i18n keys referenced in HTML must exist */
const usedKeys = [...html.matchAll(/data-i18n(?:-aria)?="([^"]+)"/g)].map((m) => m[1]);
for (const key of new Set(usedKeys)) {
  if (!(key in I18N.en)) fail(`i18n key not translated: ${key}`);
}

/* Offers must be hidden until a real promo exists */
if (Array.isArray(C.promos) && C.promos.length === 0 && !/id="offers"[^>]*hidden/.test(html)) {
  fail('offers section must start hidden when no promotion is configured');
}

/* Hours must never be invented */
if (!C.hours?.verified && C.hours?.schedule?.length) fail('hours marked unverified but a schedule is present');
if (/openingHours/.test(html)) fail('opening hours appear in the page markup without verification');

/* Analytics must stay off until configured */
if (C.analytics?.enabled && !/^G-[A-Z0-9]+$/.test(C.analytics.ga4Id || '')) {
  fail('analytics.enabled is true but ga4Id is not a valid measurement id');
}

/* SEO files */
const sitemap = await readFile(path.join(dist, 'sitemap.xml'), 'utf8').catch(() => '');
if (!sitemap.includes('<urlset')) fail('sitemap.xml missing or malformed');
for (const page of ['', 'privacy.html']) {
  const loc = `https://authorsauravkushwaha.github.io/Dairy_Park/${page}`;
  if (!sitemap.includes(loc)) fail(`sitemap.xml does not list ${loc || '/'}`);
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

/* Report */
for (const note of notes) console.log(`• ${note}`);
if (problems.length) {
  console.error(`\n✗ ${problems.length} problem(s):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}
console.log(`✓ checks passed (${pages.length} pages, ${localRefs.size} local references)`);
