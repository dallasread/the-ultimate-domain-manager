import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/components/Login/component.vue'
import Auth from '@/components/Auth/component.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export { router, routes }
