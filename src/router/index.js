import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/components/Login/component.vue'
import Auth from '@/components/Auth/component.vue'
import Domains from '@/components/Domains/component.vue'
import Domain from '@/components/Domain/component.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth
  },
  {
    path: '/domains/:name',
    name: 'Domain',
    component: Domain
  },
  {
    path: '/domains',
    name: 'Domains',
    component: Domains
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export { router, routes }
