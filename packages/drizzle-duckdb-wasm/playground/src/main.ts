/* eslint-disable import/no-duplicates */
/* Issue for import/no-duplicates already opened https://github.com/un-ts/eslint-plugin-import-x/issues/372 */

import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

import App from './App.vue'
import '@unocss/reset/tailwind.css'
import 'uno.css'
import './styles/themes.css'

const router = createRouter({ routes, history: createWebHashHistory() })

createApp(App)
  .use(router)
  .mount('#app')
