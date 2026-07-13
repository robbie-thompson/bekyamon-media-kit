import { adminPage } from './admin-page.js';
import { CONTENT_IMAGES, DEFAULT_DATA, PLATFORM_IDS, defaultLayout } from './default-data.js';

const DATA_KEY = 'mediakit:data';
const LAYOUT_PREFIX = 'mediakit:layout:';
const SESSION_COOKIE = 'bekyamon_admin';
const MAX_BODY_BYTES = 100_000;

const jsonHeaders = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
  'x-content-type-options': 'nosniff',
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    try {
      if (url.pathname.startsWith('/api/')) return await apiRouter(request, env, url);
      if (url.pathname === '/admindashboard' || url.pathname === '/admindashboard/') {
        return new Response(adminPage(), { headers: securityHeaders('text/html; charset=utf-8') });
      }
      if (url.pathname === '/') return env.ASSETS.fetch(request);
      if (url.pathname === '/mediakit') return Response.redirect(`${url.origin}/mediakit/`, 302);
      if ((request.method === 'GET' || request.method === 'HEAD') && /^\/mediakit\/[a-z0-9-]+\/?$/.test(url.pathname)) {
        const indexUrl = new URL('/mediakit/', url);
        return env.ASSETS.fetch(new Request(indexUrl, request));
      }
      if ((request.method === 'GET' || request.method === 'HEAD') && url.pathname.startsWith('/mediakit/')) {
        const asset = await env.ASSETS.fetch(request);
        if (asset.status !== 404) return asset;
        const indexUrl = new URL('/mediakit/', url);
        return env.ASSETS.fetch(new Request(indexUrl, request));
      }
      return env.ASSETS.fetch(request);
    } catch (error) {
      if (!error.status) console.error(error);
      return json({ error: error.status ? error.message : 'Internal server error' }, error.status || 500);
    }
  },
};

async function apiRouter(request, env, url) {
  if (!env.MEDIA_KIT_KV) return json({ error: 'MEDIA_KIT_KV binding is not configured' }, 503);
  const method = request.method.toUpperCase();

  if (method === 'GET' && url.pathname.startsWith('/api/mediakit/')) {
    const slug = normaliseSlug(url.pathname.slice('/api/mediakit/'.length));
    if (!slug) return json({ error: 'Invalid presentation slug' }, 400);
    return publicMediaKit(env, slug);
  }

  if (url.pathname === '/api/admin/login' && method === 'POST') {
    assertSameOrigin(request, url);
    if (!env.DASHBOARD_PASSWORD) return json({ error: 'DASHBOARD_PASSWORD is not configured' }, 503);
    const body = await readJson(request);
    if (!await secureEqual(body.password || '', env.DASHBOARD_PASSWORD)) return json({ error: 'Incorrect password' }, 401);
    const token = await createSession(env.DASHBOARD_PASSWORD);
    const secure = url.protocol === 'https:' ? '; Secure' : '';
    return json({ ok: true }, 200, { 'set-cookie': `${SESSION_COOKIE}=${token}; HttpOnly${secure}; SameSite=Strict; Path=/; Max-Age=28800` });
  }

  if (url.pathname === '/api/admin/logout' && method === 'POST') {
    assertSameOrigin(request, url);
    return json({ ok: true }, 200, { 'set-cookie': `${SESSION_COOKIE}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0` });
  }

  if (!env.DASHBOARD_PASSWORD || !await isAuthenticated(request, env.DASHBOARD_PASSWORD)) return json({ error: 'Unauthorized' }, 401);
  if (method !== 'GET') assertSameOrigin(request, url);

  if (url.pathname === '/api/admin/state' && method === 'GET') {
    const [storedData, layouts] = await Promise.all([readData(env), readLayouts(env)]);
    const availableLayouts = layouts.some(({ slug }) => slug === 'default') ? layouts : [defaultLayout(), ...layouts];
    return json({ data: storedData, layouts: availableLayouts, defaultLayout: defaultLayout() });
  }
  if (url.pathname === '/api/admin/data' && method === 'PUT') {
    const data = validateData(await readJson(request));
    data.updatedLabel = new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'Europe/London' });
    await env.MEDIA_KIT_KV.put(DATA_KEY, JSON.stringify(data));
    return json({ ok: true, data });
  }

  const layoutMatch = url.pathname.match(/^\/api\/admin\/layout\/([^/]+)$/);
  if (layoutMatch) {
    const slug = normaliseSlug(layoutMatch[1]);
    if (!slug) return json({ error: 'Invalid presentation slug' }, 400);
    if (method === 'PUT') {
      const layout = validateLayout(await readJson(request), slug);
      await env.MEDIA_KIT_KV.put(`${LAYOUT_PREFIX}${slug}`, JSON.stringify(layout));
      return json({ ok: true, layout });
    }
    if (method === 'DELETE') {
      if (slug === 'default') return json({ error: 'The default presentation cannot be deleted' }, 400);
      await env.MEDIA_KIT_KV.delete(`${LAYOUT_PREFIX}${slug}`);
      return new Response(null, { status: 204, headers: jsonHeaders });
    }
  }
  return json({ error: 'Not found' }, 404);
}

