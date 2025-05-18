<script setup>
import { useCategoriesStore } from '@/stores/useCategoryStore'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const categoriesStore = useCategoriesStore()
const route = useRoute()

const isEditMode = computed(() => route.path.includes('edit'))

const form = ref({
  name: '',
})

const isTouched = ref({
  name: false,
})

const isLoading = ref(false)

watch(() => isEditMode.value, editing => {
  if (editing && categoriesStore.selectedCategory) {
    form.value = {
      name: categoriesStore.selectedCategory.name || '',
    }
  }
}, { immediate: true })

const isFormValid = computed(() => {
  return form.value.name.trim() !== ''
})

const handleSubmit = async () => {
  isTouched.value.name = true
  if (!isFormValid.value) return

  try {
    isLoading.value = true

    if (isEditMode.value) {
      await categoriesStore.updateCategory({
        id: route.params.id,
        name: form.value.name,
      })
    } else {
      await categoriesStore.addCategory({
        name: form.value.name,
      })

      form.value = { name: '' }
      isTouched.value = { name: false }
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
      {{ isEditMode ? 'Edit Category' : 'Add Category' }}
    </VCardTitle>

    <VCardText class="pa-6">
      <VRow>
        <VCol cols="12">
          <VTextField
            v-model="form.name"
            label="Category Name"
            variant="outlined"
            dense
            required
            class="mb-4"
            :disabled="isLoading"
            :error="isTouched.name && !form.name.trim()"
            :error-messages="isTouched.name && !form.name.trim() ? ['This field is required'] : []"
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
        {{ isEditMode ? 'Update' : 'Add' }} Category
      </VBtn>
    </VCardActions>
  </VCard>
</template>
