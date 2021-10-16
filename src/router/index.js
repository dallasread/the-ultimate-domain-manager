import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/home/component.vue'
import Login from '@/views/login/component.vue'
import Auth from '@/views/auth/component.vue'
import Domains from '@/views/domains/component.vue'
import Domain from '@/views/domain/component.vue'

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
  routes
})

export { router, routes }
