<script setup>
import BookForm from "@/components/forms/categories/CategoryForm.vue"
import EditOutline from "@/components/forms/EditOutline.vue"
import { useCategoriesStore } from "@/stores/useCategoryStore"
import { onMounted } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()
const store = useCategoriesStore()
const bookId = route.params.id

// Fetch book on mount
onMounted(async () => {
  if (bookId) {
    await store.fetchCategoryById(bookId)
  }
})

// Forms
const basicInfo = BookForm
const arabicTranslation = null
const englishTranslation = null
const russianTranslation = null
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
