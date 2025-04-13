<script setup>
import DepartmentForm from '@/components/forms/departments/DepartmentForm.vue'
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
  <DepartmentForm :submit="handleSubmit" />
</template>
