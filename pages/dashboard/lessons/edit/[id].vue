<script setup>
import EditOutline from '@/components/forms/EditOutline.vue'
import ArabicTranslationForm from '@/components/forms/lessons/ArabicTranslationForm.vue'
import EnglishTranslationForm from '@/components/forms/lessons/EnglishTranslationForm.vue'
import LessonForm from '@/components/forms/lessons/LessonForm.vue'
import RussianTranslationForm from '@/components/forms/lessons/RussianTranslationForm.vue'

const basicInfo = LessonForm
const arabicTranslation = ArabicTranslationForm
const englishTranslation = EnglishTranslationForm
const russianTranslation = RussianTranslationForm

const route = useRoute()
const lessonId = route.params.id

const lessonsStore = useLessonsStore()

onMounted(async () => {
  await lessonsStore.getLesson(lessonId)
})
</script>

<template>
  <VCard v-if="!lessonsStore.state.loading">
    <EditOutline
      :loading="lessonsStore.state.loading"
      :basic-info-form="basicInfo"
      :arabic-form="arabicTranslation"
      :english-form="englishTranslation"
      :russian-form="russianTranslation"
    />
  </VCard>
  <VText v-else>
    Loading...
  </VText>
</template>
