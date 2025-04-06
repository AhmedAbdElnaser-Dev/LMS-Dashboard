<script setup>
import DataGrid from "@/components/DataGrid.vue";
import { useDepartmentsStore } from "@/stores/departmentsStore";
import { onMounted } from "vue";

const departmentsStore = useDepartmentsStore();

onMounted(() => {
  departmentsStore.fetchDepartments();
});

const headers = [
  { title: "Name", key: "name" },
  { title: "Supervisor", key: "supervisor" },
  { title: "Category", key: "categoryName" },
  { title: "Gender", key: "gender" },
  { title: "Actions", key: "actions", sortable: false },
];

</script>

<template>
  <div>
    <p v-if="departmentsStore.loading">Loading departments...</p>
    <p v-if="departmentsStore.error">{{ departmentsStore.error }}</p>

    <DataGrid
      :headers="headers"
      :items="departmentsStore.departments"
      :loading="departmentsStore.loading"
      :onDelete="departmentsStore.deleteDepartment"
      name="departments"
    >
      <template #item.supervisor="{ item }">
        {{ item.supervisor?.fullName || "N/A" }}
      </template>
    </DataGrid>
  </div>
</template>
