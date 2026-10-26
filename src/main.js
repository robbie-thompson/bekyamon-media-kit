import { createIcons, Mail, ArrowUpRight, MapPin, Users, Instagram, Youtube, Twitch, Music2 } from 'lucide';
import './styles.css';
import { PLATFORM_METRICS } from '../worker/default-data.js';
const imageUrl = (filename) => `${import.meta.env.BASE_URL}images/${filename}`;

const brands = [
  { id: 'adobe', name: 'Adobe', logo: imageUrl('logos/adobe.svg') },
  { id: 'spotify', name: 'Spotify', logo: imageUrl('logos/spotify.svg') },
  { id: 'nike', name: 'Nike', logo: imageUrl('logos/nike.svg') },
  { id: 'glossier', name: 'Glossier', logo: imageUrl('logos/glossier.svg') },
  { id: 'logitech', name: 'Logitech', logo: imageUrl('logos/logitech.svg') },
  { id: 'gymshark', name: 'Gymshark', logo: imageUrl('logos/gymshark.svg') },
];

function icon(name, size = 16) {
  return `<i data-lucide="${name}" width="${size}" height="${size}" aria-hidden="true"></i>`;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[character]);
}

function contentImage(value) {
  return /^https:\/\//i.test(value) ? value : imageUrl(value);
}

function contactLinks() {
  return `
    <div class="contact-links">
      <a class="button button--primary" href="mailto:business@bekyamon.live">${icon('mail')}<span>Email me</span></a>
      <a class="button button--quiet" href="https://www.instagram.com/bekyamon" target="_blank" rel="noreferrer">${icon('instagram')}<span>Instagram</span>${icon('arrow-up-right', 14)}</a>
    </div>`;
}

function brandStrip() {
  return `
    <section class="brand-strip" aria-label="Brand collaborations">
      <div class="brand-row">${brands.map((brand) => `
        <div class="brand-mark brand-mark--${brand.id}">
          <img src="${brand.logo}" alt="${brand.name}" />
        </div>`).join('')}</div>
    </section>`;
}

function progressList(items) {
  return `<div class="progress-list">${items.map(([label, value]) => `
    <div class="progress-item">
      <div class="progress-label"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}%</strong></div>
      <div class="progress-track"><span style="--progress: ${Math.min(100, Math.max(0, Number(value) || 0))}%"></span></div>
    </div>`).join('')}</div>`;
}

function platformNav(platformData) {
  return `<nav class="platform-nav" aria-label="Platform sections">${platformData.map((platform) => `<a href="#${platform.id}">${icon(platform.icon)}${escapeHtml(platform.name)}</a>`).join('')}</nav>`;
}

function footer() {
  return `
    <footer class="site-footer">
      <a class="footer-email" href="mailto:business@bekyamon.live">business@bekyamon.live ${icon('arrow-up-right', 20)}</a>
    </footer>`;
}

function dashboardPlatform(platform, index) {
  const metrics = PLATFORM_METRICS[platform.id]
    .filter(([key]) => platform.visible.metrics[key]);
  return `
    <section class="dashboard-platform platform-section" id="${platform.id}">
      <div class="dashboard-platform__header">
        <div class="dashboard-platform__title"><span>${icon(platform.icon, 22)}</span><div><p class="eyebrow">0${index + 1}${platform.visible.handle ? ` · ${escapeHtml(platform.handle)}` : ''}</p><h2>${escapeHtml(platform.name)}</h2></div></div>
      </div>
      <div class="dashboard-grid" style="--metric-span: ${6 / (metrics.length || 1)}">
        ${metrics.map(([key, label], metricIndex) => `<div class="metric-card ${metricIndex === 0 ? 'metric-card--primary' : ''}"><p>${label}</p><strong>${escapeHtml(platform[key] || '—')}</strong></div>`).join('')}
        ${platform.visible.genders && platform.genders.length ? `<div class="dashboard-audience">
          <div class="dashboard-card-heading"><div><p class="eyebrow">Community</p><h3>${escapeHtml(platform.gendersLabel || 'Gender split')}</h3></div>${icon('users')}</div>
          ${progressList(platform.genders)}
        </div>` : ''}
        ${platform.visible.locations && platform.locations.length ? `<div class="dashboard-audience">
          <div class="dashboard-card-heading"><div><p class="eyebrow">Geography</p><h3>Top locations</h3></div>${icon('map-pin')}</div>
          ${progressList(platform.locations)}
        </div>` : ''}
        ${platform.visible.content && platform.content.length ? `<div class="dashboard-content">
          <div class="dashboard-card-heading"><div><p class="eyebrow">Recent uploads</p><h3>Content performance</h3></div><span>Views</span></div>
          <div class="dashboard-content-list">${platform.content.map((item) => `
            <article>
              <img src="${escapeHtml(contentImage(item.image))}" alt="" loading="lazy" />
              <div><span>${escapeHtml(item.format)}</span><h4>${escapeHtml(item.title)}</h4></div>
              <strong>${escapeHtml(item.views)}</strong>
            </article>`).join('')}</div>
        </div>` : ''}
      </div>
    </section>`;
}

