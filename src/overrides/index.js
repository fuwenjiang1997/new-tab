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
import ScriptPage from './views/script/Script.vue'

const _routes = [
  {
    path: '/',
    // component: HomePage,
    component: ScriptPage,
  },
  {
    path: '/set',
    component: SetPage,
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
