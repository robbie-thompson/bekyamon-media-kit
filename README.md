# Bekyamon Media Kit

A responsive dashboard-style creator media kit, built with Vite and ready for Cloudflare Pages.

## Local development

```bash
npm install
npm run dev
```

## Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`
- Node version: 22
- Custom domain: `bekyamon.live`
- Production URL: `https://bekyamon.live/mediakit/`

The Vite build is written to `dist/mediakit`, while Cloudflare metadata is
written to the root of `dist`. Keep the Pages output directory set to `dist`;
using `dist/mediakit` would publish the site at the domain root instead.

All audience figures, content titles, brand partnerships and biography copy are placeholders.
