<script setup>
import { useBooksStore } from '@/stores/useBookStore'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { VBtn, VCard, VCardActions, VCardText, VTextField } from 'vuetify/components'

const route = useRoute()
const booksStore = useBooksStore()

const form = ref({
  name: '',
  description: '', // Added description field
})

const isTouched = ref(false)

// Determine if we're adding or editing based on the English translation
const isEditMode = computed(() => {
  const enTranslation = booksStore.selectedBook?.translations?.en
  
  return enTranslation && enTranslation.name !== ''
})

onMounted(async () => {
  // Fetch book if not already loaded
  if (!booksStore.selectedBook && route.params.id) {
    await booksStore.fetchBookById(route.params.id)
  }

  // Populate form with English translation if it exists, otherwise leave empty
  const enTranslation = booksStore.selectedBook?.translations?.en

  form.value.name = enTranslation?.name || ''
  form.value.description = enTranslation?.description || ''
})

const isFormValid = computed(
  () => form.value.name.trim() !== '' && form.value.description.trim() !== '',
)

const handleSubmit = async () => {
  isTouched.value = true
  if (isFormValid.value) {
    await booksStore.submitTranslation({
      language: 'en',
      name: form.value.name,
      description: form.value.description,
    })
  }
}
</script>

<template>
  <VCard class="shadow-lg rounded-lg py-6">
    <VCardText class="pa-6">
      <VTextField
        v-model="form.name"
        label="Book Name (English)"
        variant="outlined"
        dense
        required
        class="mb-4"
        :error="isTouched && !form.name.trim()"
        :error-messages="isTouched && !form.name.trim() ? ['This field is required'] : []"
        @blur="isTouched = true"
      />
      <VTextField
        v-model="form.description"
        label="Description (English)"
        variant="outlined"
        dense
        required
        class="mb-4"
        :error="isTouched && !form.description.trim()"
        :error-messages="isTouched && !form.description.trim() ? ['This field is required'] : []"
        @blur="isTouched = true"
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
