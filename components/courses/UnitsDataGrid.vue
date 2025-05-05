<template>
  <VCard>
    <VCardTitle>
      Units
    </VCardTitle>
    <VDataTable
      :headers="headers"
      :items="units"
      class="elevation-1"
      item-key="id"
      show-header
    >
      <template #item.actions="{ item }">
        <VBtn
          icon
          variant="text"
          color="primary"
          @click="onPreview(item)"
        >
          <VIcon>mdi-eye</VIcon>
        </VBtn>
        <VBtn
          icon
          variant="text"
          color="warning"
          @click="onEdit(item)"
        >
          <VIcon>mdi-pencil</VIcon>
        </VBtn>
        <VBtn
          icon
          variant="text"
          color="error"
          @click="onDelete(item)"
        >
          <VIcon>mdi-delete</VIcon>
        </VBtn>
      </template>
    </VDataTable>
  </VCard>
</template>

<script setup>
const props = defineProps({
  units: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['preview', 'edit', 'delete'])

const headers = [
  { text: 'Unit Name', value: 'name' },
  { text: 'Lessons', value: 'lessonCount' },
  { text: 'Actions', value: 'actions', sortable: false },
]

function onPreview(unit) {
  emit('preview', unit)
}
function onEdit(unit) {
  emit('edit', unit)
}
function onDelete(unit) {
  emit('delete', unit)
}
</script>
