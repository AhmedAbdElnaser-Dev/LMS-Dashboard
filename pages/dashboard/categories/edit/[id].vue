<script setup>
import ArabicTranslationForm from "@/components/forms/books/ArabicTranslationForm.vue"
import BookForm from "@/components/forms/books/BookForm.vue"
import EnglishTranslationForm from "@/components/forms/books/EnglishTranslationForm.vue"
import RussianTranslationForm from "@/components/forms/books/RussianTranslationForm.vue"
import EditOutline from "@/components/forms/EditOutline.vue"
import { useBooksStore } from "@/stores/useBookStore"
import { onMounted } from "vue"
import { useRoute } from "vue-router"
import { VCard } from "vuetify/components"

const route = useRoute()
const store = useBooksStore()
const bookId = route.params.id

// Fetch book on mount
onMounted(async () => {
  if (bookId) {
    store.fetchBookById(bookId)
  }
})

// Forms
const basicInfo = BookForm
const arabicTranslation = ArabicTranslationForm
const englishTranslation = EnglishTranslationForm
const russianTranslation = RussianTranslationForm
</script>

<template>
  <VCard v-if="!store.loading">
    <EditOutline
      :basic-info-form="basicInfo"
      :arabic-form="arabicTranslation"
      :english-form="englishTranslation"
      :russian-form="russianTranslation"
    />
  </VCard>
</template>
