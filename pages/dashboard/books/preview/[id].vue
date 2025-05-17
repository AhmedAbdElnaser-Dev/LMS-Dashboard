<script>
import { useBooksStore } from '@/stores/useBookStore'
import { storeToRefs } from 'pinia'
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    // Router and Store
    const route = useRoute()
    const router = useRouter()
    const booksStore = useBooksStore()
    const { selectedBook, loading, error } = storeToRefs(booksStore)

    // Computed
    const bookId = computed(() => route.params.id)

    // Refs for PDF upload
    const pdfFile = ref(null)
    const pdfInputRef = ref(null)

    // Refs for picture upload
    const pictureFile = ref(null)  // Fixed missing parenthesis
    const pictureInputRef = ref(null)

    // Constants
    const languageNames = {
      en: 'English',
      ar: 'Arabic',
      ru: 'Russian',
    }

    const headers = [
      { title: 'Language', key: 'language', width: '15%' },
      { title: 'Title', key: 'name', width: '25%' },
      { title: 'Description', key: 'description', width: '45%' },
      { title: 'Actions', key: 'actions', width: '15%' },
    ]

    // Computed Properties
    const translationItems = computed(() => {
      if (!selectedBook.value?.translations) return []

      return Object.entries(selectedBook.value.translations)
        .filter(([langCode]) => ['en', 'ar', 'ru'].includes(langCode))
        .map(([langCode, translation]) => ({
          language: getLanguageName(langCode),
          name: translation.name || 'No name available',
          description: translation.description || 'No description available',
          languageCode: langCode.toLowerCase(),
        }))
    })

    // Methods
    const navigateToEdit = tab => {
      router.push(`/dashboard/books/edit/${bookId.value}?tab=${tab}`)
    }

    const getLanguageName = code => {
      return languageNames[code.toLowerCase()] || code.toUpperCase()
    }

    const formatDate = date => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    }

    // PDF upload handlers
    const openPdfInput = () => {
      if (pdfInputRef.value) {
        pdfInputRef.value.$el.querySelector('input').click()
      }
    }

    const uploadPdf = async () => {
      if (!pdfFile.value) {
        console.error('No PDF file selected')

        return
      }

      const formData = new FormData()

      formData.append('PDF', pdfFile.value[0])

      try {
        await booksStore.editBook(bookId.value, formData)
        pdfFile.value = null // Reset file input
      } catch (err) {
        console.error('PDF upload failed:', err)
      }
    }

    // Picture upload handlers
    const openPictureInput = () => {
      if (pictureInputRef.value) {
        pictureInputRef.value.$el.querySelector('input').click()
      }
    }

    const uploadPicture = async () => {
      if (!pictureFile.value) {
        console.error('No picture file selected')

        return
      }

      const formData = new FormData()

      formData.append('Picture', pictureFile.value[0])

      try {
        await booksStore.editBookPicture(bookId.value, formData)
        pictureFile.value = null // Reset file input
      } catch (err) {
        console.error('Picture upload failed:', err)
      }
    }

    // Lifecycle Hooks
    onMounted(() => {
      if (bookId.value) {
        booksStore.fetchBookById(bookId.value)
      }
    })

    return {
      // State
      selectedBook,
      loading,
      error,

      // Constants
      headers,

      // Computed
      translationItems,

      // Methods
      navigateToEdit,
      formatDate,

      // PDF related
      pdfFile,
      pdfInputRef,
      openPdfInput,
      uploadPdf,

      // Picture related
      pictureFile,
      pictureInputRef,
      openPictureInput,
      uploadPicture,
    }
  },
})
</script>

