import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/AuthStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: '', name: 'home', component: () => import('@/views/HomeView.vue') },
        { path: 'all-tasks', name: 'all-tasks', component: () => import('@/views/AllTasksView.vue') },
      ],
    },
    { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated()) {
    return '/login'
  }
  if (to.path === '/login' && authStore.isAuthenticated()) {
    return '/'
  }
})

export default router
