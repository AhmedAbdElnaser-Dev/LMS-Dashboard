<script setup>
import { useUnitsStore } from '@/stores/useUnitsStore'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const unitsStore = useUnitsStore()

const form = ref({
  name: '',
})

const isTouched = ref(false)
const isLoading = ref(false)

const isEditMode = computed(() => {
  const arTranslation = unitsStore.unit?.translations.find(
    translation => translation.language === 'ar',
  )

  return arTranslation && arTranslation.name !== ''
})

onMounted(async () => {
  if (!unitsStore.unit && route.params.id) {
    await unitsStore.getUnit(route.params.id)
  }

  const arTranslation = unitsStore.unit?.translations?.find(
    translation => translation.language === 'ar',
  )

  if (!arTranslation) {
    return
  }

  form.value.name = arTranslation.name || ''
  isTouched.value = true
})

const isFormValid = computed(() => form.value.name.trim() !== '')

const handleSubmit = async () => {
  isTouched.value = true

  if (isFormValid.value) {
    try {
      isLoading.value = true

      await unitsStore.submitTranslation({
        language: 'ar',
        name: form.value.name,
      })

      // Optionally reset form after success
      // form.value.name = ''
      // isTouched.value = false
    } catch (error) {
      console.error('Submit failed:', error)
    } finally {
      isLoading.value = false
    }
  }
}
</script>

<template>
  <VCard class="shadow-lg rounded-lg py-6">
    <VCardText class="pa-6">
      <VTextField
        v-model="form.name"
        label="Unit Name (Arabic)"
        variant="outlined"
        dense
        required
        class="mb-4"
        :disabled="isLoading"
        :error="isTouched && !form.name.trim()"
        :error-messages="isTouched && !form.name.trim() ? ['This field is required'] : []"
        @blur="isTouched = true"
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
