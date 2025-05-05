<template>
  <div class="d-flex justify-space-between align-center mb-6">
    <h1 class="text-h4">
      {{ course.name }}
    </h1>
    <VBtn
      color="primary"
      variant="outlined"
      prepend-icon="tabler-pencil"
      @click="() => $emit('edit-course')"
    >
      Edit Course
    </VBtn>
  </div>
</template>

<script setup>
const props = defineProps({
  course: { type: Object, required: true },
})
</script>