async function publicMediaKit(env, slug) {
  const [data, storedLayout] = await Promise.all([
    readData(env),
    env.MEDIA_KIT_KV.get(`${LAYOUT_PREFIX}${slug}`, 'json'),
  ]);
  const layout = storedLayout || (slug === 'default' ? defaultLayout() : null);
  if (!layout) return json({ error: 'Presentation not found' }, 404);
  const profile = applyLayout(data, validateLayout(layout, slug));
  return json(profile, 200, { 'cache-control': 'public, max-age=30, stale-while-revalidate=120' });
}

export function applyLayout(data, layout) {
  const byId = Object.fromEntries(data.platforms.map((platform) => [platform.id, platform]));
  const platforms = layout.platformOrder.filter((id) => layout.platforms[id]?.visible && byId[id]).map((id) => {
    const platform = structuredClone(byId[id]);
    const visibility = layout.platforms[id];
    platform.visible = {
      handle: visibility.handle,
      metrics: visibility.metrics,
      locations: visibility.locations,
      genders: visibility.genders,
      content: visibility.content,
    };
    platform.locations = platform.locations.filter((_, index) => visibility.locationItems[index] !== false);
    platform.genders = platform.genders.filter((_, index) => visibility.genderItems[index] !== false);
    platform.content = platform.content.filter((item) => visibility.contentItems[item.id] !== false);
    return platform;
  });
  return {
    slug: layout.slug,
    name: layout.name,
    updatedLabel: data.updatedLabel,
    overview: { ...data.overview, visible: layout.overviewVisible, metrics: layout.overviewMetrics },
    platforms,
  };
}

async function readData(env) {
  const stored = await env.MEDIA_KIT_KV.get(DATA_KEY, 'json');
  return stored ? validateData(stored) : structuredClone(DEFAULT_DATA);
}

async function readLayouts(env) {
  const result = await env.MEDIA_KIT_KV.list({ prefix: LAYOUT_PREFIX });
  const layouts = await Promise.all(result.keys.map((key) => env.MEDIA_KIT_KV.get(key.name, 'json')));
  return layouts.filter(Boolean).map((layout) => validateLayout(layout, layout.slug)).sort((a, b) => a.name.localeCompare(b.name));
}

function validateData(input) {
  if (!input || typeof input !== 'object' || !input.overview || !Array.isArray(input.platforms)) throw httpError('Invalid stats data', 400);
  const platforms = PLATFORM_IDS.map((id) => input.platforms.find((item) => item?.id === id)).filter(Boolean).map((platform) => ({
    id: platform.id,
    name: cleanText(platform.name, 40),
    handle: cleanText(platform.handle, 80),
    icon: DEFAULT_DATA.platforms.find((item) => item.id === platform.id).icon,
    followers: cleanText(platform.followers, 30),
    avgViews: cleanText(platform.avgViews, 30),
    engagement: cleanText(platform.engagement, 30),
    locations: validateBreakdown(platform.locations),
    genders: validateBreakdown(platform.genders),
    content: Array.isArray(platform.content) ? platform.content.slice(0, 12).map((item, index) => ({
      id: cleanIdentifier(item.id, `${platform.id}-${index + 1}`),
      title: cleanText(item.title, 160),
      format: cleanText(item.format, 80),
      views: cleanText(item.views, 30),
      image: cleanImage(item.image),
    })) : [],
  }));
  if (platforms.length !== PLATFORM_IDS.length) throw httpError('All platforms are required', 400);
  return {
    updatedLabel: cleanText(input.updatedLabel || '', 40),
    overview: {
      followers: cleanText(input.overview.followers, 30),
      avgViews: cleanText(input.overview.avgViews, 30),
      engagement: cleanText(input.overview.engagement, 30),
    },
    platforms,
  };
}

