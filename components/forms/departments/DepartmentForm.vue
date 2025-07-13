<template>
  <VCard class="shadow-lg rounded-lg py-6">
    <VCardTitle class="text-h4 font-weight-bold text-center mb-6">
      {{ isEditMode ? "Edit Department" : "Add Department" }}
    </VCardTitle>
    <VCardText>
      <VRow>
        <VCol
          cols="12"
          md="6"
        >
          <VTextField
            v-model="form.name"
            label="Department Name"
            variant="outlined"
            required
            class="mb-4"
            :error="isTouched.name && !form.name"
            :error-messages="isTouched.name && !form.name ? ['Name is required'] : []"
            :disabled="isLoading"
            @blur="isTouched.name = true"
          />
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <VSelect
            v-model="form.category"
            label="Category"
            :items="categories"
            item-title="title"
            item-value="value"
            variant="outlined"
            required
            class="mb-4"
            :error="isTouched.category && !form.category"
            :error-messages="isTouched.category && !form.category ? ['Category is required'] : []"
            :disabled="isLoading"
            @blur="isTouched.category = true"
          />
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <VSelect
            v-model="form.supervisor"
            label="Supervisor"
            :items="supervisors"
            item-title="title"
            item-value="value"
            variant="outlined"
            required
            class="mb-4"
            :error="isTouched.supervisor && !form.supervisor"
            :error-messages="isTouched.supervisor && !form.supervisor ? ['Supervisor is required'] : []"
            :disabled="isLoading"
            @blur="isTouched.supervisor = true"
          />
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <VSelect
            v-model="form.gender"
            label="Type"
            :items="genders"
            item-title="title"
            item-value="value"
            variant="outlined"
            required
            class="mb-4"
            :error="isTouched.gender && !form.gender"
            :error-messages="isTouched.gender && !form.gender ? ['Gender is required'] : []"
            :disabled="isLoading"
            @blur="isTouched.gender = true"
          />
        </VCol>
      </VRow>
    </VCardText>
    <VCardActions class="px-6 justify-start">
      <VBtn
        :disabled="!isFormValid || isLoading"
        color="primary"
        variant="flat"
        :prepend-icon="isEditMode ? 'tabler-pencil' : 'tabler-plus'"
        class="px-4"
        :loading="isLoading"
        @click="handleSubmit"
      >
        {{ isEditMode ? "Update" : "Submit" }}
      </VBtn>
    </VCardActions>
  </VCard>
</template>

<script setup>
import { useDepartmentsStore } from '@/stores/useDepartmentsStore'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const departmentsStore = useDepartmentsStore()
const route = useRoute()

const form = ref({
  name: '',
  category: '',
  supervisor: '',
  gender: '',
})

const isTouched = ref({
  name: false,
  category: false,
  supervisor: false,
  gender: false,
})

const isLoading = ref(false)
const isEditMode = computed(() => route.path.includes("edit"))

onMounted(async () => {
  isLoading.value = true
  try {
    await departmentsStore.fetchUsersAndCategories()
  } catch (error) {
    console.error("Failed to load initial data:", error)
  } finally {
    isLoading.value = false
  }
})

watch(() => departmentsStore.department, newDepartment => {
  if (newDepartment && route.path.includes("edit")) {
    form.value = {
      name: newDepartment.name || '',
      category: newDepartment.categoryName || '',
      supervisor: newDepartment.supervisor.id || '',
      gender: newDepartment.gender || '',
    }
  } else {
    form.value = { name: '', category: '', supervisor: '', gender: '' }
  }
}, { immediate: true })

const categories = computed(() => departmentsStore.categories.map(c => ({ title: c.name, value: c.id })))
const supervisors = computed(() => departmentsStore.users.map(u => ({ title: `${u.fullName} (${u.role})`, value: u.id })))

const genders = computed(() => [
  { title: "Male", value: "Male" },
  { title: "Female", value: "Female" },
  { title: "Kids", value: "Kids" },
])

const isFormValid = computed(() =>
  form.value.name.trim() !== '' &&
  form.value.category.trim() !== '' &&
  form.value.supervisor.trim() !== '' &&
  form.value.gender.trim() !== '',
)

const handleSubmit = async () => {
  isTouched.value.name = true
  isTouched.value.category = true
  isTouched.value.supervisor = true
  isTouched.value.gender = true

  if (!isFormValid.value) return

  isLoading.value = true
  try {
    if (isEditMode.value) {
      await departmentsStore.updateDepartment(route.params.id, {
        id: route.params.id,
        name: form.value.name,
        categoryId: form.value.category,
        supervisorId: form.value.supervisor,
        gender: form.value.gender,
      })
    } else {
      await departmentsStore.addDepartment({
        name: form.value.name,
        categoryId: form.value.category,
        supervisorId: form.value.supervisor,
        gender: form.value.gender,
      })

      // Reset form after successful submission in add mode
      if (!isEditMode.value) {
        form.value = { name: '', category: '', supervisor: '', gender: '' }
        isTouched.value = { name: false, category: false, supervisor: false, gender: false }
      }
    }
  } catch (error) {
    console.error("Form submission failed:", error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Empty */
</style>
