import { createApp } from 'vue'
import routes from '~pages'
import App from './App.vue'
import { createRouter, createWebHashHistory } from 'vue-router/auto'
import { createPinia } from 'pinia'
import '@/assets/index.css'

// routes.push({
//   path: '/',
//   redirect: '/popup',
// })

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
})

createApp(App).use(router).use(createPinia()).mount('#app')