function validateLayout(input, slug) {
  if (!input || typeof input !== 'object') throw httpError('Invalid layout', 400);
  const fallback = defaultLayout(slug);
  const requestedOrder = Array.isArray(input.platformOrder) ? input.platformOrder.filter((id) => PLATFORM_IDS.includes(id)) : [];
  const platformOrder = [...new Set([...requestedOrder, ...PLATFORM_IDS])];
  const platforms = Object.fromEntries(PLATFORM_IDS.map((id) => {
    const value = input.platforms?.[id] || fallback.platforms[id];
    return [id, {
      visible: value.visible !== false,
      handle: value.handle !== false,
      metrics: {
        followers: value.metrics?.followers !== false,
        avgViews: value.metrics?.avgViews !== false,
        engagement: value.metrics?.engagement !== false,
      },
      locations: value.locations !== false,
      locationItems: validateItemVisibility(value.locationItems),
      genders: value.genders !== false,
      genderItems: validateItemVisibility(value.genderItems),
      content: value.content !== false,
      contentItems: Object.fromEntries(Object.entries(value.contentItems || {}).slice(0, 100).map(([key, shown]) => [cleanText(key, 80), shown !== false])),
    }];
  }));
  return {
    slug,
    name: cleanText(input.name || slug, 80),
    overviewVisible: input.overviewVisible !== false,
    overviewMetrics: {
      followers: input.overviewMetrics?.followers !== false,
      avgViews: input.overviewMetrics?.avgViews !== false,
      engagement: input.overviewMetrics?.engagement !== false,
    },
    platformOrder,
    platforms,
  };
}

function validateItemVisibility(input) {
  return Object.fromEntries(Object.entries(input || {}).slice(0, 100).filter(([key]) => /^\d+$/.test(key)).map(([key, shown]) => [key, shown !== false]));
}

function validateBreakdown(items) {
  if (!Array.isArray(items)) return [];
  return items.slice(0, 10).map((item) => [cleanText(item?.[0], 80), Math.min(100, Math.max(0, Number(item?.[1]) || 0))]);
}

function cleanText(value, maxLength) { return String(value ?? '').trim().slice(0, maxLength); }
function cleanIdentifier(value, fallback) {
  const identifier = cleanText(value, 80);
  return /^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(identifier) ? identifier : fallback;
}
function cleanImage(value) {
  const image = cleanText(value, 500);
  if (CONTENT_IMAGES.some(({ value: availableImage }) => availableImage === image)) return image;
  throw httpError('Image must be selected from the available media-kit images', 400);
}
function normaliseSlug(value) {
  const slug = String(value || '').toLowerCase().trim();
  return /^[a-z0-9](?:[a-z0-9-]{0,46}[a-z0-9])?$/.test(slug) ? slug : null;
}

async function readJson(request) {
  const length = Number(request.headers.get('content-length') || 0);
  if (length > MAX_BODY_BYTES) throw httpError('Request body is too large', 413);
  let text;
  try { text = await request.text(); } catch { throw httpError('Unable to read request body', 400); }
  if (text.length > MAX_BODY_BYTES) throw httpError('Request body is too large', 413);
  try { return JSON.parse(text); } catch { throw httpError('Invalid JSON', 400); }
}

function assertSameOrigin(request, url) {
  const origin = request.headers.get('origin');
  if (origin && origin !== url.origin) throw httpError('Cross-origin request rejected', 403);
}

async function createSession(secret) {
  const payload = `${Date.now() + 8 * 60 * 60 * 1000}`;
  return `${payload}.${await hmac(payload, secret)}`;
}
async function isAuthenticated(request, secret) {
  const cookies = parseCookies(request.headers.get('cookie') || '');
  const token = cookies[SESSION_COOKIE];
  if (!token) return false;
  const [expires, signature] = token.split('.');
  if (!expires || !signature || Number(expires) < Date.now()) return false;
  return secureEqual(signature, await hmac(expires, secret));
}
function parseCookies(header) {
  const cookies = {};
  for (const part of header.split(';')) {
    const separator = part.indexOf('=');
    if (separator < 1) continue;
    try {
      const key = decodeURIComponent(part.slice(0, separator).trim());
      cookies[key] = decodeURIComponent(part.slice(separator + 1).trim());
    } catch {
      // Ignore malformed cookies and treat the request as unauthenticated.
    }
  }
  return cookies;
}
async function hmac(value, secret) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const bytes = new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(value)));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}
async function secureEqual(left, right) {
  const encoder = new TextEncoder();
  const [a, b] = await Promise.all([crypto.subtle.digest('SHA-256', encoder.encode(String(left))), crypto.subtle.digest('SHA-256', encoder.encode(String(right)))]);
  const aa = new Uint8Array(a); const bb = new Uint8Array(b); let difference = 0;
  for (let index = 0; index < aa.length; index++) difference |= aa[index] ^ bb[index];
  return difference === 0;
}

function securityHeaders(contentType) {
  return {
    'content-type': contentType,
    'cache-control': 'no-store',
    'content-security-policy': "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'self'; img-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'",
    'referrer-policy': 'no-referrer',
    'x-content-type-options': 'nosniff',
    'x-frame-options': 'DENY',
  };
}
function json(body, status = 200, extraHeaders = {}) { return new Response(JSON.stringify(body), { status, headers: { ...jsonHeaders, ...extraHeaders } }); }
function httpError(message, status) { const error = new Error(message); error.status = status; return error; }

export const internals = { validateData, validateLayout, normaliseSlug };
