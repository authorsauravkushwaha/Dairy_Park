#!/usr/bin/env node
/**
 * Headless smoke test: loads dist/index.html in jsdom, runs the real scripts,
 * and checks that rendering, bilingual switching and navigation work without
 * runtime errors. Images are simulated as "not uploaded" so the placeholder
 * path is exercised too.
 */
import { JSDOM } from 'jsdom';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

const failures = [];
const pass = [];
const expect = (condition, message) => (condition ? pass.push(message) : failures.push(message));

const html = await readFile(path.join(dist, 'index.html'), 'utf8');
const dom = new JSDOM(html, {
  url: 'https://authorsauravkushwaha.github.io/Dairy_Park/',
  runScripts: 'outside-only',
  pretendToBeVisual: true
});
const { window } = dom;
const { document } = window;

/* --- Browser APIs jsdom does not implement ------------------------------- */
window.matchMedia = (query) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener() {},
  removeEventListener() {},
  addListener() {},
  removeListener() {},
  dispatchEvent() { return false; }
});

window.IntersectionObserver = class {
  constructor(callback) { this.callback = callback; }
  observe(target) { this.callback([{ isIntersecting: true, target, intersectionRatio: 1 }], this); }
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
};

window.requestAnimationFrame = (callback) => window.setTimeout(() => callback(Date.now()), 0);
window.cancelAnimationFrame = (id) => window.clearTimeout(id);
window.Element.prototype.scrollIntoView = function () {};
window.scrollTo = () => {};

// Simulate "no owner photos uploaded yet": every image probe fails.
window.Image = class {
  constructor() { this.onload = null; this.onerror = null; this.naturalWidth = 0; }
  set src(value) {
    this._src = value;
    window.setTimeout(() => { if (this.onerror) this.onerror(); }, 0);
  }
  get src() { return this._src; }
};

const runtimeErrors = [];
window.addEventListener('error', (event) => runtimeErrors.push(event.message || String(event.error)));
window.addEventListener('unhandledrejection', (event) => runtimeErrors.push(String(event.reason)));

const run = async (file) => {
  const code = await readFile(path.join(dist, file), 'utf8');
  window.eval(code);
};

await run('content.js');
await run('assets/js/i18n.js');
await run('assets/js/app.min.js');
await new Promise((resolve) => window.setTimeout(resolve, 120));

/* --- Initial (English) render -------------------------------------------- */
expect(runtimeErrors.length === 0, `no runtime errors${runtimeErrors.length ? ': ' + runtimeErrors.join(' | ') : ''}`);
expect(document.documentElement.getAttribute('lang') === 'en', 'document language starts as English');
expect(document.title.includes('Dairy Park'), 'document title is set');
expect(document.querySelectorAll('[data-dish-id]').length === 2, 'both menu items render');
expect(document.querySelectorAll('#facilityList li').length === 2, 'facilities render from content.js');
expect(document.querySelector('#reviews').hidden === false, 'reviews section is visible');
expect(document.querySelector('#offers').hidden === true, 'offers section stays hidden without a promotion');
expect(document.querySelector('#shop').hidden === true, 'shop gallery stays hidden without photos');
expect(document.querySelectorAll('[data-tilt]').length >= 2, '3D tilt cards are initialised');
expect(document.querySelectorAll('.reveal.is-in').length > 0, 'scroll reveals activate');
expect(document.querySelector('#ownerPortrait').hidden, 'owner portrait stays hidden until a real photo is uploaded');
expect(document.querySelector('.hero__bg img').getAttribute('src').includes('placeholder-hero'), 'decorative hero background uses the designed placeholder');
expect([...document.querySelectorAll('[data-offers-link]')].every((node) => node.hidden), 'offers nav links stay hidden');

const hoursText = document.querySelector('[data-bind="hours"]').textContent;
expect(/confirm|10:30 PM/.test(hoursText), 'hours ask visitors to confirm and quote only the listed closing time');

const phoneLinks = [...document.querySelectorAll('a[href^="tel:"]')];
expect(phoneLinks.length >= 5, 'click-to-call links are present throughout');
expect(phoneLinks.every((a) => a.getAttribute('href') === 'tel:+919932452124'), 'every call link uses the verified number');

const directionLinks = [...document.querySelectorAll('a[href*="google.com/maps/dir"]')];
expect(directionLinks.length >= 4, 'get-directions links are present');

const mapFrame = document.querySelector('#location iframe');
expect(mapFrame && mapFrame.src.includes('output=embed'), 'Google Map embed is wired up');

/* --- Language switching --------------------------------------------------- */
document.querySelector('[data-lang="bn"]').click();
await new Promise((resolve) => window.setTimeout(resolve, 60));

