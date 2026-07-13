import { createIcons, Mail, ArrowUpRight, MapPin, Users, Instagram, Youtube, Twitch, Music2, ChevronDown } from 'lucide';
import './styles.css';

const imageUrl = (filename) => `${import.meta.env.BASE_URL}images/${filename}`;

const platformData = [
  {
    id: 'instagram',
    name: 'Instagram',
    handle: '@bekyamon',
    icon: 'instagram',
    followers: '484K',
    avgViews: '318K',
    engagement: '7.8%',
    content: [
      { title: 'A slow afternoon by the sea', format: 'Reel', views: '842K', image: imageUrl('bekyamon-close.jpg') },
      { title: 'Three ways I style summer', format: 'Carousel', views: '316K', image: imageUrl('bekyamon-profile.jpg') },
      { title: 'What I actually packed', format: 'Reel', views: '691K', image: imageUrl('bekyamon-wide.jpg') },
    ],
    locations: [['United Kingdom', 48], ['United States', 22], ['Australia', 8]],
    genders: [['Women', 72], ['Men', 24], ['Other', 4]],
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    handle: '@bekyamon',
    icon: 'music-2',
    followers: '728K',
    avgViews: '526K',
    engagement: '10.4%',
    content: [
      { title: 'POV: the outfit finally works', format: 'Video', views: '1.8M', image: imageUrl('bekyamon-profile.jpg') },
      { title: 'Beach day reality check', format: 'Video', views: '934K', image: imageUrl('bekyamon-wide.jpg') },
      { title: 'This changed my morning', format: 'Video', views: '712K', image: imageUrl('bekyamon-close.jpg') },
    ],
    locations: [['United Kingdom', 52], ['United States', 19], ['Ireland', 7]],
    genders: [['Women', 76], ['Men', 20], ['Other', 4]],
  },
  {
    id: 'youtube',
    name: 'YouTube',
    handle: 'Bekyamon',
    icon: 'youtube',
    followers: '211K',
    avgViews: '148K',
    engagement: '6.2%',
    content: [
      { title: 'A very honest summer reset', format: 'Vlog · 18:42', views: '284K', image: imageUrl('bekyamon-wide.jpg') },
      { title: 'Things I wish I knew sooner', format: 'Video · 14:08', views: '197K', image: imageUrl('bekyamon-close.jpg') },
      { title: 'Come away with me for 48 hours', format: 'Vlog · 22:16', views: '163K', image: imageUrl('bekyamon-profile.jpg') },
    ],
    locations: [['United Kingdom', 44], ['United States', 27], ['Canada', 9]],
    genders: [['Women', 69], ['Men', 26], ['Other', 5]],
  },
  {
    id: 'twitch',
    name: 'Twitch',
    handle: 'bekyamon',
    icon: 'twitch',
    followers: '126K',
    avgViews: '92K',
    engagement: '9.1%',
    content: [
      { title: 'Cosy games and a proper catch-up', format: 'Stream · 03:18:42', views: '156K', image: imageUrl('bekyamon-close.jpg') },
      { title: 'Chat chooses everything I do', format: 'Stream · 02:46:19', views: '121K', image: imageUrl('bekyamon-profile.jpg') },
      { title: 'Late-night community games', format: 'Stream · 04:02:07', views: '98K', image: imageUrl('bekyamon-wide.jpg') },
    ],
    locations: [['United Kingdom', 46], ['United States', 25], ['Canada', 8]],
    genders: [['Women', 67], ['Men', 28], ['Other', 5]],
  },
];

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

function contactLinks() {
  return `
    <div class="contact-links">
      <a class="button button--primary" href="mailto:hello@bekyamon.com">${icon('mail')}<span>Email me</span></a>
      <a class="button button--quiet" href="https://www.instagram.com/bekyamon" target="_blank" rel="noreferrer">${icon('instagram')}<span>Instagram</span>${icon('arrow-up-right', 14)}</a>
      <a class="button button--icon" href="#platforms" aria-label="Explore audience and platform data">${icon('chevron-down')}</a>
    </div>`;
}

function brandStrip() {
  return `
    <section class="brand-strip" aria-labelledby="brand-heading">
      <p class="eyebrow" id="brand-heading">Select collaborations</p>
      <div class="brand-row">${brands.map((brand) => `
        <div class="brand-mark brand-mark--${brand.id}">
          <img src="${brand.logo}" alt="${brand.name}" />
        </div>`).join('')}</div>
    </section>`;
}

function progressList(items) {
  return `<div class="progress-list">${items.map(([label, value]) => `
    <div class="progress-item">
      <div class="progress-label"><span>${label}</span><strong>${value}%</strong></div>
      <div class="progress-track"><span style="--progress: ${value}%"></span></div>
    </div>`).join('')}</div>`;
}

