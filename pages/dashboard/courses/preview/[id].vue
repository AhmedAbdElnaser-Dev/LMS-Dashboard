<script setup>
import BooksGrid from '@/components/courses/CourseBooks.vue'
import TranslationsTable from '@/components/courses/CourseTranslations.vue'
import GroupDialog from '@/components/courses/GroupDialog.vue'
import GroupsGrid from '@/components/courses/GroupsGrid.vue'
import { useCoursesStore } from '@/stores/useCoursesStore'
import { useGroupsStore } from '@/stores/useGroupsStore'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const courseId = route.params.id

const coursesStore = useCoursesStore()
const groupsStore = useGroupsStore()

const { course } = storeToRefs(coursesStore)
const { courseGroups, loading: groupsLoading } = storeToRefs(groupsStore)

const selectedGroupId = ref(null)
const showAddGroupDialog = ref(false)
const loading = ref(false)
const openPanels = ref([0, 1, 2])

const handleAddGroup = () => {
  showAddGroupDialog.value = true
}

const handleCloseAddGroup = () => {
  showAddGroupDialog.value = false
}

const handleSubmitGroup = async values => {
  try {
    loading.value = true
    await groupsStore.createGroup({
      ...values,
      courseId,
    })
    showAddGroupDialog.value = false
  } catch (error) {
    console.error('Failed to create group:', error)
  } finally {
    loading.value = false
  }
}

const handleDeleteGroup = async groupId => {
  try {
    await groupsStore.deleteGroup(groupId)
  } catch (error) {
    console.error('Failed to delete group:', error)
  }
}

const handleViewGroup = groupId => {
  router.push(`/dashboard/groups/preview/${groupId}`)
}

onMounted(async () => {
  await Promise.all([
    coursesStore.fetchCourseById(courseId),
    groupsStore.getCourseGroups(courseId),
  ])
})
</script>

<template>
  <div>
    <div v-if="!course">
      Loading...
    </div>
    <div v-else>
      <div class="d-flex justify-space-between align-center mb-6">
        <h1 class="text-h4">
          {{ course.name }}
        </h1>
        <VBtn
          color="primary"
          variant="outlined"
          prepend-icon="tabler-pencil"
          @click="() => router.push(`/dashboard/courses/edit/${courseId}`)"
        >
          Edit Course
        </VBtn>
      </div>

      <VExpansionPanels
        v-model="openPanels"
        multiple
        variant="accordion"
      >
        <VExpansionPanel>
          <VExpansionPanelTitle>
            <VIcon
              start
              icon="tabler-book"
            />
            Books
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            <BooksGrid :books="course.books" />
          </VExpansionPanelText>
        </VExpansionPanel>

        <VExpansionPanel>
          <VExpansionPanelTitle>
            <VIcon
              start
              icon="tabler-language"
            />
            Translations
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            <TranslationsTable
              :translations="course.translations"
              @edit="lang => router.push(`/dashboard/courses/edit/${courseId}?tab=${lang}`)"
            />
          </VExpansionPanelText>
        </VExpansionPanel>

        <VExpansionPanel>
          <VExpansionPanelTitle>
            <VIcon
              start
              icon="tabler-users-group"
            />
            Groups
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            <GroupsGrid
              :groups="courseGroups"
              :loading="groupsLoading"
              @add="handleAddGroup"
              @delete="handleDeleteGroup"
              @view="handleViewGroup"
            />
          </VExpansionPanelText>
        </VExpansionPanel>
      </VExpansionPanels>
    </div>

    <GroupDialog
      :show="showAddGroupDialog"
      :loading="loading"
      @close="handleCloseAddGroup"
      @submit="handleSubmitGroup"
    />
  </div>
</template>
