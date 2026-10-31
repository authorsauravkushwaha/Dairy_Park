#!/usr/bin/env node
/**
 * Headless smoke test: loads every built page in jsdom, runs the real scripts,
 * and checks rendering, bilingual switching, navigation, the food filters,
 * the gallery lightbox, offers empty state and the honest contact form.
 * Image probes fail on purpose so the placeholder paths are exercised.
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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function loadPage(outFile, urlPath) {
  const html = await readFile(path.join(dist, outFile), 'utf8');
  const dom = new JSDOM(html, {
    url: 'https://authorsauravkushwaha.github.io/Dairy_Park/' + urlPath,
    runScripts: 'outside-only',
    pretendToBeVisual: true
  });
  const { window } = dom;

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
  await sleep(140);

  return { window, document: window.document, runtimeErrors };
}

/* ========================================================================== */
/* HOME                                                                       */
/* ========================================================================== */
{
  const { document, window, runtimeErrors } = await loadPage('index.html', '');
  expect(runtimeErrors.length === 0, `home: no runtime errors${runtimeErrors.length ? ': ' + runtimeErrors.join(' | ') : ''}`);
  expect(document.documentElement.getAttribute('lang') === 'en', 'home: starts in English');
  expect(document.title.includes('Dairy Park'), 'home: title is set');
  expect(document.querySelectorAll('[data-dish-id]').length === 2, 'home: both featured menu items render');
  expect(document.querySelectorAll('#facilityList li').length === 2, 'home: facilities render');
  expect(document.querySelector('#offers, #offersActive') === null, 'home: no offers section leaks onto the homepage');
  expect(!!document.querySelector('#galleryPreview'), 'home: gallery preview container exists');
  expect(document.querySelector('#galleryPreview .gallery-preview__empty') !== null, 'home: honest gallery empty panel without photos');
  expect(document.querySelector('.closing') !== null, 'home: closing CTA exists');
  expect(document.querySelectorAll('.welcome-card').length === 4, 'home: welcome cards render');

  // Navigation wiring
  const navLinks = [...document.querySelectorAll('.nav .nav__link')];
  expect(navLinks.length === 8, 'home: desktop nav has all 8 destinations');
  const homeNav = document.querySelector('.nav [data-nav="home"]');
  expect(homeNav && homeNav.getAttribute('aria-current') === 'page', 'home: home nav item is marked active');
  expect([...document.querySelectorAll('a[href^="tel:"]')].every((a) => a.getAttribute('href') === 'tel:+919932452124'), 'home: every call link uses the verified number');
  expect(document.querySelector('a[href="food/"]') !== null, 'home: Explore-Our-Food CTA points at /food/');
  expect(document.querySelector('a[href="gallery/"]') !== null, 'home: View-Full-Gallery CTA points at /gallery/');
  expect(document.querySelector('a[href="reviews/"]') !== null, 'home: Read-More-Reviews CTA points at /reviews/');
  expect(document.querySelector('a[href="visit/"]') !== null, 'home: location preview links to /visit/');

  // Language switch keeps the visitor on the same page
  document.querySelector('[data-lang="bn"]').click();
  await sleep(80);
  expect(document.documentElement.getAttribute('lang') === 'bn', 'home: language switches to Bengali');
  expect(document.querySelector('[data-i18n="nav.menu"]').textContent === 'খাবার ও মেনু', 'home: navigation is translated');
  expect(document.title.includes('ডেয়ারি পার্ক'), 'home: page title is translated');
  expect(window.location.pathname === '/Dairy_Park/', 'home: language switch keeps the current page');
  expect(document.querySelector('[data-bind="rating"]').textContent === '৪.০', 'home: rating uses Bengali numerals');
  expect(document.querySelectorAll('[data-dish-id]').length === 2, 'home: menu re-renders in Bengali');
  expect(window.localStorage.getItem('dp-lang') === 'bn', 'home: language choice is remembered');

  // Mobile drawer
  document.querySelector('[data-lang="en"]').click();
  await sleep(60);
  const toggle = document.querySelector('.nav-toggle');
  toggle.click();
  await sleep(60);
  expect(toggle.getAttribute('aria-expanded') === 'true' && document.querySelector('#drawer').hidden === false, 'home: mobile drawer opens');
  document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }));
  await sleep(400);
  expect(toggle.getAttribute('aria-expanded') === 'false', 'home: Escape closes the drawer');
}

