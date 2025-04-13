<script setup>
import DataGrid from "@/components/DataGrid.vue"
import { useBooksStore } from "@/stores/useBookStore"
import { format } from "date-fns"
import { onMounted } from "vue"
import ImagePreview from "~/components/ImagePreview.vue"

const booksStore = useBooksStore()

onMounted(() => {
  booksStore.fetchBooks()
})

const headers = [
  { title: "PDF", key: "name" },
  { title: "Picture", key: "urlPic", sortable: false },

  // { title: "Created By", key: "createdBy" },
  // { title: "Updated By", key: "updatedBy" },
  { title: "Created At", key: "createdAt" },
  { title: "Updated At", key: "updatedAt" },
  { title: "Actions", key: "actions", sortable: false },
]

// Handle delete
async function handleDelete (id) {
  console.log("Delete")
  booksStore.deleteBook(id)
};

const formatDate = dateString => {
  return dateString ? format(new Date(dateString), "yyyy-MM-dd HH:mm") : "N/A"
}
</script>

<template>
  <div>
    <p v-if="booksStore.loading">
      Loading books...
    </p>
    <p v-if="booksStore.error">
      {{ booksStore.error }}
    </p>

    <DataGrid
      :headers="headers"
      :items="booksStore.books"
      :loading="booksStore.loading"
      name="books"
      :on-delete="handleDelete"
    >
      <!-- PDF Link -->
      <template #item.name="{ item }">
        <a
          :href="url(item.urlPdf)"
          target="_blank"
          class="text-blue-500 underline"
        >
          {{ item.name }}
        </a>
      </template>

      <!-- Picture Preview -->
      <template #item.urlPic="{ item }">
        <ImagePreview :src="url(item.urlPic)" />
      </template>

      <!-- Formatted Created At -->
      <template #item.createdAt="{ item }">
        {{ formatDate(item.createdAt) }}
      </template>

      <!-- Formatted Updated At -->
      <template #item.updatedAt="{ item }">
        {{ formatDate(item.updatedAt) }}
      </template>
    </DataGrid>
  </div>
</template>
