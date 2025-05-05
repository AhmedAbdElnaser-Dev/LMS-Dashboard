import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useAuthStore } from '@/stores/useAuthStore'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated && !authStore.user) {
    try {
      await authStore.verifyUser()
    } catch (error) {
      console.error('Verification failed:', error)
    }
  }

  // Specific route handling
  if (to.path === '/login') {
    if (authStore.isAuthenticated) {

      return navigateTo('/dashboard')
    }

    return
  }

  if (to.path.startsWith('/dashboard')) {
    if (authStore.isAuthenticated) {

      return
    }

    return navigateTo('/login')
  }

  if (!authStore.isAuthenticated) {

    return navigateTo('/login')
  }
})
