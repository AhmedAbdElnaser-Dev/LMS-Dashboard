<script setup>
import { useLessonsStore } from '@/stores/useLessonsStore'

const groupHeaders = [
  { title: 'Group Name', key: 'name' },
  { title: 'Members', key: 'memberCount' },
  { title: 'Actions', key: 'actions', sortable: false },
]

import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const lessonId = route.params.id


const lessonsStore = useLessonsStore()
const { loading, error, lesson, getLesson } = lessonsStore

const openPanels = ref([0, 1, 2, 3])

onMounted(async () => {
  console.log('Lesson data loaded:', lesson)
  try {
    await Promise.all([
      getLesson(lessonId),
    ])


    console.log('Lesson data loaded:', lesson)
  } catch (error) {
    console.error('Failed to load lesson data:', error)
    error = 'Failed to load lesson data. Please try again.'
  }
})

const unitHeaders = [
  { title: 'Unit Name', key: 'name' },
  { title: 'Lessons', key: 'lessonCount' },
  { title: 'Actions', key: 'actions', sortable: false },
]
</script>

<template>
  <div>
    <div v-if="loading">
      Loading...
    </div>
    <div v-else-if="error">
      {{ error }}
    </div>
    <div v-else>
      <div class="d-flex justify-space-between align-center mb-6">
        <h1 class="text-h4">
          {{ lesson.title }}
        </h1>
        <VBtn
          color="primary"
          variant="outlined"
          prepend-icon="tabler-pencil"
          @click="() => router.push(`/dashboard/lessons/edit/${lessonId}`)"
        >
          Edit Lesson
        </VBtn>
      </div>

      <VExpansionPanels
        v-model="openPanels"
        multiple
        variant="accordion"
      />
    </div>
  </div>
</template>
