<script setup>
import { ref } from 'vue'

const props = defineProps({
  groups: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['delete', 'view', 'add'])

const searchGroups = ref('')

const groupHeaders = [
  { title: 'Name', key: 'name', sortable: true },
  { title: 'Max Students', key: 'maxStudents', sortable: true },
  { title: 'Current Students', key: 'currentStudents', sortable: true },
  { title: 'Actions', key: 'actions', align: 'end' },
]
</script>

<template>
  <VCard>
    <VCardTitle>
      <VRow
        align="center"
        no-gutters
      >
        <VCol cols="6">
          <span class="text-h6">Groups</span>
        </VCol>
        <VCol
          cols="6"
          class="d-flex justify-end gap-4"
        >
          <VTextField
            v-model="searchGroups"
            append-inner-icon="tabler-search"
            label="Search groups"
            single-line
            hide-details
            density="compact"
          />
          <VBtn
            color="primary"
            prepend-icon="tabler-plus"
            @click="$emit('add')"
          >
            Add Group
          </VBtn>
        </VCol>
      </VRow>
    </VCardTitle>

    <VCardText>
      <div v-if="loading">
        Loading groups...
      </div>
      <div
        v-else-if="!groups?.length"
        class="text-center pa-4"
      >
        No groups available
      </div>
      <VTable
        v-else
        hover
        class="rounded"
      >
        <thead>
          <tr>
            <th
              v-for="header in groupHeaders"
              :key="header.key"
              :class="{ 'text-end': header.align === 'end' }"
            >
              {{ header.title }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="group in groups"
            :key="group.id"
          >
            <td>{{ group.name }}</td>
            <td>{{ group.maxStudents }}</td>
            <td>{{ group.students?.length || 0 }}</td>
            <td class="text-end">
              <VBtn
                icon
                variant="text"
                color="error"
                size="small"
                @click="$emit('delete', group.id)"
              >
                <VIcon>tabler-trash</VIcon>
              </VBtn>
              <VBtn
                icon
                variant="text"
                color="primary"
                size="small"
                @click="$emit('view', group.id)"
              >
                <VIcon>tabler-eye</VIcon>
              </VBtn>
            </td>
          </tr>
        </tbody>
      </VTable>
    </VCardText>
  </VCard>
</template>
