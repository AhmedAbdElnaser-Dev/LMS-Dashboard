<script setup>
import { useUnitsStore } from '@/stores/useUnitsStore'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const unitsStore = useUnitsStore()
const route = useRoute()

const isEditMode = computed(() => route.path.includes('edit'))
const unitId = computed(() => route.params.id)

const form = ref({
  name: '',
})

const isTouched = ref({
  name: false,
})

const isLoading = ref(false)

watch(
  () => isEditMode.value,
  async editing => {
    if (editing && unitId.value) {
      try {
        const unit = unitsStore.unit

        form.value.name = unit.name || ''
      } catch (error) {
        console.error('Failed to fetch unit data:', error)
      }
    }
  },
  { immediate: true },
)

const isFormValid = computed(() => form.value.name.trim() !== '')

const handleSubmit = async () => {
  isTouched.value.name = true
  if (!isFormValid.value) return

  const unitData = { name: form.value.name }

  try {
    isLoading.value = true

    if (isEditMode.value) {
      await unitsStore.updateUnit(unitId.value, unitData)
    } else {
      console.log('Adding new unit:', courseId)

      await unitsStore.addUnit(unitData)
      form.value.name = ''
      isTouched.value.name = false
    }
  } catch (err) {
    console.error('Error submitting form:', err)
  } finally {
    isLoading.value = false
  }
}
</script>


<template>
  <VCard class="shadow-lg rounded-lg py-6">
    <VCardTitle class="text-h4 font-weight-bold text-center mb-6">
      {{ isEditMode ? 'Edit Unit' : 'Add Unit' }}
    </VCardTitle>

    <VCardText class="pa-6">
      <VRow>
        <VCol cols="12">
          <VTextField
            v-model="form.name"
            label="Unit Name"
            variant="outlined"
            dense
            required
            class="mb-4"
            :error="isTouched.name && !form.name.trim()"
            :error-messages="isTouched.name && !form.name.trim() ? ['Name is required'] : []"
            @blur="isTouched.name = true"
          />
        </VCol>
      </VRow>
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
        {{ isEditMode ? 'Update' : 'Add' }} Unit
      </VBtn>
    </VCardActions>
  </VCard>
</template>
