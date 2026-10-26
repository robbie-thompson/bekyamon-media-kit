import { defineConfig } from 'vite';

export default defineConfig(async ({ command, isPreview }) => ({
  base: '/',
  // Use the Workers runtime with live source files during local development.
  plugins: command === 'serve' && !isPreview
    ? [(await import('@cloudflare/vite-plugin')).cloudflare()]
    : [],
  server: {
    port: 8787,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
}));
