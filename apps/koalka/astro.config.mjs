import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import analog from '@analogjs/astro-angular';

export default defineConfig({
  integrations: [
    analog({ polyfillZoneJs: false }),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  vite: {
    server: {
      fs: {
        // Pozwala Vite na dostęp do plików poza folderem apps/face-astro
        // W monorepo Nx najlepiej dopuścić cały root projektu
        allow: [
          '../../', // Wchodzi dwa poziomy wyżej do głównego folderu monorepo
        ],
      },
    },
    ssr: {
      noExternal: ['@angular/**', '@analogjs/**', '@saas/**'],
    },
  },
  srcDir: './src',
  publicDir: './public',
  outDir: '../../dist/apps/koalka',
});
