<script setup>
import { useAuthStore } from '@/stores/useAuthStore'

const authStore = useAuthStore()

// Add a small delay to ensure the store is initialized
onMounted(async () => {
  await nextTick()

  // Initialize store if not already done
  if (!authStore.isInitialized) {
    authStore.initialize()
  }

  // The middleware will handle all navigation logic
  // No need to manually check authentication or navigate here
})
</script>

<template>
  <div class="d-flex align-center justify-center min-h-screen">
    <div class="text-center">
      <VProgressCircular
        indeterminate
        size="64"
        class="mb-4"
      />
      <p class="text-h6">
        Loading...
      </p>
    </div>
  </div>
</template>
