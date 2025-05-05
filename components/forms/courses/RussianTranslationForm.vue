<script setup>
import { useCoursesStore } from '@/stores/useCoursesStore'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const coursesStore = useCoursesStore()

const form = ref({
  courseId: route.params.id, 
  language: 'ru', 
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

  loading.value = true
  try {
    if (isEditMode.value) {
      const result = await coursesStore.editTranslation({
        translationId: coursesStore.course.translations.ru.id,
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

      console.log(result)

      if (!result.success) {
        showSnackbar(result.message || 'Error updating translation', 'error')

        return
      }
      showSnackbar('Russian translation updated successfully!', 'success')
    } else {
      const result = await coursesStore.addTranslation({
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

      if (result.success && result.translation && result.translation.id) {
        form.value.translationId = result.translation.id
      }

      if (!result.success) {
        showSnackbar(result.message || 'Error adding translation', 'error')
        
        return
      }
      showSnackbar('Russian translation added successfully!', 'success')
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
        {{ isEditMode ? 'Update' : 'Add' }} Russian Translation
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
