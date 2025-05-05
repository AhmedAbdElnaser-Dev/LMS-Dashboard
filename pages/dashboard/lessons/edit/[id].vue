<script setup>
import ArabicTranslationForm from '@/components/forms/books/ArabicTranslationForm.vue'
import BookForm from '@/components/forms/books/BookForm.vue'
import EnglishTranslationForm from '@/components/forms/books/EnglishTranslationForm.vue'
import EditOutline from '@/components/forms/EditOutline.vue'

const basicInfo = BookForm
const arabicTranslation = ArabicTranslationForm
const englishTranslation = EnglishTranslationForm
const russianTranslation = null
</script>

<template>
  <VCard>
    <EditOutline
      :basic-info-form="basicInfo"
      :arabic-form="arabicTranslation"
      :english-form="englishTranslation"
      :russian-form="russianTranslation"
    />
  </VCard>
</template>
