<script setup>
import { computed } from 'vue'

const props = defineProps({
  translations: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['navigate-to-edit', 'open-modal'])

const translationHeaders = [
  { title: 'Language', key: 'language' },
  { title: 'Name', key: 'name' },
  { title: 'Title', key: 'title' },
  { title: 'Description', key: 'description' },
  { title: 'About', key: 'about' },
  { title: 'Demo', key: 'demoUrl' },
  { title: 'Pic', key: 'urlPic' },
  { title: 'Prerequisites', key: 'prerequisites' },
  { title: 'Outcomes', key: 'outcomes' },
  { title: 'Actions', key: 'actions' },
]

const translationItems = computed(() => {
  if (!props.translations) return []
  
  return Object.entries(props.translations).map(([lang, data]) => ({
    language: getLanguageName(lang),
    langCode: lang,
    name: data.name ?? 'Not Found',
    title: data.title ?? 'Not Found',
    description: data.description ?? 'Not Found',
    about: data.about ?? 'Not Found',
    demoUrl: data.demoUrl,
    urlPic: data.urlPic,
    prerequisites: data.prerequisites ?? [],
    learningOutcomes: data.learningOutcomes ?? [],
  }))
})

const getLanguageName = code => {
  switch (code) {
  case 'en': return 'English'
  case 'ar': return 'Arabic'
  case 'ru': return 'Russian'
  default: return 'Unknown Language'
  }
}
</script>

<template>
  <div>
    <VDataTable
      :headers="translationHeaders"
      :items="translationItems"
      :items-per-page="5"
      class="bg-transparent"
    >
      <template #item.demoUrl="{ item }">
        <VBtn
          v-if="item.demoUrl"
          color="primary"
          small
          @click="emit('open-modal', item.demoUrl, 'video')"
        >
          View Demo
        </VBtn>
        <span v-else>Not Found</span>
      </template>

      <template #item.urlPic="{ item }">
        <VBtn
          v-if="item.urlPic"
          color="primary"
          small
          @click="emit('open-modal', item.urlPic, 'image')"
        >
          View Picture
        </VBtn>
        <span v-else>Not Found</span>
      </template>

      <template #item.prerequisites="{ item }">
        <VBtn
          v-if="item.prerequisites.length"
          color="primary"
          small
          @click="emit('open-modal', item.prerequisites, 'prerequisites')"
        >
          View Prerequisites
        </VBtn>
        <span v-else>Not Found</span>
      </template>

      <template #item.outcomes="{ item }">
        <VBtn
          v-if="item.learningOutcomes.length"
          color="primary"
          small
          @click="emit('open-modal', item.learningOutcomes, 'outcomes')"
        >
          View Outcomes
        </VBtn>
        <span v-else>Not Found</span>
      </template>

      <template #item.actions="{ item }">
        <VBtn
          color="primary"
          small
          variant="outlined"
          @click="emit('navigate-to-edit', item.langCode)"
        >
          Edit
        </VBtn>
      </template>
    </VDataTable>
  </div>
</template>
