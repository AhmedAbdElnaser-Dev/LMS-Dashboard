<template>
  <div>
    <VRow>
      <VCol
        v-for="(book, index) in books"
        :key="index"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <VCard class="rounded-lg">
          <img
            :src="url(book.urlPic)"
            height="200"
            class="rounded-t-lg"
            cover
          >
          <VCardText>
            <p class="font-weight-medium text-body-1 mb-2">
              {{ book.name || 'Untitled Book' }}
            </p>
            <VBtn
              v-if="book.urlPdf"
              :href="url(book.urlPdf)"
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
              block
              variant="outlined"
            >
              Preview PDF
            </VBtn>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<script setup>
defineProps({ books: Array })
</script>
