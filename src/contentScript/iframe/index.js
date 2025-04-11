import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router/auto'
import routes from '~pages'
import App from './App.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...routes],
})

createApp(App).use(router).use(createPinia()).mount('#app')
