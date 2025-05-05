<template>
  <div>
    <div v-if="loading">
      <VProgressCircular
        indeterminate
        color="primary"
      />
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
          @click="() => router.push(`/dashboard/units/edit/${id}`)"
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
              v-if="unit.lessons && unit.lessons.length"
              :headers="lessonHeaders"
              :items="unit.lessons"
              name="lessons"
            >
              <template #item.actions="{ item }">
                <VBtn
                  icon="tabler-eye"
                  variant="text"
                  color="primary"
                  @click="previewLesson(item)"
                />
                <VBtn
                  icon="tabler-pencil"
                  variant="text"
                  color="warning"
                  @click="editLesson(item)"
                />
                <VBtn
                  icon="tabler-trash"
                  variant="text"
                  color="error"
                  @click="deleteUnit(item.id)"
                />
              </template>
            </DataGrid>
            <div
              v-else
              class="text-grey"
            >
              No lessons found for this unit.
            </div>
          </VExpansionPanelText>
        </VExpansionPanel>
        <!-- Translations Panel -->
        <VExpansionPanel>
          <VExpansionPanelTitle>
            <VIcon
              start
              icon="tabler-language"
            />
            Translations
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            <div v-if="unit.translations && unit.translations.length">
              <!-- Implement translations table or list here -->
              <span>Translations coming soon...</span>
            </div>
            <div
              v-else
              class="text-grey"
            >
              No translations found for this unit.
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
const activeTab = ref('lessons')
const loading = ref(false)
const error = ref(null)

// Lessons DataGrid headers
const lessonHeaders = [
  { title: 'Title', key: 'title' },
  { title: 'Description', key: 'description' },
  { title: 'Actions', key: 'actions', sortable: false },
]

const previewLesson = lesson => {
  router
}

const editLesson = lesson => {
  // TODO: Implement lesson edit
}

const deleteUnit = async unitId => {
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
