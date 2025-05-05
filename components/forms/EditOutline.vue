<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
  basicInfoForm: { type: Object, default: null },
  arabicForm: { type: Object, default: null },
  englishForm: { type: Object, default: null },
  russianForm: { type: Object, default: null },
})

const route = useRoute()
const router = useRouter()

// Tabs Data
const tabs = computed(() => [
  { key: 'basic', title: 'Basic Info', form: props.basicInfoForm },
  { key: 'ar', title: 'Arabic Translation', form: props.arabicForm },
  { key: 'en', title: 'English Translation', form: props.englishForm },
  { key: 'ru', title: 'Russian Translation', form: props.russianForm },
])

const activeTab = ref(0)

const updateActiveTab = () => {
  const tabKey = route.query.tab || 'basic'
  const foundIndex = tabs.value.findIndex(tab => tab.key === tabKey && tab.form)

  activeTab.value = foundIndex !== -1 ? foundIndex : 0
}

watch(() => route.query.tab, updateActiveTab, { immediate: true })

// Handle tab click and update query parameter
const changeTab = index => {
  if (!tabs.value[index].form) return
  activeTab.value = index
  router.push({ query: { tab: tabs.value[index].key } })
}
</script>

<template>
  <div class="d-flex">
    <!-- Sidebar Tabs -->
    <VList class="sidebar-tabs">
      <VListItem
        v-for="(tab, index) in tabs"
        :key="index"
        :disabled="!tab.form"
        :active="activeTab === index"
        @click="changeTab(index)"
      >
        {{ tab.title }}
      </VListItem>
    </VList>

    <div class="tab-content">
      <VWindow
        :model-value="activeTab"
        @update:model-value="val => activeTab.value = val"
      >
        <VWindowItem
          v-for="(tab, index) in tabs"
          :key="index"
        >
          <component
            :is="tab.form"
            v-if="tab.form"
          />
        </VWindowItem>
      </VWindow>
    </div>
  </div>
</template>

<style scoped>
.sidebar-tabs {
  padding: 10px;
  border-inline-end: 2px solid #ddd;
  inline-size: 200px;
}

.sidebar-tabs .v-list-item {
  padding: 12px;
  cursor: pointer;
  transition: background 0.3s, color 0.3s;
}

/* Vuetify's active item class */
.sidebar-tabs .v-list-item.v-list-item--active {
  backdrop-filter: blur(12px);
  color: var(--v-theme-primary);
  font-weight: bold;
}

.sidebar-tabs .v-list-item.disabled-tab {
  color: gray;
  cursor: not-allowed;
}

.tab-content {
  flex: 1;
  padding: 20px;
}
</style>
