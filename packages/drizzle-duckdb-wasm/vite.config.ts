import { resolve } from 'node:path'

import Vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'
import VueRouter from 'vue-router/vite'

import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: resolve(import.meta.dirname, 'playground', 'dist'),
  },
  plugins: [
    // https://router.vuejs.org/
    VueRouter({
      root: 'playground',
      extensions: ['.vue', '.md'],
      dts: resolve(import.meta.dirname, 'playground', 'src', 'typed-router.d.ts'),
      watch: false,
    }),
    Vue(),
    // https://github.com/antfu/unocss
    // see uno.config.ts for config
    Unocss(),
  ],
})
