import { navigateTo } from "#app"
import { api } from "#imports"
import { defineStore } from "pinia"

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    loading: false,
    error: null,
    isVerifying: false, // Add this to prevent multiple verify calls
    redirectPath: null, // Store intended destination
    isInitialized: false, // Track if store has been initialized
  }),

  getters: {
    isAuthenticated: state => !!state.user,
  },

  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null

      try {
        const res = await api().post("/users/login", credentials)

        if (res.status === 200) {
          // Set user immediately after successful login
          this.user = res.data
          this.isInitialized = true

          // Don't navigate here, let the middleware handle it
          return res
        }

        return res
      } catch (error) {
        console.error("API Error:", error)
        this.error = error.response?.data?.message || "Login failed"
        throw error // Re-throw to handle in component
      } finally {
        this.loading = false
      }
    },

    async verifyUser() {
      // Prevent multiple simultaneous verify calls
      if (this.isVerifying) {
        return { status: this.user ? 200 : 401 }
      }

      this.isVerifying = true
      this.loading = true

      try {
        const res = await api().get("/users/verify")

        if (res.status === 200) {
          this.user = res.data
          this.isInitialized = true
          
          return res
        } else {
          this.user = null
          this.isInitialized = true
          
          return { status: 401 }
        }
      } catch (error) {
        console.error("User verification failed:", error)
        this.user = null
        this.isInitialized = true
        
        return { status: 401 }
      } finally {
        this.loading = false
        this.isVerifying = false
      }
    },

    async logout() {
      this.loading = true
      try {
        const res = await api().post("/users/logout")

        if (res.status === 200) {
          this.user = null
          this.redirectPath = null
          this.isInitialized = true
          navigateTo("/login")
        }
      } catch (error) {
        console.error("Logout failed:", error)

        // Clear user data even if logout API fails
        this.user = null
        this.redirectPath = null
        this.isInitialized = true
        navigateTo("/login")
      } finally {
        this.loading = false
      }
    },

    // Add method to set intended redirect path
    setRedirectPath(path) {
      this.redirectPath = path
    },

    // Add method to clear redirect path
    clearRedirectPath() {
      this.redirectPath = null
    },

    // Initialize store state
    initialize() {
      if (!this.isInitialized) {
        this.isInitialized = true
      }
    },
  },
})
