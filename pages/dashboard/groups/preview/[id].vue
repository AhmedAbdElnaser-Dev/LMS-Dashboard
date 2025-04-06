<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  VBtn, VCard, VCardText, VCol, VDataTable, VImg, VRow, VTooltip
} from 'vuetify/components'

const router = useRouter()

const bookId = '123'

const navigateToEdit = (tab) => {
  router.push(`/dashboard/books/edit/${bookId}?tab=${tab}`)
}

const book = ref({
  title: 'Journey to the Stars',
  image: "https://marketplace.canva.com/EAD7YHrjZYY/1/0/1003w/canva-blue-illustrated-stars-children's-book-cover-haFtaSNXXF4.jpg",
  pdfUrl: 'c:\\Users\\Omar\\Downloads\\المدينة 1 (2).pdf',
  createdBy: 'Admin',
  createdAt: '2024-03-25',
  updatedBy: 'Editor',
  updatedAt: '2024-06-01',
  translations: {
    arabic: {
      title: 'رحلة إلى النجوم',
      createdBy: 'Admin',
      createdAt: '2024-03-25',
      updatedBy: 'Editor',
      updatedAt: '2024-06-01'
    },
    english: {
      title: 'Journey to the Stars',
      createdBy: 'Admin',
      createdAt: '2024-03-25',
      updatedBy: 'Editor',
      updatedAt: '2024-06-01'
    },
    russian: {
      title: 'Путешествие к звездам',
      createdBy: 'Admin',
      createdAt: '2024-03-25',
      updatedBy: 'Editor',
      updatedAt: '2024-06-01'
    }
  }
})

const headers = [
  { title: 'Language', key: 'language' },
  { title: 'Title', key: 'title' },
  { title: 'Details', key: 'details' },
  { title: 'Actions', key: 'actions' }
]

const translationItems = Object.entries(book.value.translations).map(([key, data]) => ({
  language: key.charAt(0).toUpperCase() + key.slice(1),
  title: data.title,
  details: {
    createdBy: data.createdBy,
    createdAt: data.createdAt,
    updatedBy: data.updatedBy,
    updatedAt: data.updatedAt
  }
}))
</script>

<template>
  <VCard class="pa-6">
    <VRow>
      <VCol cols="12" md="4" class="d-flex flex-column align-center">
        <VImg
          :src="book.image"
          class="rounded-lg shadow-sm mb-4"
          height="300"
          width="280"
          cover
        />
        <VBtn color="primary" variant="outlined" :href="book.pdfUrl" target="_blank">
          Preview PDF
        </VBtn>
      </VCol>

      <VCol cols="12" md="8">
        <h2 class="text-h5 font-weight-bold mb-2">{{ book.title }}</h2>
        <p class="text-body-2 text-grey-darken-1">
          <strong>Created by:</strong> {{ book.createdBy }} at {{ book.createdAt }}
          <br />
          <strong>Updated by:</strong> {{ book.updatedBy }} at {{ book.updatedAt }}
        </p>

        <VBtn color="primary" variant="outlined" class="mt-3 mb-4" @click="navigateToEdit('basic')">
          Edit Basic Info
        </VBtn>

        <VCardText style="padding: 0;">
          <h3 class="text-h6 mb-4">Translations</h3>
          <VDataTable
            :headers="headers"
            :items="translationItems"
            class="elevation-1"
            disable-pagination
            hide-default-footer
          >
            <template v-slot:item.details="{ item }">
              <VTooltip location="top">
                <template v-slot:activator="{ props }">
                  <span v-bind="props" class="cursor-pointer text-primary">View Details</span>
                </template>
                <div>
                  <p><strong>Created by:</strong> {{ item.details.createdBy }} at {{ item.details.createdAt }}</p>
                  <p><strong>Updated by:</strong> {{ item.details.updatedBy }} at {{ item.details.updatedAt }}</p>
                </div>
              </VTooltip>
            </template>

            <template v-slot:item.actions="{ item }">
              <VBtn
                color="primary"
                variant="text"
                @click="navigateToEdit(item.language.toLowerCase())"
              >
                Edit {{ item.language }}
              </VBtn>
            </template>
          </VDataTable>
        </VCardText>
      </VCol>
    </VRow>
  </VCard>
</template>
