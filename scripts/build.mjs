#!/usr/bin/env node
/**
 * Builds the deployable multi-page site into ./dist
 *
 *   • assembles every page from templates/layout.html + partials + page body
 *   • injects the active navigation marker, base-relative links, per-page
 *     meta tags and generated Restaurant JSON-LD (from content.js)
 *   • computes a CSP hash for each page's inline JSON-LD block
 *   • bundles + minifies assets/js/app.js   -> dist/assets/js/app.min.js
 *   • minifies assets/css/main.css          -> dist/assets/css/main.min.css
 *   • generates sitemap.xml from the page registry + site.url
 *   • copies static files (404, content.js, i18n, fonts, images, manifest)
 *
 * Owner-editable files (content.js, assets/js/i18n.js, assets/img/photos/*)
 * are copied as-is — the deploy workflow runs this script so the published
 * files always match.
 */
import { build } from 'esbuild';
import { createHash } from 'node:crypto';
import { copyFile, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGES, SITEMAP_PAGES } from './pages.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const templates = path.join(root, 'templates');

const hash = (buffer) => createHash('sha256').update(buffer).digest('base64');
const shortHash = (buffer) => createHash('sha256').update(buffer).digest('hex').slice(0, 8);

async function copyDir(from, to) {
  await mkdir(to, { recursive: true });
  for (const entry of await readdir(from, { withFileTypes: true })) {
    const src = path.join(from, entry.name);
    const dest = path.join(to, entry.name);
    if (entry.isDirectory()) await copyDir(src, dest);
    else if (entry.isFile()) await copyFile(src, dest);
  }
}

/* Load owner content for structured data + site URL */
async function loadContent() {
  globalThis.window = {};
  await import(path.join(root, 'content.js'));
  return globalThis.window.DP_CONTENT;
}

/* ------------------------------------------------------------------ */
/* JSON-LD generated from verified content.js values                   */
/* ------------------------------------------------------------------ */
function restaurantNode(C, siteUrl) {
  const b = C.business;
  const spend = b.spend || {};
  return {
    '@type': 'Restaurant',
    '@id': siteUrl + '#restaurant',
    name: b.name,
    alternateName: b.nameBn,
    description:
      'Fast-food restaurant in Kolaghat, West Bengal, with dine-in and drive-through. Menu highlights include Dahi Vada and Steam Momo.',
    url: siteUrl,
    image: siteUrl + 'assets/img/og-image.png',
    telephone: b.phone && b.phone.tel,
    servesCuisine: ['Fast Food', 'Indian'],
    priceRange: (spend.currency || '₹') + spend.min + '–' + spend.max,
    currenciesAccepted: 'INR',
    address: {
      '@type': 'PostalAddress',
      ...b.schemaAddress
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: b.lat,
      longitude: b.lng
    },
    hasMap: b.mapsUrl,
    areaServed: { '@type': 'City', name: 'Kolaghat' },
    amenityFeature: (b.facilities || []).map((f) => ({
      '@type': 'LocationFeatureSpecification',
      name: f.en,
      value: true
    })),
    hasMenu: siteUrl + 'food/'
  };
}

function jsonLdFor(page, C) {
  const siteUrl = C.site.url;
  const graph = [
    restaurantNode(C, siteUrl),
    {
      '@type': 'WebSite',
      '@id': siteUrl + '#website',
      url: siteUrl,
      name: C.business.name,
      inLanguage: ['en-IN', 'bn-IN'],
      publisher: { '@id': siteUrl + '#restaurant' }
    }
  ];
  if (page.slug) {
    const pageUrl = siteUrl + page.slug;
    graph.push({
      '@type': 'WebPage',
      '@id': pageUrl + '#webpage',
      url: pageUrl,
      name: page.crumb,
      isPartOf: { '@id': siteUrl + '#website' },
      about: { '@id': siteUrl + '#restaurant' },
      inLanguage: ['en-IN', 'bn-IN']
    });
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: page.crumb, item: pageUrl }
      ]
    });
  }
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2);
}

