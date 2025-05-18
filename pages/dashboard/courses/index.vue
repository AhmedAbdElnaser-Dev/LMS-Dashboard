<script setup>
import DataGrid from '@/components/DataGrid.vue'
import { useCoursesStore } from '@/stores/useCoursesStore'
import { onMounted, ref } from 'vue'

const coursesStore = useCoursesStore()
const loading = ref(false)
const error = ref(null)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('info')

const showSnackbar = (message, color = 'info') => {
  snackbarText.value = message
  snackbarColor.value = color
  snackbar.value = true
}

onMounted(async () => {
  if (!coursesStore.courses.length) {
    try {
      loading.value = true
      await coursesStore.fetchCourses()
    } catch (err) {
      error.value = err.message || 'Failed to fetch courses'
    } finally {
      loading.value = false
    }
  }
})

const handleDelete = async id => {
  try {
    await coursesStore.deleteCourse(id)
  } catch (err) {
  }
}

const headers = [
  { title: 'Course Name', key: 'name' },
  { title: 'Category', key: 'categoryName' },
  { title: 'Department', key: 'departmentName' },
  { title: 'Groups', key: 'groupCount' },
  { title: 'Units', key: 'unitCount' },
  { title: 'Lessons', key: 'lessonCount' },
  { title: 'Instructors', key: 'instructorCount' },
  { title: 'Actions', key: 'actions', sortable: false },
]

const customActions = []
</script>

<template>
  <DataGrid
    :headers="headers"
    :items="coursesStore.courses"
    :loading="loading"
    :error="error"
    :custom-actions="customActions"
    name="courses"
    @delete="handleDelete"
  />
</template>
