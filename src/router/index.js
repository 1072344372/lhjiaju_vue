import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '@/views/Login.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    children: [
      { path: '/furn', component: () => import('@/views/FurnManagement.vue') },
      { path: '/order', component: () => import('@/views/OrderManagement.vue') },
      { path: '/user', component: () => import('@/views/UserManagement.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
