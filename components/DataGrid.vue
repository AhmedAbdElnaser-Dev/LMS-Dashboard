<script setup>
import { computed, ref } from 'vue'
import ImagePreview from '~/components/ImagePreview.vue'

const props = defineProps({
  headers: {
    type: Array,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  addRoute: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['delete'])

const searchQuery = ref('')
const selectedRows = ref([])
const itemsPerPage = ref(5)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

const showDeleteModal = ref(false)
const itemToDelete = ref(null)

const filteredItems = computed(() => {
  return props.items.filter(item => {
    return Object.values(item).some(value =>
      String(value).toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
  })
})

const totalItems = computed(() => filteredItems.value.length)

const paginatedItems = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value

  return itemsPerPage.value === -1
    ? filteredItems.value
    : filteredItems.value.slice(start, end)
})

const totalPages = computed(() => {
  return itemsPerPage.value === -1
    ? 1
    : Math.ceil(totalItems.value / itemsPerPage.value)
})

const updateOptions = options => {
  page.value = options.page
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

const initiateDelete = item => {
  itemToDelete.value = item
  showDeleteModal.value = true
}

const confirmDelete = () => {
  if (itemToDelete.value) {
    emit('delete', itemToDelete.value.id)
    showDeleteModal.value = false
    itemToDelete.value = null
  }
}

const cancelDelete = () => {
  showDeleteModal.value = false
  itemToDelete.value = null
}

const hasActions = computed(() => props.headers.some(header => header.key === 'actions'))

const isImageColumn = key => {
  const imageKeys = ['pic', 'img', 'image', 'photo', 'thumbnail']

  return imageKeys.includes(key.toLowerCase())
}
</script>

<template>
  <VCard>
    <VCardText>
      <div class="d-flex justify-space-between flex-wrap gap-4">
        <div class="d-flex gap-4 align-center">
          <NuxtLink :to="addRoute || `/dashboard/${props.name}/add`">
            <VBtn prepend-icon="tabler-plus">
              Add {{ props.name.charAt(0).toUpperCase() + props.name.slice(1) }}
            </VBtn>
          </NuxtLink>
        </div>
        <div class="d-flex align-center flex-wrap gap-4">
          <VTextField
            v-model="searchQuery"
            :placeholder="`Search ${props.name.charAt(0).toUpperCase() + props.name.slice(1)}`"
            density="compact"
            variant="outlined"
            class="data-grid-filter"
          />
        </div>
      </div>
    </VCardText>

    <VDivider />

    <VDataTable
      v-model="selectedRows"
      :headers="props.headers"
      :items="paginatedItems"
      item-value="id"
      class="text-no-wrap"
      :items-per-page="itemsPerPage"
      :page="page"
      hide-default-footer
    >
      <template
        v-for="header in props.headers"
        #[`item.${header.key}`]="{ item }"
      >
        <slot
          :name="`item.${header.key}`"
          :item="item"
        >
          <ImagePreview
            v-if="isImageColumn(header.key)"
            :src="item[header.key]"
          />
          <span v-else>{{ item[header.key] }}</span>
        </slot>
      </template>

      <template
        v-if="hasActions"
        #item.actions="{ item }"
      >
        <VBtn
          icon="tabler-trash"
          variant="text"
          color="error"
          @click="initiateDelete(item)"
        />
        <NuxtLink :to="`/dashboard/${props.name}/preview/${item.id}`">
          <VBtn
            icon="tabler-eye"
            variant="text"
            color="primary"
          />
        </NuxtLink>
        <NuxtLink :to="`/dashboard/${props.name}/edit/${item.id}`">
          <VBtn
            icon="tabler-pencil"
            variant="text"
            color="secondary"
          />
        </NuxtLink>
      </template>

      <template #bottom>
        <div class="table-footer d-flex align-center justify-space-between pa-2 gap-4 flex-wrap">
          <div class="d-flex align-center gap-x-2">
            <div>Show</div>
            <VSelect
              :model-value="itemsPerPage"
              :items="[5, 10, 25, 50, 100, -1]"
              density="compact"
              variant="outlined"
              style="inline-size: 100px;"
              @update:model-value="itemsPerPage = parseInt($event, 10); page = 1"
            />
          </div>
          <VPagination
            v-model="page"
            :length="totalPages"
            :total-visible="7"
          />
        </div>
      </template>
    </VDataTable>

    <VDialog
      v-model="showDeleteModal"
      max-width="500"
    >
      <VCard>
        <VCardTitle>Confirm Deletion</VCardTitle>
        <VCardText>
          <p>Are you sure you want to delete "{{ itemToDelete?.name }}"?</p>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn
            color="secondary"
            @click="cancelDelete"
          >
            Cancel
          </VBtn>
          <VBtn
            color="error"
            @click="confirmDelete"
          >
            Yes, Delete
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VCard>
</template>

<style lang="scss">
.data-grid-filter {
  inline-size: 12rem;
}

.table-footer {
  padding: 24px !important;
}
</style>
