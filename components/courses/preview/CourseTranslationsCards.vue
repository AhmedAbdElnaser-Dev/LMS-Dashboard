<script setup>
import { computed } from 'vue'

const props = defineProps({
  translations: {
    type: Object,
    required: true,
  },
  languages: {
    type: Array,
    default: () => ([
      { title: 'Arabic', value: 'ar', icon: 'tabler-letter-a' },
      { title: 'English', value: 'en', icon: 'tabler-language' },
      { title: 'Russian', value: 'ru', icon: 'tabler-letter-r' },
    ]),
  },
})

const emit = defineEmits(['editTranslation', 'openModal', 'customAction'])

const getTranslation = lang => props.translations?.[lang] || null

const translationCards = computed(() =>
  props.languages.map(lang => ({
    ...lang,
    translation: getTranslation(lang.value),
  })),
)

const handleEdit = lang => {
  emit('editTranslation', lang)
}

const handleCustomAction = (lang, translation) => {
  emit('customAction', { lang, translation })
}
</script>

<template>
  <VRow>
    <VCol
      v-for="lang in translationCards"
      :key="lang.value"
      cols="12"
      md="4"
    >
      <VCard
        :color="lang.translation ? undefined : 'grey-lighten-3'"
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
          <VCardTitle class="d-flex align-center justify-space-between">
            <span>{{ lang.title }}</span>
            <VMenu>
              <template #activator="{ props }">
                <VBtn
                  v-bind="props"
                  icon
                  variant="text"
                  size="small"
                  class="ml-2"
                >
                  <VIcon icon="tabler-dots-vertical" />
                </VBtn>
              </template>
              <VList>
                <VListItem
                  prepend-icon="tabler-pencil"
                  @click="handleEdit(lang.value)"
                >
                  <VListItemTitle>Edit {{ lang.title }}</VListItemTitle>
                </VListItem>
                <VListItem
                  v-if="lang.translation && lang.translation.demoUrl"
                  prepend-icon="tabler-brand-youtube"
                  @click="$emit('openModal', { type: 'demo', url: lang.translation.demoUrl, lang: lang.value })"
                >
                  <VListItemTitle>Demo Video</VListItemTitle>
                </VListItem>
                <VListItem
                  v-if="lang.translation"
                  prepend-icon="tabler-list-details"
                  @click="$emit('openModal', { type: 'outcomes', outcomes: lang.translation.learningOutcomes ?? [], lang: lang.value })"
                >
                  <VListItemTitle>Outcomes</VListItemTitle>
                </VListItem>
                <VListItem
                  v-if="lang.translation"
                  prepend-icon="tabler-list-check"
                  @click="$emit('openModal', { type: 'prerequisites', prerequisites: lang.translation.prerequisites ?? [], lang: lang.value })"
                >
                  <VListItemTitle>Prerequisites</VListItemTitle>
                </VListItem>
              </VList>
            </VMenu>
          </VCardTitle>
        </VCardItem>

        <VCardText v-if="lang.translation">
          <h3 class="text-h6 mb-2">
            {{ lang.translation.name || '-' }}
          </h3>
          <p class="text-body-1">
            {{ lang.translation.description || '-' }}
          </p>
        </VCardText>

        <VCardText v-else>
          <VAlert
            type="info"
            variant="tonal"
            text="No content available for this language"
            class="mb-2"
          />
          <VBtn
            color="primary"
            variant="text"
            prepend-icon="tabler-plus"
            @click="handleEdit(lang.value)"
          >
            Add {{ lang.title }}
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style scoped>
.h-100 {
  block-size: 100%;
}
</style>
