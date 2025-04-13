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
  language: 'en', // Set to English
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

// Determine if we're in edit mode based on the English translation's name
const isEditMode = computed(() => {
  const enTranslation = coursesStore.course?.translations?.en
  
  return enTranslation && enTranslation.name !== '' && enTranslation.name !== null
})

// Fill form with existing English translation data if available
onMounted(() => {
  const enTranslation = coursesStore.course?.translations?.en
  if (enTranslation) {
    form.value = {
      ...form.value,
      name: enTranslation.name || '',
      urlPic: enTranslation.urlPic || '',
      description: enTranslation.description || '',
      about: enTranslation.about || '',
      demoUrl: enTranslation.demoUrl || '',
      title: enTranslation.title || '',
      prerequisites: enTranslation.prerequisites || [],
      learningOutcomes: enTranslation.learningOutcomes || [],
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
        translationId: coursesStore.course.translations.en.id, // Assumes translation has an ID
        language: 'en',
        name: form.value.name,
        urlPic: form.value.urlPic,
        description: form.value.description,
        about: form.value.about,
        demoUrl: form.value.demoUrl,
        title: form.value.title,
        prerequisites: form.value.prerequisites,
        learningOutcomes: form.value.learningOutcomes,
      })
      alert('English translation updated successfully!')
    } else {
      // Add mode
      await coursesStore.addTranslation({
        courseId: form.value.courseId,
        language: 'en',
        name: form.value.name,
        urlPic: form.value.urlPic,
        description: form.value.description,
        about: form.value.about,
        demoUrl: form.value.demoUrl,
        title: form.value.title,
        prerequisites: form.value.prerequisites,
        learningOutcomes: form.value.learningOutcomes,
      })
      alert('English translation added successfully!')
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
        label="Course Name (English)"
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
        label="Title (English)"
        variant="outlined"
        dense
        class="mb-4"
      />
      <VTextField
        v-model="form.urlPic"
        label="Picture URL (English)"
        variant="outlined"
        dense
        class="mb-4"
      />
      <VTextarea
        v-model="form.description"
        label="Description (English)"
        variant="outlined"
        dense
        class="mb-4"
      />
      <VTextarea
        v-model="form.about"
        label="About (English)"
        variant="outlined"
        dense
        class="mb-4"
      />
      <VTextField
        v-model="form.demoUrl"
        label="Demo URL (English)"
        variant="outlined"
        dense
        class="mb-4"
      />
      <VCombobox
        v-model="form.prerequisites"
        label="Prerequisites (English)"
        variant="outlined"
        dense
        multiple
        chips
        class="mb-4"
        hint="Press Enter to add a prerequisite"
      />
      <VCombobox
        v-model="form.learningOutcomes"
        label="Learning Outcomes (English)"
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
        {{ isEditMode ? 'Update' : 'Add' }} English Translation
      </VBtn>
    </VCardActions>
  </VCard>
</template>
