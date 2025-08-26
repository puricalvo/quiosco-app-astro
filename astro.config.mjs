// @ts-check
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
  vite: {
      plugins: [tailwindcss()]
  },

  output: 'server',
  integrations: [react(), vue()]
});