<script setup>
import { useBooksStore } from '@/stores/useBookStore'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { VBtn, VCard, VCardActions, VCardText, VTextField } from 'vuetify/components'

const route = useRoute()
const booksStore = useBooksStore()

const form = ref({
  name: '',
  description: '',
})

const isTouched = ref(false)

const isEditMode = computed(() => {
  const ruTranslation = booksStore.selectedBook?.translations?.ru
  
  return ruTranslation && ruTranslation.name !== ''
})

onMounted(async () => {
  if (!booksStore.selectedBook && route.params.id) {
    await booksStore.fetchBookById(route.params.id)
  }

  const ruTranslation = booksStore.selectedBook?.translations?.ru

  form.value.name = ruTranslation?.name || ''
  form.value.description = ruTranslation?.description || ''
})

const isFormValid = computed(
  () => form.value.name.trim() !== '' && form.value.description.trim() !== '',
)

const handleSubmit = async () => {
  isTouched.value = true
  if (isFormValid.value) {
    await booksStore.submitTranslation({
      language: 'ru',
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
        label="Book Name (Russian)"
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
        label="Description (Russian)"
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
