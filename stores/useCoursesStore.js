import { api } from '#imports'
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

  // Actions
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
      console.error('Failed to fetch form data:', err)
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
      console.log('Fetched course:', course.value)
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
      await api().post('/courses/add', courseData)
      await fetchFormData()
    } catch (err) {
      error.value = err
      console.error('Failed to add course:', err)
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
      }
    } catch (err) {
      console.error(`Error deleting course with ID ${courseId}:`, err)
      error.value = err.response?.data?.message || 'Failed to delete course'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateCourse = async (id, courseData) => {
    loading.value = true
    error.value = null
    try {
      await api().put(`/courses/${id}/edit`, courseData)
    } catch (err) {
      error.value = err
      console.error(`Failed to update course with id ${id}:`, err)
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
          [translationData.language]: newTranslation,
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

      return newTranslation
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to add translation'
      console.error('Failed to add translation:', err)
      throw error.value
    } finally {
      loading.value = false
    }
  }

  const editTranslation = async translationData => {
    loading.value = true
    error.value = null
    try {
      const response = await api().put('/api/courses/translations/edit', translationData)
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

      return updatedTranslation
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to edit translation'
      console.error('Failed to edit translation:', err)
      throw error.value
    } finally {
      loading.value = false
    }
  }

  // Return state and actions
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
  }
})
