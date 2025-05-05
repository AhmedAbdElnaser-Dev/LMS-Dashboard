<script setup>
import { useUnitsStore } from '@/stores/useUnitsStore'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const unitsStore = useUnitsStore()

const selectedLanguage = ref('en') // Default to English
const form = ref({ name: '' })
const isTouched = ref(false)

const isEditMode = computed(() => {
  const translation = unitsStore.unit?.translations?.[selectedLanguage.value]

  return translation && translation.name !== ''
})

const loadTranslation = () => {
  const translation = unitsStore.unit?.translations?.[selectedLanguage.value]

  form.value.name = translation?.name || ''
}

onMounted(async () => {
  if (!unitsStore.unit && route.params.id) {
    await unitsStore.fetchUnitById(route.params.id)
  }
  loadTranslation()
})

// Watch language change
watch(selectedLanguage, () => {
  isTouched.value = false
  loadTranslation()
})

const isFormValid = computed(() => form.value.name.trim() !== '')

const handleSubmit = async () => {
  isTouched.value = true

  if (isFormValid.value) {
    try {
      if (isEditMode.value) {
        await unitsStore.submitTranslation({
          language: selectedLanguage.value,
          name: form.value.name,
        })
      } else {
        await unitsStore.addTranslation({
          language: selectedLanguage.value,
          name: form.value.name,
        })
      }
    } catch (error) {
      console.error('Submit failed:', error)
    }
  }
}
</script>

<template>
  <VCard class="shadow-lg rounded-lg py-6">
    <VCardText class="pa-6">
      <div class="mb-4">
        <label class="font-bold text-sm mb-2 block">Language</label>
        <select
          v-model="selectedLanguage"
          class="w-full px-3 py-2 border rounded"
        >
          <option value="en">
            English
          </option>
          <option value="ar">
            Arabic
          </option>
          <option value="ru">
            Russian
          </option>
        </select>
      </div>

      <VTextField
        v-model="form.name"
        :label="`Unit Name (${selectedLanguage === 'en' ? 'English' : selectedLanguage === 'ar' ? 'Arabic' : 'Russian'})`"
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
