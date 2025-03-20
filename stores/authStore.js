// stores/authStore.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: null,
  }),

  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null

      console.log('test')
      try {
        const config = useRuntimeConfig() // Access runtime config
        const res = await $fetch('/users/login', {
          method: 'POST',
          body: credentials,
          baseURL: config.public.apiBaseUrl, // Use the config value
          credentials: 'include', // Include cookies
        })

        if (res.status === 200) {
          await this.verifyUser()
          return true // Indicate success
        }

        return false
      } catch (error) {
        console.error('API Error:', error)
        this.error = error.response?.data?.message || 'Login failed'
        return false
      } finally {
        this.loading = false
      }
    },

    async verifyUser() {
      this.loading = true
      try {
        const config = useRuntimeConfig() // Access runtime config
        const res = await $fetch('/users/verify', {
          baseURL: config.public.apiBaseUrl, // Use the config value
          credentials: 'include', // Include cookies
        })

        if (res.status === 200) {
          this.user = res.data
        } else {
          this.user = null
        }
      } catch (error) {
        console.error('User verification failed:', error)
        this.user = null
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.user,
  },
})

