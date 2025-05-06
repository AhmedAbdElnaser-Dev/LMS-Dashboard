<script setup>
import { useLessonsStore } from '@/stores/useLessonsStore'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const lessonsStore = useLessonsStore()
const route = useRoute()

const isEditMode = computed(() => route.path.includes('edit'))
const lessonId = computed(() => route.params.id)

const form = ref({
  title: '',
  description: '',
})

const isTouched = ref({
  title: false,
  description: false,
})

const isLoading = ref(false)

watch(
  () => isEditMode.value,
  async editing => {
    if (editing && lessonId.value) {
      try {
        const lesson = lessonsStore.lesson

        form.value.title = lesson?.title || ''
        form.value.description = lesson?.description || ''
      } catch (error) {
        console.error('Failed to fetch lesson data:', error)
      }
    }
  },
  { immediate: true },
)

const isFormValid = computed(() =>
  form.value.title.trim() !== '' && form.value.description.trim() !== '',
)

function resetForm() {
  form.value.title = ''
  form.value.description = ''
  isTouched.value.title = false
  isTouched.value.description = false
}

const handleSubmit = async () => {
  isTouched.value.title = true
  isTouched.value.description = true

  if (!isFormValid.value) return

  const lessonData = {
    title: form.value.title,
    description: form.value.description,
  }

  try {
    isLoading.value = true

    if (isEditMode.value) {
      await lessonsStore.updateLesson(lessonId.value, lessonData)

      // Optionally show a snackbar: "Lesson updated successfully"
    } else {
      const courseId = route.params.id

      await lessonsStore.addLesson(lessonData, courseId)

      // ✅ Reset only after successful add
      resetForm()

      // Optionally show a snackbar: "Lesson added successfully"
    }
  } catch (err) {
    console.error('Error submitting form:', err)

    // Optionally show a snackbar: "Error occurred: " + err.message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <VCard class="shadow-lg rounded-lg py-6">
    <VCardTitle class="text-h4 font-weight-bold text-center mb-6">
      {{ isEditMode ? 'Edit Lesson' : 'Add Lesson' }}
    </VCardTitle>

    <VCardText class="pa-6">
      <VRow>
        <VCol cols="6">
          <VTextField
            v-model="form.title"
            label="Lesson Title"
            variant="outlined"
            dense
            required
            class="mb-4"
            :disabled="isLoading"
            :error="isTouched.title && !form.title.trim()"
            :error-messages="isTouched.title && !form.title.trim() ? ['Title is required'] : []"
            @blur="isTouched.title = true"
          />
        </VCol>

        <VCol cols="6">
          <VTextField
            v-model="form.description"
            label="Lesson Description"
            variant="outlined"
            dense
            required
            class="mb-4"
            :disabled="isLoading"
            :error="isTouched.description && !form.description.trim()"
            :error-messages="isTouched.description && !form.description.trim() ? ['Description is required'] : []"
            @blur="isTouched.description = true"
          />
        </VCol>
      </VRow>
    </VCardText>

    <VCardActions class="px-6 justify-start">
      <VBtn
        color="primary"
        variant="flat"
        :disabled="!isFormValid || isLoading"
        :loading="isLoading"
        :prepend-icon="isEditMode ? 'tabler-pencil' : 'tabler-plus'"
        class="px-4"
        @click="handleSubmit"
      >
        {{ isEditMode ? 'Update' : 'Add' }} Lesson
      </VBtn>
    </VCardActions>
  </VCard>
</template>
