import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useAuthStore } from '@/stores/useAuthStore'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()

  console.log('Auth middleware triggered')
  console.log('Current route:', to.path)
  console.log('Previous route:', from.path)
  console.log('Is authenticated:', authStore.isAuthenticated)
  console.log('Redirect path:', authStore.redirectPath)

  // Initialize store if not already done
  if (!authStore.isInitialized) {
    authStore.initialize()
  }

  // If user is not authenticated, try to verify
  if (!authStore.isAuthenticated) {
    try {
      console.log('Verifying user...')
      await authStore.verifyUser()
    } catch (error) {
      console.error('Verification failed:', error)
    }
  }

  // Handle login page
  if (to.path === '/login') {
    if (authStore.isAuthenticated) {
      // If user is authenticated and trying to access login, redirect to dashboard or intended path
      const redirectPath = authStore.redirectPath || '/dashboard'

      authStore.clearRedirectPath()

      return navigateTo(redirectPath)
    }

    return // Allow access to login page
  }

  // Handle dashboard routes
  if (to.path.startsWith('/dashboard')) {
    if (authStore.isAuthenticated) {
      // User is authenticated, allow access
      return
    } else {
      // User is not authenticated, store intended destination and redirect to login
      authStore.setRedirectPath(to.fullPath)

      return navigateTo('/login')
    }
  }

  // Handle root path
  if (to.path === '/') {
    if (authStore.isAuthenticated) {
      const redirectPath = authStore.redirectPath || '/dashboard'

      authStore.clearRedirectPath()

      return navigateTo(redirectPath)
    } else {
      authStore.setRedirectPath('/dashboard')

      return navigateTo('/login')
    }
  }

  // For all other routes, require authentication
  if (!authStore.isAuthenticated) {
    authStore.setRedirectPath(to.fullPath)

    return navigateTo('/login')
  }
})