/* ========================================================================== */
/* FOOD & MENU                                                                */
/* ========================================================================== */
{
  const { document, window, runtimeErrors } = await loadPage('food/index.html', 'food/');
  expect(runtimeErrors.length === 0, `food: no runtime errors${runtimeErrors.length ? ': ' + runtimeErrors.join(' | ') : ''}`);
  expect(document.querySelector('#featured').hidden === false, 'food: featured section visible');
  expect(document.querySelectorAll('#featuredGrid [data-dish-id]').length === 2, 'food: featured grid shows the two highlights');
  expect(document.querySelectorAll('#menuGrid [data-dish-id]').length === 2, 'food: full menu grid renders');

  const cats = [...document.querySelectorAll('.menu-cat')];
  expect(cats.length === 3, 'food: category chips = All + the two non-empty categories');
  expect(cats[0].classList.contains('is-active'), 'food: "All" is active initially');

  // Category filter
  const momoChip = cats.find((c) => c.textContent === 'Momos');
  momoChip.click();
  await sleep(40);
  expect(document.querySelectorAll('#menuGrid [data-dish-id]').length === 1, 'food: Momos filter leaves one dish');
  expect(document.querySelector('#menuGrid [data-dish-id]').dataset.dishId === 'steam-momo', 'food: filtered dish is Steam Momo');

  // Search + empty state
  const search = document.querySelector('#menuSearch');
  search.value = 'zzz-no-such-dish';
  search.dispatchEvent(new window.Event('input', { bubbles: true }));
  await sleep(200);
  expect(document.querySelector('#menuEmpty').hidden === false, 'food: empty state appears for a dead search');
  document.querySelector('#menuClear').click();
  await sleep(60);
  expect(document.querySelectorAll('#menuGrid [data-dish-id]').length === 2, 'food: clear filters restores the grid');
  expect(document.querySelector('#menuEmpty').hidden === true, 'food: empty state hides after clearing');

  // Detail dialog
  document.querySelector('#menuGrid [data-dish-id]').click();
  await sleep(60);
  const dialog = document.querySelector('#dishDialog');
  expect(dialog.open === true || dialog.hasAttribute('open'), 'food: dish detail dialog opens');
  expect(document.querySelector('#dishDialogBody .dish-dialog__title') !== null, 'food: dialog shows the dish title');
  expect(document.querySelectorAll('#dishDialogBody a[href^="tel:"]').length === 1, 'food: dialog has a call-to-enquire button');
  document.querySelector('#dishDialogClose').click();
  await sleep(40);
  expect(dialog.open === false || !dialog.hasAttribute('open'), 'food: dialog closes');

  // Empty configured categories must not appear
  expect(![...document.querySelectorAll('.menu-cat')].some((c) => /Beverages|Chaat|Ice Cream/i.test(c.textContent)), 'food: empty categories stay hidden');
}

/* ========================================================================== */
/* GALLERY                                                                    */
/* ========================================================================== */
{
  const { document, runtimeErrors } = await loadPage('gallery/index.html', 'gallery/');
  expect(runtimeErrors.length === 0, `gallery: no runtime errors${runtimeErrors.length ? ': ' + runtimeErrors.join(' | ') : ''}`);
  expect(document.querySelectorAll('.gallery-section').length === 4, 'gallery: four sections render');
  expect(document.querySelectorAll('.masonry__item--placeholder').length === 4, 'gallery: each empty section shows one designed placeholder');
  expect(document.querySelector('#lightbox').hidden === true, 'gallery: lightbox starts closed');
  const titles = [...document.querySelectorAll('.gallery-section__title')].map((n) => n.textContent);
  expect(titles.join('|').includes('Restaurant Exterior') && titles.join('|').includes('Food & Menu'), 'gallery: section titles are present');
}

/* ========================================================================== */
/* OFFERS                                                                     */
/* ========================================================================== */
{
  const { document, runtimeErrors } = await loadPage('offers/index.html', 'offers/');
  expect(runtimeErrors.length === 0, `offers: no runtime errors${runtimeErrors.length ? ': ' + runtimeErrors.join(' | ') : ''}`);
  expect(document.querySelector('#offersActive').hidden === true, 'offers: active section hidden without promotions');
  expect(document.querySelector('#offersEmpty').hidden === false, 'offers: informative empty state is shown');
  expect(document.querySelector('#offersEmpty a[href^="tel:"]') !== null, 'offers: empty state offers a call CTA');
}

