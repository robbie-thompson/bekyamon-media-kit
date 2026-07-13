export function adminPage() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <title>Bekyamon media kit · Admin</title>
  <style>
    :root{color-scheme:light;--ink:#20211f;--paper:#e8e8e3;--card:#f4f4f0;--line:#cdcec8;--muted:#6d706b;--accent:#20211f;font:14px/1.45 system-ui,-apple-system,sans-serif;color:var(--ink);background:var(--paper)}
    *{box-sizing:border-box}body{margin:0}button,input{font:inherit}button{cursor:pointer}.hidden{display:none!important}.shell{min-height:100vh}.topbar{height:68px;padding:0 28px;border-bottom:1px solid var(--line);display:flex;align-items:center;gap:16px;position:sticky;top:0;background:rgba(232,232,227,.94);backdrop-filter:blur(12px);z-index:10}.brand{font-weight:750;letter-spacing:.08em}.topbar small{color:var(--muted)}.topbar-actions{margin-left:auto;display:flex;gap:8px}.button{border:1px solid var(--ink);background:transparent;border-radius:999px;padding:9px 15px;font-weight:650}.button.primary{background:var(--ink);color:white}.button.danger{border-color:#9b2f2f;color:#8b2222}.button:disabled{opacity:.45;cursor:wait}.login{min-height:100vh;display:grid;place-items:center;padding:24px}.login-card{width:min(420px,100%);background:var(--card);border:1px solid var(--line);padding:36px;border-radius:12px}.login-card h1{font-size:30px;margin:8px 0 10px}.login-card p{color:var(--muted);margin:0 0 24px}.field{display:grid;gap:6px}.field label,.label{font-size:11px;text-transform:uppercase;letter-spacing:.08em;font-weight:700;color:var(--muted)}input[type=text],input[type=password],input[type=number]{width:100%;border:1px solid var(--line);background:white;border-radius:6px;padding:10px 11px;color:var(--ink)}.login-card .button{width:100%;margin-top:12px}.error{color:#982b2b;min-height:20px;margin-top:12px!important}.workspace{display:grid;grid-template-columns:250px minmax(0,1fr)}.sidebar{position:sticky;top:68px;height:calc(100vh - 68px);border-right:1px solid var(--line);padding:24px 18px;overflow:auto}.sidebar-heading{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}.sidebar-heading h2{font-size:13px;text-transform:uppercase;letter-spacing:.08em;margin:0}.icon-button{width:30px;height:30px;border:1px solid var(--line);border-radius:50%;background:transparent}.layout-list{display:grid;gap:6px}.layout-tab{display:block;width:100%;border:0;background:transparent;text-align:left;padding:11px;border-radius:6px}.layout-tab span{display:block;font-weight:700}.layout-tab small{color:var(--muted)}.layout-tab.active{background:var(--ink);color:white}.layout-tab.active small{color:#c8cac5}.main{padding:32px clamp(20px,4vw,56px) 80px;max-width:1200px}.page-heading{display:flex;gap:24px;justify-content:space-between;align-items:start;margin-bottom:30px}.page-heading h1{font-size:34px;line-height:1.05;margin:7px 0}.page-heading p{margin:0;color:var(--muted)}.slug-link{color:inherit}.panel{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:22px;margin-bottom:14px}.panel-title{display:flex;align-items:center;gap:12px;margin-bottom:20px}.panel-title h2{font-size:20px;margin:0}.panel-title .toggle{margin-left:auto}.grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.metric-field{border:1px solid var(--line);border-radius:7px;padding:12px;background:white}.metric-field .check{margin-bottom:10px}.check{display:flex;align-items:center;gap:8px;font-weight:650}.check input{width:17px;height:17px;accent-color:var(--accent)}.platform{background:var(--card);border:1px solid var(--line);border-radius:10px;margin-bottom:14px}.platform-head{display:flex;align-items:center;gap:12px;padding:18px 22px;border-bottom:1px solid var(--line)}.platform-head h2{margin:0;font-size:20px}.platform-head .check{margin-left:auto}.reorder{display:flex;gap:5px}.reorder button{width:31px;height:31px;border:1px solid var(--line);background:transparent;border-radius:5px}.platform-body{padding:22px}.subsection{border-top:1px solid var(--line);padding-top:20px;margin-top:20px}.subsection-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:13px}.subsection-head h3{font-size:14px;margin:0}.rows{display:grid;gap:8px}.data-row{display:grid;grid-template-columns:22px minmax(130px,1.3fr) minmax(90px,.7fr);gap:8px;align-items:center}.content-row{grid-template-columns:22px minmax(160px,1.5fr) minmax(110px,.7fr) minmax(80px,.5fr) minmax(140px,1fr)}.notice{position:fixed;bottom:20px;right:20px;background:var(--ink);color:white;padding:11px 16px;border-radius:7px;box-shadow:0 10px 35px #0003;z-index:20}.empty{color:var(--muted)}
    @media(max-width:760px){.topbar{padding:0 14px}.topbar small{display:none}.workspace{display:block}.sidebar{position:static;height:auto;border-right:0;border-bottom:1px solid var(--line)}.layout-list{display:flex;overflow:auto}.layout-tab{min-width:140px}.main{padding:24px 14px 70px}.page-heading{display:block}.page-heading .button{margin-top:16px}.grid-3{grid-template-columns:1fr}.data-row,.content-row{grid-template-columns:22px 1fr}.data-row input:not(:first-child),.content-row input:not(:first-child){grid-column:2}.platform-head{padding:15px}.platform-body{padding:15px}}
  </style>
</head>
<body>
  <section id="login" class="login">
    <form id="login-form" class="login-card">
      <span class="label">Private dashboard</span><h1>Media kit admin</h1><p>Enter the dashboard password to manage stats and presentation links.</p>
      <div class="field"><label for="password">Password</label><input id="password" type="password" required autocomplete="current-password"></div>
      <button class="button primary" type="submit">Log in</button><p id="login-error" class="error" role="alert"></p>
    </form>
  </section>
  <section id="app" class="shell hidden">
    <header class="topbar"><span class="brand">BEKYAMON</span><small>Media kit admin</small><div class="topbar-actions"><button id="save" class="button primary">Save changes</button><button id="logout" class="button">Log out</button></div></header>
    <div class="workspace"><aside class="sidebar"><div class="sidebar-heading"><h2>Presentation links</h2><button id="add-layout" class="icon-button" title="Create presentation">+</button></div><div id="layout-list" class="layout-list"></div></aside><main id="editor" class="main"></main></div>
  </section>
  <div id="notice" class="notice hidden" role="status"></div>
  <script>
  (() => {
    const $ = (selector, root = document) => root.querySelector(selector);
    const clone = (value) => JSON.parse(JSON.stringify(value));
    let state = null;
    let selectedSlug = null;

    async function api(path, options = {}) {
      const response = await fetch(path, { credentials: 'same-origin', headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options });
      const body = response.status === 204 ? null : await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body?.error || 'Request failed');
      return body;
    }
    function notify(message) { const el = $('#notice'); el.textContent = message; el.classList.remove('hidden'); clearTimeout(notify.timer); notify.timer = setTimeout(() => el.classList.add('hidden'), 2600); }
    function slugify(value) { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48); }
    function field(label, value, path, type = 'text') { return '<div class="field"><label>' + label + '</label><input type="' + type + '" value="' + escapeAttr(value) + '" data-path="' + escapeAttr(path) + '"></div>'; }
    function check(label, checked, path) { return '<label class="check"><input type="checkbox" ' + (checked ? 'checked' : '') + ' data-path="' + escapeAttr(path) + '"><span>' + label + '</span></label>'; }
    function escapeAttr(value) { return String(value ?? '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
    function layout() { return state.layouts.find((item) => item.slug === selectedSlug); }
    function platformSettings(id) { return layout().platforms[id]; }
    function setPath(root, path, value) { const keys = path.split('.'); const last = keys.pop(); const target = keys.reduce((obj, key) => obj[key], root); target[last] = value; }

    async function load() {
      try {
        state = await api('/api/admin/state');
        selectedSlug = state.layouts[0]?.slug || null;
        $('#login').classList.add('hidden'); $('#app').classList.remove('hidden'); render();
      } catch (error) {
        if (error.message !== 'Unauthorized') $('#login-error').textContent = error.message;
      }
    }
    function render() {
      $('#layout-list').innerHTML = state.layouts.map((item) => '<button class="layout-tab ' + (item.slug === selectedSlug ? 'active' : '') + '" data-slug="' + escapeAttr(item.slug) + '"><span>' + escapeAttr(item.name) + '</span><small>/mediakit/' + escapeAttr(item.slug) + '</small></button>').join('');
      const current = layout();
      if (!current) { $('#editor').innerHTML = '<p class="empty">Create a presentation link to begin.</p>'; return; }
      const byId = Object.fromEntries(state.data.platforms.map((item) => [item.id, item]));
      $('#editor').innerHTML = '<div class="page-heading"><div><span class="label">Presentation</span><h1>' + escapeAttr(current.name) + '</h1><p><a class="slug-link" href="/mediakit/' + escapeAttr(current.slug) + '" target="_blank" rel="noopener">/mediakit/' + escapeAttr(current.slug) + ' ↗</a></p></div>' + (current.slug === 'default' ? '' : '<button class="button danger" id="delete-layout">Delete presentation</button>') + '</div>' +
        '<section class="panel"><div class="panel-title"><h2>Combined overview</h2><div class="toggle">' + check('Show section', current.overviewVisible, 'layout.overviewVisible') + '</div></div><div class="grid-3">' + metric('Total followers', 'followers') + metric('Average views', 'avgViews') + metric('Average engagement', 'engagement') + '</div></section>' +
        current.platformOrder.map((id, index) => platformEditor(byId[id], current, index)).join('');
    }
    function metric(label, key) { return '<div class="metric-field">' + check('Show ' + label.toLowerCase(), layout().overviewMetrics[key], 'layout.overviewMetrics.' + key) + field(label, state.data.overview[key], 'data.overview.' + key) + '</div>'; }
    function platformEditor(platform, current, index) {
      const settings = platformSettings(platform.id); const base = 'data.platforms.' + state.data.platforms.findIndex((item) => item.id === platform.id); const view = 'layout.platforms.' + platform.id;
      return '<section class="platform" data-platform="' + platform.id + '"><div class="platform-head"><div class="reorder"><button data-move="up" ' + (index === 0 ? 'disabled' : '') + ' title="Move up">↑</button><button data-move="down" ' + (index === current.platformOrder.length - 1 ? 'disabled' : '') + ' title="Move down">↓</button></div><h2>' + escapeAttr(platform.name) + '</h2>' + check('Show platform', settings.visible, view + '.visible') + '</div><div class="platform-body">' +
        '<div class="metric-field" style="margin-bottom:12px">' + check('Show handle', settings.handle, view + '.handle') + field('Handle', platform.handle, base + '.handle') + '</div>' +
        '<div class="grid-3">' + metricInput('Followers', 'followers', platform, settings, base, view) + metricInput('Average views', 'avgViews', platform, settings, base, view) + metricInput('Engagement', 'engagement', platform, settings, base, view) + '</div>' +
        '<div class="subsection"><div class="subsection-head"><h3>Top locations</h3>' + check('Show', settings.locations, view + '.locations') + '</div><div class="rows">' + platform.locations.map((item, i) => '<div class="data-row">' + check('', settings.locationItems[i] !== false, view + '.locationItems.' + i) + '<input type="text" aria-label="Location" value="' + escapeAttr(item[0]) + '" data-path="' + base + '.locations.' + i + '.0"><input type="number" min="0" max="100" aria-label="Percentage" value="' + escapeAttr(item[1]) + '" data-path="' + base + '.locations.' + i + '.1"></div>').join('') + '</div></div>' +
        '<div class="subsection"><div class="subsection-head"><h3>Gender split</h3>' + check('Show', settings.genders, view + '.genders') + '</div><div class="rows">' + platform.genders.map((item, i) => '<div class="data-row">' + check('', settings.genderItems[i] !== false, view + '.genderItems.' + i) + '<input type="text" aria-label="Audience" value="' + escapeAttr(item[0]) + '" data-path="' + base + '.genders.' + i + '.0"><input type="number" min="0" max="100" aria-label="Percentage" value="' + escapeAttr(item[1]) + '" data-path="' + base + '.genders.' + i + '.1"></div>').join('') + '</div></div>' +
        '<div class="subsection"><div class="subsection-head"><h3>Content performance</h3>' + check('Show section', settings.content, view + '.content') + '</div><div class="rows">' + platform.content.map((item, i) => '<div class="data-row content-row">' + check('', settings.contentItems[item.id] !== false, view + '.contentItems.' + item.id) + '<input type="text" aria-label="Title" value="' + escapeAttr(item.title) + '" data-path="' + base + '.content.' + i + '.title"><input type="text" aria-label="Format" value="' + escapeAttr(item.format) + '" data-path="' + base + '.content.' + i + '.format"><input type="text" aria-label="Views" value="' + escapeAttr(item.views) + '" data-path="' + base + '.content.' + i + '.views"><input type="text" aria-label="Image filename or URL" value="' + escapeAttr(item.image) + '" data-path="' + base + '.content.' + i + '.image"></div>').join('') + '</div></div></div></section>';
    }
    function metricInput(label, key, platform, settings, base, view) { return '<div class="metric-field">' + check('Show ' + label.toLowerCase(), settings.metrics[key], view + '.metrics.' + key) + field(label, platform[key], base + '.' + key) + '</div>'; }

    document.addEventListener('input', (event) => {
      const path = event.target.dataset.path; if (!path || !state) return;
      const root = path.startsWith('data.') ? state : { layout: layout() };
      let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      if (event.target.type === 'number') value = Number(value);
      setPath(root, path, value);
    });
    $('#login-form').addEventListener('submit', async (event) => { event.preventDefault(); $('#login-error').textContent = ''; try { await api('/api/admin/login', { method:'POST', body:JSON.stringify({ password:$('#password').value }) }); $('#password').value=''; await load(); } catch(error) { $('#login-error').textContent = error.message; } });
    $('#logout').addEventListener('click', async () => { await api('/api/admin/logout', { method:'POST' }); location.reload(); });
    $('#layout-list').addEventListener('click', (event) => { const tab = event.target.closest('[data-slug]'); if (!tab) return; selectedSlug = tab.dataset.slug; render(); });
    $('#add-layout').addEventListener('click', () => { const name = prompt('Name this presentation (for example, Twitch pitch)'); if (!name) return; const slug = slugify(prompt('Choose its URL slug', name) || ''); if (!slug) return notify('Please use a valid slug'); if (state.layouts.some((item) => item.slug === slug)) return notify('That slug already exists'); const template = clone(layout() || state.defaultLayout); template.slug = slug; template.name = name.trim().slice(0,80); state.layouts.push(template); selectedSlug = slug; render(); notify('Presentation created — save to publish it'); });
    $('#editor').addEventListener('click', (event) => { const move = event.target.closest('[data-move]'); if (move) { const id = move.closest('[data-platform]').dataset.platform; const order = layout().platformOrder; const from = order.indexOf(id); const to = move.dataset.move === 'up' ? from - 1 : from + 1; if (to >= 0 && to < order.length) { [order[from],order[to]]=[order[to],order[from]]; render(); } return; } if (event.target.id === 'delete-layout') { if (!confirm('Delete this presentation link?')) return; const removed = selectedSlug; state.layouts = state.layouts.filter((item) => item.slug !== removed); selectedSlug = state.layouts[0]?.slug || null; api('/api/admin/layout/' + encodeURIComponent(removed), {method:'DELETE'}).then(() => { render(); notify('Presentation deleted'); }).catch((error) => notify(error.message)); } });
    $('#save').addEventListener('click', async () => { const button=$('#save'); button.disabled=true; try { await api('/api/admin/data',{method:'PUT',body:JSON.stringify(state.data)}); await Promise.all(state.layouts.map((item)=>api('/api/admin/layout/'+encodeURIComponent(item.slug),{method:'PUT',body:JSON.stringify(item)}))); state.data.updatedLabel = new Date().toLocaleDateString('en-GB',{month:'long',year:'numeric'}); notify('Changes published'); } catch(error) { notify(error.message); } finally { button.disabled=false; } });
    load();
  })();
  </script>
</body></html>`;
}