/* ------------------------------------------------------------------ */
/* WhatsApp enquiries                                                  */
/* ------------------------------------------------------------------ */
/* Enquiry messages are addressed to the owner's own WhatsApp. The number
   lives in content.js → whatsapp.number, so the static links are generated
   from it here instead of being typed twice. */
function whatsappConfig(content) {
  const wa = content.whatsapp || {};
  const number = String(wa.number || '').replace(/[^0-9]/g, '');
  const valid = number.length >= 10 && number.length <= 15;
  const enabled = wa.enabled !== false && valid;
  return {
    enabled,
    number,
    url: enabled ? 'https://wa.me/' + number : '',
    template: wa.template || {}
  };
}

/* ------------------------------------------------------------------ */
/* Page assembly                                                       */
/* ------------------------------------------------------------------ */
const escapeAttr = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

async function assemblePage(page, ctx) {
  const { layout, partials, content, cssVersion, jsVersion } = ctx;

  const source = await readFile(path.join(templates, 'pages', page.file), 'utf8');
  const metaMatch = source.match(/^<!--meta\s*([\s\S]*?)-->/);
  if (!metaMatch) throw new Error(`templates/pages/${page.file}: missing <!--meta {…} --> header`);
  const meta = JSON.parse(metaMatch[1]);
  if (meta.page !== page.id) throw new Error(`templates/pages/${page.file}: meta.page "${meta.page}" != "${page.id}"`);
  const main = source.slice(metaMatch[0].length).replace(/^\n/, '');

  // Pages that live in a folder (food/index.html …) need "../" to reach
  // root-level assets and sibling pages; root pages (index, privacy, 404) don't.
  const pageBase = page.out.includes('/') ? '../' : '';
  const homeHref = pageBase ? '../' : './';

  const siteUrl = content.site.url;
  const canonical = siteUrl + page.slug;
  const wa = whatsappConfig(content);
  const jsonld = jsonLdFor(page, content);
  const jsonldHash = `'sha256-${hash(Buffer.from(jsonld, 'utf8'))}'`;

  // Includes first (partials may contain {{…}} too)
  let html = layout.replace(/\{\{include:([\w-]+)\}\}/g, (_, name) => partials[name]);

  // Active navigation marker (works with no JavaScript)
  if (page.nav) {
    const active = `data-nav="${page.nav}" aria-current="page" data-active="1"`;
    html = html.split(`data-nav="${page.nav}"`).join(active);
  }

  const replacements = {
    // The page body goes in first: page templates may use tokens such as
    // {{waUrl}} themselves, so every token must still be resolved afterwards.
    main,
    title: escapeAttr(meta.title),
    desc: escapeAttr(meta.desc),
    canonical: escapeAttr(canonical),
    ogImage: escapeAttr(siteUrl + 'assets/img/og-image.png'),
    base: pageBase,
    home: homeHref,
    page: page.id,
    bodyClass: page.id === 'home' ? '' : 'subpage',
    // WebP is the format findPhoto() tries first, so preload that exact file
    // or the browser downloads the hero twice.
    headExtra: page.id === 'home'
      ? '  <link rel="preload" href="assets/img/photos/owner.webp" as="image" fetchpriority="high">'
      : '',
    jsonld,
    jsonldHash,
    // WhatsApp enquiry links (empty-safe: a disabled config hides the blocks)
    waUrl: escapeAttr(wa.enabled ? wa.url : 'tel:' + ((content.business.phone && content.business.phone.tel) || '')),
    waHidden: wa.enabled ? '' : ' hidden',
    cssVer: cssVersion,
    jsVer: jsVersion
  };
  for (const [key, value] of Object.entries(replacements)) {
    html = html.split(`{{${key}}}`).join(value);
  }

  if (/\{\{[\w:]+\}\}/.test(html)) {
    const leftover = html.match(/\{\{[\w:]+\}\}/g);
    throw new Error(`${page.out}: unresolved template tokens: ${[...new Set(leftover)].join(', ')}`);
  }
  return html;
}

