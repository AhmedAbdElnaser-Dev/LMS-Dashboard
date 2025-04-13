<script setup>
import GroupForm from '@/components/forms/groups/GroupForm.vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'submit'])
</script>

<template>
  <VDialog
    :model-value="show"
    max-width="800"
    persistent
  >
    <VCard class="pa-4">
      <VCardTitle class="text-h5 font-weight-bold d-flex justify-space-between align-center">
        Add New Group
        <VBtn
          icon
          variant="text"
          @click="$emit('close')"
        >
          <VIcon>tabler-x</VIcon>
        </VBtn>
      </VCardTitle>

      <VCardText>
        <GroupForm
          :loading="loading"
          @submit="$emit('submit', $event)"
        />
      </VCardText>
    </VCard>
  </VDialog>
</template>
