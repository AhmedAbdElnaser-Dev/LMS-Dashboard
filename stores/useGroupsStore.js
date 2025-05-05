import { ref } from 'vue'

export const useGroupsStore = defineStore('groupsStore', () => {
  const loading = ref(false)
  const error = ref(null)
  const courseGroups = ref([])
  const currentGroup = ref(null)
  const instructors = ref([])
  const students = ref([])
  const useSnackbar = useSnackbarStore()

  const setCourseGroups = groups => {
    courseGroups.value = groups
  }

  const removeGroup = group => {
    courseGroups.value = courseGroups.value.filter(g => g.id !== group)
  }

  const getCourseGroups = async courseId => {
    try {
      loading.value = true
      error.value = null

      const response = await api().get(`/groups/course/${courseId}`)

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

      const response = await api().get(`/groups/${groupId}`)

      currentGroup.value = response.data

      return response.data
    } catch (err) {
      error.value = err.message || 'Failed to fetch group details'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateGroup = async data => {
    try {
      error.value = null

      const response = await api().put(`/groups/edit`, data)

      currentGroup.value = response.data

      useSnackbar.show("Group updated successfully", "success")

      return response.data
    } catch (err) {
      error.value = err.message || 'Failed to update group'
      useSnackbar.show("Failed to update group", "error")
    }
  }

  const addGroup = async group => {
    loading.value = true
    error.value = null
    try {
      const response = await api().post('/groups/add-to-course', group)

      courseGroups.value.push(response.data)

      useSnackbar.show("Group added successfully", "success")

      return { success: true }
    } catch (err) {
      error.value = err.message || 'Failed to add group'
      useSnackbar.show("Failed to add group", "error")

      return { success: false }
    } finally {
      loading.value = false
    }
  }

  const addTranslation = async ({ groupId, language, name, description }) => {
    try {
      loading.value = true
      error.value = null

      const res = await api().post(`/groups/add-translation`, {
        language,
        name,
        description,
        groupId,
      })

      if (currentGroup.value && currentGroup.value.id === groupId) {
        currentGroup.value.translations = [
          ...(currentGroup.value.translations || []),
          res.data,
        ]
      }

      useSnackbar.show("Translation added successfully", "success")

      return res.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to add translation'
      console.error('Error adding translation:', err)
      useSnackbar.show("Failed to add translation", "error")
      throw err
    } finally {
      loading.value = false
    }
  }

  const editTranslation = async ({ groupId, language, name, description }) => {
    try {
      loading.value = true
      error.value = null

      const res = await api().put(`/groups/update-translation/`, {
        groupId,
        language,
        name,
        description,
      })

      if (currentGroup.value && currentGroup.value.id === groupId) {
        const index = currentGroup.value.translations?.findIndex(t => t.language === language) ?? -1
        if (index !== -1) {
          currentGroup.value.translations[index] = res.data
        } else {
          currentGroup.value.translations = [
            ...(currentGroup.value.translations || []),
            res.data,
          ]
        }
      }

      useSnackbar.show("Translation updated successfully", "success")

      return res.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update translation'
      console.error('Error editing translation:', err)
      useSnackbar.show("Failed to update translation", "error")
      throw err
    } finally {
      loading.value = false
    }
  }

  const submitTranslation = async ({ groupId, language, name, description }) => {
    if (!currentGroup.value || currentGroup.value.id !== groupId) {
      error.value = 'No selected group to update'
      console.error('No selected group to update')
      useSnackbar.show("No selected group to update", "error")

      return
    }

    try {
      loading.value = true
      error.value = null

      const existingTranslation = currentGroup.value.translations?.find(
        t => t.language === language,
      )

      if (existingTranslation) {
        return await editTranslation({
          groupId,
          language,
          name,
          description,
        })
      } else {
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

  const getInstructors = async () => {
    try {
      error.value = null

      const response = await api().get('/users/teachers')

      instructors.value = response.data

      return response.data
    } catch (err) {
      error.value = err.message || 'Failed to fetch instructors'
      throw err
    }
  }

  const addStudent = async ({ groupId, studentId }) => {
    try {
      error.value = null

      const response = await api().post('/groups/add-student', {
        groupId,
        studentId,
      })

      // if (currentGroup.value && currentGroup.value.id === groupId) {
      //   const newStudent = response.data.student || { id: studentId }

      //   currentGroup.value.students = [
      //     ...(currentGroup.value.students || []),
      //     newStudent,
      //   ]
      //   if (response.data.currentStudentCount !== undefined) {
      //     currentGroup.value.currentStudentCount = response.data.currentStudentCount
      //   }
      // }

      currentGroup.value.students = [
        ...(currentGroup.value.students || []),
        response.data,
      ]

      useSnackbar.show("Student added successfully", "success")

      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to add student'
      useSnackbar.show("Failed to add student", "error")
      throw err
    }
  }

  const getStudents = async () => {
    try {
      error.value = null

      const response = await api().get('/users/students')

      students.value = response.data.students
    } catch (err) {
      error.value = err.message || 'Failed to fetch students'
      throw err
    }
  }

  const removeStudent = async ({ groupId, studentId }) => {
    try {
      error.value = null

      const response = await api().delete(`/groups/remove-student`, {
        data: { groupId, studentId },
      })

      if (currentGroup.value && currentGroup.value.id === groupId) {
        currentGroup.value.students = currentGroup.value.students.filter(
          student => student.id !== studentId,
        )
        if (response.data.currentStudentCount !== undefined) {
          currentGroup.value.currentStudentCount = response.data.currentStudentCount
        }
      }
      if (currentGroup.value) {
        currentGroup.value.students = currentGroup.value.students.filter(
          student => student.id !== studentId,
        )
      }

      useSnackbar.show("Student removed successfully", "success")

      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to remove student'
      console.error('Error removing student:', err)
      useSnackbar.show("Failed to remove student", "error")
      throw err
    }
  }

  const deleteGroup = async groupId => {
    loading.value = true
    error.value = null
    try {
      const res = await api().delete(`/groups/${groupId}`)

      if (res.status === 200 || res.status === 204) {
        useSnackbar.show("Group deleted successfully", "success")

        return { success: true }
      }
      useSnackbar.show("Failed to delete group", "error")

      return { success: false }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete group'
      useSnackbar.show("Failed to delete group", "error")

      return { success: false, message: 'Failed to delete group' }
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    courseGroups,
    currentGroup,
    instructors,
    students,
    getCourseGroups,
    getGroupById,
    updateGroup,
    addGroup,
    addTranslation,
    editTranslation,
    submitTranslation,
    getInstructors,
    addStudent,
    getStudents,
    removeStudent,
    deleteGroup,
    setCourseGroups,
    removeGroup,
  }
})
