<script setup>
import { useCategoriesStore } from '@/stores/useCategoryStore'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const categoriesStore = useCategoriesStore()

// Loading state for async operations
const isLoading = ref(false)

// Form state
const form = ref({
  name: '',
})

// Track touched state for validation
const isTouched = ref({
  name: false,
})

// Determine edit mode based on Arabic translation existence
const isEditMode = computed(() => {
  const arTranslation = categoriesStore.selectedCategory?.translations?.ar

  return arTranslation && arTranslation.name !== ''
})

// Fetch category data on mount if needed
onMounted(async () => {
  if (!categoriesStore.selectedCategory && route.params.id) {
    try {
      isLoading.value = true
      await categoriesStore.fetchCategoryById(route.params.id)
    } catch (err) {
      console.error('Error fetching category:', err)
    } finally {
      isLoading.value = false
    }
  }

  const arTranslation = categoriesStore.selectedCategory?.translations?.ar

  form.value.name = arTranslation?.name || ''
})

// Form validation
const isFormValid = computed(() => form.value.name.trim() !== '')

// Handle form submission
const handleSubmit = async () => {
  isTouched.value.name = true

  if (!isFormValid.value) return

  try {
    isLoading.value = true
    await categoriesStore.submitTranslation({
      language: 'ar',
      name: form.value.name,
    })

    // Optionally reset form in add mode
    if (!isEditMode.value) {
      form.value = { name: '' }
      isTouched.value = { name: false }
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
      {{ isEditMode ? 'Edit Arabic Translation' : 'Add Arabic Translation' }}
    </VCardTitle>

    <VCardText class="pa-6">
      <VTextField
        v-model="form.name"
        label="Category Name (Arabic)"
        variant="outlined"
        dense
        required
        class="mb-4"
        :disabled="isLoading"
        :error="isTouched.name && !form.name.trim()"
        :error-messages="isTouched.name && !form.name.trim() ? ['This field is required'] : []"
        @blur="isTouched.name = true"
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
