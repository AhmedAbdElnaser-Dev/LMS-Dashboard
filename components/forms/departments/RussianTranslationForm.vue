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
const isLoading = ref(false)

const isEditMode = computed(() => {
  const ruTranslation = departmentsStore.department?.translations?.ru

  return ruTranslation && ruTranslation.name !== ''
})

onMounted(() => {
  const ruTranslation = departmentsStore.department?.translations?.ru

  form.value.name = ruTranslation?.name || ''
})

const isFormValid = computed(() => form.value.name.trim() !== '')

const handleSubmit = async () => {
  isTouched.value = true
  if (!isFormValid.value) return

  isLoading.value = true
  try {
    await departmentsStore.submitTranslation({
      language: 'ru',
      name: form.value.name,
    })
  } catch (error) {
    console.error('Translation submission failed:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <VCard class="shadow-lg rounded-lg py-6">
    <VCardText class="pa-6">
      <VTextField
        v-model="form.name"
        label="Department Name (Russian)"
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
