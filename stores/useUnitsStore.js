import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUnitsStore = defineStore('unitsStore', () => {
  const snackbar = useSnackbarStore()
  const coursesStore = useCoursesStore()

  const loading = ref(false)
  const error = ref(null)
  const currentCourseId = ref(null)
  const unit = ref(null)

  const setCurrentCourse = courseId => {
    currentCourseId.value = courseId
  }

  const addUnit = async (unitData, courseId) => {
    error.value = null
    try {
      console.log('Adding unit:', unitData, courseId)
      await api().post('/units', { ...unitData, courseId })
      snackbar.show('Unit added successfully', 'success')
    } catch (err) {
      console.error('Error adding unit:', err)

      const errMsg = err.response?.data?.message || 'Failed to add unit'

      error.value = errMsg
      snackbar.show(errMsg, 'error')
      throw err
    }
  }

  const updateUnit = async (unitId, unitData) => {
    error.value = null
    try {
      await api().put(`/units/${unitId}`, unitData)
      snackbar.show('Unit updated successfully', 'success')

      const course = coursesStore.course

      if (course) {
        const updatedUnits = course.units.map(unit => {
          if (unit.id === unitId) {
            return { ...unit, ...unitData }
          }

          return unit
        })

        coursesStore.setCourse({ ...course, units: updatedUnits })
      }
    } catch (err) {
      console.error(`Error updating unit with ID ${unitId}:`, err)

      const errMsg = err.response?.data?.message || 'Failed to update unit'

      error.value = errMsg
      snackbar.show(errMsg, 'error')
      throw err
    }
  }

  const getUnit = async unitId => {
    loading.value = true
    error.value = null
    try {
      const res = await api().get(`/units/${unitId}`)

      unit.value = res.data

      return res.data
    } catch (err) {
      console.error(`Error getting unit with ID ${unitId}:`, err)

      const errMsg = err.response?.data?.message || 'Failed to get unit'

      error.value = errMsg
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteUnit = async unitId => {
    loading.value = true
    error.value = null
    try {
      await api().delete(`/units/${unitId}`)
      snackbar.show('Unit deleted successfully', 'success')
    } catch (err) {
      console.error(`Error deleting unit with ID ${unitId}:`, err)

      const errMsg = err.response?.data?.message || 'Failed to delete unit'

      error.value = errMsg
      snackbar.show(errMsg, 'error')
      throw err
    } finally {
      loading.value = false
    }
  }

  const addUnitTranslation = async (unitId, translationData) => {
    try {
      await api().post(`/units/${unitId}/translations`, translationData)

      unit.value = {
        ...unit.value,
        translations: [
          ...(unit.value.translations || []),
          translationData,
        ],
      }

      snackbar.show('Translation added successfully', 'success')
    } catch (err) {
      console.error(`Error adding translation to unit ${unitId}:`, err)

      const errMsg = err.response?.data?.message || 'Failed to add translation'

      snackbar.show(errMsg, 'error')
      throw err
    }
  }

  const updateUnitTranslation = async (unitId, language, translationData) => {
    try {
      await api().put(`/units/${unitId}/translations/${language}`, translationData)

      unit.value = {
        ...unit.value,
        translations: unit.value.translations.map(t => {
          if (t.language === language) {
            return { ...t, ...translationData }
          }

          return t
        }),
      }

      snackbar.show('Translation updated successfully', 'success')
    } catch (err) {
      console.error(`Error updating translation for unit ${unitId}, lang ${language}:`, err)

      const errMsg = err.response?.data?.message || 'Failed to update translation'

      snackbar.show(errMsg, 'error')
      throw err
    }
  }

  const fetchUnitById = async unitId => {
    return await getUnit(unitId)
  }

  const submitTranslation = async ({ language, name }) => {
    if (!unit.value?.id) {
      const errMsg = 'Unit not loaded.'

      snackbar.show(errMsg, 'error')
      throw new Error(errMsg)
    }

    const hasTranslation = unit.value?.translations?.find(t => t.language === language)

    if (hasTranslation) {
      await updateUnitTranslation(unit.value.id, language, { name })
    } else {
      await addUnitTranslation(unit.value.id, { language, name })
    }
  }

  async function deleteLesson(lessonId) {
    try {
      await api().delete(`/lessons/${lessonId}`)
      snackbar.show('Lesson deleted successfully!', 'success')
      unit.value.lessons = unit.value.lessons.filter(l => l.id !== lessonId)
    } catch (err) {
      error.value = err.message
      snackbar.show(`Failed to delete lesson`, 'error')
    }
  }

  return {
    loading,
    error,
    currentCourseId,
    unit,
    setCurrentCourse,
    addUnit,
    updateUnit,
    getUnit,
    deleteUnit,
    fetchUnitById,
    submitTranslation,
    deleteLesson,
  }
})
