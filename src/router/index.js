import { createRouter, createWebHistory } from 'vue-router'
import Welcome from '@/components//Welcome/component.vue'

const routes = [
  {
    path: '/',
    name: 'Welcome',
    component: Welcome
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export { router, routes }
