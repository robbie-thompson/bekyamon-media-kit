import { createIcons, Mail, Download, ArrowUpRight, Eye, Play, MapPin, Users, Instagram, Youtube, Twitch, Music2, ChevronDown, LayoutGrid, BookOpen, PanelsTopLeft } from 'lucide';
import './styles.css';

const designs = {
  editorial: { label: 'Editorial', number: '01', icon: 'book-open' },
  dashboard: { label: 'Dashboard', number: '02', icon: 'layout-grid' },
  portfolio: { label: 'Portfolio', number: '03', icon: 'panels-top-left' },
};

const platformData = [
  {
    id: 'instagram',
    name: 'Instagram',
    handle: '@bekyamon',
    icon: 'instagram',
    followers: '484K',
    avgViews: '318K',
    engagement: '7.8%',
    description: 'Style, everyday life and bright visual storytelling for an audience that comes for a candid point of view.',
    content: [
      { title: 'A slow afternoon by the sea', format: 'Reel', views: '842K', image: '/images/bekyamon-close.jpg' },
      { title: 'Three ways I style summer', format: 'Carousel', views: '316K', image: '/images/bekyamon-profile.jpg' },
      { title: 'What I actually packed', format: 'Reel', views: '691K', image: '/images/bekyamon-wide.jpg' },
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
    description: 'Fast, funny and personality-led edits spanning fashion, culture and the moments worth sharing with friends.',
    content: [
      { title: 'POV: the outfit finally works', format: 'Video', views: '1.8M', image: '/images/bekyamon-profile.jpg' },
      { title: 'Beach day reality check', format: 'Video', views: '934K', image: '/images/bekyamon-wide.jpg' },
      { title: 'This changed my morning', format: 'Video', views: '712K', image: '/images/bekyamon-close.jpg' },
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
    description: 'Longer-form stories and considered recommendations, made for an audience who stays for the full conversation.',
    content: [
      { title: 'A very honest summer reset', format: 'Vlog · 18:42', views: '284K', image: '/images/bekyamon-wide.jpg' },
      { title: 'Things I wish I knew sooner', format: 'Video · 14:08', views: '197K', image: '/images/bekyamon-close.jpg' },
      { title: 'Come away with me for 48 hours', format: 'Vlog · 22:16', views: '163K', image: '/images/bekyamon-profile.jpg' },
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
    description: 'Live conversations, games and unfiltered community moments where viewers become part of the story in real time.',
    content: [
      { title: 'Cosy games and a proper catch-up', format: 'Stream · 03:18:42', views: '156K', image: '/images/bekyamon-close.jpg' },
      { title: 'Chat chooses everything I do', format: 'Stream · 02:46:19', views: '121K', image: '/images/bekyamon-profile.jpg' },
      { title: 'Late-night community games', format: 'Stream · 04:02:07', views: '98K', image: '/images/bekyamon-wide.jpg' },
    ],
    locations: [['United Kingdom', 46], ['United States', 25], ['Canada', 8]],
    genders: [['Women', 67], ['Men', 28], ['Other', 5]],
  },
];

const brands = ['ADOBE', 'SPOTIFY', 'NIKE', 'GLOSSIER', 'LOGITECH', 'GYMSHARK'];

function icon(name, size = 16) {
  return `<i data-lucide="${name}" width="${size}" height="${size}" aria-hidden="true"></i>`;
}

function contactLinks(compact = false) {
  return `
    <div class="contact-links ${compact ? 'contact-links--compact' : ''}">
      <a class="button button--primary" href="mailto:hello@bekyamon.com">${icon('mail')}<span>Email me</span></a>
      <a class="button button--quiet" href="https://www.instagram.com/bekyamon" target="_blank" rel="noreferrer">${icon('instagram')}<span>Instagram</span>${icon('arrow-up-right', 14)}</a>
      <a class="button button--icon" href="#platforms" aria-label="Explore audience and platform data">${icon('chevron-down')}</a>
    </div>`;
}

function brandStrip(title = 'Previously partnered with') {
  return `
    <section class="brand-strip" aria-labelledby="brand-heading">
      <p class="eyebrow" id="brand-heading">${title} <span>· Placeholder logos</span></p>
      <div class="brand-row">${brands.map((brand) => `<div class="brand-mark">${brand}</div>`).join('')}</div>
    </section>`;
}

function progressList(items, variant = '') {
  return `<div class="progress-list ${variant}">${items.map(([label, value]) => `
    <div class="progress-item">
      <div class="progress-label"><span>${label}</span><strong>${value}%</strong></div>
      <div class="progress-track"><span style="--progress: ${value}%"></span></div>
    </div>`).join('')}</div>`;
}

function contentCard(item, index, variant = '') {
  return `
    <article class="content-card ${variant}">
      <div class="content-card__image">
        <img src="${item.image}" alt="" loading="lazy" />
        <span class="content-index">0${index + 1}</span>
        <span class="play-button">${icon('play', 14)}</span>
      </div>
      <div class="content-card__meta">
        <p>${item.format}</p>
        <p class="view-count">${icon('eye', 13)} ${item.views}</p>
      </div>
      <h4>${item.title}</h4>
    </article>`;
}

function platformNav() {
  return `<nav class="platform-nav" aria-label="Platform sections">${platformData.map((platform) => `<a href="#${platform.id}">${icon(platform.icon)}${platform.name}</a>`).join('')}</nav>`;
}

function topBar(active) {
  return `
    <header class="topbar">
      <a class="wordmark" href="#top" aria-label="Bekyamon media kit home"><span>B</span> BEKYAMON</a>
      <div class="topbar__meta"><span>Media kit</span><span>2026</span></div>
      <button class="design-menu-button" type="button" aria-expanded="false" aria-controls="design-menu">
        ${icon(designs[active].icon)} <span>${designs[active].number} / ${designs[active].label}</span> ${icon('chevron-down', 14)}
      </button>
      <div class="design-menu" id="design-menu" hidden>
        <p>Choose a design direction</p>
        ${Object.entries(designs).map(([key, design]) => `
          <button type="button" data-design="${key}" class="${key === active ? 'is-active' : ''}">
            <span>${design.number}</span><strong>${design.label}</strong>${icon(design.icon)}
          </button>`).join('')}
      </div>
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

function editorialPlatform(platform, index) {
  return `
    <section class="editorial-platform platform-section" id="${platform.id}">
      <div class="platform-heading">
        <div><span class="section-number">0${index + 1}</span><span class="platform-icon">${icon(platform.icon, 20)}</span></div>
        <div>
          <p class="eyebrow">${platform.handle}</p>
          <h2>${platform.name}</h2>
          <p class="section-intro">${platform.description}</p>
        </div>
      </div>
      <div class="platform-stats">
        <div><strong>${platform.followers}</strong><span>Followers</span></div>
        <div><strong>${platform.avgViews}</strong><span>Avg. views · 90d</span></div>
        <div><strong>${platform.engagement}</strong><span>Engagement</span></div>
      </div>
      <div class="content-heading"><h3>Latest work</h3><span>Mock content · Last 90 days</span></div>
      <div class="content-grid">${platform.content.map((item, i) => contentCard(item, i)).join('')}</div>
      <div class="demographics">
        <div class="demo-heading"><span>${icon('users')}</span><div><p class="eyebrow">Audience profile</p><h3>Who’s watching</h3></div></div>
        <div><p class="demo-title">Top locations</p>${progressList(platform.locations)}</div>
        <div><p class="demo-title">Gender split</p>${progressList(platform.genders)}</div>
      </div>
    </section>`;
}

function editorial() {
  return `
    <div class="site editorial" id="top">
      ${topBar('editorial')}
      <main id="content">
        <section class="editorial-hero">
          <div class="hero-copy">
            <p class="eyebrow">Digital creator · Brighton, UK</p>
            <h1>Real life,<br><em>well told.</em></h1>
            <p class="bio"><span>Placeholder bio —</span> Bekyamon is a UK-based creator known for warm, honest storytelling across style, culture and everyday life. Her community comes for the wit and stays for the point of view.</p>
            ${contactLinks()}
          </div>
          <figure class="hero-image editorial-hero__image"><img src="/images/bekyamon-profile.jpg" alt="Bekyamon standing on a sunny beach" /></figure>
          <div class="hero-stat hero-stat--one"><strong>1.55M</strong><span>Combined following</span></div>
          <div class="hero-stat hero-stat--two"><strong>1.08M</strong><span>Average cross-platform views</span></div>
        </section>
        ${brandStrip()}
        <div class="section-index"><p>Platform breakdown</p>${platformNav()}</div>
        <div id="platforms">${platformData.map(editorialPlatform).join('')}</div>
      </main>
      ${footer()}
    </div>`;
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
          ${progressList(platform.locations, 'progress-list--dark')}
        </div>
        <div class="dashboard-audience">
          <div class="dashboard-card-heading"><div><p class="eyebrow">Community</p><h3>Gender split</h3></div>${icon('users')}</div>
          ${progressList(platform.genders, 'progress-list--dark')}
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
    <div class="site dashboard" id="top">
      ${topBar('dashboard')}
      <main id="content" class="dashboard-shell">
        <aside class="dashboard-sidebar">
          <div><p class="eyebrow">Media kit / 2026</p><h2>Bekyamon</h2><p>Creator analytics and partnership profile.</p></div>
          ${platformNav()}
          <div class="sidebar-contact"><p>Partnership enquiries</p><a href="mailto:hello@bekyamon.com">hello@bekyamon.com</a></div>
        </aside>
        <div class="dashboard-main">
          <section class="dashboard-hero">
            <div class="dashboard-profile">
              <img src="/images/bekyamon-close.jpg" alt="Portrait of Bekyamon on the beach" />
              <div><p class="eyebrow">Creator overview</p><h1>Hi, I’m<br>Bekyamon.</h1></div>
            </div>
            <p class="dashboard-bio"><span>Placeholder bio —</span> UK creator with a sharp eye for the small moments. I make honest, personality-led content across style, culture and everyday life.</p>
            ${contactLinks(true)}
          </section>
          <section class="overview-grid" aria-label="Combined audience overview">
            <div class="overview-title"><p class="eyebrow">Combined reach</p><h2>At a glance</h2><span>Updated July 2026 · Mock data</span></div>
            <div class="overview-metric"><span>01</span><strong>1.55M</strong><p>Total followers</p></div>
            <div class="overview-metric"><span>02</span><strong>1.08M</strong><p>Avg. views</p></div>
            <div class="overview-metric"><span>03</span><strong>8.3%</strong><p>Avg. engagement</p></div>
          </section>
          ${brandStrip('Select collaborations')}
          <div id="platforms">${platformData.map(dashboardPlatform).join('')}</div>
          <div id="contact">${footer()}</div>
        </div>
      </main>
    </div>`;
}

function portfolioPlatform(platform, index) {
  const reverse = index % 2 ? 'portfolio-platform--reverse' : '';
  return `
    <section class="portfolio-platform platform-section ${reverse}" id="${platform.id}">
      <div class="portfolio-platform__intro">
        <div class="platform-kicker"><span>0${index + 1}</span>${icon(platform.icon, 20)}<p>${platform.handle}</p></div>
        <h2>${platform.name}</h2>
        <p>${platform.description}</p>
        <div class="portfolio-metrics">
          <div><strong>${platform.followers}</strong><span>Followers</span></div>
          <div><strong>${platform.avgViews}</strong><span>90-day avg. views</span></div>
        </div>
        <div class="portfolio-demo">
          <div><p class="demo-title">Top locations</p>${progressList(platform.locations)}</div>
          <div><p class="demo-title">Gender split</p>${progressList(platform.genders)}</div>
        </div>
      </div>
      <div class="portfolio-content">
        <div class="portfolio-content__heading"><p>Latest work</p><span>Mock content ↘</span></div>
        <div class="portfolio-content__grid">${platform.content.map((item, i) => contentCard(item, i, i === 0 ? 'content-card--featured' : '')).join('')}</div>
      </div>
    </section>`;
}

function portfolio() {
  return `
    <div class="site portfolio" id="top">
      ${topBar('portfolio')}
      <main id="content">
        <section class="portfolio-hero">
          <figure><img src="/images/bekyamon-wide.jpg" alt="Bekyamon standing on a bright beach" /></figure>
          <div class="portfolio-hero__copy">
            <p class="eyebrow">Bekyamon · Creator media kit</p>
            <h1>Making the<br>everyday <em>matter.</em></h1>
          </div>
          <div class="portfolio-hero__details">
            <p><span>Placeholder bio —</span> Bekyamon is a Brighton-based creator bringing wit, warmth and an unmistakable visual voice to content about style, culture and real life.</p>
            ${contactLinks()}
          </div>
          <div class="portfolio-hero__totals">
            <div><strong>1.55M</strong><span>Combined followers</span></div>
            <div><strong>1.08M</strong><span>Average views</span></div>
          </div>
        </section>
        ${brandStrip('Brand experience')}
        <section class="portfolio-index"><div><p class="eyebrow">Inside this kit</p><h2>Four platforms.<br>One community.</h2></div>${platformNav()}</section>
        <div id="platforms">${platformData.map(portfolioPlatform).join('')}</div>
      </main>
      ${footer()}
    </div>`;
}

const renderers = { editorial, dashboard, portfolio };

function getDesign() {
  const params = new URLSearchParams(window.location.search);
  const design = params.get('design');
  return renderers[design] ? design : 'editorial';
}

function render(design = getDesign()) {
  document.documentElement.dataset.design = design;
  document.querySelector('#app').innerHTML = renderers[design]();
  createIcons({ icons: { Mail, Download, ArrowUpRight, Eye, Play, MapPin, Users, Instagram, Youtube, Twitch, Music2, ChevronDown, LayoutGrid, BookOpen, PanelsTopLeft } });
  bindInteractions(design);
}

function bindInteractions(currentDesign) {
  const menuButton = document.querySelector('.design-menu-button');
  const menu = document.querySelector('.design-menu');

  menuButton?.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menu.hidden = isOpen;
  });

  menu?.querySelectorAll('[data-design]').forEach((button) => {
    button.addEventListener('click', () => {
      const design = button.dataset.design;
      if (design === currentDesign) {
        menu.hidden = true;
        menuButton.setAttribute('aria-expanded', 'false');
        return;
      }
      const url = new URL(window.location);
      url.searchParams.set('design', design);
      window.history.pushState({}, '', url);
      render(design);
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
  });

  document.addEventListener('click', function closeMenu(event) {
    if (!event.target.closest('.design-menu') && !event.target.closest('.design-menu-button')) {
      menu.hidden = true;
      menuButton.setAttribute('aria-expanded', 'false');
      document.removeEventListener('click', closeMenu);
    }
  });
}

window.addEventListener('popstate', () => render());
render();
