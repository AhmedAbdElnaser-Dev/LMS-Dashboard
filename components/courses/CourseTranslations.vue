<script setup>
import { computed } from 'vue'
import TranslationsTable from '@/components/global/TranslationsTable.vue'

const props = defineProps({
  translations: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['navigateToEdit', 'openModal'])

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

const langMap = {
  en: 'English',
  ar: 'Arabic',
  ru: 'Russian',
}

const transform = (item) => ({
  ...item,
  name: item.name ?? 'Not Found',
  title: item.title ?? 'Not Found',
  description: item.description ?? 'Not Found',
  about: item.about ?? 'Not Found',
  prerequisites: item.prerequisites ?? [],
  learningOutcomes: item.learningOutcomes ?? [],
})

const actions = [
  {
    label: 'Edit',
    icon: 'tabler-pencil',
    color: 'primary',
    variant: 'outlined',
    onClick: (item) => emit('navigateToEdit', item.langCode),
  },
]

const customSlots = {
  'item.demoUrl': true,
  'item.urlPic': true,
  'item.prerequisites': true,
  'item.outcomes': true,
}

const translationItems = computed(() => {
  if (!props.translations) return []
  
  return Object.entries(props.translations).map(([lang, data]) => ({
    language: langMap[lang],
    langCode: lang,
    ...data,
  }))
})
</script>

<template>
  <TranslationsTable
    :headers="translationHeaders"
    :items="translationItems"
    :lang-map="langMap"
    :transform="transform"
    :actions="actions"
    :custom-slots="customSlots"
    @navigateToEdit="lang => emit('navigateToEdit', lang)"
    @openModal="(...args) => emit('openModal', ...args)"
  >
    <template #item.demoUrl="{ item }">
      <VBtn
        v-if="item.demoUrl"
        color="primary"
        small
        @click="$emit('openModal', item.demoUrl, 'video')"
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
        @click="$emit('openModal', item.urlPic, 'image')"
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
        @click="$emit('openModal', item.prerequisites, 'prerequisites')"
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
        @click="$emit('openModal', item.learningOutcomes, 'outcomes')"
      >
        View Outcomes
      </VBtn>
      <span v-else>Not Found</span>
    </template>
  </TranslationsTable>
</template>
