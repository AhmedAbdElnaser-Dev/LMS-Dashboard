<script setup>
import BookForm from '@/components/forms/books/BookForm.vue'
import { useBooksStore } from '@/stores/useBookStore.js'

const booksStore = useBooksStore()

const handleSubmit = formData => {
  booksStore.addBook({
    name: formData.name,
    pdfFile: formData.pdf,
    picFile: formData.pic,
  })
}
</script>

<template>
  <BookForm :submit="handleSubmit" />
</template>
