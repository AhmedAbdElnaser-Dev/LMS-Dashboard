<script setup>
import DataGrid from '@/components/DataGrid.vue'
import { useCoursesStore } from '@/stores/useCoursesStore'
import { onMounted } from 'vue'

const coursesStore = useCoursesStore()

onMounted(() => {
  coursesStore.fetchCourses()
})

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

const handleDelete = async id => {
  await coursesStore.deleteCourse(id)
}
</script>

<template>
  <DataGrid
    :headers="headers"
    :items="coursesStore.courses"
    name="courses"
    @delete="handleDelete"
  />
</template>
