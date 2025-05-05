<script setup>
import GroupDialog from '@/components/courses/GroupDialog.vue'
import CourseBooksPanel from '@/components/courses/preview/CourseBooksPanel.vue'
import CourseGroupsPanel from '@/components/courses/preview/CourseGroupsPanel.vue'
import CourseHeader from '@/components/courses/preview/CourseHeader.vue'
import CourseTranslationsPanel from '@/components/courses/preview/CourseTranslationsPanel.vue'
import CourseUnitsPanel from '@/components/courses/preview/CourseUnitsPanel.vue'
import { useCoursesStore } from '@/stores/useCoursesStore'
import { useGroupsStore } from '@/stores/useGroupsStore'
import { useUnitsStore } from '@/stores/useUnitsStore'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const courseId = route.params.id

const coursesStore = useCoursesStore()
const groupsStore = useGroupsStore()
const unitsStore = useUnitsStore()

unitsStore.setCurrentCourse(courseId)

const { course } = storeToRefs(coursesStore)
const { courseGroups, loading: groupsLoading } = storeToRefs(groupsStore)
const { loading: unitsLoading } = storeToRefs(unitsStore)

const selectedGroupId = ref(null)
const showAddGroupDialog = ref(false)
const loading = ref(false)
const error = ref(null)
const openPanels = ref([0, 1, 2, 3])

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
    await coursesStore.deleteGroup(groupId)
  } catch (error) {
    console.error('Failed to delete group:', error)
  }
}

const handleViewGroup = groupId => {
  router.push(`/dashboard/groups/preview/${groupId}`)
}

onMounted(async () => {
  try {
    loading.value = true
    await Promise.all([
      coursesStore.fetchCourseById(courseId),

      // groupsStore.getCourseGroups(courseId),
    ])
  } catch (error) {
    console.error('Failed to load course data:', error)
    error.value = 'Failed to load course data. Please try again.'
  } finally {
    loading.value = false
  }
})

// Units DataGrid headers
const unitHeaders = [
  { title: 'Unit Name', key: 'name' },
  { title: 'Lessons', key: 'lessonCount' },
  { title: 'Actions', key: 'actions', sortable: false },
]

// Units dialog logic
const previewDialog = ref(false)
const editDialog = ref(false)
const selectedUnit = ref(null)
const editUnitData = ref({ name: '', lessonCount: 0 })

function previewUnit(unit) {
  selectedUnit.value = unit
  previewDialog.value = true
}
function editUnit(unit) {
  editUnitData.value = { ...unit }
  editDialog.value = true
}
function saveEditUnit() {
  editDialog.value = false
}
async function deleteUnit(unit) {
  const id = typeof unit === 'object' ? unit.id : unit
  if (!confirm('Are you sure you want to delete this unit?')) {
    // await unit
  }

  try {
    loading.value = true
    await unitsStore.deleteUnit(id)

    // Refresh the course data to update the units list
    await coursesStore.fetchCourseById(courseId)
  } catch (error) {
    console.error('Failed to delete unit:', error)
    error.value = 'Failed to delete unit. Please try again.'
  } finally {
    loading.value = false
  }
}

async function handleEditGroup() {

}
</script>

<template>
  <div>
    <div v-if="!course">
      Loading...
    </div>
    <div v-else-if="error">
      {{ error }}
    </div>
    <div v-else>
      <CourseHeader
        :course="course"
        @edit-course="() => router.push(`/dashboard/courses/edit/${courseId}`)"
      />
      <VExpansionPanels
        v-model="openPanels"
        multiple
        variant="accordion"
      >
        <CourseTranslationsPanel
          :course="course"
          :selected-unit="selectedUnit"
          @edit-translation="lang => router.push(`/dashboard/courses/edit/${courseId}?tab=${lang}`)"
          @edit-lesson-translation="({ lang, unit }) => router.push(`/dashboard/lessons/edit/${unit.id}?lang=${lang}`)"
        />

        <CourseGroupsPanel
          :course-groups="course.groups"
          :add-route="`${route.path}/add-group`"
        />

        <CourseUnitsPanel
          :unit-headers="unitHeaders"
          :units="course.units || []"
          :add-route="`${route.path}/add-unit`"
          @delete-unit="deleteUnit"
          @preview-unit="previewUnit"
          @edit-unit="editUnit"
        />
        <CourseBooksPanel :books="course.books" />
      </VExpansionPanels>
    </div>

    <GroupDialog
      :show="showAddGroupDialog"
      :loading="loading"
      :add-route="`${route.path}/add-group`"
      @close="handleCloseAddGroup"
      @submit="handleSubmitGroup"
    />

    <!-- Units Preview/Edit Dialogs -->
    <VDialog
      v-model="previewDialog"
      max-width="500"
    >
      <VCard>
        <VCardTitle>Preview Unit</VCardTitle>
        <VCardText>
          <div v-if="selectedUnit">
            <div><b>Name:</b> {{ selectedUnit.name }}</div>
            <div><b>Lessons:</b> {{ selectedUnit.lessonCount }}</div>
          </div>
        </VCardText>
        <VCardActions>
          <VBtn @click="previewDialog = false">
            Close
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
    <VDialog
      v-model="editDialog"
      max-width="500"
    >
      <VCard>
        <VCardTitle>Edit Unit</VCardTitle>
        <VCardText>
          <VTextField
            v-model="editUnitData.name"
            label="Unit Name"
          />
          <VTextField
            v-model="editUnitData.lessonCount"
            label="Lesson Count"
            type="number"
          />
        </VCardText>
        <VCardActions>
          <VBtn
            color="primary"
            @click="saveEditUnit"
          >
            Save
          </VBtn>
          <VBtn @click="editDialog = false">
            Cancel
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>
