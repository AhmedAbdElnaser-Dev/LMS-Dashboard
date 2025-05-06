import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'
import { useSnackbarStore } from './snackbar'

export const useLessonsStore = defineStore('lessonsStore', () => {
  const snackbar = useSnackbarStore()

  const state = reactive({
    loading: false,
    error: null,
    lesson: null,
    lessons: [],
  })

  async function getLesson(lessonId) {
    state.loading = true
    state.error = null

    try {
      const response = await api().get(`/lessons/${lessonId}`)

      state.lesson = response.data
    } catch (err) {
      state.error = err.message
    } finally {
      state.loading = false
    }
  }

  async function getLessons() {
    state.loading = true
    state.error = null

    try {
      const response = await api().get(`/lessons`)

      state.lessons = response.data
    } catch (err) {
      state.error = err.message
    } finally {
      state.loading = false
    }
  }

  async function addLesson(lessonData, unitId) {
    state.loading = true
    state.error = null

    try {
      const response = await api().post(`/lessons`, { ...lessonData, unitId })

      state.lessons.push(response.data)
      snackbar.show(`Lesson added successfully!`, 'success')
    } catch (err) {
      state.error = err.message
      snackbar.show(`Failed to add lesson`, 'error')
    } finally {
      state.loading = false
    }
  }

  async function updateLesson(lessonId, lessonData) {
    state.loading = true
    state.error = null

    try {
      const response = await api().put(`/lessons/${lessonId}`, lessonData)

      state.lesson = response.data
      snackbar.show('Lesson updated successfully!', 'success')
    } catch (err) {
      state.error = err.message
      snackbar.show(`Failed to update lesson`, 'error')
    } finally {
      state.loading = false
    }
  }

  async function deleteLesson(lessonId) {
    state.loading = true
    state.error = null

    try {
      await api().delete(`/lessons/${lessonId}`)
      state.lessons = state.lessons.filter(l => l.id !== lessonId)
      snackbar.show('Lesson deleted successfully!', 'success')
    } catch (err) {
      state.error = err.message
      snackbar.show(`Failed to delete lesson`, 'error')
    } finally {
      state.loading = false
    }
  }

  return {
    ...toRefs(state),
    getLesson,
    getLessons,
    addLesson,
    updateLesson,
    deleteLesson,
  }
})
