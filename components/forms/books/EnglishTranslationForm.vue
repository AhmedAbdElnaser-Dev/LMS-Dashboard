<script setup>
import { useBooksStore } from '@/stores/useBookStore'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const booksStore = useBooksStore()

// Loading state for async operations
const isLoading = ref(false)

// Form state
const form = ref({
  name: '',
  description: '',
})

// Track touched state for validation
const isTouched = ref({
  name: false,
  description: false,
})

// Determine edit mode based on Englush translation existence
const isEditMode = computed(() => {
  const enTranslation = booksStore.selectedBook?.translations?.en

  return enTranslation && enTranslation.name !== ''
})

// Fetch book data on mount if needed
onMounted(async () => {
  if (!booksStore.selectedBook && route.params.id) {
    try {
      isLoading.value = true
      await booksStore.fetchBookById(route.params.id)
    } catch (err) {
      console.error('Error fetching book:', err)
    } finally {
      isLoading.value = false
    }
  }

  const enTranslation = booksStore.selectedBook?.translations?.en

  form.value.name = enTranslation?.name || ''
  form.value.description = enTranslation?.description || ''
})

// Form validation
const isFormValid = computed(
  () => form.value.name.trim() !== '' && form.value.description.trim() !== '',
)

// Handle form submission
const handleSubmit = async () => {
  isTouched.value.name = true
  isTouched.value.description = true

  if (!isFormValid.value) return

  try {
    isLoading.value = true
    await booksStore.submitTranslation({
      language: 'en',
      name: form.value.name,
      description: form.value.description,
    })

    // Optionally reset form in add mode
    if (!isEditMode.value) {
      form.value = { name: '', description: '' }
      isTouched.value = { name: false, description: false }
    }
  } catch (err) {
    console.error('Error submitting translation:', err)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <VCard class="shadow-lg rounded-lg py-6">
    <VCardTitle class="text-h4 font-weight-bold text-center mb-6">
      {{ isEditMode ? 'Edit English Translation' : 'Add English Translation' }}
    </VCardTitle>

    <VCardText class="pa-6">
      <VTextField
        v-model="form.name"
        label="Book Name (English)"
        variant="outlined"
        dense
        required
        class="mb-4"
        :disabled="isLoading"
        :error="isTouched.name && !form.name.trim()"
        :error-messages="isTouched.name && !form.name.trim() ? ['This field is required'] : []"
        @blur="isTouched.name = true"
      />
      <VTextField
        v-model="form.description"
        label="Description (English)"
        variant="outlined"
        dense
        required
        class="mb-4"
        :disabled="isLoading"
        :error="isTouched.description && !form.description.trim()"
        :error-messages="isTouched.description && !form.description.trim() ? ['This field is required'] : []"
        @blur="isTouched.description = true"
      />
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
        {{ isEditMode ? 'Update' : 'Add' }} Translation
      </VBtn>
    </VCardActions>
  </VCard>
</template>
