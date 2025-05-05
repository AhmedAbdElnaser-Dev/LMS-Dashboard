import { defineStore } from 'pinia'

export const useLessonsStore = defineStore('lessonsStore', {
  state: () => ({
    loading: false,
    error: null,
    lesson: null,
  }),

  actions: {
    async getLesson(lessonId) {
      this.loading = true
      this.error = null

      try {
        const response = await api().get(`/lessons/${lessonId}`)

        this.lesson = response.data
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
  },
})
