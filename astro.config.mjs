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
    domains: ['freshcoffee.loca.lt']
  },
  output: 'server',
  integrations: [react(), vue()],
  adapter: netlify(),
});