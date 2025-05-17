<script setup>
import DataGrid from '@/components/DataGrid.vue'
import ImagePreview from '@/components/ImagePreview.vue'
import { ref } from 'vue'

// Sample book data (100+ rows)
const books = ref(Array.from({ length: 105 }, (_, i) => ({
  id: i + 1,
  pdf: `book${i + 1}.pdf`,
  pic: `https://images.pexels.com/photos/13146110/pexels-photo-13146110.jpeg?cs=srgb`,
  createdBy: `User ${String.fromCharCode(65 + (i % 26))}`,
  updatedBy: `Editor ${String.fromCharCode(65 + (i % 26))}`,
  createdAt: `2025-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
  updatedAt: `2025-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
})))

// Headers
const headers = [
  { title: '#', key: 'id' },
  { title: 'PDF', key: 'pdf' },
  { title: 'Picture', key: 'pic' },
  { title: 'Created By', key: 'createdBy' },
  { title: 'Updated By', key: 'updatedBy' },
  { title: 'Created At', key: 'createdAt' },
  { title: 'Updated At', key: 'updatedAt' },
  { title: 'Actions', key: 'actions', sortable: false },
]

// Handle delete
const handleDelete = id => {
  books.value = books.value.filter(book => book.id !== id)
}
</script>

<template>
  <DataGrid
    :headers="headers"
    :items="books"
    name="books"
    @delete="handleDelete"
  >
    <!-- Custom slot for ID -->
    <template #item.id="{ item }">
      #{{ item.id }}
    </template>

    <!-- Custom slot for PDF -->
    <template #item.pdf="{ item }">
      <a
        :href="item.pdf"
        target="_blank"
      >{{ item.pdf }}</a>
    </template>

    <!-- Custom slot for Picture (Using ImagePreview) -->
    <template #item.pic="{ item }">
      <ImagePreview :src="item.pic" />
    </template>
  </DataGrid>
</template>