/* ========================================================================== */
/* REVIEWS                                                                    */
/* ========================================================================== */
{
  const { document, window, runtimeErrors } = await loadPage('reviews/index.html', 'reviews/');
  expect(runtimeErrors.length === 0, `reviews: no runtime errors${runtimeErrors.length ? ': ' + runtimeErrors.join(' | ') : ''}`);
  expect(document.querySelector('[data-bind="rating"]').textContent === '4.0', 'reviews: rating shows as listed');
  expect(document.querySelector('[data-bind="reviewsLead"]').textContent.includes('204'), 'reviews: review count shows as listed');
  expect(document.querySelectorAll('[data-bind-stars] .star-fill').length === 4, 'reviews: four filled stars for a 4.0 rating');
  const googleLinks = [...document.querySelectorAll('a[href*="google.com/maps/place"]')];
  expect(googleLinks.length >= 2, 'reviews: links to the original Google reviews');
  document.querySelector('[data-lang="bn"]').click();
  await sleep(80);
  expect(window.location.pathname === '/Dairy_Park/reviews/', 'reviews: language switch stays on the reviews page');
  expect(document.querySelector('[data-bind="rating"]').textContent === '৪.০', 'reviews: Bengali numerals after switch');
}

/* ========================================================================== */
/* VISIT                                                                      */
/* ========================================================================== */
{
  const { document, runtimeErrors } = await loadPage('visit/index.html', 'visit/');
  expect(runtimeErrors.length === 0, `visit: no runtime errors${runtimeErrors.length ? ': ' + runtimeErrors.join(' | ') : ''}`);
  expect(document.querySelector('#location iframe') !== null, 'visit: Google Map embed is wired up');
  expect(document.querySelectorAll('#facilityList li').length === 2, 'visit: dine-in + drive-through listed');
  const hoursText = document.querySelector('[data-bind="hours"]').textContent;
  expect(/confirm|10:30 PM/.test(hoursText), 'visit: hours ask visitors to confirm');
  expect(document.querySelector('[data-bind="spend"]').textContent.includes('1–200'), 'visit: typical spend shown');
}

/* ========================================================================== */
/* CONTACT                                                                    */
/* ========================================================================== */
{
  const { document, window, runtimeErrors } = await loadPage('contact/index.html', 'contact/');
  expect(runtimeErrors.length === 0, `contact: no runtime errors${runtimeErrors.length ? ': ' + runtimeErrors.join(' | ') : ''}`);
  expect(document.querySelectorAll('.contact-card').length === 3, 'contact: phone, address and hours cards render');
  expect(document.querySelector('#location iframe, .contact-map iframe') !== null, 'contact: map embed present');

  const form = document.querySelector('#enquiryForm');
  form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
  await sleep(40);
  expect(document.querySelector('#formError').hidden === false, 'contact: empty submit shows a validation error');
  expect(document.querySelector('#formStatus').hidden === true, 'contact: no status shown for an invalid form');

  form.elements.name.value = 'Test Visitor';
  form.elements.phone.value = '9876543210';
  form.elements.message.value = 'Are Steam Momos available this evening?';
  form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
  await sleep(40);
  expect(document.querySelector('#formError').hidden === true, 'contact: valid input clears the error');
  expect(document.querySelector('#formStatus').hidden === false, 'contact: valid input reveals the honest status panel');
  expect(document.querySelector('#formStatus a[href^="tel:"]') !== null, 'contact: status hands the visitor a call button');
  expect(/haven’t received|can’t send/i.test(document.querySelector('#formStatus').textContent), 'contact: status admits nothing was transmitted');
}

/* ========================================================================== */
/* ABOUT + PRIVACY                                                            */
/* ========================================================================== */
{
  const { document, runtimeErrors } = await loadPage('about/index.html', 'about/');
  expect(runtimeErrors.length === 0, `about: no runtime errors${runtimeErrors.length ? ': ' + runtimeErrors.join(' | ') : ''}`);
  expect(document.querySelectorAll('.fact').length >= 4, 'about: facilities section renders');
  expect(document.querySelectorAll('.explore-item').length === 4, 'about: explore list renders');
  expect(document.querySelector('a[href="../food/"]') !== null, 'about: menu CTA points to /food/');
}
{
  const { document, runtimeErrors } = await loadPage('privacy.html', 'privacy.html');
  expect(runtimeErrors.length === 0, `privacy: no runtime errors${runtimeErrors.length ? ': ' + runtimeErrors.join(' | ') : ''}`);
  expect(document.querySelectorAll('.page__section').length === 2, 'privacy: English + Bengali sections render');
  expect(document.querySelector('.site-header') !== null, 'privacy: shares the site header');
}

/* Report */
for (const message of pass) console.log(`  ✓ ${message}`);
if (failures.length) {
  console.error(`\n✗ ${failures.length} smoke test failure(s):`);
  for (const message of failures) console.error(`  - ${message}`);
  process.exit(1);
}
console.log(`\n✓ smoke test passed (${pass.length} assertions)`);
