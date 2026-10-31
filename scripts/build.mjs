#!/usr/bin/env node
/**
 * Builds the deployable site into ./dist
 *
 *   • bundles + minifies assets/js/app.js   -> dist/assets/js/app.min.js
 *   • minifies assets/css/main.css          -> dist/assets/css/main.min.css
 *   • copies static files (html, content.js, translations, fonts, images)
 *   • adds a Content-Security-Policy hash for the inline JSON-LD block
 *   • adds cache-busting hashes to the CSS/JS URLs
 *
 * Owner-editable files (content.js, assets/js/i18n.js, assets/img/photos/*)
 * are copied as-is — they never need a rebuild to be edited locally, but the
 * deploy workflow runs this script so the published files always match.
 */
import { build } from 'esbuild';
import { createHash } from 'node:crypto';
import { copyFile, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

const PAGES = ['index.html', '404.html', 'privacy.html'];
const FILES = ['content.js', 'manifest.webmanifest', 'robots.txt', 'sitemap.xml'];
const DIRS = ['assets/fonts', 'assets/img'];

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

async function main() {
  await rm(dist, { recursive: true, force: true });
  await mkdir(dist, { recursive: true });

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
  for (const dir of DIRS) await copyDir(path.join(root, dir), path.join(dist, dir));
  for (const file of [...PAGES, ...FILES]) {
    const src = path.join(root, file);
    try {
      await stat(src);
    } catch {
      console.warn(`! missing ${file}`);
      continue;
    }
    await copyFile(src, path.join(dist, file));
  }

  // --- HTML: CSP hash for the JSON-LD data block + asset versions -----------
  for (const page of PAGES) {
    const file = path.join(dist, page);
    let html;
    try {
      html = await readFile(file, 'utf8');
    } catch {
      continue;
    }

    const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    if (ld) {
      const ldHash = `'sha256-${hash(Buffer.from(ld[1], 'utf8'))}'`;
      html = html.replace('__JSONLD_HASH__', ldHash);
    } else {
      html = html.replace('__JSONLD_HASH__', '');
    }

    html = html
      .replace(/assets\/css\/main\.min\.css(\?v=[^"]*)?/g, `assets/css/main.min.css?v=${cssVersion}`)
      .replace(/assets\/js\/app\.min\.js(\?v=[^"]*)?/g, `assets/js/app.min.js?v=${jsVersion}`);

    if (html.includes('__JSONLD_HASH__')) {
      throw new Error(`CSP placeholder was not replaced in ${page}`);
    }
    await writeFile(file, html, 'utf8');
  }

  // --- Report ---------------------------------------------------------------
  const sizes = {
    'app.min.js': jsBuffer.length,
    'main.min.css': cssBuffer.length,
    'index.html': (await stat(path.join(dist, 'index.html'))).size
  };
  for (const [name, bytes] of Object.entries(sizes)) {
    console.log(`  ${name.padEnd(14)} ${(bytes / 1024).toFixed(1)} kB`);
  }
  console.log('✓ build complete → dist/');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
