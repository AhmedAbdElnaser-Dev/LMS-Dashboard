<script setup>
import DataGrid from "@/components/DataGrid.vue";
import { useCategoriesStore } from "@/stores/categoryStore";
import { format } from "date-fns";
import { onMounted } from "vue";

const categoriesStore = useCategoriesStore();

onMounted(() => {
  categoriesStore.fetchCategories();
});

const headers = [
  { title: "Name", key: "name" },
  { title: "Created At", key: "createdAt" },
  { title: "Updated At", key: "updatedAt" },
  { title: "Actions", key: "actions", sortable: false },
];

async function handleDelete(id) {
  console.log("Deleting category with ID:", id);
  await categoriesStore.deleteCategory(id);
}

const formatDate = (dateString) => {
  return dateString ? format(new Date(dateString), "yyyy-MM-dd HH:mm") : "N/A";
};
</script>

<template>
  <div>
    <p v-if="categoriesStore.loading">Loading categories...</p>

    <DataGrid
      :headers="headers"
      :items="categoriesStore.categories"
      :loading="categoriesStore.loading"
      name="categories"
      :onDelete="handleDelete"
    >
      <template #item.name="{ item }">
        <span>{{ item.name }}</span>
      </template>

      <template #item.createdAt="{ item }">
        {{ formatDate(item.createdAt) }}
      </template>

      <template #item.updatedAt="{ item }">
        {{ formatDate(item.updatedAt) }}
      </template>
    </DataGrid>
  </div>
</template>
