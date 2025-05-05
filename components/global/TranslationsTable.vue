<template>
  <div>
    <VDataTable
      :headers="headers"
      :items="tableItems"
      :items-per-page="itemsPerPage"
      class="bg-transparent"
    >
      <template v-for="(_, slotName) in customSlots" #[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps" />
      </template>
      <template #item.actions="{ item }">
        <slot name="actions" :item="item">
          <VBtn
            v-for="(action, i) in actions"
            :key="i"
            :color="action.color || 'primary'"
            :variant="action.variant || 'outlined'"
            :icon="action.icon"
            size="small"
            @click="() => action.onClick(item)"
          >
            {{ action.label }}
          </VBtn>
        </slot>
      </template>
    </VDataTable>
  </div>
</template>

<script setup>
import { computed, toRefs } from 'vue'

const props = defineProps({
  items: { type: [Array, Object], required: true },
  headers: { type: Array, required: true },
  itemsPerPage: { type: Number, default: 5 },
  langMap: { type: Object, default: () => ({}) }, // { en: 'English', ... }
  transform: { type: Function, default: null }, // function to map items to table rows
  actions: { type: Array, default: () => [] }, // [{ label, icon, color, variant, onClick(item) }]
  customSlots: { type: Object, default: () => ({}) }, // { 'item.demoUrl': true, ... }
})

const { items, langMap, transform } = toRefs(props)

const tableItems = computed(() => {
  if (typeof items.value !== 'object') return []
  let arr = Array.isArray(items.value)
    ? items.value
    : Object.entries(items.value).map(([lang, data]) => ({ lang, ...data }))
  if (transform.value) arr = arr.map(transform.value)
  if (langMap.value && Object.keys(langMap.value).length) {
    arr = arr.map(item => ({
      ...item,
      language: langMap.value[item.lang] || item.language || item.lang,
    }))
  }
  return arr
})
</script>
