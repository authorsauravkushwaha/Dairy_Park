#!/usr/bin/env node
/**
 * Headless smoke test: loads every built page in jsdom, runs the real scripts,
 * and checks rendering, bilingual switching, navigation, the food filters,
 * the gallery lightbox, offers empty state and the honest contact form.
 * Photo probes resolve against the files that actually ship, so the real-photo
 * paths are exercised; only files that are absent fall back to placeholders.
 */
import { JSDOM } from 'jsdom';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

/** Owner content, loaded once so the assertions follow content.js rather than
 *  hard-coded counts (the menu grows without breaking the suite). */
globalThis.window = {};
await import(path.join(dist, 'content.js'));
const CONTENT = globalThis.window.DP_CONTENT;
const MENU = CONTENT.menu || [];
const HIGHLIGHTS = MENU.filter((item) => item && item.highlight === true);
const FACILITIES = (CONTENT.business && CONTENT.business.facilities) || [];
const PRICED = MENU.filter((item) => item.price !== null && item.price !== undefined && item.price !== '');
const CHEAPEST = PRICED.reduce((min, item) => {
  const value = Number(String(item.price).replace(/[^0-9.]/g, ''));
  return value && value < min ? value : min;
}, Infinity);
const USED_CATEGORIES = (CONTENT.menuCategories || []).filter((cat) => MENU.some((item) => item.category === cat.id));

const failures = [];
const pass = [];
const expect = (condition, message) => (condition ? pass.push(message) : failures.push(message));

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Photo files actually shipped in dist — mirrored here so the image probes in
 *  jsdom resolve the same way they do in a real browser. */
