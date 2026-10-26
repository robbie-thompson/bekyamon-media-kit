import assert from 'node:assert/strict';
import test from 'node:test';
import worker, { applyLayout, internals } from '../worker/index.js';
import { DEFAULT_DATA, defaultLayout } from '../worker/default-data.js';

class MemoryKV {
  constructor(entries = {}) { this.entries = new Map(Object.entries(entries)); }
  async get(key, type) {
    const value = this.entries.get(key);
    if (value === undefined) return null;
    return type === 'json' ? JSON.parse(value) : value;
  }
  async put(key, value) { this.entries.set(key, value); }
  async delete(key) { this.entries.delete(key); }
  async list({ prefix }) {
    return { keys: [...this.entries.keys()].filter((key) => key.startsWith(prefix)).map((name) => ({ name })) };
  }
}

const env = (entries = {}) => ({
  DASHBOARD_PASSWORD: 'test-password',
  MEDIA_KIT_KV: new MemoryKV(entries),
  ASSETS: { fetch: () => new Response('asset') },
});

test('layout filtering controls order, sections and individual content', () => {
  const layout = defaultLayout('twitch-first', 'Twitch first');
  layout.platformOrder = ['twitch', 'youtube', 'instagram', 'tiktok'];
  layout.platforms.instagram.visible = false;
  layout.platforms.twitch.metrics.avgViewers90d = false;
  layout.platforms.twitch.contentItems['twitch-2'] = false;
  const result = applyLayout(structuredClone(DEFAULT_DATA), layout);
  assert.deepEqual(result.platforms.map(({ id }) => id), ['twitch', 'youtube', 'tiktok']);
  assert.equal(result.platforms[0].visible.metrics.avgViewers90d, false);
  assert.deepEqual(result.platforms[0].content.map(({ id }) => id), ['twitch-1', 'twitch-3']);
});

test('public API returns default data and rejects unknown media kit slugs', async () => {
  const runtime = env();
  const defaultResponse = await worker.fetch(new Request('https://example.com/api/mediakit/default'), runtime);
  assert.equal(defaultResponse.status, 200);
  assert.equal((await defaultResponse.json()).platforms.length, 5);
  const missingResponse = await worker.fetch(new Request('https://example.com/api/mediakit/missing'), runtime);
  assert.equal(missingResponse.status, 404);
});

test('platform stats preserve the requested metrics and visibility through validation', () => {
  const data = structuredClone(DEFAULT_DATA);
  data.platforms[0].views90d = '2.5M';
  data.platforms[0].interactions90d = '180K';
  data.platforms[1].likes90d = '420K';
  data.platforms[2].views90d = '900K';
  data.platforms[3].totalViews90d = '750K';
  data.platforms[3].avgViewers90d = '1.2K';

  const layout = defaultLayout();
  layout.platforms.twitch.metrics.avgViewers90d = false;
  const result = applyLayout(internals.validateData(data), internals.validateLayout(layout, 'default'));

  assert.equal(result.platforms[0].views90d, '2.5M');
  assert.equal(result.platforms[0].interactions90d, '180K');
  assert.equal(result.platforms[1].likes90d, '420K');
  assert.equal(result.platforms[2].views90d, '900K');
  assert.deepEqual(Object.keys(result.platforms[2].visible.metrics), ['followers', 'views90d']);
  assert.equal(result.platforms[3].totalViews90d, '750K');
  assert.equal(result.platforms[3].avgViewers90d, '1.2K');
  assert.equal(result.platforms[3].visible.metrics.avgViewers90d, false);
  assert.equal('engagement' in result.platforms[0], false);
});

test('X / Twitter stats and audience rows can be edited and hidden', () => {
  const data = internals.validateData(structuredClone(DEFAULT_DATA));
  const twitter = data.platforms.find(({ id }) => id === 'twitter');
  assert.equal(twitter.name, 'X / Twitter');
  assert.equal(twitter.followers, '43.5K');
  assert.equal(twitter.impressions90d, '1.2M');
  assert.equal(twitter.engagements90d, '61.2K');
  assert.deepEqual(twitter.genders, [['Women', 58], ['Men', 42]]);
  assert.deepEqual(twitter.locations, [['United States', 47.2], ['United Kingdom', 17], ['Australia', 5.2]]);

  twitter.impressions90d = '1.3M';
  const layout = defaultLayout();
  layout.platforms.twitter.metrics.engagements90d = false;
  layout.platforms.twitter.genderItems[1] = false;
  layout.platforms.twitter.locationItems[2] = false;
  const profile = applyLayout(internals.validateData(data), layout);
  const result = profile.platforms.find(({ id }) => id === 'twitter');
  assert.equal(result.impressions90d, '1.3M');
  assert.equal(result.visible.metrics.engagements90d, false);
  assert.deepEqual(result.genders, [['Women', 58]]);
  assert.deepEqual(result.locations, [['United States', 47.2], ['United Kingdom', 17]]);

  layout.platforms.twitter.visible = false;
  assert.equal(applyLayout(data, layout).platforms.some(({ id }) => id === 'twitter'), false);
});

