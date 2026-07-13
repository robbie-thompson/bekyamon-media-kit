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
  layout.platforms.twitch.metrics.engagement = false;
  layout.platforms.twitch.contentItems['twitch-2'] = false;
  const result = applyLayout(structuredClone(DEFAULT_DATA), layout);
  assert.deepEqual(result.platforms.map(({ id }) => id), ['twitch', 'youtube', 'tiktok']);
  assert.equal(result.platforms[0].visible.metrics.engagement, false);
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
});

test('nested media-kit routes fall back to the built SPA entry point', async () => {
  const runtime = env();
  runtime.ASSETS.fetch = (request) => new URL(request.url).pathname === '/mediakit/'
    ? new Response('<main>media kit</main>', { headers: { 'content-type': 'text/html' } })
    : new Response('missing', { status: 404 });
  const response = await worker.fetch(new Request('https://example.com/mediakit/twitch'), runtime);
  assert.equal(response.status, 200);
  assert.match(await response.text(), /media kit/);
});

test('the domain root remains unclaimed and returns the static 404', async () => {
  const runtime = env();
  runtime.ASSETS.fetch = () => new Response('not found', { status: 404 });
  const response = await worker.fetch(new Request('https://example.com/'), runtime);
  assert.equal(response.status, 404);
  assert.equal(await response.text(), 'not found');
});