function platformNav() {
  return `<nav class="platform-nav" aria-label="Platform sections">${platformData.map((platform) => `<a href="#${platform.id}">${icon(platform.icon)}${platform.name}</a>`).join('')}</nav>`;
}

function topBar() {
  return `
    <header class="topbar">
      <a class="wordmark" href="#top" aria-label="Bekyamon media kit home"><span>B</span> BEKYAMON</a>
      <div class="topbar__meta"><span>Media kit</span><span>2026</span></div>
    </header>`;
}

function footer() {
  return `
    <footer class="site-footer">
      <p class="eyebrow">Let’s make something good</p>
      <h2>Have a project<br>in mind?</h2>
      <a class="footer-email" href="mailto:hello@bekyamon.com">hello@bekyamon.com ${icon('arrow-up-right', 20)}</a>
      <div class="footer-bottom"><span>© Bekyamon 2026</span><span>Stats shown are placeholders</span><a href="#top">Back to top ↑</a></div>
    </footer>`;
}

function dashboardPlatform(platform, index) {
  return `
    <section class="dashboard-platform platform-section" id="${platform.id}">
      <div class="dashboard-platform__header">
        <div class="dashboard-platform__title"><span>${icon(platform.icon, 22)}</span><div><p class="eyebrow">0${index + 1} · ${platform.handle}</p><h2>${platform.name}</h2></div></div>
        <a href="#contact" class="text-link">Request full report ${icon('arrow-up-right', 14)}</a>
      </div>
      <div class="dashboard-grid">
        <div class="metric-card metric-card--primary"><p>Followers</p><strong>${platform.followers}</strong><span>Mock total audience</span></div>
        <div class="metric-card"><p>Avg. views</p><strong>${platform.avgViews}</strong><span>Past 90 days</span></div>
        <div class="metric-card"><p>Engagement</p><strong>${platform.engagement}</strong><span>Average rate</span></div>
        <div class="dashboard-audience">
          <div class="dashboard-card-heading"><div><p class="eyebrow">Geography</p><h3>Top locations</h3></div>${icon('map-pin')}</div>
          ${progressList(platform.locations)}
        </div>
        <div class="dashboard-audience">
          <div class="dashboard-card-heading"><div><p class="eyebrow">Community</p><h3>Gender split</h3></div>${icon('users')}</div>
          ${progressList(platform.genders)}
        </div>
        <div class="dashboard-content">
          <div class="dashboard-card-heading"><div><p class="eyebrow">Recent uploads</p><h3>Content performance</h3></div><span>Views</span></div>
          <div class="dashboard-content-list">${platform.content.map((item) => `
            <article>
              <img src="${item.image}" alt="" loading="lazy" />
              <div><span>${item.format}</span><h4>${item.title}</h4></div>
              <strong>${item.views}</strong>
            </article>`).join('')}</div>
        </div>
      </div>
    </section>`;
}

function dashboard() {
  return `
    <div class="site" id="top">
      ${topBar()}
      <main id="content" class="dashboard-shell">
        <aside class="dashboard-sidebar">
          <div><p class="eyebrow">Media kit / 2026</p><h2>Bekyamon</h2><p>Creator analytics and partnership profile.</p></div>
          ${platformNav()}
          <div class="sidebar-contact"><p>Partnership enquiries</p><a href="mailto:hello@bekyamon.com">hello@bekyamon.com</a></div>
        </aside>
        <div class="dashboard-main">
          <section class="dashboard-hero">
            <div class="dashboard-profile">
              <img src="${imageUrl('bekyamon-close.jpg')}" alt="Portrait of Bekyamon on the beach" />
              <div><p class="eyebrow">Creator overview</p><h1>Hi, I’m<br>Bekyamon.</h1></div>
            </div>
            <p class="dashboard-bio"><span>Placeholder bio —</span> UK creator with a sharp eye for the small moments. I make honest, personality-led content across style, culture and everyday life.</p>
            ${contactLinks()}
          </section>
          <section class="overview-grid" aria-label="Combined audience overview">
            <div class="overview-title"><p class="eyebrow">Combined reach</p><h2>At a glance</h2><span>Updated July 2026 · Mock data</span></div>
            <div class="overview-metric"><span>01</span><strong>1.55M</strong><p>Total followers</p></div>
            <div class="overview-metric"><span>02</span><strong>1.08M</strong><p>Avg. views</p></div>
            <div class="overview-metric"><span>03</span><strong>8.3%</strong><p>Avg. engagement</p></div>
          </section>
          ${brandStrip()}
          <div id="platforms">${platformData.map(dashboardPlatform).join('')}</div>
          <div id="contact">${footer()}</div>
        </div>
      </main>
    </div>`;
}

document.querySelector('#app').innerHTML = dashboard();
createIcons({ icons: { Mail, ArrowUpRight, MapPin, Users, Instagram, Youtube, Twitch, Music2, ChevronDown } });
