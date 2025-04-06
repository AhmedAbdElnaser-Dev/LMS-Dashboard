import { defineStore } from 'pinia'

export const useCoursesStore = defineStore('coursesStore', {
  state: () => ({
    courses: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchCourses() {
      this.loading = true
      this.error = null
      try {
        const response = await api().get('/courses/all')
        this.courses = response.data
      } catch (err) {
        this.error = err
        console.error('Failed to fetch courses:', err)
      } finally {
        this.loading = false
      }
    }
  }
})
