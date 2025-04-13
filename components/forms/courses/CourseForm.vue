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
          />
        </VCol>
      </VRow>
    </VCardText>

    <VCardActions class="px-6 justify-start">
      <VBtn
        :disabled="!isFormValid || coursesStore.loading"
        color="primary"
        variant="flat"
        :prepend-icon="isEditMode ? 'tabler-pencil' : 'tabler-plus'"
        class="px-4"
        @click="handleSubmit"
      >
        {{ isEditMode ? "Update" : "Submit" }}
      </VBtn>
    </VCardActions>
  </VCard>
</template>

<script setup>
import { useCoursesStore } from '@/stores/useCoursesStore'
import { computed, onMounted, ref } from 'vue'
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
  // Fetch form data (categories, departments, books)
  await coursesStore.fetchFormData()

  // If in edit mode, fetch and populate course data
  if (isEditMode.value && courseId.value) {
    try {
      await coursesStore.fetchCourseById(courseId.value) // Fetch the course data

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

  const payload = {
    name: form.value.name,
    categoryId: form.value.categoryId,
    departmentId: form.value.departmentId,
    bookIds: form.value.bookIds,
  }

  try {
    if (isEditMode.value && courseId.value) {
      await coursesStore.updateCourse(courseId.value, payload)
      console.log('Course updated successfully')
    } else {
      await coursesStore.addCourse(payload)
      console.log('Course added successfully')
    }
  } catch (error) {
    console.error('Error submitting course:', error)
  }
}
</script>
