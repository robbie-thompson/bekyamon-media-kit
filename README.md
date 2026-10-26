# Bekyamon Media Kit

A responsive creator media kit with a Cloudflare Worker, KV-backed live stats, and a password-protected media kit editor.

## What is configurable

The Worker keeps shared stats/content separate from media kit layouts:

- Shared data: combined metrics, platform metrics, audience breakdowns, handles, and content performance.
- Per-link layout: biography text and visibility, platform order, visible platforms, visible metrics, audience rows, and visible content items. The biography is empty and hidden by default.

For example, an admin can create `twitch`, move Twitch to the top, hide Instagram, and publish the result at `/mediakit/twitch`. Updating Twitch followers later updates every media kit without changing their layouts.

The contact details, creator imagery, and collaboration strip remain static in the frontend.

## Local development

```bash
npm install
npm run dev
```

This starts Vite with the Cloudflare Workers runtime. The frontend, API, and admin dashboard share one server:

- `http://localhost:8787/mediakit/default` — media kit
- `http://localhost:8787/mediakit/default#platforms` — platform sections
- `http://localhost:8787/admindashboard` — admin dashboard

Run only `npm run dev`. `npm run dev:worker` is an alias for the same command, so do not run both at once. Port 8787 must be free. Frontend edits update automatically, and Worker edits reload the local runtime. Development serves source files directly, so `npm run build` does not interrupt the running site.

## Cloudflare setup

This project deploys as a Worker with static assets, rather than as a standalone Pages project. The Worker serves:

- `/mediakit/default` — the default media kit
- `/mediakit/:slug` — a saved media kit
- `/api/mediakit/:slug` — its public JSON data
- `/admindashboard` — the private editor

A media kit slug is required in every media-kit URL. `/`, `/mediakit`, and `/mediakit/` return 404.

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
```

Skip the copy if `.dev.vars` already exists. Set `DASHBOARD_PASSWORD` in `.dev.vars`, then run `npm run dev`. Wrangler provides a local KV store. Open `http://localhost:8787/admindashboard` and log in with that password.

## Data and security notes

- Public API responses are cached for 30 seconds, with stale responses allowed while Cloudflare refreshes them.
- Admin sessions are signed, HTTP-only, same-site cookies valid for eight hours.
- Admin writes are same-origin checked and all submitted KV data is length/type validated.
- `DASHBOARD_PASSWORD` must be stored as an encrypted runtime secret under the Worker's **Variables and Secrets** settings; do not add it to `wrangler.jsonc` or commit `.dev.vars`.
- Content images are selected from the bundled media-kit images in the dashboard.

## Default content sources

Content was checked in the internal browser on 26 October 2026. Each platform uses its three latest public uploads in newest-first order. YouTube uses the three latest videos from the `@bekyamon` channel's Videos tab. Twitch uses past broadcasts sorted by date. View counts are a snapshot of the public display, including platform rounding, except Instagram reel views, which were provided by the user.

| Platform | Latest | Second latest | Third latest |
| --- | --- | --- | --- |
| Instagram | [Moving update](https://www.instagram.com/bekyamon/reel/DeCbCpWK_Hr/) | [Dungeons II loadout](https://www.instagram.com/bekyamon/reel/Dd9NgPsKkys/) | [New in Dungeons II](https://www.instagram.com/bekyamon/reel/Dd6rl14qQRB/) |
| TikTok | [Dungeons II loadout](https://www.tiktok.com/@bekyamon/video/7691718088949058838) | [New in Dungeons II](https://www.tiktok.com/@bekyamon/video/7691353785083448598) | [LEGO Chicken Mounts](https://www.tiktok.com/@bekyamon/video/7667993399651306785) |
| YouTube | [Did Minecraft Just Bring Back Minecon?](https://www.youtube.com/watch?v=4CF9Cndnflc) | [The Sulfur Cube is The Perfect Minecraft Mob](https://www.youtube.com/watch?v=dCxbSbDtTKQ) | [Why Minecraft Looks Different Now](https://www.youtube.com/watch?v=9dYiaRxtu9Q) |
| Twitch | [Building my desk in the USA](https://www.twitch.tv/videos/2910552123) | [Last stream in the UK](https://www.twitch.tv/videos/2895202932) | [Festivaling with friends](https://www.twitch.tv/videos/2893473908) |

Thumbnails are saved in `public/images/content/` so the default content does not depend on expiring social CDN URLs. Twitch thumbnails two and three use frames around 20:24, captured from their respective VODs. Captions are shortened into titles, with paid content marked as ads where disclosed. These defaults apply before shared data is saved to KV. Existing saved data must be edited through the dashboard.

## Verification

```bash
npm run check
```

This runs the Worker/API tests and the production frontend build.
