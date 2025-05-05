import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUnitsStore = defineStore('unitsStore', () => {
  const snackbar = useSnackbarStore()

  const loading = ref(false)
  const error = ref(null)
  const currentCourseId = ref(null)
  const unit = ref(null)

  const setCurrentCourse = courseId => {
    currentCourseId.value = courseId
  }

  const addUnit = async unitData => {
    loading.value = true
    error.value = null
    try {
      await api().post('/units', unitData)
      snackbar.show('Unit added successfully', 'success')
    } catch (err) {
      console.error('Error adding unit:', err)

      const errMsg = err.response?.data?.message || 'Failed to add unit'

      error.value = errMsg
      snackbar.show(errMsg, 'error')
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateUnit = async (unitId, unitData) => {
    loading.value = true
    error.value = null
    try {
      await api().put(`/units/${unitId}`, unitData)
      snackbar.show('Unit updated successfully', 'success')
    } catch (err) {
      console.error(`Error updating unit with ID ${unitId}:`, err)

      const errMsg = err.response?.data?.message || 'Failed to update unit'

      error.value = errMsg
      snackbar.show(errMsg, 'error')
      throw err
    } finally {
      loading.value = false
    }
  }

  const getUnit = async unitId => {
    loading.value = true
    error.value = null
    try {
      const res = await api().get(`/units/${unitId}`)

      unit.value = res.data
      snackbar.show('Unit fetched successfully', 'success')

      return res.data
    } catch (err) {
      console.error(`Error getting unit with ID ${unitId}:`, err)

      const errMsg = err.response?.data?.message || 'Failed to get unit'

      error.value = errMsg
      snackbar.show(errMsg, 'error')
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
      await getUnit(unitId)
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
      await getUnit(unitId)
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

    const hasTranslation = unit.value?.translations?.[language]

    if (hasTranslation) {
      await updateUnitTranslation(unit.value.id, language, { name })
    } else {
      await addUnitTranslation(unit.value.id, { language, name })
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
  }
})
