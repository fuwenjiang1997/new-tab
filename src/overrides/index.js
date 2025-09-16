import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router/auto'
import routes from '~pages'
import App from './App.vue'
import IconCard from './components/Card.vue'
import CustomPage from './views/custom/Custom.vue'
import HomePage from './views/home/Home.vue'
import ScriptPage from './views/script/Script.vue'
import SetPage from './views/set/Set.vue'
import '@/assets/index.css'


const _routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    component: HomePage,
  },
  {
    path: '/script',
    component: ScriptPage,
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
