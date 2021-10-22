import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/home/component.vue'
import Login from '@/pages/login/component.vue'
import Auth from '@/pages/auth/component.vue'
import Domains from '@/pages/domains/component.vue'
import Domain from '@/pages/domain/component.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
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
  routes,
  scrollBehavior () {
    return { top: 0, behavior: 'smooth' }
  }
})

export { router, routes }