function buildSitemap(content) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = SITEMAP_PAGES.map((page) => {
    const loc = content.site.url + page.slug;
    return [
      '  <url>',
      `    <loc>${loc}</loc>`,
      `    <lastmod>${today}</lastmod>`,
      page.id === 'home' ? '    <changefreq>weekly</changefreq>' : '    <changefreq>monthly</changefreq>',
      `    <priority>${page.priority}</priority>`,
      '  </url>'
    ].join('\n');
  }).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

/* ------------------------------------------------------------------ */
async function main() {
  await rm(dist, { recursive: true, force: true });
  await mkdir(dist, { recursive: true });

  const content = await loadContent();

  // --- JavaScript -----------------------------------------------------------
  await build({
    entryPoints: [path.join(root, 'assets/js/app.js')],
    bundle: true,
    minify: true,
    format: 'iife',
    target: ['es2018'],
    platform: 'browser',
    legalComments: 'none',
    outfile: path.join(dist, 'assets/js/app.min.js'),
    logLevel: 'warning'
  });
  const jsBuffer = await readFile(path.join(dist, 'assets/js/app.min.js'));
  const jsVersion = shortHash(jsBuffer);

  // --- CSS (transform keeps font url() paths untouched) ---------------------
  const cssSource = await readFile(path.join(root, 'assets/css/main.css'), 'utf8');
  const cssResult = await build({
    stdin: { contents: cssSource, loader: 'css', resolveDir: path.join(root, 'assets/css'), sourcefile: 'main.css' },
    minify: true,
    write: false,
    logLevel: 'warning'
  });
  const cssBuffer = Buffer.from(cssResult.outputFiles[0].contents);
  await mkdir(path.join(dist, 'assets/css'), { recursive: true });
  await writeFile(path.join(dist, 'assets/css/main.min.css'), cssBuffer);
  const cssVersion = shortHash(cssBuffer);

  // --- Static assets --------------------------------------------------------
  await mkdir(path.join(dist, 'assets/js'), { recursive: true });
  await copyFile(path.join(root, 'assets/js/i18n.js'), path.join(dist, 'assets/js/i18n.js'));
  for (const dir of ['assets/fonts', 'assets/img']) await copyDir(path.join(root, dir), path.join(dist, dir));
  for (const file of ['content.js', 'manifest.webmanifest', 'robots.txt', '404.html']) {
    await copyFile(path.join(root, file), path.join(dist, file));
  }

  // --- Templates ------------------------------------------------------------
  const layout = await readFile(path.join(templates, 'layout.html'), 'utf8');
  const partialNames = ['header', 'drawer', 'footer', 'sticky', 'consent'];
  const partials = {};
  for (const name of partialNames) {
    partials[name] = await readFile(path.join(templates, 'partials', `${name}.html`), 'utf8');
  }

  const ctx = { layout, partials, content, cssVersion, jsVersion };
  for (const page of PAGES) {
    const html = await assemblePage(page, ctx);
    const outFile = path.join(dist, page.out);
    await mkdir(path.dirname(outFile), { recursive: true });
    await writeFile(outFile, html, 'utf8');
  }

  // 404 stays a standalone file — give it the versioned stylesheet too
  const notFoundPath = path.join(dist, '404.html');
  const notFound = await readFile(notFoundPath, 'utf8');
  await writeFile(
    notFoundPath,
    notFound.replace(/assets\/css\/main\.min\.css(\?v=[^"]*)?/g, `assets/css/main.min.css?v=${cssVersion}`),
    'utf8'
  );

  // --- Sitemap (generated from the registry, never drifts) ------------------
  await writeFile(path.join(dist, 'sitemap.xml'), buildSitemap(content), 'utf8');

  // --- Report ---------------------------------------------------------------
  const sizes = {
    'app.min.js': jsBuffer.length,
    'main.min.css': cssBuffer.length
  };
  for (const [name, bytes] of Object.entries(sizes)) {
    console.log(`  ${name.padEnd(14)} ${(bytes / 1024).toFixed(1)} kB`);
  }
  console.log(`  pages          ${PAGES.length}`);
  console.log('✓ build complete → dist/');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
