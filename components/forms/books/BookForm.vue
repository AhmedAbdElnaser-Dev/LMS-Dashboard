<script setup>
import { useBooksStore } from '@/stores/bookStore';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import {
  VBtn, VCard, VCardActions, VCardText, VCardTitle,
  VCol, VFileInput, VRow, VTextField
} from 'vuetify/components';

const booksStore = useBooksStore();
const route = useRoute();

// Check if the current route includes "edit"
const isEditMode = computed(() => route.path.includes('edit'));

const form = ref({
  name: '',
  pdf: null,
  pic: null
});

const isTouched = ref({
  name: false,
  pdf: false,
  pic: false
});

// Watch selectedBook only when in edit mode
watch(() => isEditMode.value, (editing) => {
  if (editing && booksStore.selectedBook) {
    form.value = {
      name: booksStore.selectedBook.name || '',
      pdf: null,
      pic: null
    };
  }
}, { immediate: true });

const isFormValid = computed(() => {
  return form.value.name.trim() !== '' &&
         form.value.pdf instanceof File &&
         form.value.pic instanceof File;
});

const handleFileChange = (event, type) => {
  const file = event.target.files[0];
  if (!file) return;

  if (type === 'pdf' && file.type !== 'application/pdf') {
    form.value.pdf = null;
    alert('Please select a valid PDF file.');
  } else if (type === 'pic' && !file.type.startsWith('image/')) {
    form.value.pic = null;
    alert('Please select a valid image file.');
  } else {
    form.value[type] = file;
  }
};

const handleSubmit = () => {
  isTouched.value.name = true;
  isTouched.value.pdf = true;
  isTouched.value.pic = true;

  if (isFormValid.value) {
    if (isEditMode.value) {
      console.log('Updating book:', form.value);
    } else {
      booksStore.addBook({
        name: form.value.name,
        pdfFile: form.value.pdf,
        picFile: form.value.pic
      });
    }
  }
};
</script>

<template>
  <VCard class="shadow-lg rounded-lg py-6">
    <VCardTitle class="text-h4 font-weight-bold text-center mb-6">
      {{ isEditMode ? 'Edit Book' : 'Add Book' }}
    </VCardTitle>

    <VCardText class="pa-6">
      <VRow>
        <VCol cols="12" md="6">
          <VTextField
            v-model="form.name"
            label="Book Name"
            variant="outlined"
            dense
            required
            class="mb-4"
            :error="isTouched.name && !form.name.trim()"
            :error-messages="isTouched.name && !form.name.trim() ? ['This field is required'] : []"
            @blur="isTouched.name = true"
          />
        </VCol>

        <VCol cols="12" md="6">
          <VFileInput
            label="Book PDF"
            variant="outlined"
            dense
            accept=".pdf"
            required
            class="mb-4"
            :error="isTouched.pdf && !form.pdf"
            :error-messages="isTouched.pdf && !form.pdf ? ['PDF file is required'] : []"
            @change="(event) => handleFileChange(event, 'pdf')"
          />
        </VCol>

        <VCol cols="12" md="6">
          <VFileInput
            label="Book Picture"
            variant="outlined"
            dense
            accept="image/*"
            required
            class="mb-4"
            :error="isTouched.pic && !form.pic"
            :error-messages="isTouched.pic && !form.pic ? ['Image file is required'] : []"
            @change="(event) => handleFileChange(event, 'pic')"
          />
        </VCol>
      </VRow>
    </VCardText>

    <VCardActions class="px-6 justify-start">
      <VBtn
        color="primary"
        variant="flat"
        @click="handleSubmit"
        :disabled="!isFormValid"
        :prepend-icon="isEditMode ? 'tabler-pencil' : 'tabler-plus'"
        class="px-4"
      >
        {{ isEditMode ? 'Update' : 'Add' }} Book
      </VBtn>
    </VCardActions>
  </VCard>
</template>
