<script setup>
import { useCategoriesStore } from '@/stores/useCategoryStore'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const categoriesStore = useCategoriesStore()

// Loading state
const isLoading = ref(false)

// Form state
const form = ref({
  name: '',
})

// Track touched state
const isTouched = ref({
  name: false,
})

// Check if we're editing existing English translation
const isEditMode = computed(() => {
  const enTranslation = categoriesStore.selectedCategory?.translations?.en

  return enTranslation && enTranslation.name !== ''
})

// Load category data if needed
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

  // Pre-fill form if English translation exists
  const enTranslation = categoriesStore.selectedCategory?.translations?.en

  form.value.name = enTranslation?.name || ''
})

// Form validation
const isFormValid = computed(() => form.value.name.trim() !== '')

// Submit handler
const handleSubmit = async () => {
  isTouched.value.name = true

  if (!isFormValid.value) return

  try {
    isLoading.value = true
    await categoriesStore.submitTranslation({
      language: 'en', // English
      name: form.value.name,
    })

    // Reset form if in add mode
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
      {{ isEditMode ? 'Edit English Name' : 'Add English Name' }}
    </VCardTitle>

    <VCardText class="pa-6">
      <VTextField
        v-model="form.name"
        label="Category Name (English)"
        variant="outlined"
        dense
        required
        class="mb-4"
        :disabled="isLoading"
        :error="isTouched.name && !form.name.trim()"
        :error-messages="isTouched.name && !form.name.trim() ? ['Name is required'] : []"
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
        {{ isEditMode ? 'Update' : 'Save' }} English Name
      </VBtn>
    </VCardActions>
  </VCard>
</template>
