<script setup>
import EditOutline from '@/components/forms/EditOutline.vue'
import ArabicTranslationForm from '@/components/forms/lessons/ArabicTranslationForm.vue'
import EnglishTranslationForm from '@/components/forms/lessons/EnglishTranslationForm.vue'
import BookForm from '@/components/forms/lessons/LessonForm.vue'

const basicInfo = BookForm
const arabicTranslation = ArabicTranslationForm
const englishTranslation = EnglishTranslationForm
const russianTranslation = russianTranslation
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
