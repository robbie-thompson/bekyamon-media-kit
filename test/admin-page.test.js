import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import { adminPage } from '../worker/admin-page.js';
import { DEFAULT_DATA, defaultLayout } from '../worker/default-data.js';

/**
 * Run the dashboard script with browser and network boundaries supplied locally.
 */
async function dashboard(layouts, answers) {
  const elements = new Map();
  const requests = [];
  const state = { data: structuredClone(DEFAULT_DATA), layouts, defaultLayout: defaultLayout() };

  const document = {
    querySelector(selector) {
      if (!elements.has(selector)) {
        elements.set(selector, {
          innerHTML: '',
          classList: { add() {}, remove() {} },
          addEventListener(type, listener) { this[type] = listener; },
        });
      }

      return elements.get(selector);
    },
    addEventListener(type, listener) { this[type] = listener; },
  };

  const context = vm.createContext({
    document,
    prompt: () => answers.shift(),
    setTimeout: () => 1,
    clearTimeout() {},
    fetch: async (path, options) => {
      requests.push({ path, ...options });
      return { ok: true, status: 200, json: async () => structuredClone(state) };
    },
  });

  vm.runInContext(adminPage().match(/<script>([\s\S]*?)<\/script>/)[1], context);
  await new Promise((resolve) => setImmediate(resolve));

  return { document, elements, requests };
}

test('duplicate copies the clicked kit independently and writes only on Save changes', async () => {
  const source = defaultLayout('pitch', 'Pitch');
  source.bio = 'Custom biography';
  source.bioVisible = true;
  source.platformOrder.reverse();
  source.platforms.instagram.visible = false;
  const { document, elements, requests } = await dashboard(
    [defaultLayout(), source],
    ['Pitch copy', 'pitch-copy'],
  );
  const list = elements.get('#layout-list');
  assert.match(list.innerHTML, /data-duplicate="pitch"/);

  // Duplicate an unselected kit and edit the copy's nested settings.
  list.click({ target: { closest: () => ({ dataset: { duplicate: 'pitch' } }) } });
  assert.match(elements.get('#editor').innerHTML, /<h1>Pitch copy<\/h1>/);
  assert.match(elements.get('#editor').innerHTML, /value="Custom biography"/);
  assert.deepEqual(requests.map(({ path }) => path), ['/api/admin/state']);

  document.input({ target: { dataset: { path: 'layout.bio' }, type: 'text', value: 'Copy biography' } });
  document.input({ target: { dataset: { path: 'layout.platforms.instagram.visible' }, type: 'checkbox', checked: true } });
  await elements.get('#save').click();

  const saved = requests
    .filter(({ path }) => path.startsWith('/api/admin/layout/'))
    .map(({ body }) => JSON.parse(body));
  assert.deepEqual(saved.find(({ slug }) => slug === 'pitch'), source);
  const expectedCopy = structuredClone(source);
  expectedCopy.slug = 'pitch-copy';
  expectedCopy.name = 'Pitch copy';
  expectedCopy.bio = 'Copy biography';
  expectedCopy.platforms.instagram.visible = true;
  assert.deepEqual(saved.find(({ slug }) => slug === 'pitch-copy'), expectedCopy);
});

test('cancelled or conflicting duplicates do not create a kit or write requests', async () => {
  for (const answers of [[null], ['Copy', null], ['Copy', 'default']]) {
    const { elements, requests } = await dashboard([defaultLayout()], answers);
    const list = elements.get('#layout-list');
    const original = list.innerHTML;
    list.click({ target: { closest: () => ({ dataset: { duplicate: 'default' } }) } });
    assert.equal(list.innerHTML, original);
    assert.deepEqual(requests.map(({ path }) => path), ['/api/admin/state']);
  }
});
