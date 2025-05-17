<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const lessonsStore = useLessonsStore()

const form = ref({
  title: '',
  description: '',
  content: '',
})

const isTouched = ref(false)
const isLoading = ref(false)
const lessonId = computed(() => route.params.id)

const isEditMode = computed(() => {
  return lessonsStore.state.lesson?.translations.find(
    translation => translation.language === 'ar',
  )
})

onMounted(async () => {
  if (isEditMode.value && lessonId.value) {
    const arTranslation = lessonsStore.state.lesson?.translations?.find(
      translation => translation.language === 'ar',
    )

    console.log('Arabic Translation:', arTranslation)

    if (arTranslation) {
      form.value.title = arTranslation.title || ''
      form.value.description = arTranslation.description || ''
      form.value.content = arTranslation.content || ''
    }
  }

  if (!lessonsStore.state.lesson && lessonId.value) {
    isLoading.value = true
    try {
      await lessonsStore.getLesson(lessonId.value)

      const arTranslation = lessonsStore.state.lesson?.translations?.find(
        translation => translation.language === 'ar',
      )

      if (arTranslation) {
        form.value.title = arTranslation.title || ''
        form.value.description = arTranslation.description || ''
        form.value.content = arTranslation.content || ''
        isTouched.value = true
      }
    } catch (error) {
      console.error('Failed to load lesson:', error)
    } finally {
      isLoading.value = false
    }
  }
})

const isFormValid = computed(() => {
  return form.value.title.trim() !== '' &&
         form.value.description.trim() !== '' &&
         form.value.content.trim() !== ''
})

const handleSubmit = async () => {
  isTouched.value = true

  if (isFormValid.value) {
    isLoading.value = true
    try {
      await lessonsStore.submitTranslation({
        language: 'ar',
        title: form.value.title,
        description: form.value.description,
        content: form.value.content,
      })
    } catch (error) {
      console.error('Submit failed:', error)
    } finally {
      isLoading.value = false
    }
  }
}
</script>

<template>
  <VCard class="shadow-lg rounded-lg py-6">
    <VCardText class="pa-6">
      <VRow>
        <VCol
          cols="12"
          md="6"
        >
          <VTextField
            v-model="form.title"
            label="Lesson Title (Arabic)"
            variant="outlined"
            dense
            required
            class="mb-4"
            :disabled="isLoading"
            :error="isTouched && !form.title.trim()"
            :error-messages="isTouched && !form.title.trim() ? ['This field is required'] : []"
            @blur="isTouched = true"
          />
        </vcol>

        <VCol
          cols="12"
          md="6"
        >
          <VTextField
            v-model="form.description"
            label="Lesson Description (Arabic)"
            variant="outlined"
            dense
            required
            class="mb-4"
            :disabled="isLoading"
            :error="isTouched && !form.description.trim()"
            :error-messages="isTouched && !form.description.trim() ? ['This field is required'] : []"
            @blur="isTouched = true"
          />
        </VCol>

        <VCol cols="12">
          <VTextarea
            v-model="form.content"
            label="Lesson Content (Arabic)"
            variant="outlined"
            dense
            required
            class="mb-4"
            :disabled="isLoading"
            :error="isTouched && !form.description.trim()"
            :error-messages="isTouched && !form.description.trim() ? ['This field is required'] : []"
            @blur="isTouched = true"
          />
        </VCol>
      </VRow>
    </VCardText>

    <VCardActions class="px-6 justify-start">
      <VBtn
        color="primary"
        variant="flat"
        :disabled="!isFormValid || isLoading"
        :loading="isLoading"
        :prepend-icon="isEditMode ? 'tabler-pencil' : 'tabler-plus'"
        class="px-4"
        @click="handleSubmit"
      >
        {{ isEditMode ? 'Update' : 'Add' }} Translation
      </VBtn>
    </VCardActions>
  </VCard>
</template>
