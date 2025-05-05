<script setup>
import { useGroupsStore } from '@/stores/useGroupsStore'
import { computed, ref, watch } from 'vue'

const groupsStore = useGroupsStore()

const form = ref({
  name: '',
  description: '',
})

const isTouched = ref({
  name: false,
  description: false,
})

const isEditMode = computed(() => {
  const ruTranslation = groupsStore.currentGroup?.translations?.find(
    t => t.language === 'ru',
  )
  
  return !!ruTranslation
})

const isFormValid = computed(() => 
  form.value.name.trim() !== '' && 
  form.value.description.trim() !== '',
)

const handleSubmit = async () => {
  isTouched.value.name = true
  isTouched.value.description = true

  if (!isFormValid.value) return

  try {
    const groupId = groupsStore.currentGroup?.id
    if (!groupId) {
      console.error('No group selected')
      
      return
    }

    await groupsStore.submitTranslation({
      groupId,
      language: 'ru',
      name: form.value.name,
      description: form.value.description,
    })
  } catch (err) {
    console.error('Error submitting translation:', err)
  }
}

const initializeForm = () => {
  const ruTranslation = groupsStore.currentGroup?.translations?.find(
    t => t.language === 'ru',
  )

  form.value.name = ruTranslation?.name || ''
  form.value.description = ruTranslation?.description || ''
}

// Initialize form immediately and watch for changes to currentGroup
initializeForm()
watch(
  () => groupsStore.currentGroup,
  () => initializeForm(),
  { deep: true },
)
</script>

<template>
  <VCard class="shadow-lg rounded-lg py-6">
    <VCardText class="pa-6">
      <VTextField
        v-model="form.name"
        label="Group Name (Russian)"
        variant="outlined"
        dense
        required
        class="mb-4"
        :error="isTouched.name && !form.name.trim()"
        :error-messages="isTouched.name && !form.name.trim() ? ['This field is required'] : []"
        @blur="isTouched.name = true"
      />
      <VTextarea
        v-model="form.description"
        label="Group Description (Russian)"
        variant="outlined"
        dense
        required
        class="mb-4"
        :error="isTouched.description && !form.description.trim()"
        :error-messages="isTouched.description && !form.description.trim() ? ['This field is required'] : []"
        @blur="isTouched.description = true"
      />
    </VCardText>

    <VCardActions class="px-6 justify-start">
      <VBtn
        color="primary"
        variant="flat"
        :disabled="!isFormValid"
        :prepend-icon="isEditMode ? 'tabler-pencil' : 'tabler-plus'"
        class="px-4"
        @click="handleSubmit"
      >
        {{ isEditMode ? 'Update' : 'Add' }} Translation
      </VBtn>
    </VCardActions>
  </VCard>
</template>