let shippedPhotoCache = null;
async function shippedPhotos() {
  if (shippedPhotoCache) return shippedPhotoCache;
  const files = await readdir(path.join(dist, 'assets/img/photos')).catch(() => []);
  shippedPhotoCache = new Set(
    files
      .filter((f) => /\.(webp|avif|jpe?g|png)$/i.test(f))
  );
  return shippedPhotoCache;
}

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

  // Simulate the photos that are actually shipped in dist/assets/img/photos/, so
  // the photo-driven extras are exercised against the real set.
  const suppliedPhotos = await shippedPhotos();
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
  expect(
    document.querySelectorAll('[data-dish-id]').length === HIGHLIGHTS.length,
    `home: all ${HIGHLIGHTS.length} highlight dishes render`
  );
  expect(document.querySelectorAll('#facilityList li').length === FACILITIES.length, 'home: facilities render');
  expect(document.querySelector('#offers, #offersActive') === null, 'home: no offers section leaks onto the homepage');
  expect(!!document.querySelector('#galleryPreview'), 'home: gallery preview container exists');
  const previewTiles = [...document.querySelectorAll('#galleryPreview .gallery-preview__tile')];
  expect(previewTiles.length === 4, 'home: gallery preview shows four tiles');
  expect(previewTiles.every((tile) => tile.classList.contains('has-photo')), 'home: every preview tile shows a supplied photograph');
  expect(previewTiles.every((tile) => /photos\//.test(tile.querySelector('img').getAttribute('src'))), 'home: preview tiles point at the photo folder');
  const previewSrcs = previewTiles.map((tile) => tile.querySelector('img').getAttribute('src')).join(' ');
  expect(/shop-front/.test(previewSrcs) && /interior-/.test(previewSrcs) && /dahi-vada/.test(previewSrcs), 'home: preview mixes the shopfront, the dining room and the food');
  expect(document.querySelector('.hero.has-owner') !== null, 'home: owner portrait appears in the hero with the supplied photo');
  expect(/owner\.(webp|avif|jpe?g|png)$/.test(document.querySelector('#ownerPortrait').getAttribute('src')), 'home: portrait uses the real owner photo');
  expect(/shop-front\.(webp|avif|jpe?g|png)$/.test(document.querySelector('#heroPhoto').getAttribute('src')), 'home: hero background uses the shopfront photo');
  expect(document.querySelector('.hero__botanical') !== null, 'home: hero carries its botanical line art');
  expect(document.querySelector('.hero.has-shopfront') !== null, 'home: the shopfront stays sharp behind the headline');
  expect(document.querySelector('.closing') !== null, 'home: closing CTA exists');
  expect(document.querySelectorAll('.welcome-card').length === 5, 'home: welcome cards render, including pure veg');
  expect(document.querySelector('.welcome-card--veg') !== null, 'home: the pure-veg card is called out');

  // Menu-led additions: the seal, the price ribbon and the price facts
  expect(document.querySelector('.hero__seal .seal') !== null, 'home: the pure-veg seal floats in the hero');
  const ribbon = document.querySelector('.hero__ribbon');
  expect(ribbon !== null, 'home: the hero carries a pure-veg + price ribbon');
  expect(/Pure Veg/i.test(ribbon.textContent), 'home: the ribbon says pure veg');
  expect(ribbon.textContent.includes('₹' + CHEAPEST), 'home: the ribbon quotes the cheapest printed price');
  expect(document.querySelector('[data-bind="menuCount"]').textContent === String(PRICED.length), 'home: the dish count comes from the menu');
  expect(document.querySelector('[data-bind="priceFrom"]').textContent === '₹' + CHEAPEST, 'home: the cheapest price is read from the menu');

  // The two new photographic bands
  expect(document.querySelectorAll('.dine__facts li').length === 3, 'home: the dining-room band lists its three facts');
  expect(document.querySelectorAll('.dine__photos .arch-photo.has-photo').length === 2, 'home: both dining-room photographs load');
  expect(document.querySelectorAll('.counter-card').length === 3, 'home: the dairy counter shows three cards');
  expect(document.querySelectorAll('.counter-card__photo.has-photo').length === 3, 'home: every counter photograph loads');

  // Navigation wiring
  const navLinks = [...document.querySelectorAll('.nav .nav__link')];
  expect(navLinks.length === 8, 'home: desktop nav has all 8 destinations');
  const homeNav = document.querySelector('.nav [data-nav="home"]');
  expect(homeNav && homeNav.getAttribute('aria-current') === 'page', 'home: home nav item is marked active');
  expect([...document.querySelectorAll('a[href^="tel:"]')].every((a) => a.getAttribute('href') === 'tel:+919932452124'), 'home: every call link uses the verified number');
  expect(document.querySelector('a[href="food/"]') !== null, 'home: Explore-Our-Food CTA points at /food/');
  expect(document.querySelector('a[href="gallery/"]') !== null, 'home: View-Full-Gallery CTA points at /gallery/');
  expect(document.querySelector('a[href="visit/"]') !== null, 'home: location preview links to /visit/');

  // Reviews stay hidden until the owner re-verifies the Google listing
  expect(document.querySelector('#reviews').hidden === true, 'home: unverified reviews section stays hidden');
  expect([...document.querySelectorAll('[data-review-summary]')].every((node) => node.hidden), 'home: unverified rating chips stay hidden');
  expect([...document.querySelectorAll('[data-review-link]')].every((node) => node.hidden), 'home: review nav links stay hidden');
  expect(document.querySelector('.nav [data-nav="reviews"]').hidden === true, 'home: Reviews nav item hides while unverified');

  // Home page extras added on top of the multi-page build
  expect(document.querySelector('#trust') !== null, 'home: trust band exists');
  expect(document.querySelectorAll('.trust__item:not([hidden])').length === 4, 'home: trust band hides the unverified rating figures');
  // dataset.count is the settled value; .textContent is mid-count-up at this point
  expect(document.querySelector('[data-bind="facilityCount"]').dataset.count === String(FACILITIES.length), 'home: facility count comes from content.js');
  expect(document.querySelector('[data-bind="spend"]').textContent === '₹1–200', 'home: typical spend renders');
  expect(document.querySelector('#pairing') !== null, 'home: order-both strip exists');
  expect(document.querySelector('[data-bind="pairingTitle"]').textContent.length > 0, 'home: order-both strip has its headline');
  expect(
    document.querySelectorAll('.dish__tag').length === HIGHLIGHTS.filter((item) => item.tag).length,
    'home: dish cards render their gold tag ribbon'
  );
  expect(document.querySelectorAll('.dish--nophoto').length > 0, 'home: dishes without a photograph get the printed-card look');
  expect(document.querySelectorAll('.dish--nophoto img').length === 0, 'home: no placeholder image is left in a photo-less card');

  // Photo-driven extras appear once the dish photos are supplied
  expect(document.querySelectorAll('.pairing__plate').length === 2, 'home: order-both strip shows both dish photos');
  expect(document.querySelector('#heroPicks').hidden === false, 'home: hero dish peeks appear with the supplied photos');

  // Language switch keeps the visitor on the same page
  document.querySelector('[data-lang="bn"]').click();
  await sleep(80);
  expect(document.documentElement.getAttribute('lang') === 'bn', 'home: language switches to Bengali');
  expect(document.querySelector('[data-i18n="nav.menu"]').textContent === 'খাবার ও মেনু', 'home: navigation is translated');
  expect(document.title.includes('ডেয়ারি পার্ক'), 'home: page title is translated');
  expect(window.location.pathname === '/Dairy_Park/', 'home: language switch keeps the current page');
  expect(document.querySelector('#reviews').hidden === true, 'home: reviews stay hidden after switching language');
  expect(document.querySelectorAll('[data-dish-id]').length === HIGHLIGHTS.length, 'home: menu re-renders in Bengali');
  expect(document.querySelector('[data-bind="priceFrom"]').textContent === '₹' + String(CHEAPEST).replace(/[0-9]/g, (d) => '০১২৩৪৫৬৭৮৯'[Number(d)]), 'home: the cheapest price is localised in Bengali');
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
  expect(
    document.querySelectorAll('#featuredGrid [data-dish-id]').length === HIGHLIGHTS.length,
    'food: featured grid shows every highlight'
  );
  expect(
    document.querySelectorAll('#menuGrid [data-dish-id]').length === MENU.length,
    'food: the whole printed menu renders'
  );

  const cats = [...document.querySelectorAll('.menu-cat')];
  expect(cats.length === USED_CATEGORIES.length + 1, 'food: category chips = All + every non-empty category');
  expect(cats[0].classList.contains('is-active'), 'food: "All" is active initially');

  // The price list itself
  expect(document.querySelectorAll('#menuGrid .menu-group').length === USED_CATEGORIES.length, 'food: the list is grouped by category');
  const rowPrices = [...document.querySelectorAll('#menuGrid .menu-row__price')];
  expect(rowPrices.length === MENU.length, 'food: every dish shows a price or an ask-for-price note');
  expect(rowPrices.filter((node) => /^₹\d/.test(node.textContent)).length === PRICED.length, 'food: printed prices come from the menu card');
  expect(document.querySelector('#menuGrid .menu-row[data-dish-id="dahi-vada"]').textContent.includes('₹80'), 'food: Dahi Vada shows its printed ₹80');
  expect(document.querySelectorAll('.menu-stats .menu-stat:not([hidden])').length === 3, 'food: the menu-in-numbers strip renders');
  expect(document.querySelector('[data-bind="menuCount"]').textContent === String(PRICED.length), 'food: the dish count matches the menu');
  expect(document.querySelectorAll('.menu-card-band .menu-shot img').length === 3, 'food: the printed menu card photographs are shown');
  expect(
    [...document.querySelectorAll('#menuGrid .menu-group__title')].every((node) => node.textContent.trim().length > 0),
    'food: every price-list group is titled'
  );

  // Category filter
  const momoChip = cats.find((c) => c.textContent === 'Momos');
  momoChip.click();
  await sleep(40);
  const momoRows = [...document.querySelectorAll('#menuGrid [data-dish-id]')];
  expect(momoRows.length === MENU.filter((item) => item.category === 'momos').length, 'food: the Momos filter leaves only momos');
  expect(momoRows.some((row) => row.dataset.dishId === 'steam-momo'), 'food: Steam Momo is among the filtered rows');

  // Search + empty state
  const search = document.querySelector('#menuSearch');
  search.value = 'zzz-no-such-dish';
  search.dispatchEvent(new window.Event('input', { bubbles: true }));
  await sleep(200);
  expect(document.querySelector('#menuEmpty').hidden === false, 'food: empty state appears for a dead search');
  document.querySelector('#menuClear').click();
  await sleep(60);
  expect(document.querySelectorAll('#menuGrid [data-dish-id]').length === MENU.length, 'food: clear filters restores the grid');
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
  const chipLabels = [...document.querySelectorAll('.menu-cat')].map((c) => c.textContent);
  expect(!chipLabels.includes('Desserts'), 'food: categories with no items stay hidden');
  expect(
    USED_CATEGORIES.every((cat) => chipLabels.includes(cat.name.en)),
    'food: every category that has items is offered as a filter'
  );
}

/* ========================================================================== */
/* GALLERY                                                                    */
/* ========================================================================== */
{
  const { document, window, runtimeErrors } = await loadPage('gallery/index.html', 'gallery/');
  expect(runtimeErrors.length === 0, `gallery: no runtime errors${runtimeErrors.length ? ': ' + runtimeErrors.join(' | ') : ''}`);
  expect(document.querySelectorAll('.gallery-section').length === 4, 'gallery: four sections render');
  const galleryTiles = [...document.querySelectorAll('.masonry__item')];
  expect(galleryTiles.length >= 12, 'gallery: the whole supplied photo set is on the page');
  expect(galleryTiles.every((tile) => tile.classList.contains('masonry__item--ready')), 'gallery: every gallery entry loads a real photograph');
  expect(document.querySelectorAll('.masonry__item--placeholder').length === 0, 'gallery: no designed placeholders are left');
  expect(document.querySelectorAll('.masonry--arch .masonry__item').length > 0, 'gallery: outside/inside sets hang in arched frames');
  expect(document.querySelector('#lightbox').hidden === true, 'gallery: lightbox starts closed');
  const titles = [...document.querySelectorAll('.gallery-section__title')].map((n) => n.textContent);
  expect(titles.join('|').includes('Restaurant Exterior') && titles.join('|').includes('Food & Menu'), 'gallery: section titles are present');

  // Lightbox with real photos
  document.querySelector('.masonry__item--ready').click();
  await sleep(60);
  expect(document.querySelector('#lightbox').hidden === false, 'gallery: clicking a photo opens the lightbox');
  expect(document.querySelector('#lightboxImg').getAttribute('src').includes('photos/'), 'gallery: lightbox shows the real image');
  document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowRight' }));
  await sleep(40);
  document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }));
  await sleep(40);
  expect(document.querySelector('#lightbox').hidden === true, 'gallery: Escape closes the lightbox');
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

  // Everyday value picks are real printed prices, not a discount
  const picks = [...document.querySelectorAll('#valuePicks .value-pick')];
  expect(picks.length > 0, 'offers: everyday value picks render');
  expect(picks.length <= 8, 'offers: the value row stays short');
  expect(
    picks.every((pick) => Number(pick.querySelector('.value-pick__price').textContent.replace(/[^0-9]/g, '')) <= 100),
    'offers: every value pick is really under ₹100'
  );
  expect(!/discount|% off|save ₹/i.test(document.querySelector('.offers-value').textContent), 'offers: no invented discount language');
}

