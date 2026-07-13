import { defineConfig } from 'vite';

export default defineConfig({
  base: '/mediakit/',
  build: {
    outDir: 'dist/mediakit',
    emptyOutDir: true,
  },
});
