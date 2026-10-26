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

test('public API returns default data and rejects unknown presentation slugs', async () => {
  const runtime = env();
  const defaultResponse = await worker.fetch(new Request('https://example.com/api/mediakit/default'), runtime);
  assert.equal(defaultResponse.status, 200);
  assert.equal((await defaultResponse.json()).platforms.length, 4);
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

test('admin state always includes the non-deletable default presentation', async () => {
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
  assert.deepEqual(layout.platformOrder, ['twitch', 'instagram', 'tiktok', 'youtube']);
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

test('media-kit URLs require an explicit presentation slug', async () => {
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
