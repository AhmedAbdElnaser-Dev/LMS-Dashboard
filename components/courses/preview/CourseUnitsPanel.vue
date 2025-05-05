<template>
  <VExpansionPanel>
    <VExpansionPanelTitle>
      <VIcon
        start
        icon="tabler-list-details"
      />
      Units
    </VExpansionPanelTitle>
    <VExpansionPanelText>
      <DataGrid
        :headers="unitHeaders"
        :items="units"
        name="units"
        :add-route="addRoute"
        @delete="unit => $emit('delete-unit', unit)"
      >
        <template #item.actions="{ item }">
          <VBtn
            icon="tabler-eye"
            variant="text"
            color="primary"
            @click="$emit('preview-unit', item)"
          />
          <VBtn
            icon="tabler-pencil"
            variant="text"
            color="warning"
            @click="$emit('edit-unit', item)"
          />
          <VBtn
            icon="tabler-trash"
            variant="text"
            color="error"
            @click="$emit('delete-unit', item)"
          />
        </template>
      </DataGrid>
      <div
        v-if="!units || !units.length"
        class="text-grey"
      >
        No units available.
      </div>
    </VExpansionPanelText>
  </VExpansionPanel>
</template>

<script setup>
import DataGrid from '@/components/DataGrid.vue'

const props = defineProps({
  unitHeaders: { type: Array, required: true },
  units: { type: Array, default: () => [] },
  addRoute: { type: String, required: true },
})
</script>
