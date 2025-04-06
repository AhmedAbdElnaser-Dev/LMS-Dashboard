<script setup>
import ArabicTranslationForm from "@/components/forms/books/ArabicTranslationForm.vue";
import BookForm from "@/components/forms/books/BookForm.vue";
import EnglishTranslationForm from "@/components/forms/books/EnglishTranslationForm.vue";
import RussianTranslationForm from "@/components/forms/books/RussianTranslationForm.vue";
import EditOutline from "@/components/forms/EditOutline.vue";
import { useBooksStore } from "@/stores/bookStore";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { VCard } from "vuetify/components";

const route = useRoute();
const store = useBooksStore();
const bookId = route.params.id;

// Fetch book on mount
onMounted(async () => {
  if (bookId) {
    store.fetchBookById(bookId);
  }
});

// Forms
const basicInfo = BookForm;
const arabicTranslation = ArabicTranslationForm;
const englishTranslation = EnglishTranslationForm;
const russianTranslation = RussianTranslationForm;
</script>

<template>
  <VCard v-if="!store.loading">
    <EditOutline
      :basicInfoForm="basicInfo"
      :arabicForm="arabicTranslation"
      :englishForm="englishTranslation"
      :russianForm="russianTranslation"
    />
  </VCard>
</template>
