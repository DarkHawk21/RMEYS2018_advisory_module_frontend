import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/assets/styles/_theme.scss";
          @import "@/assets/styles/mixins/responsive.scss";
          @import "@/assets/styles/_utils.scss";
          @import "@/assets/styles/components/card.scss";
        `
      }
    }
  }
});
