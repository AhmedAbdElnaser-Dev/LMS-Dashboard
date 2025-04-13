<script setup>
import { useCoursesStore } from '@/stores/useCoursesStore'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  VBtn,
  VCard,
  VCardActions,
  VCardText,
  VCombobox,
  VTextField,
  VTextarea,
} from 'vuetify/components'

const route = useRoute()
const coursesStore = useCoursesStore()

const form = ref({
  courseId: route.params.id, // Assuming course ID comes from route params
  language: 'ru', // Set to Russian
  name: '',
  urlPic: '',
  description: '',
  about: '',
  demoUrl: '',
  title: '',
  prerequisites: [],
  learningOutcomes: [],
})

const isTouched = ref(false)

// Determine if we're in edit mode based on the Russian translation's name
const isEditMode = computed(() => {
  const ruTranslation = coursesStore.course?.translations?.ru
  
  return ruTranslation && ruTranslation.name !== '' && ruTranslation.name !== null
})

// Fill form with existing Russian translation data if available
onMounted(() => {
  const ruTranslation = coursesStore.course?.translations?.ru
  if (ruTranslation) {
    form.value = {
      ...form.value,
      name: ruTranslation.name || '',
      urlPic: ruTranslation.urlPic || '',
      description: ruTranslation.description || '',
      about: ruTranslation.about || '',
      demoUrl: ruTranslation.demoUrl || '',
      title: ruTranslation.title || '',
      prerequisites: ruTranslation.prerequisites || [],
      learningOutcomes: ruTranslation.learningOutcomes || [],
    }
  }
})

// Form validation: Require at least the name field
const isFormValid = computed(() => form.value.name.trim() !== '')

const handleSubmit = async () => {
  isTouched.value = true
  if (!isFormValid.value) return

  try {
    if (isEditMode.value) {
      // Edit mode: Pass translationId if available
      await coursesStore.editTranslation({
        translationId: coursesStore.course.translations.ru.id, // Assumes translation has an ID
        language: 'ru',
        name: form.value.name,
        urlPic: form.value.urlPic,
        description: form.value.description,
        about: form.value.about,
        demoUrl: form.value.demoUrl,
        title: form.value.title,
        prerequisites: form.value.prerequisites,
        learningOutcomes: form.value.learningOutcomes,
      })
      alert('Russian translation updated successfully!')
    } else {
      // Add mode
      await coursesStore.addTranslation({
        courseId: form.value.courseId,
        language: 'ru',
        name: form.value.name,
        urlPic: form.value.urlPic,
        description: form.value.description,
        about: form.value.about,
        demoUrl: form.value.demoUrl,
        title: form.value.title,
        prerequisites: form.value.prerequisites,
        learningOutcomes: form.value.learningOutcomes,
      })
      alert('Russian translation added successfully!')
    }
  } catch (error) {
    alert(`Error: ${error}`)
  }
}
</script>

<template>
  <VCard class="shadow-lg rounded-lg py-6">
    <VCardText class="pa-6">
      <VTextField
        v-model="form.name"
        label="Course Name (Russian)"
        variant="outlined"
        dense
        required
        class="mb-4"
        :error="isTouched && !form.name.trim()"
        :error-messages="isTouched && !form.name.trim() ? ['This field is required'] : []"
        @blur="isTouched = true"
      />
      <VTextField
        v-model="form.title"
        label="Title (Russian)"
        variant="outlined"
        dense
        class="mb-4"
      />
      <VTextField
        v-model="form.urlPic"
        label="Picture URL (Russian)"
        variant="outlined"
        dense
        class="mb-4"
      />
      <VTextarea
        v-model="form.description"
        label="Description (Russian)"
        variant="outlined"
        dense
        class="mb-4"
      />
      <VTextarea
        v-model="form.about"
        label="About (Russian)"
        variant="outlined"
        dense
        class="mb-4"
      />
      <VTextField
        v-model="form.demoUrl"
        label="Demo URL (Russian)"
        variant="outlined"
        dense
        class="mb-4"
      />
      <VCombobox
        v-model="form.prerequisites"
        label="Prerequisites (Russian)"
        variant="outlined"
        dense
        multiple
        chips
        class="mb-4"
        hint="Press Enter to add a prerequisite"
      />
      <VCombobox
        v-model="form.learningOutcomes"
        label="Learning Outcomes (Russian)"
        variant="outlined"
        dense
        multiple
        chips
        class="mb-4"
        hint="Press Enter to add an outcome"
      />
    </VCardText>

    <VCardActions class="px-6 justify-start">
      <VBtn
        color="primary"
        variant="flat"
        :disabled="!isFormValid"
        :prepend-icon="isEditMode ? 'tabler-pencil' : 'tabler-plus'"
        class="px-4"
        @click="handleSubmit"
      >
        {{ isEditMode ? 'Update' : 'Add' }} Russian Translation
      </VBtn>
    </VCardActions>
  </VCard>
</template>
