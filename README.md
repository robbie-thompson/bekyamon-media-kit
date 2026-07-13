# Bekyamon Media Kit

A responsive creator media kit with a Cloudflare Worker, KV-backed live stats, and a password-protected presentation editor.

## What is configurable

The Worker keeps shared stats/content separate from presentation layouts:

- Shared data: combined metrics, platform metrics, audience breakdowns, handles, and content performance.
- Per-link layout: platform order, visible platforms, visible metrics, audience rows, and visible content items.

For example, an admin can create `twitch`, move Twitch to the top, hide Instagram, and publish the result at `/mediakit/twitch`. Updating Twitch followers later updates every presentation without changing their layouts.

The biography, contact details, creator imagery, and collaboration strip remain static in the frontend.

## Local frontend development

```bash
npm install
npm run dev
```

Vite runs the static frontend and uses bundled starter stats when the Worker API is unavailable.

## Cloudflare setup

This project deploys as a Worker with static assets, rather than as a standalone Pages project. The Worker serves:

- `/mediakit/` — the default media kit
- `/mediakit/:slug` — a saved presentation
- `/api/mediakit/:slug` — its public JSON data
- `/admindashboard` — the private editor

The domain root is intentionally not used and returns a 404.

Create and deploy through the Cloudflare dashboard:

1. Open **Workers & Pages → KV → Create instance** and create a namespace named `bekyamon-media-kit-production`.
2. Copy its namespace ID into `wrangler.jsonc`, replacing the all-zero placeholder, then commit and push that change.
3. Open **Workers & Pages → Create application → Import a repository** and select this repository.
4. Use `npm run check` as the build command and `npx wrangler deploy` as the deploy command.
5. In the deployed Worker, confirm that the `MEDIA_KIT_KV` binding points to the namespace created above.
6. Under **Settings → Variables and Secrets**, add `DASHBOARD_PASSWORD` as an encrypted runtime secret and deploy that setting.
7. Test the `workers.dev` URL before adding the production domain.
8. Under **Domains** (or **Settings → Domains & Routes**), add `bekyamon.live` as a Custom Domain.

The existing MX and TXT records for `bekyamon.live` must remain unchanged. The Worker Custom Domain adds HTTP/HTTPS handling without replacing those mail records. The existing Pages project has no production-domain mapping to remove; it may be retained temporarily at its `pages.dev` address or deleted after the Worker is verified.

After deployment, visit `/admindashboard`, log in, review the starter values, and click **Save changes**. The first save writes the starter data and default layout to KV. The public API can use the bundled starter data before this initial save, so the default media kit remains available during setup.

## Local Worker and admin development

Copy the example secret file and choose a local password:

```bash
cp .dev.vars.example .dev.vars
npm run dev:worker
```

Wrangler provides a local KV store. Open the URL printed by Wrangler, then visit `/admindashboard`.

## Data and security notes

- Public API responses are cached for 30 seconds, with stale responses allowed while Cloudflare refreshes them.
- Admin sessions are signed, HTTP-only, same-site cookies valid for eight hours.
- Admin writes are same-origin checked and all submitted KV data is length/type validated.
- `DASHBOARD_PASSWORD` must be stored as an encrypted runtime secret under the Worker's **Variables and Secrets** settings; do not add it to `wrangler.jsonc` or commit `.dev.vars`.
- Content images are selected from the bundled media-kit images in the dashboard.

## Verification

```bash
npm run check
```

This runs the Worker/API tests and the production frontend build.
