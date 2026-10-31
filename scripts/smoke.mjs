#!/usr/bin/env node
/**
 * Headless smoke test: loads dist/index.html in jsdom, runs the real scripts,
 * and checks that rendering, bilingual switching and navigation work without
 * runtime errors. Supplied shop photos load; menu-item photos exercise their
 * safe placeholder path until genuine item photos are added.
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

// Simulate the owner-supplied photos existing (and unsupported menu-item
// photos remaining absent so the designed placeholder is exercised).
const suppliedPhotos = new Set([
  'owner.jpeg', 'shop.jpeg', 'counter-snacks.jpeg',
  'ice-cream-freezer.jpeg', 'chocolate-freezer.jpeg'
]);
window.Image = class {
  constructor() { this.onload = null; this.onerror = null; this.naturalWidth = 0; }
  set src(value) {
    this._src = value;
    window.setTimeout(() => {
      const found = [...suppliedPhotos].some((name) => value.endsWith(name));
      if (found) {
        this.naturalWidth = 960;
        if (this.onload) this.onload();
      } else if (this.onerror) this.onerror();
    }, 0);
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
expect(document.querySelector('#reviews').hidden === true, 'unverified reviews section stays hidden');
expect([...document.querySelectorAll('[data-review-summary], [data-review-link]')].every((node) => node.hidden), 'unverified ratings and review links stay hidden');
expect(document.querySelector('#offers').hidden === true, 'offers section stays hidden without a promotion');
expect(document.querySelector('#shop').hidden === false, 'shop gallery appears when supplied photos load');
expect(document.querySelectorAll('[data-shop-photo]:not([src*="placeholder"])').length === 4, 'all four real shop gallery images load');
expect(document.querySelectorAll('[data-tilt]').length >= 2, '3D tilt cards are initialised');
expect(document.querySelectorAll('.reveal.is-in').length > 0, 'scroll reveals activate');
expect(document.querySelector('#heroPhoto').getAttribute('src').endsWith('owner.jpeg'), 'owner portrait loads as the homepage hero background');
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
expect(document.querySelector('#reviews').hidden === true, 'unverified review figures remain hidden in Bengali');
expect([...document.querySelectorAll('[data-review-summary], [data-review-link]')].every((node) => node.hidden), 'unverified rating summaries remain hidden in Bengali');
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

/* --- Report --------------------------------------------------------------- */
for (const message of pass) console.log(`  ✓ ${message}`);
if (failures.length) {
  console.error(`\n✗ ${failures.length} smoke test failure(s):`);
  for (const message of failures) console.error(`  - ${message}`);
  process.exit(1);
}
console.log(`\n✓ smoke test passed (${pass.length} assertions)`);
