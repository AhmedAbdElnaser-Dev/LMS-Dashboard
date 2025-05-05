<script setup>
import EditOutline from '@/components/forms/EditOutline.vue'
import ArabicTranslationForm from '@/components/forms/groups/ArabicTranslationForm.vue'
import EnglishTranslationForm from '@/components/forms/groups/EnglishTranslationForm.vue'
import GroupFormEdit from '@/components/forms/groups/GroupFormEdit.vue'
import RussianTranslationForm from '@/components/forms/groups/RussianTranslationForm.vue'
import { useGroupsStore } from '@/stores/useGroupsStore'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const groupId = route.params.id

const groupsStore = useGroupsStore()
const { currentGroup, loading } = storeToRefs(groupsStore)
const error = ref(null)

const basicInfo = GroupFormEdit
const arabicTranslation = ArabicTranslationForm
const englishTranslation = EnglishTranslationForm
const russianTranslation = RussianTranslationForm

const handleBasicInfoSubmit = async values => {
  try {
    await groupsStore.updateGroup(groupId, values)
    await groupsStore.getGroupById(groupId)
  } catch (err) {
    error.value = err.message || 'Failed to update group'
  }
}

const handleTranslationSubmit = async ({ language, name, description }) => {
  try {
    await groupsStore.submitTranslation({
      groupId,
      language,
      name,
      description,
    })
  } catch (err) {
    error.value = err.message || 'Failed to update translation'
  }
}

const handleSuccess = response => {
  if (response?.deleted) {
    router.push('/dashboard/courses')
  }
}

onMounted(async () => {
  try {
    await groupsStore.getGroupById(groupId)
    await groupsStore.getInstructors()
  } catch (err) {
    error.value = err.message || 'Failed to fetch group'
  }
})
</script>

<template>
  <VCard v-if="!groupsStore.loading">
    <EditOutline
      :basic-info-form="basicInfo"
      :arabic-form="arabicTranslation"
      :english-form="englishTranslation"
      :russian-form="russianTranslation"
      :loading="loading"
      :error="error"
      :initial-values="currentGroup"
      @basic-info-submit="handleBasicInfoSubmit"
      @translation-submit="handleTranslationSubmit"
      @success="handleSuccess"
    />
  </VCard>
</template>
