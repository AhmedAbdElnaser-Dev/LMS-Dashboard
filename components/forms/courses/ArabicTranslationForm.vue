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
  language: 'ar',
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

// Determine if we're in edit mode based on the Arabic translation's name
const isEditMode = computed(() => {
  const arTranslation = coursesStore.course?.translations?.ar
  
  return arTranslation && arTranslation.name !== '' && arTranslation.name !== null
})

// Fill form with existing Arabic translation data if available
onMounted(() => {
  const arTranslation = coursesStore.course?.translations?.ar
  if (arTranslation) {
    form.value = {
      ...form.value,
      name: arTranslation.name || '',
      urlPic: arTranslation.urlPic || '',
      description: arTranslation.description || '',
      about: arTranslation.about || '',
      demoUrl: arTranslation.demoUrl || '',
      title: arTranslation.title || '',
      prerequisites: arTranslation.prerequisites || [],
      learningOutcomes: arTranslation.learningOutcomes || [],
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
        translationId: coursesStore.course.translations.ar.id, // Assumes translation has an ID
        language: 'ar',
        name: form.value.name,
        urlPic: form.value.urlPic,
        description: form.value.description,
        about: form.value.about,
        demoUrl: form.value.demoUrl,
        title: form.value.title,
        prerequisites: form.value.prerequisites,
        learningOutcomes: form.value.learningOutcomes,
      })
      alert('Translation updated successfully!')
    } else {
      // Add mode
      await coursesStore.addTranslation({
        courseId: form.value.courseId,
        language: 'ar',
        name: form.value.name,
        urlPic: form.value.urlPic,
        description: form.value.description,
        about: form.value.about,
        demoUrl: form.value.demoUrl,
        title: form.value.title,
        prerequisites: form.value.prerequisites,
        learningOutcomes: form.value.learningOutcomes,
      })
      alert('Translation added successfully!')
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
        label="Course Name (Arabic)"
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
        label="Title (Arabic)"
        variant="outlined"
        dense
        class="mb-4"
      />
      <VTextField
        v-model="form.urlPic"
        label="Picture URL (Arabic)"
        variant="outlined"
        dense
        class="mb-4"
      />
      <VTextarea
        v-model="form.description"
        label="Description (Arabic)"
        variant="outlined"
        dense
        class="mb-4"
      />
      <VTextarea
        v-model="form.about"
        label="About (Arabic)"
        variant="outlined"
        dense
        class="mb-4"
      />
      <VTextField
        v-model="form.demoUrl"
        label="Demo URL (Arabic)"
        variant="outlined"
        dense
        class="mb-4"
      />
      <VCombobox
        v-model="form.prerequisites"
        label="Prerequisites (Arabic)"
        variant="outlined"
        dense
        multiple
        chips
        class="mb-4"
        hint="Press Enter to add a prerequisite"
      />
      <VCombobox
        v-model="form.learningOutcomes"
        label="Learning Outcomes (Arabic)"
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
        {{ isEditMode ? 'Update' : 'Add' }} Translation
      </VBtn>
    </VCardActions>
  </VCard>
</template>
