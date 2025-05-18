import { useSnackbarStore } from '@/stores/snackbar'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCoursesStore = defineStore('coursesStore', () => {
  // State
  const courses = ref([])
  const course = ref(null)
  const books = ref([])
  const categories = ref([])
  const departments = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Snackbar store
  const snackbar = useSnackbarStore()

  // Helper functions for snackbar messages
  const showSuccess = message => snackbar.show(message, 'success')
  const showError = message => snackbar.show(message, 'error')

  const fetchCourses = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api().get('/courses/all')

      courses.value = response.data
    } catch (err) {
      error.value = err
      console.error('Failed to fetch courses:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchFormData = async () => {
    loading.value = true
    error.value = null
    try {
      const [coursesRes, booksRes, categoriesRes, departmentsRes] = await Promise.all([
        api().get('/courses/all'),
        api().get('/Books'),
        api().get('/Categories'),
        api().get('/Departments/all'),
      ])

      courses.value = coursesRes.data
      books.value = booksRes.data
      categories.value = categoriesRes.data
      departments.value = departmentsRes.data
    } catch (err) {
      error.value = err
      showError('Failed to load form data')
    } finally {
      loading.value = false
    }
  }

  const fetchCourseById = async id => {
    loading.value = true
    error.value = null
    course.value = null
    try {
      const response = await api().get(`/courses/${id}/full-details`)

      course.value = response.data
    } catch (err) {
      error.value = err
      console.error(`Failed to fetch course by id ${id}:`, err)
    } finally {
      loading.value = false
    }
  }

  const addCourse = async courseData => {
    loading.value = true
    error.value = null
    try {
      const res = await api().post('/courses/add', courseData)

      if (res.status != 200) {
        error.value = "Failed to add Course"
        showError('Failed to add course')

        return { success: false, message: "Failed to add Course" }
      }

      if (courses.value.length !== 0) {
        courses.value.unshift(res.data.course)
      }

      showSuccess('Course added successfully')

      return { success: true }
    } catch (err) {
      error.value = err
      showError('Failed to add course')
      console.error('Failed to add course:', err)

      return { success: false, message: err.response?.data?.message || "Failed to add Course" }
    } finally {
      loading.value = false
    }
  }

  const deleteCourse = async courseId => {
    loading.value = true
    error.value = null
    try {
      const res = await api().delete(`/courses/${courseId}`)
      if (res.status === 200 || res.status === 204) {
        courses.value = courses.value.filter(course => course.id !== courseId)
        if (course.value && course.value.id === courseId) {
          course.value = null
        }
        showSuccess('Course deleted successfully')
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete course'

      error.value = errorMsg
      showError(errorMsg)
      console.error(`Error deleting course with ID ${courseId}:`, err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateCourse = async (id, courseData) => {
    loading.value = true
    error.value = null
    try {
      const res = await api().put(`/courses/${id}/edit`, courseData)

      if (res.status === 200 || res.status === 204) {
        courses.value = courses.value.map(course =>
          course.id === id ? { ...course, ...courseData } : course,
        )
        if (course.value && course.value.id === id) {
          course.value = { ...course.value, ...courseData }
        }
        showSuccess('Course updated successfully')

        return { success: true }
      } else {
        showError('Failed to update course')

        return { success: false, message: "Failed to update Course" }
      }
    } catch (err) {
      error.value = err
      showError('Failed to update course')
      console.error(`Failed to update course with id ${id}:`, err)

      return { success: false, message: err.response?.data?.message || "Failed to update course" }
    } finally {
      loading.value = false
    }
  }

  const addTranslation = async translationData => {
    loading.value = true
    error.value = null
    try {
      const response = await api().post('/courses/translations/add', translationData)
      const newTranslation = response.data

      if (course.value && course.value.id === translationData.courseId) {
        course.value.translations = {
          ...course.value.translations,
          [translationData.language]: { ...newTranslation, id: response.data.translationId },
        }
      }

      const courseIndex = courses.value.findIndex(
        c => c.id === translationData.courseId,
      )

      if (courseIndex !== -1) {
        courses.value[courseIndex].translations = {
          ...courses.value[courseIndex].translations,
          [translationData.language]: newTranslation,
        }
      }

      showSuccess('Translation added successfully')

      return { success: true, translation: newTranslation }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to add translation'

      error.value = errorMsg
      showError(errorMsg)
      console.error('Failed to add translation:', err)

      return { success: false, message: errorMsg }
    } finally {
      loading.value = false
    }
  }

  const editTranslation = async translationData => {
    loading.value = true
    error.value = null
    try {
      const response = await api().put('/courses/translations/edit', translationData)
      const updatedTranslation = response.data

      if (course.value) {
        course.value.translations[translationData.language] = updatedTranslation
      }

      const courseIndex = courses.value.findIndex(
        c =>
          c.translations &&
          c.translations[translationData.language]?.id === translationData.translationId,
      )

      if (courseIndex !== -1) {
        courses.value[courseIndex].translations[translationData.language] =
          updatedTranslation
      }

      showSuccess('Translation updated successfully')

      return { success: true }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to edit translation'

      error.value = errorMsg
      showError(errorMsg)

      return { success: false, message: errorMsg }
    } finally {
      loading.value = false
    }
  }

  const setCourse = courseData => {
    course.value = courseData
  }

  return {
    courses,
    course,
    books,
    categories,
    departments,
    loading,
    error,
    fetchCourses,
    fetchFormData,
    fetchCourseById,
    addCourse,
    updateCourse,
    addTranslation,
    editTranslation,
    deleteCourse,
    setCourse,
  }
})
