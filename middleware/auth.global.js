import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useAuthStore } from '@/stores/useAuthStore'

export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log('Auth middleware triggered', { to: to.path, from: from.path })

  const authStore = useAuthStore()

  if (!authStore.isAuthenticated && !authStore.user) {
    console.log('User is null and not authenticated, verifying user...')
    try {
      await authStore.verifyUser()
    } catch (error) {
      console.error('Verification failed:', error)
    }
  }

  // Specific route handling
  if (to.path === '/login') {
    if (authStore.isAuthenticated) {
      console.log('User is authenticated, redirecting from /login to /dashboard...')
      
      return navigateTo('/dashboard')
    }
    console.log('User not authenticated, allowing access to /login')
    
    return
  }

  if (to.path.startsWith('/dashboard')) {
    if (authStore.isAuthenticated) {
      console.log('User authenticated, allowing access to:', to.path)
      
      return
    }
    console.log('User not authenticated for dashboard, redirecting to /login...')
    
    return navigateTo('/login')
  }

  // For all other routes, require authentication
  if (!authStore.isAuthenticated) {
    console.log('User not authenticated for route, redirecting to /login...', to.path)
    
    return navigateTo('/login')
  }

  console.log('User authenticated, allowing access to:', to.path)
})
