<script setup>
import { computed } from 'vue'

const props = defineProps({
  group: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['editTranslation'])

const languages = [
  { title: 'Arabic', value: 'ar', icon: 'tabler-letter-a' },
  { title: 'English', value: 'en', icon: 'tabler-language' },
  { title: 'Russian', value: 'ru', icon: 'tabler-letter-r' },
]

const getTranslation = lang =>
  props.group.translations?.find(t => t.language === lang) || null

const translations = computed(() =>
  languages.map(lang => ({
    ...lang,
    translation: getTranslation(lang.value),
  })),
)

const formatDate = date => {
  if (!date) return '-'

  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const navigateToTranslation = lang => {
  emit('editTranslation', lang)
}
</script>

<template>
  <div>
    <!-- Instructor Details -->
    <div class="mb-6">
      <InstructorDetails
        v-if="props.group.instructor"
        :instructor="props.group.instructor"
      />
      <span
        v-else
        class="text-subtitle-1 text-disabled"
      >
        No instructor assigned
      </span>
    </div>

    <!-- Translation Cards -->
    <VRow>
      <VCol
        v-for="lang in translations"
        :key="lang.value"
        cols="12"
        md="4"
      >
        <VCard
          variant="outlined"
          class="h-100"
        >
          <VCardItem>
            <template #prepend>
              <VIcon
                :icon="lang.icon"
                size="24"
                class="me-2"
              />
            </template>
            <VCardTitle>{{ lang.title }}</VCardTitle>
          </VCardItem>

          <VCardText v-if="lang.translation">
            <h3 class="text-h6 mb-2">
              {{ lang.translation.name }}
            </h3>
            <p class="text-body-1">
              {{ lang.translation.description }}
            </p>

            <VBtn
              color="primary"
              variant="text"
              class="mt-2"
              prepend-icon="tabler-pencil"
              @click="navigateToTranslation(lang.value)"
            >
              Edit {{ lang.title }}
            </VBtn>
          </VCardText>

          <VCardText v-else>
            <p class="text-body-1">
              No translation available
            </p>
            <VBtn
              color="primary"
              variant="text"
              prepend-icon="tabler-plus"
              @click="navigateToTranslation(lang.value)"
            >
              Add {{ lang.title }}
            </VBtn>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Group Stats -->
    <VDivider class="my-4" />

    <div class="d-flex gap-4 flex-wrap">
      <VCard
        variant="outlined"
        class="stat-card"
      >
        <VCardTitle>Max Students</VCardTitle>
        <VCardText>
          <div class="text-h5">
            {{ props.group.maxStudents || '-' }}
          </div>
        </VCardText>
      </VCard>

      <VCard
        variant="outlined"
        class="stat-card"
      >
        <VCardTitle>Current Students</VCardTitle>
        <VCardText>
          <div class="text-h5">
            {{ props.group.currentStudentCount || '0' }}
          </div>
        </VCardText>
      </VCard>
    </div>
  </div>
</template>

<style scoped>
.stat-card {
  min-inline-size: 200px;
}
</style>
