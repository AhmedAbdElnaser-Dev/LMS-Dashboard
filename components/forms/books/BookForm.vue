<script setup>
import { useBooksStore } from '@/stores/useBookStore'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const booksStore = useBooksStore()
const route = useRoute()

const isEditMode = computed(() => route.path.includes('edit'))

const form = ref({
  name: '',
  pdf: [],
  pic: [],
})

const isTouched = ref({
  name: false,
  pdf: false,
  pic: false,
})

const isLoading = ref(false)

watch(() => isEditMode.value, editing => {
  if (editing && booksStore.selectedBook) {
    form.value = {
      name: booksStore.selectedBook.name || '',
      pdf: [],
      pic: [],
    }

    isTouched.value.pdf = false
    isTouched.value.pic = false
  }
}, { immediate: true })

const isFormValid = computed(() => {
  if (isEditMode.value) {
    return form.value.name.trim() !== ''
  }

  return form.value.name.trim() !== '' &&
         form.value.pdf.length === 1 && form.value.pdf[0] instanceof File &&
         form.value.pic.length === 1 && form.value.pic[0] instanceof File
})

const handleSubmit = async () => {
  isTouched.value.name = true
  if (!isEditMode.value) {
    isTouched.value.pdf = true
    isTouched.value.pic = true
  }

  if (!isFormValid.value) return

  try {
    isLoading.value = true

    if (isEditMode.value) {
      await booksStore.updateBook(route.params.id, {
        name: form.value.name,
      })

    } else {
      const formData = new FormData()

      formData.append('Name', form.value.name)
      formData.append('PdfFile', form.value.pdf[0])
      formData.append('PicFile', form.value.pic[0])

      await booksStore.addBook(formData)

      form.value = { name: '', pdf: [], pic: [] }
      isTouched.value = { name: false, pdf: false, pic: false }

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
      {{ isEditMode ? 'Edit Book' : 'Add Book' }}
    </VCardTitle>

    <VCardText class="pa-6">
      <VRow>
        <VCol
          cols="12"
          md="6"
        >
          <VTextField
            v-model="form.name"
            label="Book Name"
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

        <VCol
          v-if="!isEditMode"
          cols="12"
          md="6"
        >
          <VFileInput
            v-model="form.pdf"
            label="Book PDF"
            variant="outlined"
            dense
            accept="application/pdf"
            required
            class="mb-4"
            :disabled="isLoading"
            :error="isTouched.pdf && form.pdf.length === 0"
            :error-messages="isTouched.pdf && form.pdf.length === 0 ? ['PDF file is required'] : []"
            :rules="[
              v => v.length === 0 || v[0].type === 'application/pdf' || 'Only PDF files are allowed',
              v => v.length === 0 || v[0].size < 5 * 1024 * 1024 || 'File size must be less than 5MB',
            ]"
          />
        </VCol>

        <VCol
          v-if="!isEditMode"
          cols="12"
          md="6"
        >
          <VFileInput
            v-model="form.pic"
            label="Book Picture"
            variant="outlined"
            dense
            accept="image/jpeg,image/png,image/gif"
            required
            class="mb-4"
            :disabled="isLoading"
            :error="isTouched.pic && form.pic.length === 0"
            :error-messages="isTouched.pic && form.pic.length === 0 ? ['Image file is required'] : []"
            :rules="[
              v => v.length === 0 || ['image/jpeg', 'image/png', 'image/gif'].includes(v[0].type) || 'Only JPEG, PNG, or GIF files are allowed',
              v => v.length === 0 || v[0].size < 5 * 1024 * 1024 || 'File size must be less than 5MB',
            ]"
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
        {{ isEditMode ? 'Update' : 'Add' }} Book
      </VBtn>
    </VCardActions>
  </VCard>
</template>
