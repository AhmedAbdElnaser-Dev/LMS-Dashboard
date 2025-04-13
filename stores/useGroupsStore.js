import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGroupsStore = defineStore('groupsStore', () => {
  const loading = ref(false)
  const error = ref(null)
  const courseGroups = ref([])
  const currentGroup = ref(null)

  const getCourseGroups = async courseId => {
    try {
      loading.value = true
      error.value = null

      const response = await api().get(`/courses/courses/${courseId}/groups`)

      courseGroups.value = response.data
      
      return response.data
    } catch (err) {
      error.value = err.message || 'Failed to fetch course groups'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getGroupById = async groupId => {
    try {
      loading.value = true
      error.value = null

      const response = await api().get(`/courses/groups/${groupId}/details`)

      currentGroup.value = response.data
      
      return response.data
    } catch (err) {
      error.value = err.message || 'Failed to fetch group details'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateGroup = async (groupId, data) => {
    try {
      loading.value = true
      error.value = null

      const response = await api().put(`/courses/groups/${groupId}`, data)

      currentGroup.value = response.data
      
      return response.data
    } catch (err) {
      error.value = err.message || 'Failed to update group'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteGroup = async groupId => {
    loading.value = true
    error.value = null
    try {
      const res = await api().delete('/courses/groups/delete', {
        data: { groupId },
      })

      if (res.status === 200 || res.status === 204) {
        courseGroups.value = courseGroups.value.filter(group => group.id !== groupId)
        if (currentGroup.value && currentGroup.value.id === groupId) {
          currentGroup.value = null
        }
      }
    } catch (err) {
      console.error(`Error deleting group with ID ${groupId}:`, err)
      error.value = err.response?.data?.message || 'Failed to delete group'
      throw err
    } finally {
      loading.value = false
    }
  }
  

  const addTranslation = async ({ groupId, language, name, description }) => {
    try {
      loading.value = true
      error.value = null

      const res = await api().post('/courses/groups/translations', {
        groupId,
        language,
        name,
        description, // Optional, included for consistency
      })

      if (currentGroup.value && currentGroup.value.id === groupId) {
        currentGroup.value.translations = [
          ...(currentGroup.value.translations || []),
          res.data,
        ]
      }

      return res.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to add translation'
      console.error('Error adding translation:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const editTranslation = async ({ id, groupId, language, name, description }) => {
    try {
      loading.value = true
      error.value = null

      const res = await api().put(`/courses/groups/translations/${id}`, {
        id,
        groupId,
        language,
        name,
        description, // Optional, included for consistency
      })

      if (currentGroup.value && currentGroup.value.id === groupId) {
        const index = currentGroup.value.translations.findIndex(t => t.id === id)
        if (index !== -1) {
          currentGroup.value.translations[index] = res.data
        } else {
          currentGroup.value.translations = [
            ...(currentGroup.value.translations || []),
            res.data,
          ]
        }
      }

      return res.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update translation'
      console.error('Error editing translation:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const submitTranslation = async ({ groupId, language, name, description }) => {
    if (!currentGroup.value || currentGroup.value.id !== groupId) {
      error.value = 'No selected group to update'
      console.error('No selected group to update')
      
      return
    }

    try {
      loading.value = true
      error.value = null

      const existingTranslation = currentGroup.value.translations?.find(
        t => t.language === language,
      )

      if (existingTranslation) {
        // Edit existing translation
        return await editTranslation({
          id: existingTranslation.id,
          groupId,
          language,
          name,
          description,
        })
      } else {
        // Add new translation
        return await addTranslation({
          groupId,
          language,
          name,
          description,
        })
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to submit translation'
      console.error('Error submitting translation:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    courseGroups,
    currentGroup,
    getCourseGroups,
    getGroupById,
    updateGroup,
    deleteGroup,
    addTranslation,
    editTranslation,
    submitTranslation,
  }
})
