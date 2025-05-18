<template>
  <VSnackbar
    v-model="visible"
    :color="current?.type || 'info'"
    location="bottom left"
    timeout="3000"
  >
    {{ current?.message }}
  </VSnackbar>
</template>

<script setup>
import { useSnackbarStore } from '@/stores/snackbar'
import { storeToRefs } from 'pinia'

const snackbar = useSnackbarStore()
const { current, visible } = storeToRefs(snackbar)
</script>

<style>
/* styles here */
</style>
