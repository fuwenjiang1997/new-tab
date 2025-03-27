import { createApp } from 'vue'
import routes from '~pages'
import App from './App.vue'
import { createRouter, createWebHashHistory } from 'vue-router/auto'
import { createPinia } from 'pinia'
import '@/assets/index.css'
import HomePage from './views/home/Home.vue'
import SetPage from './views/set/Set.vue'
import CustomPage from './views/custom/Custom.vue'
import IconCard from './components/Card.vue'

const _routes = [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/set',
    component: SetPage,
  },
  {
    path: '/custom-page/:pageName',
    component: CustomPage,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...routes, ..._routes],
})

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.component('MyIconCard', IconCard)

app.mount('#app')
