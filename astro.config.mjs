// @ts-check
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

import react from '@astrojs/react';

import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
  vite: {
      plugins: [tailwindcss()]
  },
  image: {
    domains: ['localhost:10010']
  },
  output: 'server',
  integrations: [react(), vue()],
  adapter: netlify(),
});