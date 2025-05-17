<template>
  <div>
    <div v-if="loading">
      Loading...
    </div>
    <div v-else-if="error">
      <VAlert
        type="error"
        variant="tonal"
      >
        {{ error }}
      </VAlert>
    </div>
    <div v-else-if="unit">
      <div class="d-flex justify-space-between align-center mb-6">
        <h1 class="text-h4">
          {{ unit.name }}
        </h1>
        <VBtn
          color="primary"
          variant="outlined"
          prepend-icon="tabler-pencil"
          @click="() => router.push(`/dashboard/units/edit/${unit.id}`)"
        >
          Edit Unit
        </VBtn>
      </div>

      <VExpansionPanels
        v-model="openPanels"
        multiple
        variant="accordion"
      >
        <!-- Lessons Panel -->
        <VExpansionPanel>
          <VExpansionPanelTitle>
            <VIcon
              start
              icon="tabler-book"
            />
            Lessons
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            <DataGrid
              :headers="lessonHeaders"
              :items="unit.lessons"
              name="lessons"
              :add-route="`${route.path}/add-lesson`"
              @delete="deleteLesson"
            />
          </VExpansionPanelText>
        </VExpansionPanel>

        <VExpansionPanel>
          <VExpansionPanelTitle>
            <VIcon
              start
              icon="tabler-language"
            />
            Translations
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            <div>
              <VRow>
                <VCol
                  v-for="lang in languages"
                  :key="lang.value"
                  cols="12"
                  md="4"
                >
                  <VCard
                    variant="outlined"
                    class="h-100 d-flex flex-column"
                  >
                    <VCardTitle class="d-flex align-center">
                      <VIcon
                        :icon="lang.icon"
                        size="24"
                        class="me-2"
                      />
                      <span>{{ lang.title }}</span>
                    </VCardTitle>
                    <VCardText class="flex-grow-1">
                      <h3 class="text-h6 mb-2">
                        {{
                          unit.translations.find(t => t.language === lang.value)?.name || '-'
                        }}
                      </h3>
                    </VCardText>
                    <VCardActions>
                      <VBtn
                        color="primary"
                        :prepend-icon="unit.translations.find(t => t.language === lang.value)?.name ? 'tabler-pencil' : 'tabler-plus'"
                        @click="goToEditTranslation(unit.id, lang.value)"
                      >
                        {{
                          unit.translations.find(t => t.language === lang.value)?.name ? 'Edit' : 'Add'
                        }}
                      </VBtn>
                    </VCardActions>
                  </VCard>
                </VCol>
              </VRow>
            </div>
          </VExpansionPanelText>
        </VExpansionPanel>
      </VExpansionPanels>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUnitsStore } from '~/stores/useUnitsStore'

const route = useRoute()
const router = useRouter()
const unitsStore = useUnitsStore()

const { unit } = storeToRefs(unitsStore)
const openPanels = ref([0, 1])
const loading = ref(false)
const error = ref(null)

// Lessons DataGrid headers
const lessonHeaders = [
  { title: 'Title', key: 'title' },
  { title: 'Description', key: 'description' },
  { title: 'Actions', key: 'actions', sortable: false },
]

const previewLesson = lesson => {
  // TODO: Implement preview
}

const deleteLesson = lessonId => {
  unitsStore.deleteLesson(lessonId)
}

// Language mappings
const languages = [
  { title: 'Arabic', value: 'ar', icon: 'tabler-letter-a' },
  { title: 'English', value: 'en', icon: 'tabler-language' },
  { title: 'Russian', value: 'ru', icon: 'tabler-letter-r' },
]

const getLanguageTitle = langCode => {
  const lang = languages.find(l => l.value === langCode)

  return lang ? lang.title : langCode
}

const getLanguageIcon = langCode => {
  const lang = languages.find(l => l.value === langCode)

  return lang ? lang.icon : 'tabler-language'
}

const goToEditTranslation = (unitId, language) => {
  router.push(`/dashboard/units/edit/${unitId}/?tab=${language}`)
}

onMounted(async () => {
  try {
    loading.value = true
    await unitsStore.getUnit(route.params.id)
  } catch (err) {
    error.value = 'Failed to load unit data'
    console.error('Error loading unit:', err)
  } finally {
    loading.value = false
  }
})
</script>
