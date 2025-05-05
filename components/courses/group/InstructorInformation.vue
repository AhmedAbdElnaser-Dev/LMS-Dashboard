<script setup>
defineProps({
  instructor: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div
    class="d-flex flex-column"
    aria-label="Instructor contact information"
  >
    <span class="text-h6">{{ instructor.fullName || 'Unknown Name' }}</span>
    <span class="text-subtitle-1">{{ instructor.email || 'No Email Provided' }}</span>
    <span
      v-if="instructor.phoneNumber"
      class="text-subtitle-1"
    >
      {{ instructor.phoneNumber }}
    </span>
    <span
      v-else
      class="text-subtitle-1 text-disabled"
    >
      No Phone Number
    </span>
  </div>
</template>
