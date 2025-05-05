<template>
  <div>
    <!-- Student List -->
    <div class="mb-4">
      <div class="d-flex gap-4">
        <VTextField
          v-model="searchQuery"
          label="Search Students"
          density="comfortable"
          class="search-field"
          prepend-inner-icon="tabler-search"
          clearable
          variant="outlined"
          hide-details
        />
        <VBtn
          color="primary"
          variant="outlined"
          prepend-icon="tabler-plus"
          @click="handleAddStudents"
        >
          Add Students
        </VBtn>
      </div>
    </div>

    <VTable v-if="paginatedStudents.length">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="student in paginatedStudents"
          :key="student.id"
        >
          <td>{{ student.fullName }}</td>
          <td>{{ student.email }}</td>
          <td>{{ student.phoneNumber || '-' }}</td>
          <td>
            <VBtn
              icon="tabler-trash"
              color="error"
              variant="text"
              size="small"
              @click="handleRemoveStudent(student.id)"
            />
          </td>
        </tr>
      </tbody>
    </VTable>

    <p
      v-else-if="!groupsStore.loading && !filteredStudents.length"
      class="text-center"
    >
      No students found
    </p>

    <VProgressCircular
      v-if="groupsStore.loading"
      indeterminate
      color="primary"
      size="64"
      width="4"
      class="mx-auto my-4"
    />

    <!-- Pagination controls -->
    <div class="d-flex align-center justify-space-between mt-4">
      <VSelect
        v-model="itemsPerPage"
        :items="[5, 10, 20, 50]"
        label="Items per page"
        variant="outlined"
        hide-details
        style="max-inline-size: 150px;"
      />
      <VPagination
        v-model="page"
        :length="Math.ceil(filteredStudents.length / itemsPerPage)"
        total-visible="7"
      />
    </div>

    <!-- Add Student Dialog -->
    <VDialog
      v-model="dialog"
      max-width="500"
      persistent
    >
      <VCard>
        <VCardTitle>
          Add Student to Group
        </VCardTitle>
        <VCardText>
          <VSelect
            v-model="selectedStudent"
            :items="availableStudents"
            item-title="fullName"
            item-value="id"
            label="Select Student"
            variant="outlined"
            :disabled="groupsStore.loading || isSubmitting"
            :loading="groupsStore.loading"
            clearable
          />
        </VCardText>
        <VCardActions>
          <VBtn
            color="primary"
            variant="text"
            :disabled="isSubmitting || !selectedStudent"
            :loading="isSubmitting"
            @click="handleAddStudentSubmit"
          >
            Add
          </VBtn>
          <VBtn
            color="secondary"
            variant="text"
            :disabled="isSubmitting"
            @click="handleDialogClose"
          >
            Cancel
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script setup>
import { useGroupsStore } from '@/stores/useGroupsStore'
import { computed, ref, watch } from 'vue'

const props = defineProps({
  students: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['removeStudent'])

const groupsStore = useGroupsStore()

const searchQuery = ref('')
const dialog = ref(false)
const selectedStudent = ref(null)
const isSubmitting = ref(false)

const page = ref(1)
const itemsPerPage = ref(10)

const filteredStudents = computed(() => {
  if (!props.students) return []

  return props.students.filter(student =>
    student.fullName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

const paginatedStudents = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value

  return filteredStudents.value.slice(start, end)
})

const availableStudents = computed(() => {
  const currentStudentIds = props.students.map(student => student.id)

  return groupsStore.students.filter(
    student => !currentStudentIds.includes(student.id),
  )
})

const handleRemoveStudent = async studentId => {
  try {
    await groupsStore.removeStudent({
      groupId: groupsStore.currentGroup.id,
      studentId,
    })
  } catch (err) {
    console.error('Error removing student:', err)
  }
}

const handleAddStudents = () => {
  dialog.value = true
}

const handleDialogClose = () => {
  dialog.value = false
  selectedStudent.value = null
}

const handleAddStudentSubmit = async () => {
  if (!selectedStudent.value) return
  try {
    isSubmitting.value = true

    const groupId = groupsStore.currentGroup?.id
    if (!groupId) {
      console.error('No group selected')
      isSubmitting.value = false

      return
    }
    await groupsStore.addStudent({
      groupId,
      studentId: selectedStudent.value,
    })
  } catch (err) {
    console.error('Error adding student:', err)
  } finally {
    isSubmitting.value = false
    selectedStudent.value = null
  }
}

const fetchStudents = async () => {
  if (!groupsStore.students.length) {
    await groupsStore.getStudents()
  }
}

fetchStudents()

watch(
  () => groupsStore.currentGroup?.id,
  () => fetchStudents(),
  { immediate: true },
)
</script>

<style scoped>
/* stylelint-disable-next-line no-empty-source */
</style>
