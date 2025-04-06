<script setup>
import DataGrid from '@/components/DataGrid.vue'
import { useCoursesStore } from '@/stores/coursesStore'
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

const handleDelete = (id) => {
  coursesStore.courses = coursesStore.courses.filter(c => c.id !== id)
}
</script>

<template>
  <DataGrid
    :headers="headers"
    :items="coursesStore.courses"
    name="courses"
    @delete="handleDelete"
  >
    <!-- Custom slot for ID -->
    <template #item.id="{ item, index }">
      #{{ index + 1 }}
    </template>

    <!-- You can add more custom slots if you want to format other values -->
  </DataGrid>
</template>