/* ========================================================================== */
/* REVIEWS                                                                    */
/* ========================================================================== */
{
  const { document, window, runtimeErrors } = await loadPage('reviews/index.html', 'reviews/');
  expect(runtimeErrors.length === 0, `reviews: no runtime errors${runtimeErrors.length ? ': ' + runtimeErrors.join(' | ') : ''}`);
  expect(document.querySelector('[data-review-summary]').hidden === true, 'reviews: unverified rating summary stays hidden');
  expect(document.querySelector('[data-bind="rating"]').textContent === '4.0', 'reviews: figures kept in the source but not shown');
  expect(document.querySelector('.reviews-honest').hidden === false, 'reviews: honesty band still explains where reviews live');
  const googleLinks = [...document.querySelectorAll('a[href*="google.com/maps/place"]')];
  expect(googleLinks.length >= 1, 'reviews: links to the original Google reviews');
  document.querySelector('[data-lang="bn"]').click();
  await sleep(80);
  expect(window.location.pathname === '/Dairy_Park/reviews/', 'reviews: language switch stays on the reviews page');
  expect(document.querySelector('[data-review-summary]').hidden === true, 'reviews: summary stays hidden after switching language');
}

/* ========================================================================== */
/* VISIT                                                                      */
/* ========================================================================== */
{
  const { document, runtimeErrors } = await loadPage('visit/index.html', 'visit/');
  expect(runtimeErrors.length === 0, `visit: no runtime errors${runtimeErrors.length ? ': ' + runtimeErrors.join(' | ') : ''}`);
  expect(document.querySelector('#location iframe') !== null, 'visit: Google Map embed is wired up');
  expect(document.querySelectorAll('#facilityList li').length === FACILITIES.length, 'visit: every listed facility appears');
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
