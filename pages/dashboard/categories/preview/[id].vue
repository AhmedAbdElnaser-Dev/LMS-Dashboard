<script setup>
import { useBooksStore } from "@/stores/useBookStore"
import { storeToRefs } from "pinia"
import { computed, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import {
  VBtn, VCard, VCardText, VCol, VDataTable, VImg, VRow,
} from "vuetify/components"

const route = useRoute()
const router = useRouter()
const store = useBooksStore()

const { selectedBook, loading, error } = storeToRefs(store)
const bookId = route.params.id

const navigateToEdit = tab => {
  router.push(`/dashboard/books/edit/${bookId}?tab=${tab}`)
}

onMounted(() => {
  if (bookId) {
    store.fetchBookById(bookId)
  }
})

const headers = [
  { title: "Language", key: "language" },
  { title: "Title", key: "name" },
  { title: "Description", key: "description" },
  { title: "Actions", key: "actions" },
]

const getLanguageName = code => {
  const languageNames = {
    en: 'English',
    ar: 'Arabic',
    ru: 'Russian',
  }

  
  return languageNames[code.toLowerCase()] || code.toUpperCase()
}

const translationItems = computed(() => {
  if (!selectedBook.value?.translations) return []

  return Object.entries(selectedBook.value.translations)
    .filter(([langCode]) => ['en', 'ar', 'ru'].includes(langCode))
    .map(([langCode, translation]) => ({
      language: getLanguageName(langCode),
      name: translation.name,
      description: translation.description,
      languageCode: langCode.toLowerCase(),
    }))
})
</script>

<template>
  <VCard class="pa-6">
    <VRow v-if="loading">
      <VCol
        cols="12"
        class="text-center"
      >
        <p>Loading book details...</p>
      </VCol>
    </VRow>

    <VRow v-else-if="error">
      <VCol
        cols="12"
        class="text-center"
      >
        <p class="text-red">
          {{ error }}
        </p>
      </VCol>
    </VRow>

    <VRow v-else-if="selectedBook">
      <VCol
        cols="12"
        md="4"
        class="d-flex flex-column align-center"
      >
        <VImg
          :src="url(selectedBook.urlPic)"
          class="rounded-lg shadow-sm mb-4"
          height="300"
          width="280"
          cover
          :alt="selectedBook.name"
        />
        <VBtn
          color="primary"
          variant="outlined"
          :href="url(selectedBook.urlPdf)"
          target="_blank"
          :disabled="!selectedBook.urlPdf"
        >
          Preview PDF
        </VBtn>
      </VCol>

      <VCol
        cols="12"
        md="8"
      >
        <h1 class="text-h4 font-weight-bold mb-4">
          {{ selectedBook.name }}
        </h1>

        <div class="mb-6">
          <p class="text-body-1 mb-1">
            <strong>Created:</strong>
            {{ new Date(selectedBook.createdAt).toLocaleDateString() }}
          </p>
          <p
            v-if="selectedBook.updatedAt"
            class="text-body-1"
          >
            <strong>Last updated:</strong>
            {{ new Date(selectedBook.updatedAt).toLocaleDateString() }}
          </p>
        </div>

        <VBtn
          color="primary"
          variant="outlined"
          class="mb-6"
          @click="navigateToEdit('basic')"
        >
          Edit Basic Info
        </VBtn>

        <VCardText class="pa-0">
          <h2 class="text-h5 mb-4">
            Translations
          </h2>
          <VDataTable
            :headers="headers"
            :items="translationItems"
            class="elevation-1"
            disable-pagination
            hide-default-footer
          >
            <template #item.name="{ item }">
              <div
                class="text-truncate"
                style="max-inline-size: 300px;"
              >
                {{ item.description || 'No name available' }}
              </div>
            </template>

            <template #item.description="{ item }">
              <div
                class="text-truncate"
                style="max-inline-size: 300px;"
              >
                {{ item.description || 'No description available' }}
              </div>
            </template>

            <template #item.actions="{ item }">
              <VBtn
                color="primary"
                variant="text"
                @click="navigateToEdit(item.languageCode)"
              >
                Edit {{ getLanguageName(item.languageCode) }}
              </VBtn>
            </template>
          </VDataTable>
        </VCardText>
      </VCol>
    </VRow>
  </VCard>
</template>
