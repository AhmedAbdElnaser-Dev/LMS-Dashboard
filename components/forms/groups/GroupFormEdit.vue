<template>
  <VCard
    v-if="!isLoading"
    class="shadow-lg rounded-lg py-6"
  >
    <VCardTitle class="text-h4 font-weight-bold text-center mb-6">
      Edit Group
    </VCardTitle>

    <VCardText>
      <VRow>
        <VCol
          cols="12"
          md="6"
        >
          <VTextField
            v-model="form.name"
            label="Group Name"
            variant="outlined"
            required
            class="mb-4"
            :disabled="isSubmitting"
            :error="isTouched.name && !form.name"
            :error-messages="isTouched.name && !form.name ? ['Name is required'] : []"
            @blur="isTouched.name = true"
          />
        </VCol>

        <VCol
          cols="12"
          md="6"
        >
          <VTextField
            v-model.number="form.maxStudents"
            label="Maximum Students"
            type="number"
            variant="outlined"
            required
            class="mb-4"
            :disabled="isSubmitting"
            :error="isTouched.maxStudents && !form.maxStudents"
            :error-messages="
              isTouched.maxStudents && !form.maxStudents
                ? ['Maximum students is required']
                : isTouched.maxStudents && form.maxStudents < 5
                  ? ['Must be at least 5 students']
                  : isTouched.maxStudents && form.maxStudents > 100
                    ? ['Cannot exceed 100 students']
                    : []
            "
            min="5"
            max="100"
            @blur="isTouched.maxStudents = true"
          />
        </VCol>

        <VCol
          cols="12"
          md="6"
        >
          <VSelect
            v-model="form.instructorId"
            label="Select Instructor"
            variant="outlined"
            required
            class="mb-4"
            :items="instructors"
            item-title="fullName"
            item-value="id"
            :disabled="isSubmitting"
            :error="isTouched.instructorId && !form.instructorId"
            :error-messages="isTouched.instructorId && !form.instructorId ? ['Instructor is required'] : []"
            @blur="isTouched.instructorId = true"
          />
        </VCol>
      </VRow>
    </VCardText>

    <VCardActions class="px-6 justify-start">
      <VBtn
        :disabled="!isFormValid || isSubmitting"
        color="primary"
        variant="flat"
        class="px-4"
        @click="handleSubmit"
      >
        <template v-if="isSubmitting">
          <VProgressCircular
            indeterminate
            size="20"
            color="white"
          />
        </template>
        Update Group
      </VBtn>
    </VCardActions>
  </VCard>

  <VCard v-else>
    <VCardText>Loading...</VCardText>
  </VCard>
</template>

<script setup>
import { useGroupsStore } from '@/stores/useGroupsStore'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const groupsStore = useGroupsStore()
const { currentGroup } = storeToRefs(groupsStore)
const route = useRoute()
const router = useRouter()

const groupId = route.params.id || null
const instructors = ref([])
const isLoading = ref(true)
const error = ref(null)

const form = ref({
  groupId: groupId,
  name: '',
  maxStudents: 5,
  instructorId: '',
  courseId: '',
})

const isTouched = ref({
  name: false,
  maxStudents: false,
  instructorId: false,
})

const isSubmitting = ref(false)

const isFormValid = computed(() =>
  form.value.name.trim() !== '' &&
  form.value.maxStudents >= 5 &&
  form.value.maxStudents <= 100 &&
  form.value.instructorId.trim() !== '',
)

watch(
  () => currentGroup.value,
  group => {
    if (group && isLoading.value) {
      // only initialize once when loading
      form.value.groupId = group.id || groupId
      form.value.name = group.name || ''
      form.value.maxStudents = group.maxStudents || 5
      form.value.instructorId = group.instructor?.id || ''
      form.value.courseId = group.courseId || ''
    }
  },
  { immediate: true },
)

const handleSubmit = async () => {
  isTouched.value.name = true
  isTouched.value.maxStudents = true
  isTouched.value.instructorId = true

  if (!isFormValid.value) return

  isSubmitting.value = true
  error.value = null

  try {
    await groupsStore.updateGroup({
      groupId: form.value.groupId,
      name: form.value.name,
      instructorId: form.value.instructorId,
      maxStudents: form.value.maxStudents,
    })

    // optionally: show success message or navigate away
  } catch (err) {
    console.error('Error updating group:', err)
    error.value = err.message || 'Failed to update group'
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  try {
    if (!groupId) {
      error.value = 'Invalid group ID'
      console.error('No group ID provided')

      return
    }
    instructors.value = await groupsStore.getInstructors()
    console.log('instructors:', instructors.value)
  } catch (err) {
    error.value = err.message || 'Failed to initialize form'
    console.error('Error in onMounted:', err)
  } finally {
    isLoading.value = false
  }
})
</script>
