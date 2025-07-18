<script setup>
import { useDepartmentsStore } from '@/stores/useDepartmentsStore'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const departmentsStore = useDepartmentsStore()

const form = ref({
  name: '',
})

const isTouched = ref(false)
const isLoading = ref(false) // Added loading state

const isEditMode = computed(() => {
  const arTranslation = departmentsStore.department?.translations?.ar

  return arTranslation && arTranslation.name !== ''
})

onMounted(() => {
  const arTranslation = departmentsStore.department?.translations?.ar

  form.value.name = arTranslation?.name || ''
})

const isFormValid = computed(() => form.value.name.trim() !== '')

const handleSubmit = async () => {
  isTouched.value = true
  if (!isFormValid.value) return

  isLoading.value = true // Start loading
  try {
    await departmentsStore.submitTranslation({
      language: 'ar',
      name: form.value.name,
    })
  } catch (error) {
    console.error('Translation submission failed:', error)
  } finally {
    isLoading.value = false // End loading
  }
}
</script>

<template>
  <VCard class="shadow-lg rounded-lg py-6">
    <VCardText class="pa-6">
      <VTextField
        v-model="form.name"
        label="Department Name (Arabic)"
        variant="outlined"
        dense
        required
        class="mb-4"
        :error="isTouched && !form.name.trim()"
        :error-messages="isTouched && !form.name.trim() ? ['This field is required'] : []"
        :disabled="isLoading"
        @blur="isTouched = true"
      />
    </VCardText>

    <VCardActions class="px-6 justify-start">
      <VBtn
        color="primary"
        variant="flat"
        :disabled="!isFormValid || isLoading"
        :prepend-icon="isEditMode ? 'tabler-pencil' : 'tabler-plus'"
        :loading="isLoading"
        class="px-4"
        @click="handleSubmit"
      >
        {{ isEditMode ? 'Update' : 'Add' }} Translation
      </VBtn>
    </VCardActions>
  </VCard>
</template>
