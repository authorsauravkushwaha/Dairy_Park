/**
 * Single source of truth for the site's page structure.
 * Used by build.mjs (assembly + sitemap) and check.mjs (verification).
 *
 *  id     → body[data-page] + i18n lookup ("meta.<id>.title")
 *  file   → template in templates/pages/
 *  out    → file inside dist/  (folders give clean /food/ style URLs on Pages)
 *  slug   → path under site.url for canonical/OG/sitemap ("food/" = …/food/)
 *  nav    → which nav item lights up (null = not in main nav, e.g. privacy)
 */
export const PAGES = [
  { id: 'home',    file: 'home.html',    out: 'index.html',     slug: '',             nav: 'home',    crumb: 'Home',             priority: '1.0' },
  { id: 'food',    file: 'food.html',    out: 'food/index.html',    slug: 'food/',    nav: 'menu',    crumb: 'Food & Menu',      priority: '0.9' },
  { id: 'about',   file: 'about.html',   out: 'about/index.html',   slug: 'about/',   nav: 'about',   crumb: 'About Us',         priority: '0.7' },
  { id: 'gallery', file: 'gallery.html', out: 'gallery/index.html', slug: 'gallery/', nav: 'gallery', crumb: 'Gallery',          priority: '0.6' },
  { id: 'offers',  file: 'offers.html',  out: 'offers/index.html',  slug: 'offers/',  nav: 'offers',  crumb: 'Special Offers',   priority: '0.6' },
  { id: 'reviews', file: 'reviews.html', out: 'reviews/index.html', slug: 'reviews/', nav: 'reviews', crumb: 'Customer Reviews', priority: '0.6' },
  { id: 'visit',   file: 'visit.html',   out: 'visit/index.html',   slug: 'visit/',   nav: 'visit',   crumb: 'Visit Us',         priority: '0.8' },
  { id: 'contact', file: 'contact.html', out: 'contact/index.html', slug: 'contact/', nav: 'contact', crumb: 'Contact Us',       priority: '0.7' },
  { id: 'privacy', file: 'privacy.html', out: 'privacy.html',       slug: 'privacy.html', nav: null,  crumb: 'Privacy Note',     priority: '0.2' }
];

/** Pages listed in sitemap.xml (all of them — the privacy note is indexable). */
export const SITEMAP_PAGES = PAGES;
