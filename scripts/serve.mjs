#!/usr/bin/env node
/**
 * Tiny static server for local preview: serves ./dist on 0.0.0.0:4173
 * (PORT env var supported). No host allowlist, so sandbox previews and
 * iframe embedding work. Run `npm run build` first.
 */
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const port = Number(process.env.PORT || 4173);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

async function resolveFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]);
  let target = path.join(root, path.normalize(clean).replace(/^(\.\.[/\\])+/, ''));
  if (!target.startsWith(root)) return null;
  try {
    const info = await stat(target);
    if (info.isDirectory()) target = path.join(target, 'index.html');
    const file = await stat(target);
    return file.isFile() ? target : null;
  } catch {
    return null;
  }
}

const server = createServer(async (req, res) => {
  const url = req.url || '/';
  const found = await resolveFile(url);

  if (!found) {
    const notFound = await resolveFile('/404.html');
    res.writeHead(404, { 'Content-Type': TYPES['.html'], 'Cache-Control': 'no-store' });
    if (notFound) createReadStream(notFound).pipe(res);
    else res.end('Not found');
    return;
  }

  const ext = path.extname(found).toLowerCase();
  res.writeHead(200, {
    'Content-Type': TYPES[ext] || 'application/octet-stream',
    'Cache-Control': 'no-store',
    'X-UA-Compatible': 'IE=edge'
  });
  if (req.method === 'HEAD') res.end();
  else createReadStream(found).pipe(res);
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Dairy Park preview → http://localhost:${port}/ (serving dist/)`);
});