function overview(profile) {
  if (!profile.overview.visible) return '';
  const metrics = [
    ['followers', 'Total followers'],
    ['avgViews', 'Avg. views'],
    ['engagement', 'Avg. engagement'],
  ].filter(([key]) => profile.overview.metrics[key]);
  return `<section class="overview-grid overview-grid--${metrics.length}" aria-label="Combined audience overview">
    <div class="overview-title"><h2>Combined reach</h2></div>
    ${metrics.map(([key, label]) => `<div class="overview-metric"><strong>${escapeHtml(profile.overview[key])}</strong><p>${label}</p></div>`).join('')}
  </section>`;
}

function dashboard(profile) {
  const platformData = profile.platforms;
  return `
    <div class="site" id="top">
      <main id="content" class="dashboard-shell">
        <aside class="dashboard-sidebar">
          <div><p class="eyebrow">Media kit / ${new Date().getFullYear()}</p><h2>Bekyamon</h2></div>
          ${platformNav(platformData)}
          <div class="sidebar-contact"><p>Partnership enquiries</p><a href="mailto:business@bekyamon.live">business@bekyamon.live</a></div>
        </aside>
        <div class="dashboard-main">
          <section class="dashboard-hero">
            <div class="dashboard-profile">
              <img src="${imageUrl('bekyamon-close.jpg')}" alt="Portrait of Bekyamon on the beach" />
              <div><h1>Hi, I’m<br>Bekyamon.</h1></div>
            </div>
            <p class="dashboard-bio"><span>Placeholder bio —</span> UK creator with a sharp eye for the small moments. I make honest, personality-led content across style, culture and everyday life.</p>
            ${contactLinks()}
          </section>
          ${overview(profile)}
          ${brandStrip()}
          <div id="platforms">${platformData.map(dashboardPlatform).join('')}</div>
          <div id="contact">${footer()}</div>
        </div>
      </main>
    </div>`;
}

function presentationSlug() {
  const path = window.location.pathname.replace(/\/+$/, '');
  const match = path.match(/^\/mediakit\/([a-z0-9-]+)$/);
  return match?.[1] || null;
}

/**
 * Load only the presentation explicitly selected by the URL.
 */
async function loadMediaKit() {
  const slug = presentationSlug();

  if (!slug) {
    return null;
  }

  try {
    const response = await fetch(`/api/mediakit/${encodeURIComponent(slug)}`);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Media kit API returned ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn('Unable to load media kit data:', error);
    return { loadError: true };
  }
}

loadMediaKit().then((profile) => {
  const unavailable = (eyebrow, heading, detail) => `<div class="site" id="top"><main id="content" class="not-found"><p class="eyebrow">${eyebrow}</p><h1>${heading}</h1><p>${detail}</p></main></div>`;
  document.querySelector('#app').innerHTML = profile?.loadError
    ? unavailable('Temporarily unavailable', 'The live stats couldn’t be loaded.', 'Please refresh in a moment or ask for an updated link.')
    : profile
      ? dashboard(profile)
      : unavailable('Presentation not found', 'This media-kit link isn’t available.', 'Please check the URL or ask for an updated link.');
  createIcons({ icons: { Mail, ArrowUpRight, MapPin, Users, Instagram, Youtube, Twitch, Music2 } });
});
