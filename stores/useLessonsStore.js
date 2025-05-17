import { defineStore } from 'pinia'
import { reactive } from 'vue'
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

  async function addLessonTranslation(lessonId, translationData) {
    state.error = null

    try {
      const response = await api().post(`/lessons/translation`, { lessonId, ...translationData })

      state.lesson.translations.push(response.data)

      snackbar.show('Translation added successfully', 'success')
    }
    catch (err) {
      state.error = err.message
      snackbar.show(`Failed to add translation`, 'error')
    }
  }

  async function updateLessonTranslation(lessonId, translationData) {
    state.error = null

    try {
      const response = await api().put(`/lessons/translation/${lessonId}`, translationData)

      state.lesson.translations = state.lesson.translations.map(t => {
        if (t.language === translationData.language) {
          return { ...t, ...translationData }
        }

        return t
      },
      )
      snackbar.show('Translation updated successfully', 'success')
    }
    catch (err) {
      state.error = err.message
      snackbar.show(`Failed to update translation`, 'error')
    }
  }

  const submitTranslation = async data => {
    if (!state.lesson.id) {
      const errMsg = 'Lesson not loaded.'

      snackbar.show(errMsg, 'error')
      throw new Error(errMsg)
    }

    const hasTranslation = state.lesson?.translations?.find(t => t.language === data.language)

    if (hasTranslation) {
      const translationId = state.lesson?.translations?.find(t => t.language === data.language)?.id

      await updateLessonTranslation(translationId, data)
    } else {
      await addLessonTranslation(state.lesson.id, data)
    }
  }

  return {
    state,
    getLesson,
    getLessons,
    addLesson,
    updateLesson,
    submitTranslation,
  }
})
