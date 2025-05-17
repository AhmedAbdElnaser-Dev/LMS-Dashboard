<script setup>
import { useLessonsStore } from '@/stores/useLessonsStore'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const lessonId = route.params.id

const lessonsStore = useLessonsStore()

const openPanels = ref([0, 1, 2, 3])

const languages = [
  { title: 'Arabic', value: 'ar', icon: 'tabler-letter-a' },
  { title: 'English', value: 'en', icon: 'tabler-language' },
  { title: 'Russian', value: 'ru', icon: 'tabler-letter-r' },
]

const getTranslation = lang =>
  lessonsStore.state.lesson?.translations?.find(t => t.language === lang) || null

const translations = computed(() =>
  languages.map(lang => ({
    ...lang,
    translation: getTranslation(lang.value),
  })),
)

const navigateToTranslation = lang => {
  router.push(`/dashboard/lessons/edit/${lessonId}?lang=${lang}`)
}

onMounted(async () => {
  try {
    await lessonsStore.getLesson(lessonId)
  } catch (err) {
    console.error('Failed to load lesson data:', err)
  }
})
</script>

<template>
  <div>
    <div v-if="lessonsStore.state.loading">
      Loading...
    </div>

    <div v-else-if="lessonsStore.state.error">
      {{ lessonsStore.state.error }}
    </div>

    <div v-else-if="lessonsStore.state.lesson">
      <div class="d-flex justify-space-between align-center mb-6">
        <h1 class="text-h4">
          {{ lessonsStore.state.lesson.title || 'Untitled Lesson' }}
        </h1>
        <VBtn
          color="primary"
          variant="outlined"
          prepend-icon="tabler-pencil"
          @click="() => router.push(`/dashboard/lessons/edit/${lessonId}`)"
        >
          Edit Lesson
        </VBtn>
      </div>

      <VExpansionPanels
        v-model="openPanels"
        multiple
        variant="accordion"
      >
        <!-- Description Panel -->
        <VExpansionPanel>
          <VExpansionPanelTitle>Description</VExpansionPanelTitle>
          <VExpansionPanelText>
            <VCard class="mb-4">
              <VCardText>
                <div v-if="lessonsStore.state.lesson.description">
                  {{ lessonsStore.state.lesson.description }}
                </div>
                <div
                  v-else
                  class="text-grey"
                >
                  No description available.
                </div>
              </VCardText>
            </VCard>
          </VExpansionPanelText>
        </VExpansionPanel>

        <!-- Translations Panel -->
        <VExpansionPanel>
          <VExpansionPanelTitle>Translations</VExpansionPanelTitle>
          <VExpansionPanelText>
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
          </VExpansionPanelText>
        </VExpansionPanel>
      </VExpansionPanels>
    </div>

    <div v-else>
      No lesson data available.
    </div>
  </div>
</template>