<template>
  <VCard class="pa-6">
    <!-- Loading State -->
    <VRow
      v-if="loading"
      justify="center"
    >
      <VCol
        cols="12"
        class="text-center"
      >
        <VProgressCircular
          indeterminate
          color="primary"
        />
        Loading book details...
      </VCol>
    </VRow>

    <!-- Content -->
    <VRow v-else-if="selectedBook">
      <!-- Book Image and File Controls -->
      <VCol
        cols="12"
        md="4"
        class="d-flex flex-column align-center gap-4"
      >
        <VImg
          :src="url(selectedBook.urlPic)"
          :alt="selectedBook.name"
          class="rounded-lg shadow-sm"
          height="300"
          width="280"
          cover
        />

        <div class="d-flex flex-column align-center gap-2">
          <!-- Hidden File Inputs -->
          <VFileInput
            ref="pictureInputRef"
            v-model="pictureFile"
            label="Upload Picture"
            accept="image/jpeg,image/png,image/gif"
            variant="outlined"
            class="hidden-file-input"
            :rules="[
              v => !!v || 'Picture is required',
              v => v && ['image/jpeg', 'image/png', 'image/gif'].includes(v.type) || 'Only JPEG, PNG, or GIF files are allowed',
            ]"
            @change="uploadPicture"
          />

          <VFileInput
            ref="pdfInputRef"
            v-model="pdfFile"
            label="Upload PDF"
            accept=".pdf"
            variant="outlined"
            class="hidden-file-input"
            :rules="[v => !!v || 'PDF is required', v => v && v.type === 'application/pdf' || 'Only PDF files are allowed']"
            @change="uploadPdf"
          />

          <!-- Action Buttons -->
          <VRow>
            <VCol cols="6">
              <VBtn
                color="primary"
                variant="outlined"
                :disabled="!selectedBook"
                @click="openPdfInput"
              >
                Upload PDF
              </VBtn>
            </VCol>
            <VCol cols="6">
              <VBtn
                color="primary"
                variant="outlined"
                :href="url(selectedBook.urlPdf)"
                target="_blank"
                rel="noopener noreferrer"
                :disabled="!selectedBook.urlPdf"
              >
                Preview PDF
              </VBtn>
            </VCol>
          </VRow>
        </div>
      </VCol>

      <!-- Book Information -->
      <VCol
        cols="12"
        md="8"
        class="d-flex flex-column gap-6"
      >
        <h1 class="text-h4 font-weight-bold">
          {{ selectedBook.name }}
        </h1>

        <div class="text-body-1">
          <p>
            <strong>Created:</strong>
            {{ formatDate(selectedBook.createdAt) }}
          </p>
          <p v-if="selectedBook.updatedAt">
            <strong>Last updated:</strong>
            {{ formatDate(selectedBook.updatedAt) }}
          </p>
        </div>

        <div class="d-flex gap-2">
          <VBtn
            color="primary"
            variant="outlined"
            @click="navigateToEdit('basic')"
          >
            Edit Basic Info
          </VBtn>
          <VBtn
            color="primary"
            variant="outlined"
            :disabled="!selectedBook"
            @click="openPictureInput"
          >
            Change Picture
          </VBtn>
        </div>

        <!-- Translations Table -->
        <section>
          <h2 class="text-h5 mb-4">
            Translations
          </h2>
          <VDataTable
            :headers="headers"
            :items="translationItems"
            class="elevation-1"
            hide-default-footer
          >
            <template #item.name="{ item }">
              <div
                class="text-truncate"
                style="max-inline-size: 300px;"
              >
                {{ item.name }}
              </div>
            </template>
            <template #item.description="{ item }">
              <div
                class="text-truncate"
                style="max-inline-size: 300px;"
              >
                {{ item.description }}
              </div>
            </template>
            <template #item.actions="{ item }">
              <VBtn
                color="primary"
                variant="text"
                @click="navigateToEdit(item.languageCode)"
              >
                Edit {{ item.language }}
              </VBtn>
            </template>
          </VDataTable>
        </section>
      </VCol>
    </VRow>
  </VCard>
</template>

<style scoped>
.gap-2 {
  gap: 0.5rem;
}

.gap-4 {
  gap: 1rem;
}

.gap-6 {
  gap: 1.5rem;
}

.hidden-file-input {
  display: none;
}
</style>
