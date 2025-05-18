<script setup>
import { computed } from 'vue'

const props = defineProps({
  opacity: { type: Number, default: 100 },
})

const overlayStyle = computed(() => ({
  backgroundColor: `rgba(0, 0, 0, ${props.opacity / 100})`,
}))
</script>

<template>
  <div
    class="loading-overlay"
    :style="overlayStyle"
  >
    <VProgressCircular
      indeterminate
      size="64"
      color="primary"
    />
  </div>
</template>

<style scoped>
.loading-overlay {
  position: fixed;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  inset: 0;
}
</style>
