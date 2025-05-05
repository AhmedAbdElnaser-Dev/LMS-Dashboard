<template>
  <VExpansionPanel>
    <VExpansionPanelTitle>
      <VIcon start icon="tabler-book" />
      Books
    </VExpansionPanelTitle>
    <VExpansionPanelText>
      <BooksGrid :books="books" />
    </VExpansionPanelText>
  </VExpansionPanel>
</template>

<script setup>
import BooksGrid from '@/components/courses/CourseBooks.vue'
const props = defineProps({
  books: { type: Array, default: () => [] },
})
</script>
