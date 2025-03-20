// middleware/auth.global.js
export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()
  const cookie = useCookie('.AspNetCore.Identity.Application') // Access the cookie

  // If navigating to /login
  if (to.path === '/login') {
    // If cookie exists and user is null, verify to check authentication
    if (cookie.value && !authStore.user) {
      await authStore.verifyUser()
    }
    // If authenticated (user exists), redirect away from login
    if (authStore.user) {
      return navigateTo('/')
    }
    return // Allow access to login page if not authenticated
  }

  // For all other routes
  // If cookie exists but user is null, verify the user
  if (cookie.value && !authStore.user) {
    await authStore.verifyUser()
  }

  // If no user after verification (or no cookie), redirect to login
  if (!authStore.user) {
    return navigateTo('/login')
  }

  // If user exists, allow navigation to proceed
})