test('saved stats and layouts load X / Twitter without replacing existing edits', async () => {
  const data = structuredClone(DEFAULT_DATA);
  data.platforms = data.platforms.filter(({ id }) => id !== 'twitter');
  data.platforms[0].followers = '40K';
  data.overview.followers = '300K';
  const layout = defaultLayout('pitch', 'Pitch');
  layout.platformOrder = ['twitch', 'instagram', 'tiktok', 'youtube'];
  delete layout.platforms.twitter;
  const runtime = env({
    'mediakit:data': JSON.stringify(data),
    'mediakit:layout:pitch': JSON.stringify(layout),
  });

  const response = await worker.fetch(new Request('https://example.com/api/mediakit/pitch'), runtime);
  assert.equal(response.status, 200);
  const profile = await response.json();
  assert.deepEqual(profile.platforms.map(({ id }) => id), ['twitch', 'instagram', 'tiktok', 'youtube', 'twitter']);
  assert.equal(profile.platforms[1].followers, '40K');
  assert.equal(profile.overview.followers, '300K');
  assert.equal(profile.platforms[4].impressions90d, '1.2M');
});

test('bios save per media kit with independent visibility and empty defaults', async () => {
  const runtime = env();
  const login = await worker.fetch(new Request('https://example.com/api/admin/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ password: 'test-password' }),
  }), runtime);
  const cookie = login.headers.get('set-cookie').split(';')[0];
  const pitch = defaultLayout('pitch', 'Pitch');
  pitch.bio = 'Gaming creator\nLet’s collaborate <together>.';
  pitch.bioVisible = true;

  for (const visible of [true, false]) {
    pitch.bioVisible = visible;
    const save = await worker.fetch(new Request('https://example.com/api/admin/layout/pitch', {
      method: 'PUT',
      headers: { cookie, 'content-type': 'application/json' },
      body: JSON.stringify(pitch),
    }), runtime);
    assert.equal(save.status, 200);

    const response = await worker.fetch(new Request('https://example.com/api/mediakit/pitch'), runtime);
    assert.deepEqual((await response.json()).bio, { text: pitch.bio, visible });
  }

  const state = await worker.fetch(new Request('https://example.com/api/admin/state', {
    headers: { cookie },
  }), runtime);
  const savedPitch = (await state.json()).layouts.find(({ slug }) => slug === 'pitch');
  assert.equal(savedPitch.bio, pitch.bio);
  assert.equal(savedPitch.bioVisible, false);

  const response = await worker.fetch(new Request('https://example.com/api/mediakit/default'), runtime);
  assert.deepEqual((await response.json()).bio, { text: '', visible: false });
  const existingLayout = defaultLayout();
  delete existingLayout.bio;
  delete existingLayout.bioVisible;
  const profile = applyLayout(DEFAULT_DATA, internals.validateLayout(existingLayout, 'default'));
  assert.deepEqual(profile.bio, { text: '', visible: false });
});

test('password login issues a session that can read and update admin state', async () => {
  const runtime = env();
  const login = await worker.fetch(new Request('https://example.com/api/admin/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: 'https://example.com' },
    body: JSON.stringify({ password: 'test-password' }),
  }), runtime);
  assert.equal(login.status, 200);
  const cookie = login.headers.get('set-cookie').split(';')[0];
  const state = await worker.fetch(new Request('https://example.com/api/admin/state', { headers: { cookie } }), runtime);
  assert.equal(state.status, 200);
  assert.equal((await state.json()).layouts[0].slug, 'default');

  const data = structuredClone(DEFAULT_DATA);
  data.overview.followers = '2M';
  const save = await worker.fetch(new Request('https://example.com/api/admin/data', {
    method: 'PUT',
    headers: { cookie, origin: 'https://example.com', 'content-type': 'application/json' },
    body: JSON.stringify(data),
  }), runtime);
  assert.equal(save.status, 200);
  assert.equal(JSON.parse(runtime.MEDIA_KIT_KV.entries.get('mediakit:data')).overview.followers, '2M');
});