expect(document.documentElement.getAttribute('lang') === 'bn', 'language switches to Bengali');
expect(document.querySelector('[data-i18n="nav.menu"]').textContent === 'মেনু', 'navigation is translated');
expect(document.title.includes('ডেয়ারি পার্ক'), 'page title is translated');
expect(document.querySelector('[data-i18n="hero.cta1"]').textContent === 'পথনির্দেশ পান', 'hero CTA is translated');
expect(document.querySelector('.sticky-bar__btn--call span').textContent === 'কল করুন', 'sticky call button is translated');
expect(document.querySelectorAll('[data-dish-id]').length === 2, 'menu re-renders in Bengali');
expect(document.querySelector('[data-bind="rating"]').textContent === '৪.০', 'rating uses Bengali numerals');
expect(document.querySelector('[data-bind="reviewCount"]').textContent === '২০৪', 'review count uses Bengali numerals');
expect(document.querySelector('[data-bind="hours"]').textContent.includes('১০:৩০'), 'closing time is localised');
expect(window.localStorage.getItem('dp-lang') === 'bn', 'language choice is remembered');

document.querySelector('[data-lang="en"]').click();
await new Promise((resolve) => window.setTimeout(resolve, 60));
expect(document.querySelector('[data-i18n="nav.menu"]').textContent === 'Menu', 'language switches back to English');

/* --- Mobile navigation ---------------------------------------------------- */
const toggle = document.querySelector('.nav-toggle');
toggle.click();
await new Promise((resolve) => window.setTimeout(resolve, 60));
expect(toggle.getAttribute('aria-expanded') === 'true', 'menu button announces the open state');
expect(document.querySelector('#drawer').hidden === false, 'mobile drawer opens');
expect(document.documentElement.classList.contains('is-locked'), 'page scroll locks while the drawer is open');
expect(toggle.getAttribute('aria-label').length > 0, 'menu button has an accessible label');

window.document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }));
await new Promise((resolve) => window.setTimeout(resolve, 400));
expect(toggle.getAttribute('aria-expanded') === 'false', 'Escape closes the drawer');

/* --- Analytics stays private --------------------------------------------- */
expect(document.querySelector('#consent').hidden === true, 'no consent banner while analytics is disabled');
expect(typeof window.dataLayer !== 'undefined', 'analytics event layer is ready');

/* --- Uploaded owner photo ------------------------------------------------- */
const photoDom = new JSDOM(html, {
  url: 'https://authorsauravkushwaha.github.io/Dairy_Park/',
  runScripts: 'outside-only',
  pretendToBeVisual: true
});
const photoWindow = photoDom.window;
photoWindow.matchMedia = window.matchMedia;
photoWindow.IntersectionObserver = window.IntersectionObserver;
photoWindow.requestAnimationFrame = window.requestAnimationFrame.bind(photoWindow);
photoWindow.cancelAnimationFrame = window.cancelAnimationFrame.bind(photoWindow);
photoWindow.Element.prototype.scrollIntoView = function () {};
photoWindow.scrollTo = () => {};
photoWindow.Image = class {
  constructor() { this.onload = null; this.onerror = null; this.naturalWidth = 900; }
  set src(value) {
    photoWindow.setTimeout(() => {
      if (value.includes('/owner.webp')) this.onload?.();
      else this.onerror?.();
    }, 0);
  }
};
for (const file of ['content.js', 'assets/js/i18n.js', 'assets/js/app.min.js']) {
  photoWindow.eval(await readFile(path.join(dist, file), 'utf8'));
}
await new Promise((resolve) => photoWindow.setTimeout(resolve, 120));
const portrait = photoWindow.document.querySelector('#ownerPortrait');
expect(portrait.hidden === false, 'uploaded owner portrait becomes visible');
expect(photoWindow.document.querySelector('#heroPhoto').getAttribute('src').endsWith('/owner.webp'), 'portrait uses the uploaded owner photo');
expect(photoWindow.document.querySelector('.hero').classList.contains('has-owner-photo'), 'decorative stage gives way to the owner photo');
photoWindow.document.querySelector('[data-lang="bn"]').click();
expect(portrait.querySelector('figcaption').textContent === 'ডেয়ারি পার্কের মালিককে চিনুন', 'owner caption translates to Bengali');
photoWindow.close();

/* --- Report --------------------------------------------------------------- */
for (const message of pass) console.log(`  ✓ ${message}`);
if (failures.length) {
  console.error(`\n✗ ${failures.length} smoke test failure(s):`);
  for (const message of failures) console.error(`  - ${message}`);
  process.exit(1);
}
console.log(`\n✓ smoke test passed (${pass.length} assertions)`);
