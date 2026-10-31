/* =============================================================================
   DAIRY PARK — SITE BEHAVIOUR
   Vanilla JS, no framework. Bundled + minified into assets/js/app.min.js
   by `npm run build` (see scripts/build.mjs).
   ============================================================================= */

(function () {
  'use strict';

  var C = window.DP_CONTENT || {};
  var I = window.DP_I18N || { en: {}, bn: {} };
  var root = document.documentElement;
  // Lets CSS know scripting is available (content stays visible without it)
  root.classList.add('js');
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reducedMotion = motionQuery.matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------------------------------------------------------------------------
     Storage (never throws — private mode can block localStorage)
     --------------------------------------------------------------------------- */
  var store = {
    get: function (key) {
      try { return window.localStorage.getItem(key); } catch (e) { return null; }
    },
    set: function (key, value) {
      try { window.localStorage.setItem(key, value); } catch (e) { /* ignore */ }
    }
  };

  /* ---------------------------------------------------------------------------
     Language + text helpers
     --------------------------------------------------------------------------- */
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

  /* ---------------------------------------------------------------------------
     Small DOM helper
     --------------------------------------------------------------------------- */
  function el(tag, props, children) {
    var node = document.createElement(tag);
    if (props) {
      Object.keys(props).forEach(function (key) {
        var value = props[key];
        if (value == null || value === false) return;
        if (key === 'class') node.className = value;
        else if (key === 'text') node.textContent = value;
        else if (key === 'html') node.innerHTML = value;
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
      camera: '<path d="M4 8.5h3l1.5-2h7l1.5 2h3v10H4v-10Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="13" r="3" fill="none" stroke="currentColor" stroke-width="1.6"/>'
    };
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'icon');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.innerHTML = paths[name] || '';
    return svg;
  }

  /* ---------------------------------------------------------------------------
     Static links kept in sync with content.js
     --------------------------------------------------------------------------- */
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
  }

  /* ---------------------------------------------------------------------------
     Content rendering
     --------------------------------------------------------------------------- */
  var heroHasPhoto = false;

  function renderAddress() {
    var lines = (C.business && C.business.addressLines) || {};
    var list = lines[lang] || lines.en || [];
    setText('[data-bind="address"]', list.join(', '));
  }

  function renderSpend() {
    var spend = (C.business && C.business.spend) || {};
    var currency = spend.currency || '₹';
    var text = currency + num(spend.min) + '–' + num(spend.max);
    setText('[data-bind="spend"]', text);
  }

  function renderFacilities() {
    var list = $('#facilityList');
    if (!list) return;
    list.textContent = '';
    ((C.business && C.business.facilities) || []).forEach(function (facility) {
      list.appendChild(el('li', { text: tx(facility) }));
    });
  }

  function buildHoursFragment(compact) {
    var hours = C.hours || {};
    var frag = document.createDocumentFragment();
    if (hours.verified && Array.isArray(hours.schedule) && hours.schedule.length) {
      hours.schedule.forEach(function (entry) {
        var line = tx(entry.days) + ': ' + (entry.open || '') + ' – ' + (entry.close || '');
        if (compact) {
          frag.appendChild(el('span', { text: line }));
        } else {
          frag.appendChild(el('div', { class: 'hours-line', text: line }));
        }
      });
      return frag;
    }
    frag.appendChild(document.createTextNode(t('locate.hoursCall') + ' '));
    frag.appendChild(el(compact ? 'span' : 'span', {
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

  function menuAlt(item, hasPhoto) {
    var name = tx(item.name);
    return hasPhoto ? name : name + ' — ' + t('menu.photoSoon');
  }

  function buildDish(item, index) {
    var hasPrice = item.price !== null && item.price !== undefined && item.price !== '';
    var available = item.available !== false;

    var media = el('div', { class: 'dish__media' });
    var img = el('img', {
      class: 'dish__img',
      src: 'assets/img/placeholder-dish.svg',
      alt: menuAlt(item, false),
      width: '800',
      height: '600',
      loading: 'lazy',
      decoding: 'async'
    });
    media.appendChild(img);

    if (item.highlight) {
      media.appendChild(el('span', { class: 'dish__badge', text: t('menu.highlight') }));
    }
    var note = el('span', { class: 'dish__note' });
    note.appendChild(icon('camera'));
    note.appendChild(el('span', { text: t('menu.photoSoon') }));
    media.appendChild(note);

    var body = el('div', { class: 'dish__body' });
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
    body.appendChild(heading);
    var description = tx(item.desc);
    if (description) body.appendChild(el('p', { class: 'dish__desc', text: description }));

    var meta = el('div', { class: 'dish__meta' });
    meta.appendChild(el('span', {
      class: 'pill' + (hasPrice ? '' : ' pill--muted'),
      text: hasPrice ? localizeDigits(item.price) : t('menu.priceAsk')
    }));
    if (item.veg === true) meta.appendChild(el('span', { class: 'pill pill--veg', text: t('menu.veg') }));
    if (item.veg === false) meta.appendChild(el('span', { class: 'pill pill--nonveg', text: t('menu.nonveg') }));
    meta.appendChild(el('span', {
      class: 'pill ' + (available ? 'pill--ok' : ''),
      text: available ? t('menu.available') : t('menu.unavailable')
    }));
    body.appendChild(meta);

    var call = el('a', {
      class: 'dish__cta',
      href: 'tel:' + ((C.business && C.business.phone && C.business.phone.tel) || ''),
      'data-track': 'menu_item_call'
    });
    call.appendChild(el('span', { text: t('menu.ask') }));
    call.appendChild(icon('arrow'));
    body.appendChild(call);

    var card = el('article', {
      class: 'dish reveal' + (available ? '' : ' is-unavailable'),
      'data-dish-id': item.id || 'item-' + index,
      'data-tilt': '',
      'data-reveal': index % 2 ? 'up' : 'down'
    }, [media, body]);
    card.style.setProperty('--i', String(Math.min(index, 6)));

    // Attach the real photo if one exists; otherwise keep the designed placeholder
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

  function renderMenu() {
    var grid = $('#dishGrid');
    if (!grid) return;
    grid.textContent = '';
    ((C.menu) || []).forEach(function (item, index) {
      if (!item) return;
      grid.appendChild(buildDish(item, index));
    });
  }

  function renderPromos() {
    var section = $('#offers');
    var grid = $('#offerGrid');
    var active = ((C.promos) || []).filter(function (promo) { return promo && promo.active !== false; });

    els('[data-offers-link]').forEach(function (link) { link.hidden = active.length === 0; });
    if (!section || !grid) return;

    if (!active.length) {
      section.hidden = true;
      grid.textContent = '';
      return;
    }

    section.hidden = false;
    grid.textContent = '';
    active.forEach(function (promo) {
      var card = el('article', { class: 'offer reveal' });
      if (promo.badge) card.appendChild(el('span', { class: 'offer__badge', text: tx(promo.badge) }));
      card.appendChild(el('h3', { class: 'offer__title', text: tx(promo.title) }));
      if (promo.desc) card.appendChild(el('p', { class: 'offer__desc', text: tx(promo.desc) }));

      var cta = el('a', {
        class: 'offer__cta',
        href: 'tel:' + ((C.business && C.business.phone && C.business.phone.tel) || ''),
        'data-track': 'promo_click'
      });
      cta.appendChild(el('span', { text: tx(promo.cta) || t('offers.cta') }));
      cta.appendChild(icon('arrow'));
      card.appendChild(cta);
      grid.appendChild(card);
    });
  }

  function renderReviews() {
    var reviews = C.reviews || {};
    var section = $('#reviews');
    var rating = Number(reviews.rating);
    var count = reviews.count;

    var verifiedReviews = reviews.show !== false;
    els('[data-review-summary]').forEach(function (node) { node.hidden = !verifiedReviews; });
    els('[data-review-link]').forEach(function (node) { node.hidden = !verifiedReviews; });
    if (section && !verifiedReviews) {
      section.hidden = true;
      return;
    }
    if (section) section.hidden = false;

    var ratingText = formatRating(rating);
    var countText = num(count);

    setText('[data-bind="rating"]', ratingText);
    setText('[data-bind="reviewCount"]', countText);

    var ring = $('#ratingRing');
    if (ring && isFinite(rating)) {
      ring.style.setProperty('--pct', (Math.max(0, Math.min(5, rating)) / 5 * 100).toFixed(1) + '%');
      ring.setAttribute('aria-label', tf('reviews.aria', { rating: ratingText, count: countText }));
      ring.setAttribute('role', 'img');
    }

    var filled = Math.round(Math.max(0, Math.min(5, rating || 0)));
    els('[data-bind-stars]').forEach(function (group) {
      Array.prototype.forEach.call(group.children, function (star, i) {
        star.setAttribute('class', i < filled ? 'star-fill' : 'star-empty');
      });
    });

    setText('[data-bind="reviewsLead"]', tf('reviews.lead', { rating: ratingText, count: countText }));

    var heroReviews = $('[data-bind="heroReviews"]');
    if (heroReviews) heroReviews.textContent = tf('hero.reviews', { count: countText });
  }

  /* ---------------------------------------------------------------------------
     Photos — resolves whichever extension the owner uploaded
     --------------------------------------------------------------------------- */
  var PHOTO_EXTS = ['webp', 'avif', 'jpg', 'jpeg', 'png'];
  var photoCache = {};

  function findPhoto(base) {
    if (!base) return Promise.resolve(null);
    if (photoCache[base]) return photoCache[base];

    var promise = new Promise(function (resolve) {
      var index = 0;
      function next() {
        if (index >= PHOTO_EXTS.length) { resolve(null); return; }
        var url = base + '.' + PHOTO_EXTS[index++];
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

  function initPhotos() {
    var photos = C.photos || {};
    var hero = $('.hero');
    var heroImg = $('#heroPhoto');
    var portrait = $('#ownerPortrait');

    if (heroImg) {
      findPhoto(photos.owner).then(function (url) {
        heroHasPhoto = !!url;
        if (url) {
          heroImg.src = url;
          heroImg.classList.add('is-real');
          // The owner is the star: show the photo as a large portrait, too
          if (portrait) {
            portrait.src = url;
            if (hero) hero.classList.add('has-owner');
          }
          if (hero) hero.classList.remove('is-nophoto');
        } else {
          heroImg.src = 'assets/img/placeholder-hero.svg';
          if (hero) hero.classList.add('is-nophoto');
        }
        heroImg.alt = heroAlt();
      });
    }

    // Optional shop gallery — completely hidden until real photos exist
    var shopSection = $('#shop');
    var frames = $$('[data-shop-photo]');
    if (shopSection && frames.length) {
      var found = 0;
      var pending = frames.length;
      frames.forEach(function (img) {
        var card = closest(img, '.shop__card');
        findPhoto(photos[img.dataset.shopPhoto]).then(function (url) {
          if (url) {
            found += 1;
            img.src = url;
            img.alt = t('shop.alt');
            if (card) card.hidden = false;
          } else if (card) {
            card.hidden = true;
          }
          pending -= 1;
          if (pending === 0) {
            shopSection.hidden = found === 0;
            initReveals();
            revealInView();
          }
        });
      });
    }
  }

  /* ---------------------------------------------------------------------------
     Apply language
     --------------------------------------------------------------------------- */
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

    var title = t('meta.title');
    if (title) document.title = title;
    var desc = t('meta.desc');
    if (desc) {
      var metaDesc = $('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', desc);
      var ogDesc = $('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', desc);
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
    renderMenu();
    renderPromos();

    var heroImg = $('#heroPhoto');
    if (heroImg) heroImg.alt = heroAlt();
    var ownerImg = $('#ownerPortrait');
    if (ownerImg) ownerImg.alt = t('hero.photoAlt');
    $$('[data-shop-photo]').forEach(function (img) {
      if (img.getAttribute('src') && img.getAttribute('src').indexOf('placeholder') === -1) img.alt = t('shop.alt');
    });

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

    // Newly rendered cards may be in view — reveal without waiting
    revealInView();
  }

  function setLang(next) {
    if (next === lang) return;
    applyLang(next);
  }

  /* ---------------------------------------------------------------------------
     Header, drawer, navigation state
     --------------------------------------------------------------------------- */
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
        var link = closest(event.target, 'a[href^="#"]');
        if (link) closeDrawer(false);
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
      if (window.innerWidth >= 900 && drawerOpen) closeDrawer(false);
    });

    // Anchor navigation: close drawer, then let the browser scroll (CSS smooth)
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

  /* ---------------------------------------------------------------------------
     Language switcher
     --------------------------------------------------------------------------- */
  function initLangSwitch() {
    $$('[data-lang]').forEach(function (btn) {
      btn.addEventListener('click', function () { setLang(btn.dataset.lang); });
    });
  }

  /* ---------------------------------------------------------------------------
     Scroll-driven effects
     --------------------------------------------------------------------------- */
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
      var hero = $('.hero');
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
      var menuSection = $('#menu');
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

  /* Scroll spy for the desktop nav */
  function initScrollSpy() {
    var links = $$('.nav__link');
    if (!links.length || !('IntersectionObserver' in window)) return;
    var sections = links.map(function (link) {
      return document.querySelector(link.getAttribute('href'));
    }).filter(Boolean);

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (section) { spy.observe(section); });
  }

  /* ---------------------------------------------------------------------------
     Analytics + consent
     --------------------------------------------------------------------------- */
  var analyticsConfig = C.analytics || {};
  var gaLoaded = false;

  function track(event, params) {
    var payload = { event: event, language: lang };
    if (params) Object.keys(params).forEach(function (key) { payload[key] = params[key]; });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
    try {
      document.dispatchEvent(new CustomEvent('dp:track', { detail: payload }));
    } catch (e) { /* ignore */ }
  }

  function consentValue() {
    // 'granted' | 'denied' | null (not chosen yet)
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

    // Taps on menu cards (not just the call link) count as menu interest
    var grid = $('#dishGrid');
    if (grid) {
      grid.addEventListener('click', function (event) {
        var card = closest(event.target, '[data-dish-id]');
        if (!card) return;
        if (closest(event.target, '[data-track]')) return;
        track('menu_item_interest', { item: card.dataset.dishId });
      }, { passive: true });
    }
  }

  /* ---------------------------------------------------------------------------
     Boot
     --------------------------------------------------------------------------- */
  function boot() {
    var year = $('#year');
    if (year) year.textContent = new Date().getFullYear();

    syncLinks();
    initNav();
    initLangSwitch();
    initTracking();

    applyLang(lang, { silent: true });
    initConsent();

    // Localise the review lead on first paint
    var lead = $('[data-bind="reviewsLead"]');
    if (lead) {
      lead.textContent = tf('reviews.lead', {
        rating: formatRating((C.reviews || {}).rating),
        count: num((C.reviews || {}).count)
      });
    }
    var heroReviews = $('[data-bind="heroReviews"]');
    if (heroReviews) {
      heroReviews.textContent = tf('hero.reviews', { count: num((C.reviews || {}).count) });
    }

    initPhotos();
    initReveals();
    initTilt();
    initScroll();
    initScrollSpy();

    // Reveal anything already on screen once fonts/layout settle
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
