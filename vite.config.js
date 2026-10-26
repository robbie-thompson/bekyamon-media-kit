import { defineConfig } from 'vite';

export default defineConfig(async ({ command, isPreview }) => ({
  // The development asset binding reads files from the source root.
  base: command === 'serve' && !isPreview ? '/' : '/mediakit/',
  // Use the Workers runtime with live source files during local development.
  plugins: command === 'serve' && !isPreview
    ? [(await import('@cloudflare/vite-plugin')).cloudflare()]
    : [],
  server: {
    port: 8787,
    strictPort: true,
  },
  build: {
    outDir: 'dist/mediakit',
    emptyOutDir: true,
  },
}));
