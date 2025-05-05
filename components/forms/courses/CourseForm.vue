<template>
  <VCard class="shadow-lg rounded-lg py-6">
    <VCardTitle class="text-h4 font-weight-bold text-center mb-6">
      {{ isEditMode ? "Edit Course" : "Add Course" }}
    </VCardTitle>

    <VCardText>
      <VRow>
        <VCol
          cols="12"
          md="6"
        >
          <VTextField
            v-model="form.name"
            label="Course Name"
            variant="outlined"
            required
            class="mb-4"
            :disabled="loading"
            :error="isTouched.name && !form.name"
            :error-messages="isTouched.name && !form.name ? ['Name is required'] : []"
            @blur="isTouched.name = true"
          />
        </VCol>

        <VCol
          cols="12"
          md="6"
        >
          <VSelect
            v-model="form.categoryId"
            label="Category"
            :items="categories"
            item-title="title"
            item-value="value"
            variant="outlined"
            required
            class="mb-4"
            :disabled="loading"
            :error="isTouched.categoryId && !form.categoryId"
            :error-messages="isTouched.categoryId && !form.categoryId ? ['Category is required'] : []"
            @blur="isTouched.categoryId = true"
          />
        </VCol>

        <VCol
          cols="12"
          md="6"
        >
          <VSelect
            v-model="form.departmentId"
            label="Department"
            :items="departments"
            item-title="title"
            item-value="value"
            variant="outlined"
            required
            class="mb-4"
            :disabled="loading"
            :error="isTouched.departmentId && !form.departmentId"
            :error-messages="isTouched.departmentId && !form.departmentId ? ['Department is required'] : []"
            @blur="isTouched.departmentId = true"
          />
        </VCol>

        <VCol
          cols="12"
          md="6"
        >
          <VSelect
            v-model="form.bookIds"
            label="Books"
            :items="books"
            item-title="title"
            item-value="value"
            variant="outlined"
            multiple
            chips
            class="mb-4"
            :disabled="loading"
          />
        </VCol>
      </VRow>
    </VCardText>

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

    <VCardActions class="px-6 justify-start">
      <VBtn
        :disabled="!isFormValid || loading"
        color="primary"
        variant="flat"
        :prepend-icon="!loading ? (isEditMode ? 'tabler-pencil' : 'tabler-plus') : ''"
        class="px-4"
        @click="handleSubmit"
      >
        <template v-if="loading">
          <VProgressCircular
            indeterminate
            size="20"
            color="white"
          />
        </template>
        {{ isEditMode ? "Update" : "Submit" }}
      </VBtn>
      <VSnackbar
        v-model="snackbar.show"
        :color="snackbar.color"
        timeout="3000"
        location="bottom left"
      >
        {{ snackbar.text }}
      </VSnackbar>
    </VCardActions>
  </VCard>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

const loading = ref(false)
const snackbar = ref({ show: false, text: '', color: 'success' })

function showSnackbar(message, color = 'success') {
  snackbar.value.text = message
  snackbar.value.color = color
  snackbar.value.show = true
}

import { useCoursesStore } from '@/stores/useCoursesStore'
import { useRoute, useRouter } from 'vue-router'

const coursesStore = useCoursesStore()
const route = useRoute()
const router = useRouter()

const form = ref({
  name: '',
  categoryId: '',
  departmentId: '',
  bookIds: [],
})

const isTouched = ref({
  name: false,
  categoryId: false,
  departmentId: false,
})

const isEditMode = computed(() => route.path.includes('edit'))
const courseId = computed(() => route.params.id)

onMounted(async () => {
  await coursesStore.fetchFormData()

  if (isEditMode.value && courseId.value) {
    try {
      await coursesStore.fetchCourseById(courseId.value) 

      const course = coursesStore.course
      if (course) {
        form.value = {
          name: course.name || '',
          categoryId: course.categoryId || '',
          departmentId: course.departmentId || '',
          bookIds: course.books?.map(book => book.id) || [],
        }
      }
    } catch (error) {
      console.error('Error fetching course for edit:', error)
    }
  }
})

const categories = computed(() =>
  coursesStore.categories.map(c => ({ title: c.name, value: c.id })),
)

const departments = computed(() =>
  coursesStore.departments.map(d => ({ title: d.name, value: d.id })),
)

const books = computed(() =>
  coursesStore.books.map(b => ({ title: b.name, value: b.id })),
)

const isFormValid = computed(() =>
  form.value.name.trim() &&
  form.value.categoryId.trim() &&
  form.value.departmentId.trim(),
)

const handleSubmit = async () => {
  isTouched.value.name = true
  isTouched.value.categoryId = true
  isTouched.value.departmentId = true

  if (!isFormValid.value) return

  loading.value = true

  const payload = {
    name: form.value.name,
    categoryId: form.value.categoryId,
    departmentId: form.value.departmentId,
    bookIds: form.value.bookIds,
  }

  try {
    if (isEditMode.value && courseId.value) {
      const res = await coursesStore.updateCourse(courseId.value, payload)

      console.log(res)
      if (res) {
        if (res.success) {
          showSnackbar('Course updated successfully', 'success')

          return
        } else {
          showSnackbar('Failed to update course', 'error')

          return
        }
      } else {
        showSnackbar('Failed to update course', 'error')

        return
      }
    } else {
      const result = await coursesStore.addCourse(payload)

      if (!result.success) {
        showSnackbar(result.message || 'Error adding course', 'error')

        return
      }
      showSnackbar('Course added successfully', 'success')

      form.value = { name: '', categoryId: '', departmentId: '', bookIds: [] }
      isTouched.value = { name: false, categoryId: false, departmentId: false }
    }
  } catch (error) {
    showSnackbar(error?.message || 'Error submitting course', 'error')

    // Keep field data on error
  } finally {
    loading.value = false
  }
}

// Units grid dialog logic
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
  // Here you would update the unit in the backend or store
  editDialog.value = false
}
function deleteUnit(unit) {
  if (confirm('Are you sure you want to delete this unit?')) {
    // Here you would delete the unit in the backend or store
  }
}
</script>
