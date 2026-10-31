/* =============================================================================
   DAIRY PARK — SITE BEHAVIOUR (multi-page)
   Vanilla JS, no framework. Bundled + minified into assets/js/app.min.js
   by `npm run build` (see scripts/build.mjs). Every page loads the same
   bundle; page-specific modules activate from body[data-page].
   ============================================================================= */

(function () {
  'use strict';

  var C = window.DP_CONTENT || {};
  var I = window.DP_I18N || { en: {}, bn: {} };
  var root = document.documentElement;
  root.classList.add('js');

  var body = document.body || {};
  var PAGE = body.dataset ? body.dataset.page : '';
  var BASE = body.dataset && body.dataset.base ? body.dataset.base : '';

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reducedMotion = motionQuery.matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* --------------------------------------------------------------------------- */
  /* Storage (never throws — private mode can block localStorage)                */
  /* --------------------------------------------------------------------------- */
  var store = {
    get: function (key) {
      try { return window.localStorage.getItem(key); } catch (e) { return null; }
    },
    set: function (key, value) {
      try { window.localStorage.setItem(key, value); } catch (e) { /* ignore */ }
    }
  };

  /* --------------------------------------------------------------------------- */
  /* Language + text helpers                                                     */
  /* --------------------------------------------------------------------------- */
  var lang = initialLang();

  function initialLang() {
    var fromUrl = '';
    try { fromUrl = new URLSearchParams(window.location.search).get('lang') || ''; } catch (e) { fromUrl = ''; }
    var candidate = fromUrl || store.get('dp-lang') || (C.site && C.site.defaultLang) || 'en';
    return candidate === 'bn' ? 'bn' : 'en';
  }

  function t(key) {
    var pack = I[lang] || {};
    if (pack[key] != null) return pack[key];
    if (I.en && I.en[key] != null) return I.en[key];
    return '';
  }

  function tf(key, vars) {
    var out = t(key);
    Object.keys(vars || {}).forEach(function (name) {
      out = out.split('{' + name + '}').join(String(vars[name]));
    });
    return out;
  }

  // Accepts a string or an { en, bn } object
  function tx(value) {
    if (value == null) return '';
    if (typeof value === 'string') return value;
    return value[lang] != null ? value[lang] : (value.en || '');
  }

  var BN_DIGITS = '০১২৩৪৫৬৭৮৯';
  function localizeDigits(value) {
    var str = String(value == null ? '' : value);
    if (lang !== 'bn') return str;
    return str.replace(/[0-9]/g, function (d) { return BN_DIGITS[Number(d)]; });
  }
  function num(value) { return localizeDigits(value); }

  function formatRating(value) {
    var n = Number(value);
    if (!isFinite(n)) return '';
    return localizeDigits(n.toFixed(1));
  }

  function els(selector) { return $$(selector); }
  function closest(node, selector) { return node && node.closest ? node.closest(selector) : null; }
  function setText(selector, value) {
    els(selector).forEach(function (node) { node.textContent = value; });
  }

  function phoneHref() {
    return 'tel:' + ((C.business && C.business.phone && C.business.phone.tel) || '');
  }

  /* --------------------------------------------------------------------------- */
  /* Small DOM helper                                                            */
  /* --------------------------------------------------------------------------- */
  function el(tag, props, children) {
    var node = document.createElement(tag);
    if (props) {
      Object.keys(props).forEach(function (key) {
        var value = props[key];
        if (value == null || value === false) return;
        if (key === 'class') node.className = value;
        else if (key === 'text') node.textContent = value;
        else if (key === 'dataset') {
          Object.keys(value).forEach(function (d) { node.dataset[d] = value[d]; });
        } else node.setAttribute(key, value === true ? '' : value);
      });
    }
    (children || []).forEach(function (child) {
      if (child) node.appendChild(child);
    });
    return node;
  }

  function icon(name) {
    var paths = {
      phone: '<path d="M6.6 3h3l1.5 4-2 1.4a12 12 0 0 0 5.5 5.5l1.4-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.6 5.2 2 2 0 0 1 6.6 3Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
      arrow: '<path d="M5 12h13m-5.5-6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
      camera: '<path d="M4 8.5h3l1.5-2h7l1.5 2h3v10H4v-10Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="13" r="3" fill="none" stroke="currentColor" stroke-width="1.6"/>',
      check: '<path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>',
      star: '<path d="m12 3.6 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8L3.6 9.7l5.8-.8L12 3.6Z" fill="currentColor"/>',
      pin: '<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.6" fill="none" stroke="currentColor" stroke-width="1.7"/>',
      info: '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 11v5M12 8h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'
    };
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'icon');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.innerHTML = paths[name] || '';
    return svg;
  }

  /* --------------------------------------------------------------------------- */
  /* Static links kept in sync with content.js                                   */
  /* --------------------------------------------------------------------------- */
  function syncLinks() {
    var b = C.business || {};
    var map = {
      phone: b.phone && b.phone.tel ? 'tel:' + b.phone.tel : '',
      directions: b.directionsUrl || '',
      maps: b.mapsUrl || '',
      mapEmbed: b.mapEmbedUrl || ''
    };
    els('[data-link]').forEach(function (node) {
      var url = map[node.dataset.link];
      if (!url) return;
      if (node.tagName === 'IFRAME') node.src = url;
      else node.setAttribute('href', url);
    });
    els('[data-link="phone"]').forEach(function (node) {
      var label = node.querySelector('[data-bind="phoneDisplay"]');
      if (label && b.phone) label.textContent = b.phone.display;
    });
  }

  /* --------------------------------------------------------------------------- */
  /* Content rendering (shared across pages)                                     */
  /* --------------------------------------------------------------------------- */
  var heroHasPhoto = false;

  function renderAddress() {
    var lines = (C.business && C.business.addressLines) || {};
    var list = lines[lang] || lines.en || [];
    setText('[data-bind="address"]', list.join(', '));
  }

  function renderSpend() {
    var spend = (C.business && C.business.spend) || {};
    var currency = spend.currency || '₹';
    setText('[data-bind="spend"]', currency + num(spend.min) + '–' + num(spend.max));
  }

  function renderFacilities() {
    var facilities = (C.business && C.business.facilities) || [];
    els('#facilityList').forEach(function (list) {
      list.textContent = '';
      facilities.forEach(function (facility) {
        list.appendChild(el('li', { text: tx(facility) }));
      });
    });
    els('[data-bind="facilityCount"]').forEach(function (node) {
      node.dataset.count = String(facilities.length);
      node.textContent = num(facilities.length);
    });
  }

  function buildHoursFragment(compact) {
    var hours = C.hours || {};
    var frag = document.createDocumentFragment();
    if (hours.verified && Array.isArray(hours.schedule) && hours.schedule.length) {
      hours.schedule.forEach(function (entry) {
        var line = tx(entry.days) + ': ' + (entry.open || '') + ' – ' + (entry.close || '');
        frag.appendChild(el(compact ? 'span' : 'div', { class: compact ? '' : 'hours-line', text: line }));
      });
      return frag;
    }
    frag.appendChild(document.createTextNode(t('locate.hoursCall') + ' '));
    frag.appendChild(el('span', {
      class: compact ? '' : 'info-row__muted',
      text: tf('locate.hoursListed', { closing: localizeDigits(hours.closingTime || '') })
    }));
    return frag;
  }

  function renderHours() {
    els('[data-bind="hours"]').forEach(function (node) {
      node.textContent = '';
      node.appendChild(buildHoursFragment(false));
    });
    els('[data-bind="hoursFooter"]').forEach(function (node) {
      node.textContent = '';
      node.appendChild(buildHoursFragment(true));
    });
  }

  function renderFooterNote() {
    setText('[data-bind="footerNote"]', tx(C.footerNote));
  }

  /* --------------------------------------------------------------------------- */
  /* Photos — resolves whichever extension the owner uploaded (BASE-relative)     */
  /* --------------------------------------------------------------------------- */
  var PHOTO_EXTS = ['webp', 'avif', 'jpg', 'jpeg', 'png'];
  var photoCache = {};

  function findPhoto(base) {
    if (!base) return Promise.resolve(null);
    if (photoCache[base]) return photoCache[base];

    var promise = new Promise(function (resolve) {
      var index = 0;
      function next() {
        if (index >= PHOTO_EXTS.length) { resolve(null); return; }
        var url = BASE + base + '.' + PHOTO_EXTS[index++];
        var probe = new Image();
        probe.onload = function () { if (probe.naturalWidth > 0) resolve(url); else next(); };
        probe.onerror = next;
        probe.src = url;
      }
      next();
    });

    photoCache[base] = promise;
    return promise;
  }

  function heroAlt() {
    return heroHasPhoto ? t('hero.photoAlt') : t('hero.photoSoon');
  }

  function initHeroPhoto() {
    var heroImg = $('#heroPhoto');
    if (!heroImg) return;
    var photos = C.photos || {};
    findPhoto(photos.owner).then(function (url) {
      heroHasPhoto = !!url;
      var hero = $('.hero');
      if (url) {
        heroImg.src = url;
        heroImg.classList.add('is-real');
        // The owner is the star: show the photo as a large portrait, too
        var portrait = $('#ownerPortrait');
        if (portrait) {
          portrait.src = url;
          portrait.classList.add('is-real');
          if (hero) hero.classList.add('has-owner');
        }
        if (hero) hero.classList.remove('is-nophoto');
      } else {
        heroImg.src = BASE + 'assets/img/placeholder-hero.svg';
        if (hero) hero.classList.add('is-nophoto');
      }
      heroImg.alt = heroAlt();
    });
  }

  /* --------------------------------------------------------------------------- */
  /* Dish cards + detail dialog                                                  */
  /* --------------------------------------------------------------------------- */
  function menuAlt(item, hasPhoto) {
    var name = tx(item.name);
    return hasPhoto ? name : name + ' — ' + t('menu.photoSoon');
  }

  function dishPriceText(item) {
    var hasPrice = item.price !== null && item.price !== undefined && item.price !== '';
    return hasPrice ? localizeDigits(item.price) : t('menu.priceAsk');
  }

  function buildDish(item, index, options) {
    var opts = options || {};
    var hasPrice = item.price !== null && item.price !== undefined && item.price !== '';
    var available = item.available !== false;

    var media = el('div', { class: 'dish__media' });
    var img = el('img', {
      class: 'dish__img',
      src: BASE + 'assets/img/placeholder-dish.svg',
      alt: menuAlt(item, false),
      width: '800',
      height: '600',
      loading: 'lazy',
      decoding: 'async'
    });
    media.appendChild(img);
    media.appendChild(el('span', { class: 'dish__veil' }));

    // Steam wisps over the plate — purely decorative
    var steam = el('span', { class: 'dish__steam' });
    steam.setAttribute('aria-hidden', 'true');
    steam.appendChild(el('i'));
    steam.appendChild(el('i'));
    steam.appendChild(el('i'));
    media.appendChild(steam);

    if (item.tag) {
      media.appendChild(el('span', { class: 'dish__tag', text: tx(item.tag) }));
    }
    if (item.highlight) {
      media.appendChild(el('span', { class: 'dish__badge', text: t('menu.highlight') }));
    }
    if (hasPrice) {
      media.appendChild(el('span', { class: 'dish__price', text: localizeDigits(item.price) }));
    }
    var note = el('span', { class: 'dish__note' });
    note.appendChild(icon('camera'));
    note.appendChild(el('span', { text: t('menu.photoSoon') }));
    media.appendChild(note);

    var bodyEl = el('div', { class: 'dish__body' });
    var primaryName = tx(item.name);
    var secondaryName = lang === 'bn' ? (item.name && item.name.en) : (item.name && item.name.bn);
    var heading = el('h3', { class: 'dish__name', text: primaryName });
    if (secondaryName && secondaryName !== primaryName) {
      heading.appendChild(el('span', {
        class: 'dish__name-alt',
        text: secondaryName,
        lang: lang === 'bn' ? 'en' : 'bn'
      }));
    }
    bodyEl.appendChild(heading);
    var description = tx(item.desc);
    if (description) bodyEl.appendChild(el('p', { class: 'dish__desc', text: description }));

    // Optional ticked fact list — stays empty until the owner fills it in
    if (Array.isArray(item.badges) && item.badges.length) {
      var facts = el('ul', { class: 'dish__facts' });
      item.badges.forEach(function (badge) {
        facts.appendChild(el('li', { class: 'dish__fact' }, [icon('check'), el('span', { text: tx(badge) })]));
      });
      bodyEl.appendChild(facts);
    }

    var meta = el('div', { class: 'dish__meta' });
    meta.appendChild(el('span', {
      class: 'pill' + (hasPrice ? '' : ' pill--ask'),
      text: dishPriceText(item)
    }));
    if (item.veg === true) {
      var vegPill = el('span', { class: 'pill pill--veg' });
      vegPill.appendChild(el('span', { class: 'dot dot--veg' }));
      vegPill.appendChild(el('span', { text: t('menu.veg') }));
      meta.appendChild(vegPill);
    }
    if (item.veg === false) {
      var nonVegPill = el('span', { class: 'pill pill--nonveg' });
      nonVegPill.appendChild(el('span', { class: 'dot dot--nonveg' }));
      nonVegPill.appendChild(el('span', { text: t('menu.nonveg') }));
      meta.appendChild(nonVegPill);
    }
    meta.appendChild(el('span', {
      class: 'pill ' + (available ? 'pill--ok' : ''),
      text: available ? t('menu.available') : t('menu.unavailable')
    }));
    bodyEl.appendChild(meta);

    var call = el('a', {
      class: 'dish__cta',
      href: phoneHref(),
      'data-track': 'menu_item_call'
    });
    call.appendChild(el('span', { text: t('menu.ask') }));
    call.appendChild(icon('arrow'));
    bodyEl.appendChild(call);

    var card = el('article', {
      class: 'dish reveal' + (available ? '' : ' is-unavailable'),
      'data-dish-id': item.id || 'item-' + index,
      'data-tilt': '',
      'data-reveal': index % 2 ? 'up' : 'down'
    }, [media, bodyEl]);
    card.style.setProperty('--i', String(Math.min(index, 6)));

    if (opts.detail) {
      card.classList.add('dish--detail');
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', primaryName + ' — ' + t('foodPage.detailsShort'));
      card.addEventListener('click', function (event) {
        if (closest(event.target, 'a')) return;
        openDishDialog(item);
      });
      card.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openDishDialog(item);
        }
      });
    }

    findPhoto(item.photo).then(function (url) {
      if (url) {
        img.src = url;
        img.alt = menuAlt(item, true);
        note.remove();
        card.dataset.hasPhoto = 'true';
      }
    });

    return card;
  }

  /* ---- Dish detail dialog (Food & Menu page) ---- */
  var dishDialog = $('#dishDialog');
  var dishDialogBody = $('#dishDialogBody');

  function openDishDialog(item) {
    if (!dishDialog || !dishDialogBody) return;
    dishDialogBody.textContent = '';

    var hasPrice = item.price !== null && item.price !== undefined && item.price !== '';
    var available = item.available !== false;

    var media = el('div', { class: 'dish-dialog__media' });
    var img = el('img', {
      src: BASE + 'assets/img/placeholder-dish.svg',
      alt: menuAlt(item, false),
      width: '800',
      height: '600',
      decoding: 'async'
    });
    media.appendChild(img);
    findPhoto(item.photo).then(function (url) {
      if (url) { img.src = url; img.alt = menuAlt(item, true); }
    });

    var info = el('div', { class: 'dish-dialog__info' });
    var cat = categoryById(item.category);
    if (cat) info.appendChild(el('span', { class: 'dish-dialog__cat', text: tx(cat.name) }));

    var heading = el('h2', { class: 'dish-dialog__title', id: 'dishDialogTitle', text: tx(item.name) });
    var secondaryName = lang === 'bn' ? (item.name && item.name.en) : (item.name && item.name.bn);
    if (secondaryName && secondaryName !== tx(item.name)) {
      heading.appendChild(el('span', {
        class: 'dish__name-alt',
        text: secondaryName,
        lang: lang === 'bn' ? 'en' : 'bn'
      }));
    }
    info.appendChild(heading);
    var dialogDesc = tx(item.desc);
    if (dialogDesc) info.appendChild(el('p', { class: 'dish-dialog__desc', text: dialogDesc }));

    var meta = el('div', { class: 'dish__meta' });
    meta.appendChild(el('span', { class: 'pill' + (hasPrice ? '' : ' pill--muted'), text: dishPriceText(item) }));
    if (item.veg === true) meta.appendChild(el('span', { class: 'pill pill--veg', text: t('menu.veg') }));
    if (item.veg === false) meta.appendChild(el('span', { class: 'pill pill--nonveg', text: t('menu.nonveg') }));
    meta.appendChild(el('span', {
      class: 'pill ' + (available ? 'pill--ok' : ''),
      text: available ? t('menu.available') : t('menu.unavailable')
    }));
    info.appendChild(meta);

    info.appendChild(el('p', { class: 'dish-dialog__note', text: t('menu.note') }));

    var call = el('a', {
      class: 'btn btn--primary',
      href: phoneHref(),
      'data-track': 'menu_item_call'
    });
    call.appendChild(icon('phone'));
    call.appendChild(el('span', { text: t('foodPage.callEnquire') }));
    info.appendChild(call);

    dishDialogBody.appendChild(media);
    dishDialogBody.appendChild(info);

    if (typeof dishDialog.showModal === 'function') dishDialog.showModal();
    else dishDialog.setAttribute('open', '');
    track('menu_item_open', { item: item.id || '' });
  }

  function closeDishDialog() {
    if (!dishDialog) return;
    if (typeof dishDialog.close === 'function') dishDialog.close();
    else dishDialog.removeAttribute('open');
  }

  function initDishDialog() {
    if (!dishDialog) return;
    var close = $('#dishDialogClose');
    if (close) close.addEventListener('click', closeDishDialog);
    dishDialog.addEventListener('click', function (event) {
      if (event.target === dishDialog) closeDishDialog();
    });
  }

  /* --------------------------------------------------------------------------- */
  /* Home page extras: hero dish peeks, "order both" strip, count-up numbers      */
  /* --------------------------------------------------------------------------- */
  var heroPicks = [];

  function renderHeroPicks() {
    var host = $('#heroPicks');
    if (!host) return;

    if (!heroPicks.length) {
      ((C.menu) || []).filter(function (item) { return item && item.photo; }).slice(0, 3)
        .forEach(function (item) {
          var pick = el('span', { class: 'hero__pick' });
          var img = el('img', {
            src: BASE + 'assets/img/placeholder-dish.svg',
            alt: tx(item.name),
            width: '120',
            height: '120',
            loading: 'lazy',
            decoding: 'async'
          });
          var name = el('span', { class: 'hero__pick-name', text: tx(item.name) });
          pick.appendChild(img);
          pick.appendChild(name);
          host.appendChild(pick);
          heroPicks.push({ item: item, img: img, name: name, pick: pick });

          findPhoto(item.photo).then(function (url) {
            if (!url) { pick.hidden = true; return; }
            img.src = url;
            pick.classList.add('is-real');
            host.hidden = false;
          });
        });
    }

    heroPicks.forEach(function (entry) {
      var text = tx(entry.item.name);
      entry.name.textContent = text;
      entry.img.alt = text;
    });
  }

  function renderPairing() {
    var strip = $('#pairing');
    if (!strip) return;
    var data = C.pairing || {};

    strip.hidden = data.show === false;
    setText('[data-bind="pairingEyebrow"]', tx(data.eyebrow));
    setText('[data-bind="pairingTitle"]', tx(data.title));
    setText('[data-bind="pairingDesc"]', tx(data.desc));
    setText('[data-bind="pairingCta"]', tx(data.cta));

    // The two plates follow the menu photos
    $$('[data-pairing-photo]').forEach(function (img) {
      var item = ((C.menu) || []).filter(function (entry) {
        return entry && entry.id === img.dataset.pairingPhoto;
      })[0];
      var plate = closest(img, '.pairing__plate');
      if (!item) { if (plate) plate.remove(); return; }
      findPhoto(item.photo).then(function (url) {
        if (url) img.src = url;
        else if (plate) plate.remove();
      });
    });
  }

  /* Numbers in the trust band count up the first time they scroll into view.
     Switching language re-writes them in Bengali numerals instead. */
  var counterTokens = new WeakMap();

  function writeCounter(node, value) {
    var decimals = Number(node.dataset.decimals || 0);
    node.textContent = localizeDigits(Number(value).toFixed(decimals));
  }

  function countUp(node) {
    var target = Number(node.dataset.count);
    if (!isFinite(target)) return;

    // Bumping the token cancels any animation already running for this node
    var token = (counterTokens.get(node) || 0) + 1;
    counterTokens.set(node, token);

    if (reducedMotion || !window.requestAnimationFrame) { writeCounter(node, target); return; }

    var duration = 1100;
    var step = function (now, from) {
      if (counterTokens.get(node) !== token) return;
      var progress = Math.min(1, (now - from) / duration);
      var eased = 1 - Math.pow(1 - progress, 3);
      writeCounter(node, target * eased);
      if (progress < 1) window.requestAnimationFrame(function (t) { step(t, from); });
    };
    window.requestAnimationFrame(function (now) { step(now, now); });
  }

  function syncCounters() {
    $$('[data-count]').forEach(function (node) {
      counterTokens.set(node, (counterTokens.get(node) || 0) + 1);
      writeCounter(node, node.dataset.count);
    });
  }

  function initCounters() {
    var nodes = $$('[data-count]');
    if (!nodes.length) return;
    if (!('IntersectionObserver' in window)) {
      nodes.forEach(function (node) { writeCounter(node, node.dataset.count); });
      return;
    }
    var seen = new WeakSet();
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || seen.has(entry.target)) return;
        seen.add(entry.target);
        countUp(entry.target);
      });
    }, { threshold: 0.4 });
    nodes.forEach(function (node) { observer.observe(node); });
  }

  /* --------------------------------------------------------------------------- */
  /* Menu categories                                                             */
  /* --------------------------------------------------------------------------- */
  function allCategories() { return C.menuCategories || []; }

  function categoryById(id) {
    var found = allCategories().filter(function (c) { return c.id === id; });
    return found[0] || null;
  }

  /* Categories that actually have at least one item — empty ones stay hidden */
  function usedCategories(items) {
    var source = items || C.menu || [];
    var usedIds = {};
    source.forEach(function (item) { if (item && item.category) usedIds[item.category] = true; });
    var fromRegistry = allCategories().filter(function (c) { return usedIds[c.id]; });
    if (fromRegistry.length) return fromRegistry;
    // Items without a matching registry entry still need a home
    var unknown = {};
    source.forEach(function (item) {
      if (item && item.category && !categoryById(item.category)) unknown[item.category] = true;
    });
    return Object.keys(unknown).map(function (id) {
      return { id: id, name: { en: id, bn: id } };
    });
  }

  /* --------------------------------------------------------------------------- */
  /* HOME — featured dishes + gallery preview                                    */
  /* --------------------------------------------------------------------------- */
  function renderHomeMenu() {
    var grid = $('#dishGrid');
    if (!grid) return;
    grid.textContent = '';
    var items = ((C.menu) || []).filter(function (item) {
      return item && item.highlight !== false;
    });
    items.forEach(function (item, index) {
      grid.appendChild(buildDish(item, index));
    });
  }

  function renderGalleryPreview() {
    var wrap = $('#galleryPreview');
    if (!wrap) return;
    wrap.textContent = '';

    var entries = ((C.gallery) || []).slice(0, 4);
    if (!entries.length) {
      // Honest designed panel until real photographs are uploaded
      var panel = el('div', { class: 'gallery-preview__empty reveal', 'data-reveal': 'zoom' });
      panel.appendChild(icon('camera'));
      panel.appendChild(el('p', { text: t('gallery.prevEmpty') }));
      wrap.appendChild(panel);
      return;
    }

    entries.forEach(function (entry, index) {
      var tile = el('figure', { class: 'gallery-preview__tile reveal', 'data-reveal': index % 2 ? 'up' : 'zoom' });
      var img = el('img', {
        src: BASE + 'assets/img/placeholder-shop.svg',
        alt: tx(entry.alt) || t('shop.alt'),
        width: '800',
        height: '640',
        loading: 'lazy',
        decoding: 'async'
      });
      tile.appendChild(img);
      findPhoto(entry.base).then(function (url) {
        if (url) { img.src = url; tile.classList.add('has-photo'); }
      });
      wrap.appendChild(tile);
    });
  }

  /* --------------------------------------------------------------------------- */
  /* FOOD & MENU page — featured, filters, search, grid                          */
  /* --------------------------------------------------------------------------- */
  var menuState = { cat: 'all', query: '' };

  function initFoodPage() {
    var featuredSection = $('#featured');
    var featuredGrid = $('#featuredGrid');
    if (featuredGrid) {
      featuredGrid.textContent = '';
      var featured = ((C.menu) || []).filter(function (item) { return item && item.highlight; });
      featured.forEach(function (item, index) {
        featuredGrid.appendChild(buildDish(item, index));
      });
      if (featuredSection) featuredSection.hidden = featured.length === 0;
    }
    renderMenuCats();
    renderMenuGrid();

    var search = $('#menuSearch');
    if (search && search.dataset.ready !== '1') {
      search.dataset.ready = '1';
      var timer = null;
      search.addEventListener('input', function () {
        window.clearTimeout(timer);
        timer = window.setTimeout(function () {
          menuState.query = search.value.trim().toLowerCase();
          renderMenuGrid();
        }, 120);
      });
    }
    var clear = $('#menuClear');
    if (clear && clear.dataset.ready !== '1') {
      clear.dataset.ready = '1';
      clear.addEventListener('click', function () {
        menuState.cat = 'all';
        menuState.query = '';
        if (search) search.value = '';
        renderMenuCats();
        renderMenuGrid();
      });
    }
  }

  function renderMenuCats() {
    var wrap = $('#menuCats');
    if (!wrap) return;
    wrap.textContent = '';

    var cats = usedCategories();
    var options = [{ id: 'all', name: { en: 'All', bn: 'সব' } }].concat(cats);
    options.forEach(function (cat) {
      var active = menuState.cat === cat.id;
      var chip = el('button', {
        type: 'button',
        class: 'menu-cat' + (active ? ' is-active' : ''),
        'aria-pressed': active ? 'true' : 'false',
        text: tx(cat.name)
      });
      chip.addEventListener('click', function () {
        menuState.cat = cat.id;
        renderMenuCats();
        renderMenuGrid();
        track('menu_category', { category: cat.id });
      });
      wrap.appendChild(chip);
    });
  }

  function menuMatches(item) {
    if (menuState.cat !== 'all' && item.category !== menuState.cat) return false;
    if (!menuState.query) return true;
    var haystack = [
      tx(item.name), item.name && item.name.en, item.name && item.name.bn,
      tx(item.desc), item.desc && item.desc.en, item.desc && item.desc.bn,
      item.category
    ].join(' ').toLowerCase();
    return haystack.indexOf(menuState.query) !== -1;
  }

  function renderMenuGrid() {
    var grid = $('#menuGrid');
    var empty = $('#menuEmpty');
    if (!grid) return;
    grid.textContent = '';

    var items = ((C.menu) || []).filter(function (item) { return item && menuMatches(item); });
    items.forEach(function (item, index) {
      grid.appendChild(buildDish(item, index, { detail: true }));
    });

    if (empty) empty.hidden = items.length > 0;
    revealInView();
  }

  /* --------------------------------------------------------------------------- */
  /* GALLERY page — sections + lightbox                                          */
  /* --------------------------------------------------------------------------- */
  var GALLERY_SECTIONS = ['exterior', 'interior', 'food', 'products'];
  var lightboxItems = [];

  function renderGalleryPage() {
    var wrap = $('#gallerySections');
    if (!wrap) return;
    wrap.textContent = '';
    lightboxItems = [];

    GALLERY_SECTIONS.forEach(function (sectionId, sIndex) {
      var section = el('section', { class: 'gallery-section', 'aria-labelledby': 'gsec-' + sectionId });
      var head = el('div', { class: 'gallery-section__head reveal' });
      head.appendChild(el('h2', {
        class: 'gallery-section__title',
        id: 'gsec-' + sectionId,
        text: t('gallery.sec.' + sectionId)
      }));
      head.appendChild(el('p', {
        class: 'gallery-section__lead',
        text: t('gallery.secLead.' + sectionId)
      }));
      section.appendChild(head);

      var grid = el('div', { class: 'masonry' });
      var entries = ((C.gallery) || []).filter(function (entry) { return entry && entry.section === sectionId; });

      if (!entries.length) {
        grid.appendChild(placeholderTile(sectionId));
      } else {
        entries.forEach(function (entry, index) {
          var tile = galleryTile(entry, sectionId, index);
          grid.appendChild(tile);
        });
      }
      section.appendChild(grid);
      wrap.appendChild(section);
      if (sIndex === 0) section.classList.add('gallery-section--first');
    });

    initLightbox();
    revealInView();
  }

  function placeholderTile(sectionId) {
    var tile = el('figure', { class: 'masonry__item masonry__item--placeholder reveal', 'data-reveal': 'zoom' });
    var img = el('img', {
      src: BASE + (sectionId === 'food' || sectionId === 'products'
        ? 'assets/img/placeholder-dish.svg'
        : 'assets/img/placeholder-shop.svg'),
      alt: t('gallery.placeholderAlt'),
      width: '800',
      height: '640',
      loading: 'lazy',
      decoding: 'async'
    });
    tile.appendChild(img);
    tile.appendChild(el('figcaption', { class: 'masonry__caption', text: t('gallery.comingSoon') }));
    return tile;
  }

  function galleryTile(entry, sectionId, index) {
    var tile = el('figure', { class: 'masonry__item masonry__item--pending reveal', 'data-reveal': index % 2 ? 'up' : 'zoom' });
    var img = el('img', {
      src: BASE + 'assets/img/placeholder-shop.svg',
      alt: tx(entry.alt) || t('shop.alt'),
      width: '900',
      height: '720',
      loading: 'lazy',
      decoding: 'async'
    });
    tile.appendChild(img);
    if (entry.alt) tile.appendChild(el('figcaption', { class: 'masonry__caption', text: tx(entry.alt) }));

    findPhoto(entry.base).then(function (url) {
      if (!url) {
        tile.classList.add('masonry__item--placeholder');
        tile.classList.remove('masonry__item--pending');
        img.src = BASE + 'assets/img/placeholder-shop.svg';
        img.alt = t('gallery.placeholderAlt');
        var cap = tile.querySelector('.masonry__caption');
        if (cap) cap.textContent = t('gallery.comingSoon');
        return;
      }
      img.src = url;
      img.classList.add('masonry__img--real');
      tile.classList.remove('masonry__item--pending');
      tile.classList.add('masonry__item--ready');
      var itemIndex = lightboxItems.length;
      lightboxItems.push({ src: url, alt: tx(entry.alt) || t('shop.alt'), section: sectionId });
      tile.addEventListener('click', function () { openLightbox(itemIndex); });
      tile.tabIndex = 0;
      tile.setAttribute('role', 'button');
      tile.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openLightbox(itemIndex);
        }
      });
    });

    return tile;
  }

  var lightbox = $('#lightbox');
  var lightboxIndex = 0;
  var lightboxReturnFocus = null;

  function openLightbox(index) {
    if (!lightbox || !lightboxItems.length) return;
    lightboxIndex = index;
    lightboxReturnFocus = document.activeElement;
    paintLightbox();
    lightbox.hidden = false;
    root.classList.add('is-locked');
    var close = $('#lightboxClose');
    if (close) close.focus();
    track('gallery_open');
  }

  function paintLightbox() {
    var img = $('#lightboxImg');
    var caption = $('#lightboxCaption');
    var item = lightboxItems[lightboxIndex];
    if (!item || !img) return;
    img.src = item.src;
    img.alt = item.alt;
    if (caption) caption.textContent = item.alt;
    var multi = lightboxItems.length > 1;
    var prev = $('#lightboxPrev');
    var next = $('#lightboxNext');
    if (prev) prev.hidden = !multi;
    if (next) next.hidden = !multi;
  }

  function moveLightbox(step) {
    if (!lightboxItems.length) return;
    lightboxIndex = (lightboxIndex + step + lightboxItems.length) % lightboxItems.length;
    paintLightbox();
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    root.classList.remove('is-locked');
    if (lightboxReturnFocus && lightboxReturnFocus.focus) lightboxReturnFocus.focus();
  }

  function initLightbox() {
    if (!lightbox || lightbox.dataset.ready === '1') return;
    lightbox.dataset.ready = '1';
    var close = $('#lightboxClose');
    var prev = $('#lightboxPrev');
    var next = $('#lightboxNext');
    if (close) close.addEventListener('click', closeLightbox);
    if (prev) prev.addEventListener('click', function () { moveLightbox(-1); });
    if (next) next.addEventListener('click', function () { moveLightbox(1); });
    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (event) {
      if (lightbox.hidden) return;
      if (event.key === 'Escape') closeLightbox();
      else if (event.key === 'ArrowLeft') moveLightbox(-1);
      else if (event.key === 'ArrowRight') moveLightbox(1);
    });
  }

  /* --------------------------------------------------------------------------- */
  /* OFFERS page                                                                 */
  /* --------------------------------------------------------------------------- */
  function renderOffersPage() {
    var activeSection = $('#offersActive');
    var emptySection = $('#offersEmpty');
    var grid = $('#offerGrid');
    var active = ((C.promos) || []).filter(function (promo) { return promo && promo.active !== false; });

    if (!grid || !activeSection || !emptySection) return;

    if (!active.length) {
      activeSection.hidden = true;
      emptySection.hidden = false;
      grid.textContent = '';
      return;
    }

    emptySection.hidden = true;
    activeSection.hidden = false;
    grid.textContent = '';

    active.forEach(function (promo, index) {
      var card = el('article', { class: 'offer offer--page reveal', 'data-reveal': index % 2 ? 'up' : 'zoom' });

      var media = el('div', { class: 'offer__media' });
      var img = el('img', {
        src: BASE + 'assets/img/placeholder-dish.svg',
        alt: tx(promo.title),
        width: '800',
        height: '500',
        loading: 'lazy',
        decoding: 'async'
      });
      media.appendChild(img);
      if (promo.photo) {
        findPhoto(promo.photo).then(function (url) { if (url) img.src = url; });
      } else {
        img.remove();
      }
      if (promo.badge) media.appendChild(el('span', { class: 'offer__badge', text: tx(promo.badge) }));
      if (promo.photo) card.appendChild(media);

      var content = el('div', { class: 'offer__content' });
      content.appendChild(el('h3', { class: 'offer__title', text: tx(promo.title) }));
      if (promo.desc) content.appendChild(el('p', { class: 'offer__desc', text: tx(promo.desc) }));
      if (promo.validity) {
        var validity = el('p', { class: 'offer__meta' });
        validity.appendChild(el('span', { class: 'offer__meta-label', text: t('offers.validity') }));
        validity.appendChild(el('span', { text: tx(promo.validity) }));
        content.appendChild(validity);
      }
      if (promo.conditions) {
        var conditions = el('p', { class: 'offer__meta' });
        conditions.appendChild(el('span', { class: 'offer__meta-label', text: t('offers.conditions') }));
        conditions.appendChild(el('span', { text: tx(promo.conditions) }));
        content.appendChild(conditions);
      }

      var cta = el('a', {
        class: 'offer__cta',
        href: phoneHref(),
        'data-track': 'promo_click'
      });
      cta.appendChild(el('span', { text: tx(promo.cta) || t('offers.cta') }));
      cta.appendChild(icon('arrow'));
      content.appendChild(cta);
      card.appendChild(content);
      grid.appendChild(card);
    });
    revealInView();
  }

  /* --------------------------------------------------------------------------- */
  /* REVIEWS (home preview + dedicated page share these bindings)                */
  /* --------------------------------------------------------------------------- */
  function renderReviews() {
    var reviews = C.reviews || {};
    var verified = reviews.show !== false;

    // Ratings stay hidden everywhere until the owner re-verifies the listing
    els('[data-review-summary]').forEach(function (node) { node.hidden = !verified; });
    els('[data-review-link]').forEach(function (node) { node.hidden = !verified; });
    var homeSection = $('#reviews');
    if (homeSection) homeSection.hidden = !verified;
    if (!verified) return;

    var ratingText = formatRating(Number(reviews.rating));
    var countText = num(reviews.count);

    setText('[data-bind="rating"]', ratingText);
    setText('[data-bind="reviewCount"]', countText);
    els('[data-bind="rating"][data-count]').forEach(function (node) {
      node.dataset.count = isFinite(rating) ? String(rating) : node.dataset.count;
    });
    els('[data-bind="reviewCount"][data-count]').forEach(function (node) {
      node.dataset.count = String(count);
    });

    els('.rating-ring').forEach(function (ring) {
      var rating = Number(reviews.rating);
      if (!isFinite(rating)) return;
      ring.style.setProperty('--pct', (Math.max(0, Math.min(5, rating)) / 5 * 100).toFixed(1) + '%');
      ring.setAttribute('aria-label', tf('reviews.aria', { rating: ratingText, count: countText }));
      ring.setAttribute('role', 'img');
    });

    var filled = Math.round(Math.max(0, Math.min(5, Number(reviews.rating) || 0)));
    els('[data-bind-stars]').forEach(function (group) {
      Array.prototype.forEach.call(group.children, function (star, i) {
        star.setAttribute('class', i < filled ? 'star-fill' : 'star-empty');
      });
    });

    setText('[data-bind="reviewsLead"]', tf('reviews.lead', { rating: ratingText, count: countText }));
  }

  /* --------------------------------------------------------------------------- */
  /* ABOUT page photos                                                           */
  /* --------------------------------------------------------------------------- */
  function initAboutPhotos() {
    var shop = $('#aboutShopPhoto');
    var owner = $('#aboutOwnerPhoto');
    var photos = C.photos || {};
    if (shop) {
      findPhoto(photos.shop).then(function (url) {
        if (url) { shop.src = url; shop.alt = t('about.photoCaption'); }
      });
    }
    if (owner) {
      findPhoto(photos.owner).then(function (url) {
        if (url) { owner.src = url; owner.alt = heroHasPhoto ? t('hero.photoAlt') : t('hero.photoSoon'); }
      });
    }
  }

  /* --------------------------------------------------------------------------- */
  /* CONTACT page — enquiry form (honest, no backend)                            */
  /* --------------------------------------------------------------------------- */
  function initContactForm() {
    var form = $('#enquiryForm');
    if (!form) return;
    var errorBox = $('#formError');
    var status = $('#formStatus');

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var name = (form.elements.name && form.elements.name.value || '').trim();
      var phone = (form.elements.phone && form.elements.phone.value || '').trim();
      var message = (form.elements.message && form.elements.message.value || '').trim();

      var errorKey = '';
      if (name.length < 2) errorKey = 'contact.errName';
      else if ((phone.match(/[0-9]/g) || []).length < 7) errorKey = 'contact.errPhone';
      else if (message.length < 5) errorKey = 'contact.errMessage';

      if (errorKey) {
        if (errorBox) {
          errorBox.textContent = t(errorKey);
          errorBox.hidden = false;
        }
        if (status) status.hidden = true;
        return;
      }

      if (errorBox) { errorBox.hidden = true; errorBox.textContent = ''; }
      if (status) {
        status.hidden = false;
        if (typeof status.scrollIntoView === 'function') {
          status.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
        }
      }
      track('enquiry_prepared');
    });
  }

  /* --------------------------------------------------------------------------- */
  /* Apply language                                                              */
  /* --------------------------------------------------------------------------- */
  function applyLang(next, options) {
    var opts = options || {};
    lang = next === 'bn' ? 'bn' : 'en';

    root.setAttribute('lang', lang);
    root.dataset.lang = lang;

    els('[data-i18n]').forEach(function (node) {
      var key = node.dataset.i18n;
      if (!key) return;
      var text = t(key);
      if (text) node.textContent = text;
    });

    els('[data-i18n-aria]').forEach(function (node) {
      var text = t(node.dataset.i18nAria);
      if (text) node.setAttribute('aria-label', text);
    });

    els('[data-i18n-alt]').forEach(function (node) {
      var text = t(node.dataset.i18nAlt);
      if (text && !node.classList.contains('is-real')) node.alt = text;
    });

    els('[data-i18n-attr]').forEach(function (node) {
      var spec = (node.dataset.i18nAttr || '').split('|');
      if (spec.length !== 2) return;
      var text = t(spec[1]);
      if (text) node.setAttribute(spec[0], text);
    });

    var title = t('meta.' + PAGE + '.title') || t('meta.title');
    if (title) document.title = title;
    var desc = t('meta.' + PAGE + '.desc') || t('meta.desc');
    if (desc) {
      var metaDesc = $('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', desc);
      var ogDesc = $('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', desc);
      var ogTitle = $('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', title);
    }

    els('[data-lang]').forEach(function (btn) {
      var active = btn.dataset.lang === lang;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    // Re-render content that is built from content.js
    renderAddress();
    renderSpend();
    renderFacilities();
    renderHours();
    renderFooterNote();
    renderReviews();
    renderHomeMenu();
    renderHeroPicks();
    renderPairing();
    renderGalleryPreview();
    renderGalleryPage();
    renderOffersPage();
    initFoodPage();
    syncCounters();

    var heroImg = $('#heroPhoto');
    if (heroImg) heroImg.alt = heroAlt();
    var ownerImg = $('#ownerPortrait');
    if (ownerImg && ownerImg.classList.contains('is-real')) ownerImg.alt = t('hero.photoAlt');

    updateToggleLabel();

    if (!opts.silent) {
      store.set('dp-lang', lang);
      try {
        var url = new URL(window.location.href);
        if (lang === 'bn') url.searchParams.set('lang', 'bn');
        else url.searchParams.delete('lang');
        window.history.replaceState({}, '', url.pathname + (url.search || '') + url.hash);
      } catch (e) { /* ignore */ }

      document.dispatchEvent(new CustomEvent('dp:lang', { detail: { lang: lang } }));
      track('language_change', { value: lang });
    }

    revealInView();
  }

  function setLang(next) {
    if (next === lang) return;
    applyLang(next);
  }

  /* --------------------------------------------------------------------------- */
  /* Header, drawer                                                              */
  /* --------------------------------------------------------------------------- */
  var header = $('.site-header');
  var drawer = $('#drawer');
  var navToggle = $('.nav-toggle');
  var drawerOpen = false;

  function updateToggleLabel() {
    if (!navToggle) return;
    navToggle.setAttribute('aria-label', drawerOpen ? t('a11y.closeMenu') : (t('a11y.openMenu') || 'Open menu'));
  }

  function openDrawer() {
    if (!drawer) return;
    drawerOpen = true;
    drawer.hidden = false;
    if (navToggle) navToggle.setAttribute('aria-expanded', 'true');
    if (header) header.classList.add('is-open');
    root.classList.add('is-locked');
    updateToggleLabel();
    window.requestAnimationFrame(function () { drawer.classList.add('is-open'); });
    var first = drawer.querySelector('a');
    if (first) window.setTimeout(function () { first.focus(); }, 120);
    track('nav_open');
  }

  function closeDrawer(restoreFocus) {
    if (!drawer || !drawerOpen) return;
    drawerOpen = false;
    drawer.classList.remove('is-open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    if (header) header.classList.remove('is-open');
    root.classList.remove('is-locked');
    updateToggleLabel();
    window.setTimeout(function () {
      if (!drawerOpen) drawer.hidden = true;
    }, 320);
    if (restoreFocus !== false && navToggle) navToggle.focus();
  }

  function initNav() {
    if (navToggle) {
      navToggle.addEventListener('click', function () {
        if (drawerOpen) closeDrawer(); else openDrawer();
      });
    }

    if (drawer) {
      drawer.addEventListener('click', function (event) {
        if (event.target === drawer) closeDrawer();
        if (closest(event.target, 'a')) closeDrawer(false);
      });

      drawer.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') { closeDrawer(); return; }
        if (event.key !== 'Tab') return;
        var focusable = $$('a[href], button:not([disabled])', drawer).filter(function (node) {
          return node.offsetParent !== null;
        });
        if (!focusable.length) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first.focus();
        }
      });
    }

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && drawerOpen) closeDrawer();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1080 && drawerOpen) closeDrawer(false);
    });

    // In-page anchors: close the drawer, then scroll (CSS smooth)
    document.addEventListener('click', function (event) {
      var link = closest(event.target, 'a[href^="#"]');
      if (!link) return;
      var id = link.getAttribute('href');
      if (!id || id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;
      if (drawerOpen) closeDrawer(false);
      if (link.closest('.drawer')) {
        event.preventDefault();
        window.setTimeout(function () {
          target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
        }, 60);
      }
    });
  }

  /* --------------------------------------------------------------------------- */
  /* Language switcher                                                           */
  /* --------------------------------------------------------------------------- */
  function initLangSwitch() {
    $$('[data-lang]').forEach(function (btn) {
      btn.addEventListener('click', function () { setLang(btn.dataset.lang); });
    });
  }

  /* --------------------------------------------------------------------------- */
  /* Scroll-driven effects                                                       */
  /* --------------------------------------------------------------------------- */
  var lastScroll = 0;
  var scrollQueued = false;
  var menuSeen = false;

  function onScrollFrame() {
    scrollQueued = false;
    var y = window.scrollY || window.pageYOffset;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    root.style.setProperty('--sp', max > 0 ? Math.min(1, Math.max(0, y / max)).toFixed(4) : '0');

    if (header) {
      header.classList.toggle('is-stuck', y > 14);
      if (!drawerOpen) {
        if (y > 460 && y > lastScroll + 8) header.classList.add('is-hidden');
        else if (y < lastScroll - 8 || y < 200) header.classList.remove('is-hidden');
      }
    }

    if (!reducedMotion) {
      var hero = $('.hero, .page-hero');
      if (hero && y < hero.offsetHeight * 1.2) {
        hero.style.setProperty('--hero-p', Math.min(1, y / Math.max(1, hero.offsetHeight)).toFixed(3));
      }
      var disc = $('#disc');
      if (disc) {
        var rect = disc.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          disc.style.setProperty('--disc-rot', ((y * 0.05) % 360).toFixed(1));
        }
      }
    }

    if (!menuSeen) {
      var menuSection = $('#menu, #all-menu');
      if (menuSection && menuSection.getBoundingClientRect().top < window.innerHeight * 0.85) {
        menuSeen = true;
        track('menu_view');
      }
    }

    lastScroll = y;
  }

  function onScroll() {
    if (scrollQueued) return;
    scrollQueued = true;
    window.requestAnimationFrame(onScrollFrame);
  }

  function initScroll() {
    window.addEventListener('scroll', onScroll, { passive: true });
    onScrollFrame();

    if (finePointer && !reducedMotion) {
      var hero = $('.hero');
      if (hero) {
        var pending = false;
        var mx = 0, my = 0;
        hero.addEventListener('pointermove', function (event) {
          mx = (event.clientX / window.innerWidth - 0.5) * 2;
          my = (event.clientY / window.innerHeight - 0.5) * 2;
          if (pending) return;
          pending = true;
          window.requestAnimationFrame(function () {
            hero.style.setProperty('--mx', mx.toFixed(3));
            hero.style.setProperty('--my', my.toFixed(3));
            pending = false;
          });
        }, { passive: true });
      }
    }
  }

  /* Reveal animation — runs in both scroll directions */
  var revealObserver = null;

  function initReveals() {
    if (!('IntersectionObserver' in window)) {
      els('.reveal').forEach(function (node) { node.classList.add('is-in'); });
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) entry.target.classList.add('is-in');
          else entry.target.classList.remove('is-in');
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    }
    els('.reveal').forEach(function (node) {
      if (node.dataset.revealReady === '1') return;
      node.dataset.revealReady = '1';
      revealObserver.observe(node);
    });
  }

  function revealInView() {
    initTilt();
    var limit = window.innerHeight * 0.94;
    els('.reveal').forEach(function (node) {
      if (node.classList.contains('is-in')) return;
      var rect = node.getBoundingClientRect();
      if (rect.top < limit && rect.bottom > 0) node.classList.add('is-in');
    });
    initReveals();
  }

  /* Pointer tilt (3D) — fine pointers only */
  function initTilt() {
    if (!finePointer || reducedMotion) return;
    els('[data-tilt]').forEach(function (card) {
      if (card.dataset.tiltReady === '1') return;
      card.dataset.tiltReady = '1';

      var glare = el('span', { class: 'glare' });
      glare.setAttribute('aria-hidden', 'true');
      card.appendChild(glare);

      var frame = 0;
      card.addEventListener('pointermove', function (event) {
        var rect = card.getBoundingClientRect();
        var px = (event.clientX - rect.left) / rect.width;
        var py = (event.clientY - rect.top) / rect.height;
        if (frame) return;
        frame = window.requestAnimationFrame(function () {
          frame = 0;
          card.style.setProperty('--ry', ((px - 0.5) * 9).toFixed(2) + 'deg');
          card.style.setProperty('--rx', ((0.5 - py) * 7).toFixed(2) + 'deg');
          card.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
          card.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
          card.classList.add('is-tilting');
        });
      }, { passive: true });

      card.addEventListener('pointerleave', function () {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
        card.classList.remove('is-tilting');
      });
    });
  }

  /* --------------------------------------------------------------------------- */
  /* Analytics + consent                                                         */
  /* --------------------------------------------------------------------------- */
  var analyticsConfig = C.analytics || {};
  var gaLoaded = false;

  function track(event, params) {
    var payload = { event: event, language: lang, page: PAGE };
    if (params) Object.keys(params).forEach(function (key) { payload[key] = params[key]; });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
    try {
      document.dispatchEvent(new CustomEvent('dp:track', { detail: payload }));
    } catch (e) { /* ignore */ }
  }

  function consentValue() {
    return store.get('dp-consent');
  }

  function loadGA() {
    if (gaLoaded) return;
    var id = analyticsConfig.ga4Id;
    if (!analyticsConfig.enabled || !id) return;
    gaLoaded = true;

    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', id, { anonymize_ip: true, send_page_view: true });
  }

  function initConsent() {
    var banner = $('#consent');
    var accept = $('#consentAccept');
    var decline = $('#consentDecline');
    var reopen = $('#consentReopen');
    var enabled = !!(analyticsConfig.enabled && analyticsConfig.ga4Id);

    if (!enabled) {
      if (banner) banner.hidden = true;
      if (reopen) reopen.hidden = true;
      return;
    }

    if (reopen) {
      reopen.hidden = false;
      reopen.addEventListener('click', function () {
        if (banner) banner.hidden = false;
      });
    }

    if (banner && !consentValue()) banner.hidden = false;

    function choose(value) {
      store.set('dp-consent', value);
      track('consent_update', { value: value });
      if (banner) banner.hidden = true;
      if (value === 'granted') loadGA();
    }

    if (accept) accept.addEventListener('click', function () { choose('granted'); });
    if (decline) decline.addEventListener('click', function () { choose('denied'); });

    if (consentValue() === 'granted') loadGA();
  }

  function initTracking() {
    document.addEventListener('click', function (event) {
      var target = closest(event.target, '[data-track]');
      if (!target) return;
      track(target.dataset.track || 'click', {
        location: target.dataset.trackLocation || '',
        label: (target.textContent || '').trim().slice(0, 64)
      });
    }, { passive: true });
  }

  /* --------------------------------------------------------------------------- */
  /* Boot                                                                        */
  /* --------------------------------------------------------------------------- */
  function boot() {
    var year = $('#year');
    if (year) year.textContent = new Date().getFullYear();

    syncLinks();
    initNav();
    initLangSwitch();
    initTracking();
    initDishDialog();

    applyLang(lang, { silent: true });
    initConsent();

    initHeroPhoto();
    initAboutPhotos();
    initFoodPage();
    initContactForm();

    initReveals();
    initTilt();
    initScroll();
    initCounters();

    revealInView();
    window.addEventListener('load', revealInView);

    motionQuery.addEventListener && motionQuery.addEventListener('change', function (event) {
      reducedMotion = event.matches;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
