<script setup>
import DataGrid from "@/components/DataGrid.vue"
import { useDepartmentsStore } from "@/stores/useDepartmentsStore"
import { onMounted } from "vue"

const departmentsStore = useDepartmentsStore()

onMounted(async () => {
  await departmentsStore.fetchDepartments()
})

const headers = [
  { title: "Name", key: "name" },
  { title: "Supervisor", key: "supervisor" },
  { title: "Category", key: "categoryName" },
  { title: "Gender", key: "gender" },
  { title: "Actions", key: "actions", sortable: false },
]

const deleteDepartment = async departmentId => {
  console.log("Deleting department with ID:", departmentId)
  try {
    await departmentsStore.deleteDepartment(departmentId)
    await departmentsStore.fetchDepartments()
  } catch (error) {
    console.error("Error deleting department:", error)
  }
}
</script>

<template>
  <div>
    <DataGrid
      :headers="headers"
      :items="departmentsStore.departments"
      :loading="departmentsStore.loading"
      name="departments"
      @delete="deleteDepartment"
    >
      <template #item.supervisor="{ item }">
        {{ item.supervisor?.fullName || "N/A" }}
      </template>
    </DataGrid>
  </div>
</template>
