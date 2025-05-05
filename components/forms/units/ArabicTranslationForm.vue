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

const isEditMode = computed(() => {
  const arTranslation = unitsStore.unit?.translations?.ar

  return arTranslation && arTranslation.name !== ''
})

onMounted(async () => {
  if (!unitsStore.unit && route.params.id) {
    await unitsStore.getUnit(route.params.id)
  }

  const arTranslation = unitsStore.unit?.translations?.ar

  form.value.name = arTranslation?.name || ''
})

const isFormValid = computed(() => form.value.name.trim() !== '')

const handleSubmit = async () => {
  isTouched.value = true

  if (isFormValid.value) {
    try {
      await unitsStore.submitTranslation({
        language: 'ar',
        name: form.value.name,
      })
    } catch (error) {
      console.error('Submit failed:', error)
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
        :error="isTouched && !form.name.trim()"
        :error-messages="isTouched && !form.name.trim() ? ['This field is required'] : []"
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
