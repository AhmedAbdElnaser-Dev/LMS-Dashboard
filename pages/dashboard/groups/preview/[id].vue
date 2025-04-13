<script setup>
import GroupDetails from '@/components/courses/GroupDetails.vue'
import { useGroupsStore } from '@/stores/useGroupsStore'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const groupId = route.params.id

const groupsStore = useGroupsStore()
const { currentGroup, loading } = storeToRefs(groupsStore)

const navigateToEdit = lang => {
  router.push(`/dashboard/groups/edit/${groupId}?tab=${lang || 'basic'}`)
}

const handleAddStudents = () => {
  console.log('Add students to group:', groupId)
}

onMounted(async () => {
  await groupsStore.getGroupById(groupId)
})
</script>

<template>
  <div>
    <div v-if="loading">
      Loading...
    </div>

    <div v-else-if="currentGroup">
      <div class="d-flex justify-space-between align-center mb-6">
        <h1 class="text-h4">
          Group Details
        </h1>
        <VBtn
          color="primary"
          variant="outlined"
          prepend-icon="tabler-pencil"
          @click="navigateToEdit"
        >
          Edit Group
        </VBtn>
      </div>

      <GroupDetails
        :group="currentGroup"
        @remove-student="() => {}"
        @edit-translation="navigateToEdit"
        @add-students="handleAddStudents"
      />
    </div>

    <div
      v-else
      class="d-flex justify-center align-center pa-4"
    >
      <VAlert
        type="warning"
        text="Group not found"
      />
    </div>
  </div>
</template>