test('admin state always includes the non-deletable default media kit', async () => {
  const runtime = env({
    'mediakit:layout:twitch': JSON.stringify(defaultLayout('twitch', 'Twitch')),
  });
  const login = await worker.fetch(new Request('https://example.com/api/admin/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: 'https://example.com' },
    body: JSON.stringify({ password: 'test-password' }),
  }), runtime);
  const cookie = login.headers.get('set-cookie').split(';')[0];
  const state = await worker.fetch(new Request('https://example.com/api/admin/state', { headers: { cookie } }), runtime);
  assert.deepEqual((await state.json()).layouts.map(({ slug }) => slug), ['default', 'twitch']);
  const deletion = await worker.fetch(new Request('https://example.com/api/admin/layout/default', {
    method: 'DELETE',
    headers: { cookie, origin: 'https://example.com' },
  }), runtime);
  assert.equal(deletion.status, 400);
});

test('malformed cookies are treated as unauthorized instead of server errors', async () => {
  const response = await worker.fetch(new Request('https://example.com/api/admin/state', {
    headers: { cookie: 'broken=%E0%A4%A' },
  }), env());
  assert.equal(response.status, 401);
});

test('validation normalises duplicated order and rejects unsafe image values', () => {
  const layout = internals.validateLayout({ ...defaultLayout(), platformOrder: ['twitch', 'twitch'] }, 'pitch');
  assert.deepEqual(layout.platformOrder, ['twitch', 'instagram', 'tiktok', 'youtube', 'twitter']);
  const data = structuredClone(DEFAULT_DATA);
  data.platforms[0].content[0].image = 'javascript:alert(1)';
  assert.throws(() => internals.validateData(data), /Image must be/);
  data.platforms[0].content[0].image = 'https://example.com/unavailable.jpg';
  assert.throws(() => internals.validateData(data), /available media-kit images/);
});

test('dashboard is served only from /admindashboard with image dropdowns', async () => {
  const runtime = env();
  runtime.ASSETS.fetch = () => new Response('not found', { status: 404 });
  const dashboard = await worker.fetch(new Request('https://example.com/admindashboard'), runtime);
  assert.equal(dashboard.status, 200);
  const html = await dashboard.text();
  assert.match(html, /<select aria-label="Image"/);
  assert.match(html, /Close portrait/);
  const oldRoute = await worker.fetch(new Request('https://example.com/admin'), runtime);
  assert.equal(oldRoute.status, 404);
});

test('default and saved media-kit routes serve the app entry point', async () => {
  const runtime = env();
  runtime.ASSETS.fetch = (request) => {
    assert.equal(new URL(request.url).pathname, '/mediakit/');
    return new Response(request.method === 'HEAD' ? null : '<main>media kit</main>', {
      headers: { 'content-type': 'text/html' },
    });
  };

  for (const path of ['/mediakit/default', '/mediakit/default/', '/mediakit/twitch', '/mediakit/twitch/']) {
    for (const method of ['GET', 'HEAD']) {
      const response = await worker.fetch(new Request(`https://example.com${path}`, { method }), runtime);
      assert.equal(response.status, 200);
      assert.equal(response.headers.get('location'), null);
      assert.equal(await response.text(), method === 'HEAD' ? '' : '<main>media kit</main>');
    }
  }
});

test('media-kit URLs require an explicit media kit slug', async () => {
  const runtime = env();
  runtime.ASSETS.fetch = () => {
    assert.fail('Slugless URLs must not serve the app entry point');
  };

  for (const path of ['/', '/index.html', '/mediakit', '/mediakit/', '/mediakit/index.html']) {
    for (const method of ['GET', 'HEAD']) {
      const response = await worker.fetch(new Request(`https://example.com${path}`, { method }), runtime);
      assert.equal(response.status, 404);
      assert.equal(response.headers.get('location'), null);
    }
  }
});

test('indexing is disabled for pages, APIs, assets and error responses', async () => {
  const runtime = env();
  runtime.ASSETS.fetch = () => Response.json({ asset: true }, {
    headers: { 'cache-control': 'public, max-age=3600' },
  });

  const paths = [
    '/mediakit/default',
    '/admindashboard',
    '/api/mediakit/default',
    '/api/mediakit/missing',
    '/api/admin/state',
    '/mediakit/images/bekyamon-close.jpg',
    '/',
  ];

  for (const path of paths) {
    for (const method of ['GET', 'HEAD']) {
      const response = await worker.fetch(new Request(`https://example.com${path}`, { method }), runtime);
      assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow, noarchive, noimageindex', `${method} ${path}`);
    }
  }

  const asset = await worker.fetch(new Request('https://example.com/mediakit/images/bekyamon-close.jpg'), runtime);
  assert.equal(asset.headers.get('cache-control'), 'public, max-age=3600');
  assert.deepEqual(await asset.json(), { asset: true });
});
