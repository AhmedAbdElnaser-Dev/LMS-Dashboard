<script setup>
import { useCoursesStore } from '@/stores/useCoursesStore'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

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
const loading = ref(false)
const snackbar = ref({ show: false, text: '', color: 'success' })

function showSnackbar(message, color = 'success') {
  snackbar.value.text = message
  snackbar.value.color = color
  snackbar.value.show = true
}

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

  loading.value = true
  try {
    if (isEditMode.value) {
      const result = await coursesStore.editTranslation({
        translationId: coursesStore.course.translations.ar.id,
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

      if (!result.success) {
        showSnackbar(result.message || 'Error updating translation', 'error')

        return
      }
      showSnackbar('Arabic translation updated successfully!', 'success')
    } else {
      const result = await coursesStore.addTranslation({
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

      if (result.success && result.translation && result.translation.id) {
        form.value.translationId = result.translation.id
      }

      if (!result.success) {
        showSnackbar(result.message || 'Error adding translation', 'error')
        
        return
      }
      showSnackbar('Arabic translation added successfully!', 'success')
    }
  } catch (error) {
    showSnackbar(error?.message || `Error submitting translation`, 'error')
  } finally {
    loading.value = false
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
        :disabled="!isFormValid || loading"
        :prepend-icon="!loading ? (isEditMode ? 'tabler-pencil' : 'tabler-plus') : ''"
        class="px-4"
        @click="handleSubmit"
      >
        <template v-if="loading">
          <VProgressCircular
            indeterminate
            size="20"
            color="white"
          />
        </template>
        {{ isEditMode ? 'Update' : 'Add' }} Translation
      </VBtn>
      <VSnackbar
        v-model="snackbar.show"
        :color="snackbar.color"
        timeout="3000"
        location="bottom left"
      >
        {{ snackbar.text }}
      </VSnackbar>
    </VCardActions>
  </VCard>
</template>
