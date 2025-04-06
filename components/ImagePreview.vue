<script setup>
import { ref } from 'vue'
import { VBtn, VCard, VCardActions, VCardText, VDialog, VImg, VSpacer } from 'vuetify/components'

defineProps({
  src: {
    type: String,
    required: true
  },
  size: {
    type: [String, Number],
    default: 50
  }
})

const showModal = ref(false)
</script>

<template>
  <VImg
    :src="src"
    alt="Preview"
    class="rounded cursor-pointer"
    max-width="50px"
    max-height="50px"
    @click="showModal = true"
  />

  <VDialog v-model="showModal" max-width="auto" @click:outside="showModal = false">
    <VCard>
      <VCardText class="pa-0">
        <VImg :src="src" alt="Full-size preview" max-height="80vh" max-width="100%" />
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn color="primary" @click="showModal = false">Close</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
