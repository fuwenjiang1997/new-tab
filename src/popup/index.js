import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router/auto'
import routes from '~pages'
import App from './App.vue'
import '@/assets/index.css'

// routes.push({
//   path: '/',
//   redirect: '/popup',
// })

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

createApp(App).use(router).use(createPinia()).mount('#app')
