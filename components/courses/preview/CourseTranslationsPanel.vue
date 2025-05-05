<template>
  <VExpansionPanel>
    <VExpansionPanelTitle>
      <VIcon
        start
        icon="tabler-language"
      />
      Translations
    </VExpansionPanelTitle>
    <VExpansionPanelText>
      <CourseTranslationsCards
        :translations="course.translations"
        @edit-translation="lang => $emit('edit-translation', lang)"
        @open-modal="handleOpenModal"
      />
    </VExpansionPanelText>
    <VDialog
      v-model="modalOpen"
      max-width="600"
      persistent
    >
      <VCard>
        <VCardTitle class="d-flex justify-space-between align-center">
          <span v-if="modalType === 'demo'">Demo Video</span>
          <span v-else-if="modalType === 'outcomes'">Learning Outcomes</span>
          <span v-else-if="modalType === 'prerequisites'">Prerequisites</span>
          <VBtn
            icon="tabler-x"
            variant="text"
            @click="closeModal"
          />
        </VCardTitle>
        <VCardText>
          <template v-if="modalType === 'demo'">
            <div v-if="modalData.url">
              <iframe
                v-if="modalData.url.includes('youtube')"
                :src="`https://www.youtube.com/embed/${getYoutubeId(modalData.url)}`"
                width="100%"
                height="320"
                frameborder="0"
                allowfullscreen
              />
              <video
                v-else
                :src="modalData.url"
                width="100%"
                height="320"
                controls
              />
            </div>
            <div v-else>
              No demo video available.
            </div>
          </template>
          <template v-else-if="modalType === 'outcomes'">
            <div v-if="modalData.outcomes && modalData.outcomes.length">
              <div
                v-for="(outcome, i) in modalData.outcomes"
                :key="i"
                class="d-flex align-center mb-2"
              >
                <VIcon
                  color="success"
                  icon="tabler-check"
                  class="me-2"
                />
                <span>{{ outcome }}</span>
              </div>
            </div>
            <div v-else>
              No outcomes available.
            </div>
          </template>
          <template v-else-if="modalType === 'prerequisites'">
            <div v-if="modalData.prerequisites && modalData.prerequisites.length">
              <div
                v-for="(prereq, i) in modalData.prerequisites"
                :key="i"
                class="d-flex align-center mb-2"
              >
                <VIcon
                  color="info"
                  icon="tabler-arrow-right"
                  class="me-2"
                />
                <span>{{ prereq }}</span>
              </div>
            </div>
            <div v-else>
              No prerequisites available.
            </div>
          </template>
        </VCardText>
        <VCardActions>
          <VBtn
            color="primary"
            @click="closeModal"
          >
            Close
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VExpansionPanel>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  course: { type: Object, required: true },
  selectedUnit: { type: Object, default: null },
})

// Modal state for demo, outcomes, prerequisites
const modalOpen = ref(false)
const modalType = ref('')
const modalData = ref({})

function handleOpenModal(payload) {
  modalType.value = payload.type
  modalData.value = payload
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
  modalType.value = ''
  modalData.value = {}
}

// Helper for extracting YouTube ID
function getYoutubeId(url) {
  const match = url.match(/[?&]v=([^&#]+)/) || url.match(/youtu\.be\/([^?&#]+)/)

  return match ? match[1] : ''
}
</script>
