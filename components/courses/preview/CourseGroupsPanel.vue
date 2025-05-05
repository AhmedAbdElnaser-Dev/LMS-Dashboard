<template>
  <VExpansionPanel>
    <VExpansionPanelTitle>
      <VIcon
        start
        icon="tabler-users-group"
      />
      Groups
    </VExpansionPanelTitle>
    <VExpansionPanelText>
      <DataGrid
        :headers="groupHeaders"
        :items="filteredGroups"
        name="groups"
        :loading="groupsLoading"
        :add-route="props.addRoute"
        @delete="group => handleDeleteGroup(group)"
      >
        <template #item.actions="{ item }">
          <VBtn
            icon="tabler-eye"
            variant="text"
            color="primary"
            @click="handleViewGroup(item)"
          />
          <VBtn
            icon="tabler-pencil"
            variant="text"
            color="warning"
            @click="handleEditGroup(item)"
          />
          <VBtn
            icon="tabler-trash"
            variant="text"
            color="error"
            @click="() => handleDeleteGroup(item)"
          />
        </template>
        <template #top>
          <VBtn
            prepend-icon="tabler-plus"
            color="primary"
            variant="flat"
            @click="() => router.push('/dashboard/groups/create')"
          >
            Add Group
          </VBtn>
        </template>
      </DataGrid>
      <div
        v-if="!filteredGroups.length"
        class="text-grey"
      >
        No groups available.
      </div>
    </VExpansionPanelText>
  </VExpansionPanel>
</template>

<script setup>
import DataGrid from '@/components/DataGrid.vue'
import { useGroupsStore } from '@/stores/useGroupsStore'
import { useRouter } from 'vue-router'

const props = defineProps({
  courseGroups: { type: Array, default: () => [] },
  groupsLoading: { type: Boolean, default: false },
  addRoute: { type: String, required: true },
})

const groupsStore = useGroupsStore()
const router = useRouter()

watch(() => props.courseGroups, newGroups => {
  if (newGroups.length > 0) {
    groupsStore.setCourseGroups(newGroups)
  }
}, { immediate: true })

const filteredGroups = computed(() => {
  return groupsStore.courseGroups.filter(group => {
    return group.active !== false
  })
})

async function handleDeleteGroup(group) {
  try {
    await groupsStore.deleteGroup(group)
    groupsStore.removeGroup(group)
  } catch (error) {
    console.error('Failed to delete group:', error)
  }
}

function handleViewGroup(group) {
  router.push(`/dashboard/groups/preview/${group.id}`)
}

function handleEditGroup(group) {
  console.log('Editing group:', group)
}

const groupHeaders = [
  { title: 'Group Name', key: 'name' },
  { title: 'Instructor', key: 'instructorName' },
  { title: 'Students', key: 'countOfStudents' },
  { title: 'Actions', key: 'actions', sortable: false },
]
</script>
