export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()
  const cookie = useCookie('.AspNetCore.Identity.Application')

  if (to.path === '/login') {
    if (cookie.value && !authStore.user) {
      await authStore.verifyUser()
    }
    if (authStore.user) {
      return navigateTo('/')
    }
  }

  if (cookie.value && !authStore.user) {
    await authStore.verifyUser()
  }

  if (!authStore.user) {
    return navigateTo('/login')
  }
})
